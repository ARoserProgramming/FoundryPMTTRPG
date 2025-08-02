import {
  onManageActiveEffect,
  prepareActiveEffectCategories,
} from '../helpers/effects.mjs';
import LevelUpDialog from '../dialog/level-up-dialog.mjs';

/**
 * Extend the basic ActorSheet with some very simple modifications
 * @extends {ActorSheet}
 */
export default class PMTTRPGActorSheet extends ActorSheet {
  /** @override */
  static get defaultOptions() {
    return foundry.utils.mergeObject(super.defaultOptions, {
      classes: ['pmttrpg', 'sheet', 'actor'],
      width: 600,
      height: 600,
      tabs: [
        {
          navSelector: '.sheet-tabs',
          contentSelector: '.sheet-body',
          initial: 'features',
        },
      ],
    });
  }

  /** @override */
  get template() {
    return `systems/pmttrpg/templates/actor/actor-${this.actor.type}-sheet.hbs`;
  }

  /* -------------------------------------------- */

  /** @override */
  async getData() {
    // Retrieve the data structure from the base sheet. You can inspect or log
    // the context variable to see the structure, but some key properties for
    // sheets are the actor object, the data object, whether it's
    // editable, the items array, and the effects array.
    const context = super.getData();

    // Use a safe clone of the actor data for further operations.
    const actorData = this.document.toPlainObject();

    // Add the actor's data to context.data for easier access, as well as flags.
    context.system = actorData.system;
    context.flags = actorData.flags;

    // Adding a pointer to CONFIG.PMTTRPG
    context.config = CONFIG.PMTTRPG;

    // Prepare character data and items.
    if (actorData.type === 'character' ) {
      this._prepareItems(context);
      this._prepareCharacterData(context);
    }

    // Prepare abnormality and distortion data and items.
    if (actorData.type === 'abnormality') {
        this._prepareItems(context);
        this._prepareAbnormalityData(context);
    }

    if (actorData.type === 'distortion') {
        this._prepareItems(context);
        this.__prepareDistortionData(context);
    }
    if (actorData.type === 'npc') {
      this._prepareItems(context);
      this.__prepareNpcData(context);
    }
    // Enrich biography info for display
    // Enrichment turns text like `[[/r 1d20]]` into buttons
    context.enrichedBiography = await TextEditor.enrichHTML(
      this.actor.system.biography,
      {
        // Whether to show secret blocks in the finished html
        secrets: this.document.isOwner,
        // Necessary in v11, can be removed in v12
        async: true,
        // Data to fill in for inline rolls
        rollData: this.actor.getRollData(),
        // Relative UUID resolution
        relativeTo: this.actor,
      }
    );

    // Prepare active effects
    context.effects = prepareActiveEffectCategories(
      // A generator that returns all effects stored on the actor
      // as well as any items
      this.actor.allApplicableEffects()
    );

    // Después de preparar context.effects
    for (const section of Object.values(context.effects)) {
      for (const effect of section.effects) {
        // Busca la condición por nombre
        const cond = Object.values(CONFIG.PMTTRPG.conditions).find(
            c => game.i18n.localize(c.name) === effect.name
        );
        if (cond && cond.potency) {
          effect.potency = cond.potency;
        }
      }
    }

    //localize
    context.localize_health = game.i18n.localize('PMTTRPG.Stats.HealthPoints');
    context.localize_stagger = game.i18n.localize('PMTTRPG.Stats.StaggerThreshold');
    context.localize_mentality = game.i18n.localize('PMTTRPG.Stats.Mentality');
    context.localize_rank = game.i18n.localize('PMTTRPG.Attributes.Rank');
    context.localize_light = game.i18n.localize('PMTTRPG.Attributes.Light');
    context.localize_level = game.i18n.localize('PMTTRPG.Attributes.Level');
    context.localize_xp = game.i18n.localize('PMTTRPG.Attributes.XP');

    return context;
  }

  /**
   * Character-specific context modifications
   *
   * @param {object} context The context object to mutate
   */
  _prepareCharacterData(context) {
    // This is where you can enrich character-specific editor fields
    // or setup anything else that's specific to this type
  }
  _prepareAbnormalityData(context) {
    // This is where you can enrich abnormality-specific editor fields
    // or setup anything else that's specific to this type
  }
  __prepareDistortionData(context) {
    // This is where you can enrich distortion-specific editor fields
    // or setup anything else that's specific to this type
  }
  __prepareNpcData(context){
    // This is where you can enrich npc-specific editor fields
    // or setup anything else that's specific to this type
  }
  /**
   * Organize and classify Items for Actor sheets.
   *
   * @param {object} context The context object to mutate
   */
  _prepareItems(context) {
    // Initialize containers.
    const gear = [];
    const features = [];
    const spells = {
      0: [],
      1: [],
      2: [],
      3: [],
      4: [],
      5: [],
      6: [],
      7: [],
      8: [],
      9: [],
    };

    // Iterate through items, allocating to containers
    for (let i of context.items) {
      i.img = i.img || Item.DEFAULT_ICON;
      // Append to gear.
      if (i.type === 'item') {
        gear.push(i);
      }
      // Append to features.
      else if (i.type === 'feature') {
        features.push(i);
      }
      // Append to spells.
      else if (i.type === 'spell') {
        if (i.system.spellLevel != undefined) {
          spells[i.system.spellLevel].push(i);
        }
      }
    }

    // Assign and return
    context.gear = gear;
    context.features = features;
    context.spells = spells;
  }

