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
      diceNum: new fields.NumberField({ ...requiredInteger, initial: 1, min: 1 }),
      diceSize: new fields.NumberField({...requiredInteger, initial: 10}),
      diceSizeMaxBonus: new fields.NumberField({...requiredInteger, initial: 0}),
      diceBonus: new fields.StringField({ initial: "" })
    })

    schema.formula = new fields.StringField({ blank: true });

    return schema;
  }

  prepareDerivedData() {
    // Build the formula dynamically using string interpolation
    const roll = this.roll;

    this.formula = `${roll.diceNum}d${roll.diceSize}${roll.diceBonus}`
    // Aplicar efectos según la propiedad de forma
    const formProperty = this.system.formProperty;
    switch (formProperty) {
      case "Small":
        this.roll.diceSize.value = this.roll.diceSize.initial
        this.system.reactions.bonus += 1; // +1 Counter Reaction (stackable)
        break;
      case "Medium":
        this.roll.diceSizeMaxBonus = 2;// +2 Dice Max
        this.roll.diceSize = this.roll.diceSize + this.roll.diceSizeMaxBonus
        break;
      case "Long":
        this.system.bonuses.meleeRange = 2; // Melee Attack Range is 2 Squares
        this.system.bonuses.throwRange = 1; // +1 to Throwing Range
        this.system.bonuses.clashWinEffect = "Move target 1 SQR (no Force Damage or Opportunity Attacks)";
        break;
      case "Sturdy":
        this.system.bonuses.blockReaction = 1; // +1 Block Reaction (stackable)
        break;
      case "Hybrid":
        this.system.bonuses.hybrid = true; // Habilita Melee o Ranged Attack
        break;
      case "Versatile":
        this.system.bonuses.versatile = true; // Cambia entre Offensive y Defensive
        break;
      case "Innate":
        this.system.bonuses.innateSkill = true; // Usa Skill exclusivo
        break;
      default:
        break;
    }
  }
}