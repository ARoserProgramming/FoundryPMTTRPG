import PMTTRPGDataModel from "./base-model.mjs";

/**
 * Base class for actors in the PMTTRPG system.
 * Extends PMTTRPGDataModel and defines core logic for attributes, resistances, and damage handling.
 */
export default class PMTTRPGActorBase extends PMTTRPGDataModel {

    /**
     * Defines the data schema for actors.
     * Includes attributes such as health points, stagger threshold, resistances, abilities, etc.
     * @returns {Object} Actor data schema.
     */
    static defineSchema() {
        const fields = foundry.data.fields;
        const requiredInteger = {required: true, nullable: false, integer: true};
        const schema = {};
        schema.stagger_threshold = new fields.SchemaField({
            value: new fields.NumberField({initial: 24, nullable: false, integer: true}),
            max: new fields.NumberField({initial: 24, nullable: false, integer: true}),
            temporal: new fields.NumberField({initial: 0, nullable: false, integer: true}),
        });
        schema.health_points = new fields.SchemaField({
            value: new fields.NumberField({initial: 80, nullable: false, integer: true}),
            max: new fields.NumberField({initial: 80, nullable: false, integer: true}),
            temporal: new fields.NumberField({initial: 0, nullable: false, integer: true}),
        });
        schema.light = new fields.SchemaField({
            value: new fields.NumberField({initial: 4, nullable: false, integer: true}),
            max: new fields.NumberField({initial: 4, nullable: false, integer: true}),
        });
        schema.xp = new fields.NumberField({...requiredInteger, initial: 0, min: -24, max: 128});
        schema.biography = new fields.StringField({required: true, blank: true});
        // Abilities schema
        schema.abilities = new fields.SchemaField(Object.keys(CONFIG.PMTTRPG.abilities).reduce((obj, ability) => {
            obj[ability] = new fields.SchemaField({
                value: new fields.NumberField({...requiredInteger, initial: 0, min: -1, max: 6}),
            });
            return obj;
        }, {}));
        // Resistances schema
        schema.resistances = new fields.SchemaField(
            Object.keys(CONFIG.PMTTRPG.damageTypes).reduce((obj, type) => {
                obj[type] = new fields.NumberField({ initial: 1, required: true, integer: true });
                return obj;
            }, {})
        );
        schema.levelUpPending = new fields.BooleanField({initial: false, required: true});
        return schema;
    }

    /**
     * Prepares base data for the actor.
     * Sets minimum values for key attributes and resets statuses.
     */
    prepareBaseData() {
        super.prepareBaseData();
        this.stagger_threshold.min = 0;
        this.health_points.min = 0;
        this.statuses = {};
    }

    /**
     * Prepares derived data for the actor.
     * Calculates values such as level, rank, attack modifiers, and equipment limits.
     */
    prepareDerivedData() {
        // Common ability modifier logic
        if (this.abilities) {
            for (const key in this.abilities) {
                this.abilities[key].mod = this.abilities[key].value;
                this.abilities[key].label = game.i18n.localize(CONFIG.PMTTRPG.abilities[key]) ?? key;
                this.abilities[key].img = CONFIG.PMTTRPG.abilityImages[key];
            }
        }
        // Common attribute logic
        this.level = Math.floor(this.xp / 8);
        this.rank = Math.floor(this.level / 3) + 1;
        this.attack_modifier = this.rank;
        this.evade_modifier = this.abilities.ins.value;
        this.block_modifier = this.abilities.tmp.value;
        this.tool_slots = {
            initial: 4,
            max: 4,
        };
        this.equipment_rank_limit = this.rank + 1;
        this.stagger_threshold.max = 20 + (this.abilities.chr.value * 4) + (this.rank * 4);
        this.health_points.max = 72 + (this.abilities.ftd.value * 8) + (this.rank * 8);
        this.light.max = 3 + this.rank;
    }

    /**
     * Hook executed before creating an actor.
     * Sets initial values such as token resource bar display.
     * @param {Object} data - Initial actor data.
     * @param {Object} options - Creation options.
     * @param {Object} user - User performing the action.
     * @returns {Promise<boolean>} Whether creation is allowed.
     */
    async _preCreate(data, options, user) {
        const allowed = await super._preCreate(data, options, user);
        if (allowed === false) return false;
        const updates = {
            prototypeToken: {
                displayBars: CONST.TOKEN_DISPLAY_MODES.OWNER
            }
        };
        this.parent.updateSource(updates);
    }

