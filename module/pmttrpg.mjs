// Import document classes.
import { PMTTRPGActor } from './documents/actor.mjs';
import { PMTTRPGItem } from './documents/item.mjs';
// Import sheet classes.
import { PMTTRPGActorSheet } from './sheets/actor-sheet.mjs';
import { PMTTRPGItemSheet } from './sheets/item-sheet.mjs';
// Import helper/utility classes and constants.
import { preloadHandlebarsTemplates } from './helpers/templates.mjs';
import { PMTTRPG } from './helpers/config.mjs';
// Import DataModel classes
import * as models from './data/_module.mjs';

/* -------------------------------------------- */
/*  Init Hook                                   */
/* -------------------------------------------- */

Hooks.once('init', function () {
  // Add utility classes to the global game object so that they're more easily
  // accessible in global contexts.
  game.pmttrpg = {
    PMTTRPGActor,
    PMTTRPGItem,
    rollItemMacro,
  };

  // Add custom constants for configuration.
  CONFIG.PMTTRPG = PMTTRPG;

  /**
   * Set an initiative formula for the system
   * @type {String}
   */
  CONFIG.Combat.initiative = {
    formula: '1d6 + @abilities.jst.mod',
    decimals: 2,
  };

  // Define custom Document and DataModel classes
  CONFIG.Actor.documentClass = PMTTRPGActor;

  // Note that you don't need to declare a DataModel
  // for the base actor/item classes - they are included
  // with the Character/NPC as part of super.defineSchema()
  CONFIG.Actor.dataModels = {
    character: models.PMTTRPGCharacter,
    abnormality: models.PMTTRPGAbnormality,
    distortion: models.PMTTRPGDistortion,
    npc: models.PMTTRPGNpc
  }
  CONFIG.Item.documentClass = PMTTRPGItem;
  CONFIG.Item.dataModels = {
    item: models.PMTTRPGItem,
    feature: models.PMTTRPGFeature,
    spell: models.PMTTRPGSpell
  }

  // Active Effects are never copied to the Actor,
  // but will still apply to the Actor from within the Item
  // if the transfer property on the Active Effect is true.
  CONFIG.ActiveEffect.legacyTransferral = false;

  // Register sheet application classes
  Actors.unregisterSheet('core', ActorSheet);
  Actors.registerSheet('pmttrpg', PMTTRPGActorSheet, {
    makeDefault: true,
    label: 'PMTTRPG.SheetLabels.Actor',
  });
  Items.unregisterSheet('core', ItemSheet);
  Items.registerSheet('pmttrpg', PMTTRPGItemSheet, {
    makeDefault: true,
    label: 'PMTTRPG.SheetLabels.Item',
  });

  // Preload Handlebars templates.
  return preloadHandlebarsTemplates();
});

// Hook adaptado para subida de nivel según tus reglas
Hooks.on("createActor", async (actor, options, userId) => {
  // Solo para personajes y solo si es el usuario que lo crea
  if (actor.type !== "character" || userId !== game.user.id) return;

  const abilities = actor.system.abilities;
  const statKeys = Object.keys(abilities);
  const statLabels = statKeys.map(k => game.i18n.localize(CONFIG.PMTTRPG.abilities[k]) ?? k);

  // Rango inicial
  const rank = 1;
  const statMax = rank + 2;

  // Opciones de valores posibles para cada stat, de -1 a Rank+2 (máx 3 en rango 1)
  const statOptions = (selected = 0) =>
      Array.from({length: statMax + 2}, (_, i) => i - 1)
          .map(v => `<option value="${v}" ${v === selected ? "selected" : ""}>${v}</option>`)
          .join("");

  // Construye el formulario
  let content = `<form><p>Reparte 6 puntos entre los stats. Cada stat entre -1 y ${statMax}. La suma debe ser 6.</p>`;
  statKeys.forEach((k, i) => {
    content += `
      <div>
        <label>${statLabels[i]}</label>
        <select name="${k}">${statOptions(0)}</select>
      </div>
    `;
  });
  content += `</form>`;

  // Muestra el diálogo
  new Dialog({
    title: "Asignar Stats Iniciales",
    content,
    buttons: {
      ok: {
        label: "Asignar",
        callback: async html => {
          let total = 0;
          const updates = {};
          statKeys.forEach(k => {
            const val = parseInt(html.find(`[name="${k}"]`).val());
            updates[`system.abilities.${k}.value`] = val;
            total += val;
          });
          // Valida la suma y los límites
          const valid = total === 6 && Object.values(updates).every(v => v >= -1 && v <= statMax);
          if (!valid) {
            ui.notifications.error(`La suma debe ser 6 y cada stat entre -1 y ${statMax}.`);
            return;
          }
          await actor.update(updates);
          if (actor.sheet.rendered) actor.sheet.render(true);
        }
      }
    },
    default: "ok",
    close: () => {}
  }).render(true);
});

