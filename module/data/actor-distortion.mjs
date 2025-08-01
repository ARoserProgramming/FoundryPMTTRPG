import {PMTTRPGCharacter} from "./_module.mjs";


export default class PMTTRPGDistortion extends PMTTRPGCharacter {
  async _preCreate(data, options, user) {
    await super._preCreate(data);
    this.parent.updateSource({
      prototypeToken: {
        disposition: CONST.TOKEN_DISPOSITIONS.HOSTILE,
      },
    });
  }
  static defineSchema() {
    const fields = foundry.data.fields;
    const schema = super.defineSchema();
    schema.risk = new fields.StringField({
      required: true,
      choices: ["zayin", "teth", "he", "waw", "aleph"],
      initial: "zayin"
    });
    return schema;
  }

  prepareDerivedData() {
    // Loop through ability scores, and add their modifiers to our sheet output.
   super.prepareDerivedData();
  }

  getRollData() {
    const data = {};

    // Copy the ability scores to the top level, so that rolls can use
    // formulas like `@str.mod + 4`.
    if (this.abilities) {
      for (let [k,v] of Object.entries(this.abilities)) {
        data[k] = foundry.utils.deepClone(v);
      }
    }


    return data
  }
}