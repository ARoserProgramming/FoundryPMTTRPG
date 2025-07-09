import PMTTRPGDataModel from "./base-model.mjs";

export default class PMTTRPGActorBase extends PMTTRPGDataModel {

  static defineSchema() {
    const fields = foundry.data.fields;
    const requiredInteger = { required: true, nullable: false, integer: true };
    const schema = {};

    schema.attributes = new fields.SchemaField({
      health_points: new fields.SchemaField({
        value: new fields.NumberField({ ...requiredInteger, initial: 72, min: 0 }),
        max: new fields.NumberField({ ...requiredInteger, initial: 72 })
      }),
      stagger_threshold: new fields.SchemaField({
        value: new fields.NumberField({ ...requiredInteger, initial: 20, min: 0 }),
        max: new fields.NumberField({ ...requiredInteger, initial: 20 })
      }),
      light: new fields.SchemaField({
        value: new fields.NumberField({ ...requiredInteger, initial: 3, min: 0 }),
        max: new fields.NumberField({ ...requiredInteger, initial: 3 })
      }),
      rank: new fields.SchemaField({
        value: new fields.NumberField({ ...requiredInteger, initial: 1, min: 0 }),
        max: new fields.NumberField({ ...requiredInteger, initial: 1 })
      }),
      level: new fields.SchemaField({
        value: new fields.NumberField({ ...requiredInteger, initial: 0, min: 0 }),
        max: new fields.NumberField({ ...requiredInteger, initial: 0 })
      }),
      xp: new fields.SchemaField({
        value: new fields.NumberField({ ...requiredInteger, initial: 0, min: 0 }),
        max: new fields.NumberField({ ...requiredInteger, initial: 0 })
      }),
      attack_modifier: new fields.SchemaField({
        value: new fields.NumberField({ ...requiredInteger, initial: 0}),
      }),
      block_modifier: new fields.SchemaField({
        value: new fields.NumberField({ ...requiredInteger, initial: 0}),
      }),
      evade_modifier: new fields.SchemaField({
        value: new fields.NumberField({ ...requiredInteger, initial: 0}),
      }),
      equipment_limit: new fields.SchemaField({
        value: new fields.NumberField({ ...requiredInteger, initial: 0}),
      }),
      tool_slots: new fields.SchemaField({
        value: new fields.NumberField({ ...requiredInteger, initial: 4, min: 0 }),
        max: new fields.NumberField({ ...requiredInteger, initial: 4 }),
      })
    });
    schema.biography = new fields.StringField({ required: true, blank: true }); // equivalent to passing ({initial: ""}) for StringFields
    // Iterate over ability names and create a new SchemaField for each.
    schema.abilities = new fields.SchemaField(Object.keys(CONFIG.PMTTRPG.abilities).reduce((obj, ability) => {
      obj[ability] = new fields.SchemaField({
        value: new fields.NumberField({ ...requiredInteger, initial: 0, min: -1 , max: 6}),
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
    const systemData = this;

    //this.clampBarAttribute(systemData.attributes.stagger_threshold, () => systemData.attributes.stagger_threshold.max);
    //this.clampBarAttribute(systemData.attributes.health_points, () => systemData.attributes.health_points.max);
  }
}