Hooks.on("updateActor", async (actor, changes, options, userId) => {
  if (!changes.system?.xp && !changes.xp) return;

  const prevLevel = actor._source.system?.level ?? actor._source.level ?? 0;
  const newLevel = actor.system?.level ?? actor.level ?? 0;
  const rank = actor.system?.rank ?? actor.rank ?? 1;
  const abilities = actor.system.abilities;

  if (newLevel > prevLevel) {
    // Construye las opciones de stats dinámicamente
    const statOptions = Object.entries(abilities)
        .map(([key, stat]) => `<option value="${key}">${stat.label ?? key} (${stat.value})</option>`)
        .join("");

    // Diálogo de subida de nivel
    new Dialog({
      title: "¡Subiste de nivel!",
      content: `
        <form>
          <p>Elige cómo repartir tus puntos de stat:</p>
          <label><input type="radio" name="statmode" value="split" checked> +1 a dos stats</label><br>
          <label><input type="radio" name="statmode" value="single"> +2 a un stat</label>
          <div id="stat-choices">
            <select name="stat1">${statOptions}</select>
            <select name="stat2">${statOptions}</select>
          </div>
          <hr>
          <p>Mover 1 punto de un stat a otro (opcional):</p>
          <select name="fromStat"><option value="">--Ninguno--</option>${statOptions}</select>
          <select name="toStat"><option value="">--Ninguno--</option>${statOptions}</select>
          <hr>
          <p>Acción única sobre habilidades (debes implementarla según tu modelo):</p>
          <select name="skillAction">
            <option value="">--Ninguna--</option>
            <option value="learn">Aprender nueva habilidad</option>
            <option value="change">Cambiar efecto de habilidad</option>
            <option value="forget">Olvidar habilidad</option>
          </select>
        </form>
        <script>
          // Cambia los selects según la opción elegida
          const form = document.currentScript.parentElement;
          form.querySelectorAll('input[name="statmode"]').forEach(radio => {
            radio.addEventListener('change', e => {
              const statChoices = form.querySelector('#stat-choices');
              if (e.target.value === "split") {
                statChoices.innerHTML = \`
                  <select name="stat1">${statOptions}</select>
                  <select name="stat2">${statOptions}</select>
                \`;
              } else {
                statChoices.innerHTML = \`
                  <select name="stat1">${statOptions}</select>
                \`;
              }
            });
          });
        </script>
      `,
      buttons: {
        ok: {
          label: "Asignar",
          callback: async html => {
            const statmode = html.find('[name="statmode"]:checked').val();
            const stat1 = html.find('[name="stat1"]').val();
            const stat2 = html.find('[name="stat2"]').val();
            const fromStat = html.find('[name="fromStat"]').val();
            const toStat = html.find('[name="toStat"]').val();
            const skillAction = html.find('[name="skillAction"]').val();

            // Copia los valores actuales
            const newAbilities = {};
            for (const key in abilities) {
              newAbilities[`abilities.${key}.value`] = abilities[key].value;
            }

            // Aplica la mejora de stats
            if (statmode === "split" && stat1 && stat2 && stat1 !== stat2) {
              // +1 a dos stats diferentes
              [stat1, stat2].forEach(stat => {
                const max = rank + 2;
                if (newAbilities[`abilities.${stat}.value`] < max)
                  newAbilities[`abilities.${stat}.value`] += 1;
              });
            } else if (statmode === "single" && stat1) {
              // +2 a un stat
              const max = rank + 2;
              if (newAbilities[`abilities.${stat1}.value`] < max)
                newAbilities[`abilities.${stat1}.value`] = Math.min(
                    newAbilities[`abilities.${stat1}.value`] + 2,
                    max
                );
            }

            // Mover 1 punto de un stat a otro
            if (fromStat && toStat && fromStat !== toStat) {
              const min = -1;
              const max = rank + 2;
              if (
                  newAbilities[`abilities.${fromStat}.value`] > min &&
                  newAbilities[`abilities.${toStat}.value`] < max
              ) {
                newAbilities[`abilities.${fromStat}.value`] -= 1;
                newAbilities[`abilities.${toStat}.value`] += 1;
              }
            }

            // Actualiza los stats
            await actor.update({ system: newAbilities });

            // Aquí deberías implementar la lógica para skills según tu modelo
            if (skillAction) {
              // Por ejemplo: await gestionarSkill(actor, skillAction, rank);
            }

            // Refresca la hoja
            if (actor.sheet.rendered) await actor.sheet.render(true);
          }
        }
      }
    }).render(true);
  }
});

