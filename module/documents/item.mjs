import PmTTRPGItemData from '../data/models/item.mjs';

export class PmTTRPGItem extends Item {
  static defineSchema() {
    return PmTTRPGItemData.defineSchema();
  }

  prepareData() {
    super.prepareData();
  }

  getRollData() {
    const rollData = { ...this.system };
    if (this.actor) {
      rollData.actor = this.actor.getRollData();
    }
    return rollData;
  }

  async roll() {
    const item = this;
    const speaker = ChatMessage.getSpeaker({ actor: this.actor });
    const rollMode = game.settings.get('core', 'rollMode');
    const label = `[${item.type}] ${item.name}`;

    if (!this.system.formula) {
      ChatMessage.create({
        speaker,
        rollMode,
        flavor: label,
        content: item.system.description || '',
      });
    } else {
      const rollData = this.getRollData();
      const roll = new Roll(rollData.formula, rollData);
      roll.toMessage({
        speaker,
        rollMode,
        flavor: label,
      });
      return roll;
    }
  }
}