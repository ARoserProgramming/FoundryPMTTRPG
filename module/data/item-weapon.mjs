import PMTTRPGItemBase from "./base-item.mjs";

export default class PMTTRPGWeapon extends PMTTRPGItemBase {

  static defineSchema() {
    const fields = foundry.data.fields;
    const requiredInteger = { required: true, nullable: false, integer: true };
    const schema = super.defineSchema();

    schema.quantity = new fields.NumberField({ ...requiredInteger, initial: 1, min: 1 });
    schema.weight = new fields.NumberField({ required: true, nullable: false, initial: 0, min: 0 });
    schema.formProperty = new fields.StringField({
      required: true,
      label: "Form Property",
      initial: "Medium",
      choices: [
        "Small",
        "Medium",
        "Long",
        "Sturdy",
        "Hybrid"
      ]
    });

    // Break down roll formula into three independent fields
    schema.roll = new fields.SchemaField({
      diceNum: new fields.SchemaField({
        value: new fields.NumberField({ ...requiredInteger, initial: 1 })
      }),
      diceSize: new fields.SchemaField({
        value: new fields.NumberField({ ...requiredInteger, initial: 10 }),
        bonus: new fields.NumberField({ ...requiredInteger, initial: 0 })
      }),
      diceBonus: new fields.SchemaField({
        value: new fields.StringField({ initial: "" })
      })
    });

    schema.formula = new fields.StringField({ blank: true });

    return schema;
  }
  onCreate(data, options, user) {

  }
  prepareDerivedData() {
    // Convierte los valores a número para la fórmula
    const roll = this.roll;
    const diceNum = Number(roll.diceNum.value);
    const diceSize = Number(roll.diceSize.value);
    const diceBonus = roll.diceBonus.value || "";

    // Construye la fórmula
    this.formula = `${diceNum}d${diceSize}${diceBonus}`;

    // Aplica efectos según la propiedad de forma
    const formProperty = this.formProperty;
    switch (formProperty) {
      case "Small":
        // Ejemplo: +1 reacción extra
        this.system.reactions.bonus = 1;
        break;
      case "Medium":
        // Ejemplo: +2 al tamaño del dado
        roll.diceSize.bonus = 2;
        roll.diceSize.value = diceSize + roll.diceSize.bonus;
        this.formula = `${diceNum}d${roll.diceSize.value}${diceBonus}`;
        break;
      case "Large":
        // Ejemplo: +1 dado extra
        roll.diceNum.bonus = 1;
        roll.diceNum.value = diceNum + roll.diceNum.bonus;
        this.formula = `${roll.diceNum.value}d${diceSize}${diceBonus}`;
        break;
      case "Massive":
        // Ejemplo: +2 dados y +2 tamaño de dado
        roll.diceNum.bonus = 2;
        roll.diceSize.bonus = 2;
        roll.diceNum.value = diceNum + roll.diceNum.bonus;
        roll.diceSize.value = diceSize + roll.diceSize.bonus;
        this.formula = `${roll.diceNum.value}d${roll.diceSize.value}${diceBonus}`;
        break;
      default:
        // No aplicar bonificaciones
        break;
    }
  }
}