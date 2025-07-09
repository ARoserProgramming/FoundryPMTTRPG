import PMTTRPGActorBase from "./base-actor.mjs";

export default class PMTTRPGCharacter extends PMTTRPGActorBase {

    static defineSchema() {
        const fields = foundry.data.fields;
        const requiredInteger = {required: true, nullable: false, integer: true};
        const schema = super.defineSchema();
        schema.risk = new fields.StringField({
            required: true,
            choices: ["zayin", "teth", "he", "waw", "aleph"],
            initial: "zayin"
        });
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