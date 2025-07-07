import PMTTRPGDataModel from "./base-model.mjs";

export default class PMTTRPGActorBase extends PMTTRPGDataModel {

  static defineSchema() {
    const fields = foundry.data.fields;
    const requiredInteger = { required: true, nullable: false, integer: true };
    const schema = {};

    schema.health_points = new fields.SchemaField({
      value: new fields.NumberField({ ...requiredInteger, initial: 10, min: 0 }),
      max: new fields.NumberField({ ...requiredInteger, initial: 10 })
    });
    schema.stagger_threshold = new fields.SchemaField({
      value: new fields.NumberField({ ...requiredInteger, initial: 5, min: 0 }),
      max: new fields.NumberField({ ...requiredInteger, initial: 5 })
    });
    schema.biography = new fields.StringField({ required: true, blank: true }); // equivalent to passing ({initial: ""}) for StringFields

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
  }
}