export default class LevelUpDialog extends Application {
    constructor(actor, newLevel, options = {}) {
        super(options);
        this.actor = actor;
        this.newLevel = newLevel;
        this.maxPoints = this._calculateMaxPoints();
        this.sum = 0;
    }

    static get defaultOptions() {
        return foundry.utils.mergeObject(super.defaultOptions, {
            template: 'systems/pmttrpg/templates/dialogs/level-up-dialog.hbs',
            title: `Level Up to ${this.newLevel || 'Unknown'}`,
            width: 400,
            height: 'auto',
            classes: ['pmttrpg', 'level-up-dialog'],
        });
    }

    get title() {
        return `Level Up to ${this.newLevel}`;
    }

    _calculateMaxPoints() {
        // Adjust this logic based on your system's rules for max points per level
        return Math.max(0, (this.newLevel + 3) * 2);
    }

    async getData() {
        return {
            actor: this.actor,
            newLevel: this.newLevel,
            abilities: this.actor.system.abilities,
        };
    }

    activateListeners(html) {
        super.activateListeners(html);

        // Calculate initial sum of stat values
        this.sum = html.find('.stat-value').toArray().reduce((sum, el) => sum + (parseInt(el.textContent) || 0), 0);

        // Stat increase button
        html.find('.stat-increase').on('click', (event) => {
            const button = event.currentTarget;
            const stat = button.getAttribute('data-stat');
            const max = this.actor.system.abilities[stat]?.max ?? 6;
            const currentRank = this.actor.system.level || 1; // Assuming level is stored in actor.system.level
            const span = button.parentElement.querySelector('.stat-value');
            let value = parseInt(span.textContent) || 0;

            if (this.sum < this.maxPoints && value < currentRank + 2 && value < max) {
                value += 1;
                span.textContent = value;
                this.sum = html.find('.stat-value').toArray().reduce((sum, el) => sum + (parseInt(el.textContent) || 0), 0);
            } else if (value >= max) {
                ui.notifications.warn(`Maximum value for ${stat} is ${max}!`);
            } else if (value >= currentRank + 2) {
                ui.notifications.warn(`Maximum value for ${stat} is ${currentRank + 2} at rank ${currentRank}!`);
            } else {
                ui.notifications.warn(`Maximum points (${this.maxPoints}) reached for level ${this.newLevel}!`);
            }
        });

        // Stat decrease button
        html.find('.stat-decrease').on('click', (event) => {
            const button = event.currentTarget;
            const stat = button.getAttribute('data-stat');
            const span = button.parentElement.querySelector('.stat-value');
            let value = parseInt(span.textContent) || 0;
            const min = this.actor.system.abilities[stat]?.min ?? -1;

            if (value > min) {
                value -= 1;
                span.textContent = value;
                this.sum = html.find('.stat-value').toArray().reduce((sum, el) => sum + (parseInt(el.textContent) || 0), 0);
            }
        });
    }

    async _onSubmit(html) {
        if (this.sum !== this.maxPoints) {
            await this.actor.update({'system.levelUpPending': true});
            ui.notifications.warn(`You must spend exactly ${this.maxPoints} points for level ${this.newLevel}!`);
            return;
        }

        const updates = {};
        html.find('.stat-value').each((i, el) => {
            const stat = el.getAttribute('data-stat');
            const value = parseInt(el.textContent) || 0;
            if (value !== this.actor.system.abilities[stat].value) {
                updates[`system.abilities.${stat}.value`] = value;
            }
        });
        updates['system.levelUpPending'] = false;
        await this.actor.update(updates);
        this.close();
    }

    _getHeaderButtons() {
        const buttons = super._getHeaderButtons();
        buttons.unshift({
            label: 'Apply',
            class: 'submit',
            icon: 'fas fa-check',
            onclick: () => this._onSubmit(this.element.find('.window-content')),
        });
        return buttons;
    }
    async close(options) {
        // Si no se gastaron todos los puntos, marca el flag en el actor
        if (this.sum !== this.maxPoints) {
            await this.actor.update({'system.levelUpPending': true});
        }
        return super.close(options);
    }
}