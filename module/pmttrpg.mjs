// import * as canvas from "./canvas/_module.mjs";
 import * as documents from "./documents/_module.mjs";
import * as sheets from "./sheets/_module.mjs";
// import * as applications from "./applications/_module.mjs";
// import * as helpers from "./helpers/_module.mjs";
// import * as rolls from "./rolls/_module.mjs";
// import * as data from "./data/_module.mjs";
// import * as utils from "./utils/_module.mjs";
// Import document classes.
// Import sheet classes.
import PMTTRPGActor from './documents/actor.mjs';
import PMTTRPGItem from './documents/item.mjs';
// Import helper/utility classes and constants.
import {preloadHandlebarsTemplates} from './helpers/templates.mjs';
import {PMTTRPG} from './helpers/config.mjs';
import PMTTRPGToken from "./overrides/TokenOverride.mjs";
import PMTTRPGUtils from "./helpers/utils.mjs";
globalThis.pmttrpg = {
    // canvas,
    documents,
    sheets,
    // applications,
    // helpers,
    // rolls,
    // data,
    // utils,
    // CONST: PM_CONST,
    CONFIG: PMTTRPG,
};
// Import DataModel classes
import * as models from './data/_module.mjs';
import {aplicarDañoAutomatizado} from "./helpers/effects.mjs";
import PMTTRPGActorSheet from "./sheets/actor-sheet.mjs";
import PMTTRPGItemSheet from "./sheets/item-sheet.mjs";

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
    CONFIG.Token.objectClass = PMTTRPGToken;
    // Define custom Document and DataModel classes
    CONFIG.Actor.documentClass = PMTTRPGActor;

    // Note that you don't need to declare a DataModel
    // for the base actor/item classes - they are included
    // with the Character/NPC as part of super.defineSchema()
    CONFIG.Actor.dataModels = {
        character: models.PMTTRPGCharacter,
        abnormality: models.PMTTRPGAbnormality,
        distortion: models.PMTTRPGDistortion,
        npc: models.PMTTRPGNpc,
        effect: models.PMTTRPGActiveEffect,
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
    //Remove Status Effects Not Available in PMTTRPG
    const toRemove = ["eye","bleeding","freezing","frozen","burning","bless", "corrode", "curse", "degen", "disease", "upgrade", "fireShield", "fear", "holyShield", "hover", "coldShield", "magicShield", "paralysis", "poison", "prone", "regen", "restrain", "shock", "silence", "stun", "downgrade", "unconscious", "upgrade", "weakness", "wound"];
    CONFIG.statusEffects = CONFIG.statusEffects.filter(effect => !toRemove.includes(effect.id));
    // Status Effect Transfer
    for (const [id, value] of Object.entries(PMTTRPG.conditions)) {
        CONFIG.statusEffects.push({id, ...value});
    }
    console.log(PMTTRPG.damageTypes);
   // Preload Handlebars templates.
    return preloadHandlebarsTemplates();
});
Hooks.on('createActor', async (actor, options, userId) => {
    if (!actor || actor.type !== 'character') return;

    const rangos = [
        { label: "0", xp: -24 },
        { label: "1", xp: 0 },
        { label: "2", xp: 24 },
        { label: "3", xp: 48 },
        { label: "4", xp: 72 },
        { label: "5", xp: 96 },
        { label: "EX", xp: 120 }
    ];

    const content = `
    <form>
        <div class="form-group">
            <label>Selecciona el rango inicial:</label>
            <select id="rango-inicial">
                ${rangos.map((r, i) => `<option value="${i}">${r.label}</option>`).join('')}
            </select>
        </div>
    </form>
    `;

    new Dialog({
        title: "Rango Inicial",
        content,
        buttons: {
            ok: {
                label: "Aceptar",
                callback: async (html) => {
                    const idx = parseInt(html.find('#rango-inicial').val());
                    const xp = rangos[idx].xp;
                    await actor.update({ "system.xp": xp });
                    // Calcula el nivel inicial según el XP
                    const newLevel = Math.floor(xp / 8);
                    // Abre el diálogo de subida de nivel
                    const LevelUpDialog = (await import('./module/dialog/level-up-dialog.mjs')).default;
                    new LevelUpDialog(actor, newLevel).render(true);
                }
            }
        },
        default: "ok"
    }).render(true);
});
// save the previous level before the actor is updated
Hooks.on('preUpdateActor', (actor, changes, options, userId) => {
    if (!changes.system || !('xp' in changes.system)) return;
    const prevXp = actor.system.xp ?? 0;
    actor._oldLevel = Math.floor(prevXp / 8);
});