  /* -------------------------------------------- */

  /** @override */
  activateListeners(html) {
    super.activateListeners(html);

    const maxFields = [
      "system.health_points.max",
      "system.stagger_threshold.max",
      "system.sanity_points.max",
      "system.light.max"
    ];

    const maxValuePairs = {
      "system.health_points.max": "system.health_points.value",
      "system.stagger_threshold.max": "system.stagger_threshold.value",
      "system.sanity_points.max": "system.sanity_points.value",
      "system.light.max": "system.light.value"
    };

    maxFields.forEach(field => {
      const $input = html.find(`input[name="${field}"]`);
      if ($input.length > 0) {
        $input.on("change", async (event) => {
          const value = Number(event.target.value);

          if (isNaN(value) || value < 0) {
            ui.notifications.warn(`Invalid value for ${field.split('.')[1]}. Please enter a non-negative number.`);
            return;
          }

          try {
            // Actualizar el max
            await this.actor.update({ [field]: value });

            // Ajustar el value correspondiente
            const valueField = maxValuePairs[field];
            const currentValue = this.actor.system[valueField.split('.')[1]].value;
            const clampedValue = Math.min(value, Math.max(0, currentValue));

            if (clampedValue !== currentValue) {
              await this.actor.update({ [valueField]: clampedValue });
            }
          } catch (error) {
            ui.notifications.error(`Failed to update ${field.split('.')[1]}.`);
          }
        });
      }
    });

    // Mantener el clamping de value en los inputs si lo deseas
    const valueFields = Object.values(maxValuePairs);
    valueFields.forEach(field => {
      html.find(`input[name="${field}"]`).on("change", (event) => {
        const value = Number(event.target.value);
        const maxField = Object.keys(maxValuePairs).find(key => maxValuePairs[key] === field);
        const maxValue = this.actor.system[maxField.split('.')[1]].max;
        event.target.value = Math.clamp(value, 0, maxValue);
      });
    });

    html.find('.level-up-pending-btn').on('click', async (event) => {
      // Abre el diálogo de subida de nivel
      const LevelUpDialog = (await import('../dialog/level-up-dialog.mjs')).default;
      new LevelUpDialog(this.actor, this.actor.system.level).render(true);
    });

    // Render the item sheet for viewing/editing prior to the editable check.
    html.on('click', '.item-edit', (ev) => {
      const li = $(ev.currentTarget).parents('.item');
      const item = this.actor.items.get(li.data('itemId'));
      item.sheet.render(true);
    });

    // -------------------------------------------------------------
    // Everything below here is only needed if the sheet is editable
    if (!this.isEditable) return;
    // Add Inventory Item
    html.on('click', '.item-create', this._onItemCreate.bind(this));

    // Delete Inventory Item
    html.on('click', '.item-delete', (ev) => {
      const li = $(ev.currentTarget).parents('.item');
      const item = this.actor.items.get(li.data('itemId'));
      item.delete();
      li.slideUp(200, () => this.render(false));
    });

    // Active Effect management
    html.on('click', '.effect-control', (ev) => {
      const row = ev.currentTarget.closest('li');
      const document =
        row.dataset.parentId === this.actor.id
          ? this.actor
          : this.actor.items.get(row.dataset.parentId);
      onManageActiveEffect(ev, document);
    });

    // Rollable abilities.
    html.on('click', '.rollable', this._onRoll.bind(this));

    // Drag events for macros.
    if (this.actor.isOwner) {
      let handler = (ev) => this._onDragStart(ev);
      html.find('li.item').each((i, li) => {
        if (li.classList.contains('inventory-header')) return;
        li.setAttribute('draggable', true);
        li.addEventListener('dragstart', handler, false);
      });
    }
  }
  async _showLevelUpDialog() {
    const currentLevel = Math.floor(this.actor.system.xp / 8);
    const currentRank = this.actor.system.rank;
    const dialog = new LevelUpDialog(this.actor, currentLevel, currentRank);
    dialog.render(true);
    }
  /**
   * Handle creating a new Owned Item for the actor using initial data defined in the HTML dataset
   * @param {Event} event   The originating click event
   * @private
   */
  async _onItemCreate(event) {
    event.preventDefault();
    const header = event.currentTarget;
    // Get the type of item to create.
    const type = header.dataset.type;
    // Grab any data associated with this control.
    const data = duplicate(header.dataset);
    // Initialize a default name.
    const name = `New ${type.capitalize()}`;
    // Prepare the item object.
    const itemData = {
      name: name,
      type: type,
      system: data,
    };
    // Remove the type from the dataset since it's in the itemData.type prop.
    delete itemData.system['type'];

    // Finally, create the item!
    return await Item.create(itemData, { parent: this.actor });
  }

  /**
   * Handle clickable rolls.
   * @param {Event} event   The originating click event
   * @private
   */
  _onRoll(event) {
    event.preventDefault();
    const element = event.currentTarget;
    const dataset = element.dataset;

    // Handle item rolls.
    if (dataset.rollType) {
      if (dataset.rollType == 'item') {
        const itemId = element.closest('.item').dataset.itemId;
        const item = this.actor.items.get(itemId);
        if (item) return item.roll();
      }
    }

    // Handle rolls that supply the formula directly.
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
