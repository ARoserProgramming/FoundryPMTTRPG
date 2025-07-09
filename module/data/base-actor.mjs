import PMTTRPGDataModel from "./base-model.mjs";

export default class PMTTRPGActorBase extends PMTTRPGDataModel {

    static defineSchema() {
        const fields = foundry.data.fields;
        const requiredInteger = {required: true, nullable: false, integer: true};
        const schema = {};

        schema.xp = new fields.NumberField({...requiredInteger, initial: 0, min: 0});

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
        this.stagger_threshold = {
            value: 24,
            max: 20 + (this.abilities.chr.value * 4) + (this.rank * 4),
        };
        this.health_points = {
            value: 80,
            max: 72 + (this.abilities.ftd.value * 8) + (this.rank * 8),
        };

        this.light = {
            value: 4,
            max: 3 + this.rank,
        };

        this.tool_slots = {
            value: 4,
            max: 4,
        };
    }
}