// compare after the actor is updated
Hooks.on('updateActor', async (actor, changes, options, userId) => {
    try {
        if (!changes.system || !('xp' in changes.system)) return;
        const newXp = actor.system.xp ?? 0;
        const newLevel = Math.floor(newXp / 8);
        const oldLevel = actor._oldLevel ?? newLevel;
        delete actor._oldLevel; // Clear temporary property

        if (newLevel !== oldLevel) {
            if (actor.sheet) {
                await actor.sheet._showLevelUpDialog();
                await actor.update({'system.level': newLevel});
            }
        }
    } catch (error) {
        console.error('Error in updateActor hook:', error);
    }
});
Hooks.once('ready', async function () {
    // Tipos de daño físicos fijos
    const physicalTypes = ["slash", "pierce", "blunt"];
    const testDamage = 2;

    for (const actor of game.actors.contents) {
        if (!actor.system?.health_points || !actor.system?.stagger_threshold) continue;
        console.log(`\n--- Test daño físico en ${actor.name} ---`);
        for (const damageType of physicalTypes) {
            try {
                console.log(`Aplicando ${testDamage} de daño tipo "${damageType}" a health_points`);
                await actor.system.takeDamage(testDamage, { type: damageType, targetResource: "health_points"});
                console.log(`Nuevo estado de health_points:`, foundry.utils.deepClone(actor.system.health_points));
                console.log(`Nuevo estado de stagger_threshold:`, foundry.utils.deepClone(actor.system.stagger_threshold));
            } catch (e) {
                console.error(`Error al aplicar daño tipo "${damageType}" en ${actor.name}:`, e);
            }
            // Restaurar valores
            try {
                await actor.update({
                    "system.health_points.value": actor.system.health_points.max,
                    "system.stagger_threshold.value": actor.system.stagger_threshold.max
                });
            } catch (e) {
                console.error(`Error al restaurar recursos en ${actor.name}:`, e);
            }
        }
    }
    // Tipos de daño especiales
    const specialTypes = ["burn","sinking","rupture"];
    const testDamage2 = 2;

    for (const actor of game.actors.contents) {
        if (!actor.system?.health_points || !actor.system?.stagger_threshold) continue;
        console.log(`\n--- Test daño especial en ${actor.name} ---`);
        for (const damageType of specialTypes) {
            try {
                console.log(`Aplicando ${testDamage} de daño tipo "${damageType}" con aplicarDañoAutomatizado`);
                await aplicarDañoAutomatizado(actor, damageType, testDamage2);
                console.log(`Nuevo estado de health_points:`, foundry.utils.deepClone(actor.system.health_points));
                console.log(`Nuevo estado de stagger_threshold:`, foundry.utils.deepClone(actor.system.stagger_threshold));
                if (actor.system.sanity_points)
                    console.log(`Nuevo estado de sanity_points:`, foundry.utils.deepClone(actor.system.sanity_points));
            } catch (e) {
                console.error(`Error al aplicar daño tipo "${damageType}" en ${actor.name}:`, e);
            }
            // Restaurar valores
            try {
                await actor.update({
                    "system.health_points.value": actor.system.health_points.max,
                    "system.stagger_threshold.value": actor.system.stagger_threshold.max,
                    ...(actor.system.sanity_points && {"system.sanity_points.value": actor.system.sanity_points.max})
                });
            } catch (e) {
                console.error(`Error al restaurar recursos en ${actor.name}:`, e);
            }
        }
    }


});

/* -------------------------------------------- */
/*  Handlebars Helpers                          */
/* -------------------------------------------- */

// If you need to add Handlebars helpers, here is a useful example:
Handlebars.registerHelper('toLowerCase', function (str) {
    return str.toLowerCase();
});
Handlebars.registerHelper('asset', function (path) {
    return `/systems/pmttrpg/${path}`;
});
// Registrar helper para array si no existe
Handlebars.registerHelper('array', function (start, end, options) {
    let result = [];
    for (let i = start; i <= end; i++) result.push(i);
    return options.fn ? options.fn(result) : result;
});
Handlebars.registerHelper('resistancetext', function (valor) {
    if (valor == null) return "";
    if (valor < 0.25) return "Ineffective";
    if (valor >= 0.25 && valor < 1) return "Resistant";
    if(valor >= 1 && valor < 1.5) return "Normal";
    if(valor >= 1.5 && valor <2) return "Weak";
    if(valor >= 2) return "Fatal";
    return valor;
});
Handlebars.registerHelper('varImage', function (valor, resource, type) {
    return PMTTRPGUtils.getResistanceImage(valor, resource, type);
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
            flags: {'pmttrpg.itemMacro': true},
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
