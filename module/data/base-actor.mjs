import PMTTRPGDataModel from "./base-model.mjs";

export default class PMTTRPGActorBase extends PMTTRPGDataModel {

    static defineSchema() {
        const fields = foundry.data.fields;
        const requiredInteger = {required: true, nullable: false, integer: true};
        const schema = {};
        schema.stagger_threshold = new fields.SchemaField({
            value: new fields.NumberField({initial: 24, nullable: false, integer: true}),
            max: new fields.NumberField({initial: 24, nullable: false, integer: true}),
        });
        schema.health_points = new fields.SchemaField({
            value: new fields.NumberField({initial: 80, nullable: false, integer: true}),
            max: new fields.NumberField({initial: 80, nullable: false, integer: true}),
            temporal: new fields.NumberField({initial: 0, nullable: false, integer: true}),
        });
        schema.light = new fields.SchemaField({
            value: new fields.NumberField({initial: 4, nullable: false, integer: true}),
            max: new fields.NumberField({initial: 4, nullable: false, integer: true}),
        });
        schema.xp = new fields.NumberField({...requiredInteger, initial: 0, min: -24, max: 128});
        schema.tokenBar = new fields.NumberField({min: 0, max: 0, required: true})
        schema.biography = new fields.StringField({required: true, blank: true}); // equivalent to passing ({initial: ""}) for StringFields
        // Iterate over ability names and create a new SchemaField for each.
        schema.abilities = new fields.SchemaField(Object.keys(CONFIG.PMTTRPG.abilities).reduce((obj, ability) => {
            obj[ability] = new fields.SchemaField({
                value: new fields.NumberField({...requiredInteger, initial: 0, min: -1, max: 6}),
            });
            return obj;
        }, {}));
        return schema;
    }

    prepareData(data) {
        super.prepareBaseData();
        this.stagger_threshold.min = 0;
        this.health_points.min = 0;
        this.statuses = {};
    }
    prepareDerivedData() {
        // Lógica común de modificadores de habilidades
        if (this.abilities) {
            for (const key in this.abilities) {
                this.abilities[key].mod = this.abilities[key].value;
                this.abilities[key].label = game.i18n.localize(CONFIG.PMTTRPG.abilities[key]) ?? key;
            }
        }
        // Common attribute logic

        this.level = Math.floor(this.xp / 8);
        this.rank = Math.floor(this.level / 3) + 1;
        this.attack_modifier = this.rank;
        this.evade_modifier = this.abilities.ins.value;
        this.block_modifier = this.abilities.tmp.value;
        this.equipment_rank_limit = this.rank + 1
        this.stagger_threshold.max = 20 + (this.abilities.chr.value * 4) + (this.rank * 4),
        this.health_points.max = 72 + (this.abilities.ftd.value * 8) + (this.rank * 8),
        this.light.max= 3 + this.rank;
        };
    async _preCreate(data, options, user) {
        const allowed = await super._preCreate(data, options, user);
        if (allowed === false) return false;
        if (!this.parent.system.health_points?.value || !this.parent.system.stagger_threshold?.value) {
            console.warn(`health_points o stagger_threshold no están inicializados para el actor ${this.parent.name}`);
        }
        const updates = {
            prototypeToken: {
                displayBars: CONST.TOKEN_DISPLAY_MODES.OWNER
            }
        };
        this.parent.updateSource(updates);
    }
}