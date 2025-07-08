import PMTTRPGActorBase from "./base-actor.mjs";

export default class PMTTRPGCharacter extends PMTTRPGActorBase {

  static defineSchema() {
    const fields = foundry.data.fields;
    const requiredInteger = { required: true, nullable: false, integer: true };
    const schema = super.defineSchema();


    return schema;
  }

  prepareDerivedData() {
    super.prepareDerivedData();
    // Cálculo de máximos de barras
    for (const key in this.attributes) {
      if (this.attributes[key].value > this.attributes[key].max) {
        this.attributes[key].value = this.attributes[key].max;
        console.log(`Clamped ${key} to max: ${this.attributes[key].max}`);
      } else if (this.attributes[key].value < this.attributes[key].min) {
        this.attributes[key].value = this.attributes[key].min;
        console.log(`Clamped ${key} to min: ${this.attributes[key].min}`);
      }
    }
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

    //data.lvl = this.attributes.level.value;

    return data
  }
}