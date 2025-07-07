import { PmTTRPGActor } from './documents/actor.mjs';
import { PmTTRPGItem } from './documents/item.mjs';
import { PmTTRPGActorSheet } from './sheets/actor-sheet.mjs';
import { PmTTRPGItemSheet } from './sheets/item-sheet.mjs';
import { preloadHandlebarsTemplates } from './helpers/templates.mjs';
import { PM_TTRPG } from './helpers/config.mjs';
import PmTTRPGActorBaseModel from './data/models/base-actor-model.mjs';
import PmTTRPGCharacterModel from './data/models/actor-character-model.mjs';
import PmTTRPGAbnormalityModel from './data/models/actor-abnormality-model.mjs';
import PmTTRPGDistortionModel from './data/models/actor-distortion-model.mjs';
import PmTTRPGItemBaseModel from './data/models/base-item-model.mjs';
import PmTTRPGItemModel from './data/models/item-item-model.mjs';
import PmTTRPGFeatureModel from './data/models/item-feature-model.mjs';
import PmTTRPGSpellModel from './data/models/item-spell-model.mjs';

/* -------------------------------------------- */
/*  Init Hook                                   */
/* -------------------------------------------- */

Hooks.once('init', function () {
  // Registrar modelos de datos en CONFIG
  CONFIG.PM_TTRPG = {
    ...PM_TTRPG,
    models: {
      Actor: {
        base: PmTTRPGActorBaseModel,
        character: PmTTRPGCharacterModel,
        Abnormality: PmTTRPGAbnormalityModel,
        Distortion: PmTTRPGDistortionModel
      },
      Item: {
        base: PmTTRPGItemBaseModel,
        item: PmTTRPGItemModel,
        feature: PmTTRPGFeatureModel,
        spell: PmTTRPGSpellModel
      }
    }
  };

  // Añadir clases de utilidad al objeto global
  game.pmttrpg = {
    PmTTRPGActor,
    PmTTRPGItem,
    rollItemMacro,
  };

  // Configurar clases de documentos
  CONFIG.Actor.documentClass = PmTTRPGActor;
  CONFIG.Item.documentClass = PmTTRPGItem;

  // Configurar iniciativa
  CONFIG.Combat.initiative = {
    formula: '1d6 + @abilities.jst.mod',
    decimals: 2,
  };

  // Deshabilitar transferencia heredada de efectos
  CONFIG.ActiveEffect.legacyTransferral = false;

  // Registrar hojas de aplicación
  Actors.unregisterSheet('core', ActorSheet); // Desregistrar la hoja genérica
  Actors.registerSheet('pmttrpg', PmTTRPGActorSheet, {
    makeDefault: true,
    label: 'PM_TTRPG.SheetLabels.Actor'
  });
  Items.unregisterSheet('core', ItemSheet);
  Items.registerSheet('pmttrpg', PmTTRPGItemSheet, { makeDefault: true, label: 'PM_TTRPG.SheetLabels.Item' });

  // Registrar etiquetas de tipos de actores
  CONFIG.Actor.typeLabels = {
    character: 'PM_TTRPG.Actor.Type.Character',
    Abnormality: 'PM_TTRPG.Actor.Type.Abnormality',
    Distortion: 'PM_TTRPG.Actor.Type.Distortion'
  };

  // Depuración
  console.log('PMTTRPG Init: Data models registered:', CONFIG.PM_TTRPG.models);
  console.log('PMTTRPG Init: Actor type labels registered:', CONFIG.Actor.typeLabels);
  console.log('PMTTRPG Init: System entity types:', game.system.entityTypes);

  // Preload Handlebars templates
  return preloadHandlebarsTemplates();
});

/* -------------------------------------------- */
/*  Ready Hook                                  */
/* -------------------------------------------- */

Hooks.once('ready', function () {
  console.log('PMTTRPG Ready: Final system entity types:', game.system.entityTypes);
  Hooks.on('hotbarDrop', (bar, data, slot) => createItemMacro(data, slot));
});

/* -------------------------------------------- */
/*  Handlebars Helpers                          */
/* -------------------------------------------- */

Handlebars.registerHelper('toLowerCase', function (str) {
  return str.toLowerCase();
});

/* -------------------------------------------- */
/*  Hotbar Macros                               */
/* -------------------------------------------- */

async function createItemMacro(data, slot) {
  if (data.type !== 'Item') return;
  if (!data.uuid.includes('Actor.') && !data.uuid.includes('Token.')) {
    return ui.notifications.warn('You can only create macro buttons for owned Items');
  }
  const item = await Item.fromDropData(data);
  const command = `game.pmttrpg.rollItemMacro("${data.uuid}");`;
  let macro = game.macros.find(m => m.name === item.name && m.command === command);
  if (!macro) {
    macro = await Macro.create({
      name: item.name,
      type: 'script',
      img: item.img,
      command: command,
      flags: { 'pmttrpg.itemMacro': true },
    });
  }
  game.user.assignHotbarMacro(macro, slot);
  return false;
}

function rollItemMacro(itemUuid) {
  const dropData = { type: 'Item', uuid: itemUuid };
  Item.fromDropData(dropData).then((item) => {
    if (!item || !item.parent) {
      const itemName = item?.name ?? itemUuid;
      return ui.notifications.warn(`Could not find item ${itemName}. You may need to delete and recreate this macro.`);
    }
    item.roll();
  });
}