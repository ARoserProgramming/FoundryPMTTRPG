import PMTTRPGActorBase from "./base-actor.mjs";

export default class PMTTRPGAbnormality extends PMTTRPGActorBase {
    async _preCreate(data, options, user) {
        const allowed = await super._preCreate(data, options, user);
        if (allowed === false) return false;

        const updates = {
            prototypeToken: {
                actorLink: false,
                disposition: CONST.TOKEN_DISPOSITIONS.HOSTILE,
                sight: {
                    enabled: false,
                },
            },
        };
        this.parent.updateSource(updates);
    }

    static defineSchema() {
        const fields = foundry.data.fields;
        const requiredInteger = {required: true, nullable: false, integer: true};
        const schema = super.defineSchema();
        schema.risk = new fields.StringField({
            required: true,
            choices: ["zayin", "teth", "he", "waw", "aleph"],
            initial: "zayin"
        });
        schema.abilities = new fields.SchemaField(Object.keys(CONFIG.PMTTRPG.abilities).reduce((obj, ability) => {
            obj[ability] = new fields.SchemaField({
                value: new fields.NumberField({...requiredInteger, initial: 0}),
            });
            return obj;
        }, {}));

        return schema;
    }

    prepareDerivedData() {
        super.prepareDerivedData();
    }

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
}