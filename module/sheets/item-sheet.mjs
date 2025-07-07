import { onManageActiveEffect, prepareActiveEffectCategories } from '../helpers/effects.mjs';

export class PmTTRPGItemSheet extends ItemSheet {
  static get defaultOptions() {
    return foundry.utils.mergeObject(super.defaultOptions, {
      classes: ['pmttrpg', 'sheet', 'item'],
      width: 520,
      height: 480,
      tabs: [{ navSelector: '.sheet-tabs', contentSelector: '.sheet-body', initial: 'description' }],
    });
  }

  get template() {
    return `systems/pmttrpg/templates/item/item-${this.item.type}-sheet.hbs`;
  }

  async getData() {
    const context = super.getData();
    const itemData = this.document.toObject(false);

    context.enrichedDescription = await TextEditor.enrichHTML(this.item.system.description, {
      secrets: this.document.isOwner,
      async: true,
      rollData: this.item.getRollData(),
      relativeTo: this.item,
    });

    context.system = itemData.system;
    context.flags = itemData.flags;
    context.config = CONFIG.PM_TTRPG;
    context.effects = prepareActiveEffectCategories(this.item.effects);

    return context;
  }

  activateListeners(html) {
    super.activateListeners(html);

    if (!this.isEditable) return;

    html.on('click', '.effect-control', (ev) => onManageActiveEffect(ev, this.item));
  }
}