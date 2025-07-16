import PMTTRPGActorBase from "./base-actor.mjs";

export default class PMTTRPGCharacter extends PMTTRPGActorBase {

    static defineSchema() {
        const fields = foundry.data.fields;
        const requiredInteger = {required: true, nullable: false, integer: true};
        const schema = super.defineSchema();
        schema.sanity_points = new fields.SchemaField({
            value: new fields.NumberField({initial: 15, nullable: false, integer: true}),
            max: new fields.NumberField({initial: 15, nullable: false, integer: true}),
            temporal: new fields.NumberField({initial: 0, nullable: false, integer: true}),
        })
        return schema;
    }
        prepareDerivedData() {
        super.prepareDerivedData();
        this.sanity_points.max = 15 + (this.abilities.prd.value * 3);
    };

    getRollData() {
        const data = {};

        // Copy the ability scores to the top level, so that rolls can use
        // formulas like `@str.mod + 4`.
        if (this.abilities) {
            for (let [k, v] of Object.entries(this.abilities)) {
                data[k] = foundry.utils.deepClone(v);
            }
        }
        return data
    }

    async _preCreate(data, options, user) {
        const allowed = await super._preCreate(data, options, user);
        if (allowed === false) return false;

        const updates = {
            prototypeToken: {
                actorLink: true,
                disposition: CONST.TOKEN_DISPOSITIONS.FRIENDLY,
                sight: {
                    enabled: true,
                }
            },
        };
        this.parent.updateSource(updates);
    }
}