    /**
     * Applies damage to the actor, considering resistances and the target resource.
     * Allows ignoring specific resistances or all resistances via options.
     * @param {number} damage - Amount of damage to apply.
     * @param {Object} options - Additional options.
     * @param {string} options.type - Damage type (e.g., "slash", "pierce").
     * @param {string} options.targetResource - Target resource (e.g., "health_points").
     * @param {Array|string} [options.ignoreResistances] - Resistances to ignore or "all" to ignore all.
     * @returns {Promise<Object>} Updates applied to the actor.
     * @throws {Error} If parameters are invalid or required data is missing.
     */
    async takeDamage(damage, options = {}) {
        const damageType = options.type;
        const ignoreResistances = options.ignoreResistances || [];
        const ignoreAll = ignoreResistances === "all";
        if (typeof damage !== "number" || damage < 0) {
            throw new Error("Invalid damage value. Must be a non-negative number.");
        }
        if (!this.resistances.hasOwnProperty(damageType)) {
            throw new Error(`Invalid damage type: ${damageType}`);
        }
        if (!options.targetResource || !["health_points", "stagger_threshold","sanity_points"].includes(options.targetResource)) {
            throw new Error(`Invalid target resource: ${options.targetResource}`);
        }
        if (options.targetResource === "sanity_points" && this.constructor.name === "PMTTRPGAbnormality") {
            throw new Error("Abnormalities do not have sanity_points.");
        }

        const updates = {};
        const physicalTypes = ["slash","pierce","blunt"];
        const isPhysical = physicalTypes.includes(damageType);

        const shouldIgnore = (type) => ignoreAll || (Array.isArray(ignoreResistances) && ignoreResistances.includes(type));

        if (isPhysical && options.targetResource === "health_points") {
            const hpResistance = shouldIgnore(damageType) ? 1 : this.resistances[damageType];
            const effectiveHPDamage = Math.max(0, Math.round(damage * hpResistance));
            const damageToTempHP = Math.min(effectiveHPDamage, this.health_points.temporal);
            this.health_points.temporal = Math.max(0, this.health_points.temporal - damageToTempHP);
            const remainingHPDamage = Math.max(0, effectiveHPDamage - damageToTempHP);
            if (remainingHPDamage > 0) {
                this.health_points.value = Math.max(0, this.health_points.value - remainingHPDamage);
            }
            updates["system.health_points"] = this.health_points;

            const staggerResKey = "stagger_" + damageType;
            if (!this.resistances.hasOwnProperty(staggerResKey)) {
                throw new Error(`Missing stagger resistance for: ${damageType}`);
            }
            const staggerResistance = shouldIgnore(staggerResKey) ? 1 : this.resistances[staggerResKey];
            const effectiveStaggerDamage = Math.max(0, Math.round(damage * staggerResistance));
            const damageToTempStagger = Math.min(effectiveStaggerDamage, this.stagger_threshold.temporal);
            this.stagger_threshold.temporal = Math.max(0, this.stagger_threshold.temporal - damageToTempStagger);
            const remainingStaggerDamage = Math.max(0, effectiveStaggerDamage - damageToTempStagger);
            if (remainingStaggerDamage > 0) {
                this.stagger_threshold.value = Math.max(0, this.stagger_threshold.value - remainingStaggerDamage);
            }
            updates["system.stagger_threshold"] = this.stagger_threshold;
        } else {
            const resistance = shouldIgnore(damageType) ? 1 : this.resistances[damageType];
            const effectiveDamage = Math.max(0, Math.round(damage * resistance));

            switch (options.targetResource) {
                case "health_points": {
                    const damageToTempHP = Math.min(effectiveDamage, this.health_points.temporal);
                    this.health_points.temporal = Math.max(0, this.health_points.temporal - damageToTempHP);
                    const remainingDamage = Math.max(0, effectiveDamage - damageToTempHP);
                    if (remainingDamage > 0) {
                        this.health_points.value = Math.max(0, this.health_points.value - remainingDamage);
                    }
                    updates["system.health_points"] = this.health_points;
                    break;
                }
                case "sanity_points": {
                    const damageToTempSanity = Math.min(effectiveDamage, this.sanity_points.temporal);
                    this.sanity_points.temporal = Math.max(0, this.sanity_points.temporal - damageToTempSanity);
                    const remainingDamage = Math.max(0, effectiveDamage - damageToTempSanity);
                    if (remainingDamage > 0) {
                        this.sanity_points.value = Math.max(0, this.sanity_points.value - remainingDamage);
                    }
                    updates["system.sanity_points"] = this.sanity_points;
                    break;
                }
                case "stagger_threshold": {
                    const damageToTempStagger = Math.min(effectiveDamage, this.stagger_threshold.temporal);
                    this.stagger_threshold.temporal = Math.max(0, this.stagger_threshold.temporal - damageToTempStagger);
                    const remainingDamage = Math.max(0, effectiveDamage - damageToTempStagger);
                    if (remainingDamage > 0) {
                        this.stagger_threshold.value = Math.max(0, this.stagger_threshold.value - remainingDamage);
                    }
                    updates["system.stagger_threshold"] = this.stagger_threshold;
                    break;
                }
                default:
                    throw new Error(`Invalid target resource: ${options.targetResource}`);
            }
        }
        return this.parent.update(updates, options);
    }
}