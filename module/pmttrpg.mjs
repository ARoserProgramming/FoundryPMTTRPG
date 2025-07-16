// Import document classes.
import {PMTTRPGActor} from './documents/actor.mjs';
import {PMTTRPGItem} from './documents/item.mjs';
// Import sheet classes.
import {PMTTRPGActorSheet} from './sheets/actor-sheet.mjs';
import {PMTTRPGItemSheet} from './sheets/item-sheet.mjs';
// Import helper/utility classes and constants.
import {preloadHandlebarsTemplates} from './helpers/templates.mjs';
import {PMTTRPG} from './helpers/config.mjs';
import PMTTRPGToken from "./overrides/TokenOverride.mjs";

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
Hooks.on('createActor', (actor, data, options) => {

});
Hooks.on('updateActor', (actor, changes, options, userId) => {
    try {
        // Verificar si hay cambios en el sistema y específicamente en xp
        if (!changes.system || !('xp' in changes.system)) return;
        if (actor.type !== 'character' && actor.type !== 'distortion') return;
        let newHp = actor.system.health_points.value;
        let newMaxHp = actor.system.health_points.max;
        // Calcular el nuevo nivel basado en el xp total
        const currentXp = actor.system.xp + (changes.system.xp || 0);
        const newLevel = Math.floor(currentXp / 8); // Asumiendo 8 XP por nivel
        const oldLevel = actor.system.level;
        // Si el nuevo nivel es distinto que el anterior, mostrar el diálogo
        if (newLevel !== oldLevel || newLevel === 0) {
            if (actor.sheet) {
                actor.sheet._showLevelUpDialog();
                // Actualizar el nivel del actor después de mostrar el diálogo (opcional)
                actor.update({'system.level': newLevel});
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
