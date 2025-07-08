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
  clampBarAttribute(bar, maxCalc, minCalc = 0) {
    if (!bar) {
      console.error('clampBarAttribute: bar is undefined', bar);
      return;
    }
    const max = typeof maxCalc === 'function' ? maxCalc() : (maxCalc || bar.max || Infinity);
    const min = typeof minCalc === 'function' ? minCalc() : (minCalc || bar.min || 0);
    // Asegurarse de que bar.value y bar.max estén definidos
    bar.value = bar.value !== undefined ? bar.value : min;
    bar.max = max; // Actualizar max explícitamente
    if (bar.value > max) bar.value = max;
    else if (bar.value < min) bar.value = min;
    console.log(`Clamped ${bar}: value=${bar.value}, max=${bar.max}, min=${min}`); // Depuración
  }


}