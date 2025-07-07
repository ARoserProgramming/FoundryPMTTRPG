import { onManageActiveEffect, prepareActiveEffectCategories } from '../helpers/effects.mjs';

export class PmTTRPGActor extends Actor {
    static defineSchema() {
        const models = CONFIG.PM_TTRPG.models.Actor;
        const type = this.type || 'character'; // Default a 'character' si no está definido
        return models[type] ? models[type].defineSchema() : models.base.defineSchema();
    }

    prepareDerivedData() {
        const systemData = this.system;
        const actorType = this.type;

        if (!systemData || !systemData.attributes || !systemData.attributes.xp) {
            console.warn('Actor data not fully initialized, skipping derived data preparation.');
            return;
        }

        systemData.attributes.level = Math.floor(systemData.attributes.xp.value / 8);
        systemData.attributes.rank = Math.floor(systemData.attributes.level / 3) + 1;

        systemData.health_points.max = 72 + (8 * (systemData.abilities.ftd || 0)) + (8 * systemData.attributes.rank);
        systemData.stagger_threshold.max = 20 + (4 * (systemData.abilities.chr || 0)) + (4 * systemData.attributes.rank);
        if (actorType === 'Distortion' || actorType === 'character') {
            systemData.mentality.max = 15 + (3 * (systemData.abilities.prd || 0));
        }
        systemData.light.max = 3 + systemData.attributes.rank;

        if ((actorType === 'Abnormality' || actorType === 'Distortion') && !systemData.risk) {
            systemData.risk = 'zayin';
        }

        this.clampBarAttribute(systemData.health_points, () => systemData.health_points.max);
        this.clampBarAttribute(systemData.stagger_threshold, () => systemData.stagger_threshold.max);
        if (actorType === 'Distortion' || actorType === 'character') {
            this.clampBarAttribute(systemData.mentality, () => systemData.mentality.max);
        }
        this.clampBarAttribute(systemData.light, () => systemData.light.max);
    }

    clampBarAttribute(bar, maxCalc, minCalc = 0) {
        if (!bar) return;
        const max = typeof maxCalc === 'function' ? maxCalc() : (maxCalc || bar.max || Infinity);
        const min = typeof minCalc === 'function' ? minCalc() : (minCalc || bar.min || 0);
        bar.value = bar.value ?? min;
        if (bar.value > max) bar.value = max;
        else if (bar.value < min) bar.value = min;
    }

    getRollData() {
        return foundry.utils.deepClone(this.system);
    }

    static get defaultOptions() {
        return foundry.utils.mergeObject(super.defaultOptions, {
            classes: ['pmttrpg', 'sheet', 'actor'],
            width: 600,
            height: 600,
            tabs: [{ navSelector: '.sheet-tabs', contentSelector: '.sheet-body', initial: 'features' }],
        });
    }

    get template() {
        const type = this.actor.type || 'character';
        const templatePath = `systems/pmttrpg/templates/actor/actor-${type}-sheet.hbs`;
        // Verificación de existencia del template (debug)
        if (!game.template.exists(templatePath)) {
            console.warn(`Template not found for type ${type}, falling back to generic: ${templatePath}`);
            return 'systems/pmttrpg/templates/actor/actor-sheet.hbs'; // Fallback genérico
        }
        return templatePath;
    }

    async getData() {
        const context = super.getData();
        const actorData = this.actor.toObject(false);

        context.system = actorData.system;
        context.flags = actorData.flags;
        context.config = CONFIG.PM_TTRPG;
        context.actorType = this.actor.type;

        context.enrichedBiography = await TextEditor.enrichHTML(this.actor.system.biography, {
            secrets: this.actor.isOwner,
            rollData: this.actor.getRollData(),
            relativeTo: this.actor,
        });

        context.effects = prepareActiveEffectCategories(this.actor.allApplicableEffects());

        if (!Handlebars.helpers.asset) {
            Handlebars.registerHelper('asset', function (path) {
                return `/systems/pmttrpg/${path}`;
            });
        }

        return context;
    }

    activateListeners(html) {
        super.activateListeners(html);
        if (this.actor.type === 'Abnormality' || this.actor.type === 'Distortion') {
            html.find('select[name="system.risk"]').val(this.actor.system.risk);
        }

        html.on('click', '.item-edit', (ev) => {
            const li = $(ev.currentTarget).parents('.item');
            const item = this.actor.items.get(li.data('itemId'));
            item.sheet.render(true);
        });

        if (!this.isEditable) return;

        html.on('click', '.item-create', this._onItemCreate.bind(this));
        html.on('click', '.item-delete', (ev) => {
            const li = $(ev.currentTarget).parents('.item');
            const item = this.actor.items.get(li.data('itemId'));
            item.delete();
            li.slideUp(200, () => this.render(false));
        });

        html.on('click', '.effect-control', (ev) => {
            const row = ev.currentTarget.closest('li');
            const document = row.dataset.parentId === this.actor.id ? this.actor : this.actor.items.get(row.dataset.parentId);
            onManageActiveEffect(ev, document);
        });

        if (this.actor.isOwner) {
            let handler = (ev) => this._onDragStart(ev);
            html.find('li.item').each((i, li) => {
                if (li.classList.contains('inventory-header')) return;
                li.setAttribute('draggable', true);
                li.addEventListener('dragstart', handler, false);
            });
        }
    }

    async _onItemCreate(event) {
        event.preventDefault();
        const header = event.currentTarget;
        const type = header.dataset.type;
        const data = duplicate(header.dataset);
        const name = `New ${type.capitalize()}`;
        const itemData = { name, type, system: data };
        delete itemData.system['type'];
        return await Item.create(itemData, { parent: this.actor });
    }

    _onRoll(event) {
        event.preventDefault();
        const element = event.currentTarget;
        const dataset = element.dataset;

        if (dataset.rollType) {
            if (dataset.rollType === 'item') {
                const itemId = element.closest('.item').dataset.itemId;
                const item = this.actor.items.get(itemId);
                if (item) return item.roll();
            }
        }

        if (dataset.roll) {
            let label = dataset.label ? `[ability] ${dataset.label}` : '';
            let roll = new Roll(dataset.roll, this.actor.getRollData());
            roll.toMessage({
                speaker: ChatMessage.getSpeaker({ actor: this.actor }),
                flavor: label,
                rollMode: game.settings.get('core', 'rollMode'),
            });
            return roll;
        }
    }
}