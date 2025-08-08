import PMTTRPGItemBase from "./base-item.mjs";

export default class PMTTRPGWeapon extends PMTTRPGItemBase {

  static defineSchema() {
    const fields = foundry.data.fields;
    const requiredInteger = { required: true, nullable: false, integer: true };
    const schema = super.defineSchema();

    schema.quantity = new fields.NumberField({ ...requiredInteger, initial: 1, min: 1 });
    schema.weight = new fields.NumberField({ required: true, nullable: false, initial: 0, min: 0 });
    schema.meleeAttackRange = new fields.NumberField({ required: true, nullable: false, initial: 1});
    schema.rangedAttackRange = new fields.NumberField({ required: true, nullable: false, initial: 10});
    schema.weaponType = new fields.StringField({
      required:true,
      label: "Weapon Type",
      initial: "Melee",
      choices: [
        "Melee",
        "Ranged"
      ]
    });
    schema.meleeFormProperty = new fields.StringField({
      required: true,
      label: "Melee Form Property",
      initial: "Small",
      choices: [
        "Small",
        "Medium",
        "Long",
        "Sturdy",
        "Hybrid"
      ]
    });
    schema.rangedFormProperty = new fields.StringField({
      required: true,
      label: "Ranged Form Property",
      initial: "Low Caliber",
      choices: [
        "Low Caliber",
        "High Caliber",
        "Reactive",
        "Hybrid"
      ]
    })
    // Break down roll formula into three independent fields
    schema.roll = new fields.SchemaField({
      diceNum: new fields.SchemaField({
        value: new fields.NumberField({ ...requiredInteger, initial: 1 }),
        bonus: new fields.NumberField({ ...requiredInteger, initial: 0 })
      }),
      diceSize: new fields.SchemaField({
        value: new fields.NumberField({ ...requiredInteger, initial: 10 }),
        bonus: new fields.NumberField({ ...requiredInteger, initial: 0 })
      }),
      diceBonus: new fields.SchemaField({
        value: new fields.NumberField({ initial: 2})
      })
    });

    schema.formula = new fields.StringField({ blank: true });

    return schema;
  }
  onCreate(data, options, user) {

  }
  prepareDerivedData() {
    console.log("owner", this.owner, "actor", this.actor, "system", this.system);
    // Convierte los valores a número para la fórmula
    const roll = this.roll;
    //const diceNum = Number(roll.diceNum.value);
    //const diceSize = Number(roll.diceSize.value);
    //const diceBonus = roll.diceBonus.value;
    //console.log("Actor attack_modifier:", this.actor?.attack_modifier);
    //roll.diceBonus.value = this.actor?.attack_modifier ?? 0;

    // Construye la fórmula
    this.formula = `${roll.diceNum.value}d${roll.diceSize.value}+${roll.diceBonus.value}`;

    // Aplica efectos según la propiedad de forma
    /*
    const formProperty = this.meleeFormProperty;
    if(this.weaponType === "Melee"){
      switch (formProperty) {
        case "Small":
          // Ejemplo: +1 reacción extra
          if (this.actor) {
            this.actor.update({ "system.counterReactions.bonus": (this.actor.system.counterReactions.bonus) = 1 });
          }
          break;
        case "Medium":
          // Ejemplo: +2 al tamaño del dado
          roll.diceSize.bonus = 2;
          roll.diceSize.value = diceSize + roll.diceSize.bonus;
          this.formula = `${diceNum}d${roll.diceSize.value}+${diceBonus}`;
          break;
        case "Long":
          this.meleeAttackRange = 2;
          //On Clash Win with this weapon against an adjacent target, you may choose to move the target 1 SQR in any
          //direction on the ground. This movement does not proc Force Damage or Opportunity Attacks.
          this.system.throwingRange.bonus = 1;
          break;
        case "Sturdy":
          this.system.blockReactions.bonus = 1;
          break;
        case "Hybrid":
          //You can choose to make either a Melee or Ranged Attack with this weapon, decided before the clash is rolled.
          //
          // Incompatible Hand Properties do not apply their bonuses, and bullets are still consumed as normal for Ranged Attacks.
          // [M] and [R] exclusive effects also do not take effect if incompatible.
          break;
        default:
          // No aplicar bonificaciones
          break;
      }
    }else if(this.weaponType === "Ranged"){
      switch (formProperty){

      }
    }*/
  }
}