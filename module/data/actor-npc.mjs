import PMTTRPGActorBase from "./actor-character.mjs";
import {PMTTRPGCharacter} from "./_module.mjs";

export default class PMTTRPGNpc extends PMTTRPGCharacter {
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

        // Override abilities schema to remove max limit
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