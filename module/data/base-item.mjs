import PMTTRPGDataModel from "./base-model.mjs";

export default class PMTTRPGItemBase extends PMTTRPGDataModel {

  static defineSchema() {
    const fields = foundry.data.fields;
    const schema = {};

    schema.description = new fields.StringField({ required: true, blank: true });

    return schema;
  }
  preparePostActorPrepData(){

  }
  get actor() {
    return this.parent.actor;
  }
}