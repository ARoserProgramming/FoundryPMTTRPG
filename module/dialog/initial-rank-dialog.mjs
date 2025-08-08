// module/dialog/initial-rank-dialog.mjs
export default class InitialRankDialog extends Application {
    constructor(actor, options = {}) {
        super(options);
        this.actor = actor;
        this.rangos = [
            { label: "0", xp: -24 },
            { label: "1", xp: 0 },
            { label: "2", xp: 24 },
            { label: "3", xp: 48 },
            { label: "4", xp: 72 },
            { label: "5", xp: 96 },
            { label: "EX", xp: 120 }
        ];
    }

    static get defaultOptions() {
        return foundry.utils.mergeObject(super.defaultOptions, {
            template: 'systems/pmttrpg/templates/dialogs/initial-rank-dialog.hbs',
            title: "Rango Inicial",
            width: 400,
            height: 'auto',
            classes: ['pmttrpg', 'initial-rank-dialog'],
        });
    }

    async getData() {
        return {
            actor: this.actor,
            rangos: this.rangos
        };
    }

    activateListeners(html) {
        super.activateListeners(html);
        html.find('.apply-initial-rank').on('click', async (event) => {
            await this._onSubmit(html);
        });
    }

    async _onSubmit(html) {
        const idx = parseInt(html.find('#rango-inicial').val());
        const xp = this.rangos[idx].xp;
        await this.actor.update({ "system.xp": xp });
        this.close();
    }

    _getHeaderButtons() {
        const buttons = super._getHeaderButtons();
        buttons.unshift({
            label: 'Aceptar',
            class: 'apply-initial-rank',
            icon: 'fas fa-check',
            onclick: () => this._onSubmit(this.element.find('.window-content')),
        });
        return buttons;
    }
}