/* -------------------------------------------- */
/*  Handlebars Helpers                          */
/* -------------------------------------------- */

// If you need to add Handlebars helpers, here is a useful example:
Handlebars.registerHelper('toLowerCase', function (str) {
  return str.toLowerCase();
});
Handlebars.registerHelper('asset', function (path){
  return `/systems/pmttrpg/${path}`;
});

/* -------------------------------------------- */
/*  Ready Hook                                  */
/* -------------------------------------------- */

Hooks.once('ready', function () {
  // Wait to register hotbar drop hook on ready so that modules could register earlier if they want to
  Hooks.on('hotbarDrop', (bar, data, slot) => createItemMacro(data, slot));
});

/* -------------------------------------------- */
/*  Hotbar Macros                               */
/* -------------------------------------------- */

/**
 * Create a Macro from an Item drop.
 * Get an existing item macro if one exists, otherwise create a new one.
 * @param {Object} data     The dropped data
 * @param {number} slot     The hotbar slot to use
 * @returns {Promise}
 */
async function createItemMacro(data, slot) {
  // First, determine if this is a valid owned item.
  if (data.type !== 'Item') return;
  if (!data.uuid.includes('Actor.') && !data.uuid.includes('Token.')) {
    return ui.notifications.warn(
      'You can only create macro buttons for owned Items'
    );
  }
  // If it is, retrieve it based on the uuid.
  const item = await Item.fromDropData(data);

  // Create the macro command using the uuid.
  const command = `game.pmttrpg.rollItemMacro("${data.uuid}");`;
  let macro = game.macros.find(
    (m) => m.name === item.name && m.command === command
  );
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

/**
 * Create a Macro from an Item drop.
 * Get an existing item macro if one exists, otherwise create a new one.
 * @param {string} itemUuid
 */
function rollItemMacro(itemUuid) {
  // Reconstruct the drop data so that we can load the item.
  const dropData = {
    type: 'Item',
    uuid: itemUuid,
  };
  // Load the item from the uuid.
  Item.fromDropData(dropData).then((item) => {
    // Determine if the item loaded and if it's an owned item.
    if (!item || !item.parent) {
      const itemName = item?.name ?? itemUuid;
      return ui.notifications.warn(
        `Could not find item ${itemName}. You may need to delete and recreate this macro.`
      );
    }

    // Trigger the item roll
    item.roll();
  });
}
