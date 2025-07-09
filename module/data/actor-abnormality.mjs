import PMTTRPGActorBase from "./base-actor.mjs";

export default class PMTTRPGCharacter extends PMTTRPGActorBase {

    static defineSchema() {
        const fields = foundry.data.fields;
        const requiredInteger = {required: true, nullable: false, integer: true};
        const schema = super.defineSchema();

        return schema;
    }

    prepareDerivedData() {
        super.prepareDerivedData();
        this.risk = new Enum
        {
            "Zayin", "Teth", "HE", "Waw", "Aleph"
        }
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

        data.lvl = this.attributes.level.value;

        return data
    }
}