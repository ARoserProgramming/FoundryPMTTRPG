/**
 * Extend the base Actor document by defining a custom roll data structure which is ideal for the Simple system.
 * @extends {Actor}
 */
export class PmTTRPGActor extends Actor {
    /** @override */
    prepareData() {
        // Prepare data for the actor. Calling the super version of this executes
        // the following, in order: data reset (to clear active effects),
        // prepareBaseData(), prepareEmbeddedDocuments() (including active effects),
        // prepareDerivedData().
        super.prepareData();
    }

    /** @override */
    prepareBaseData() {
        // Data modifications in this step occur before processing embedded
        // documents or derived data.
    }
    get level() {
        const system = this.system;
        const XP = system.attributes?.xp?.value ?? 0;
        return Math.floor(XP / 8);
    }
    get rank() {
        const LEVEL = this.level;
        return Math.floor(LEVEL / 3) +1;

    }
    get health_points() {
        const system = this.system;
        const FTD = system.abilities?.ftd?.value ?? 0;
        const RANK = this.rank;
        return 72 + (8 * FTD) + (8 * RANK);
    }

    get stagger_threshold() {
        const system = this.system;
        const CHR = system.abilities?.chr?.value ?? 0;
        const RANK = this.rank;
        return 20 + (CHR * 4) + (RANK * 4);
    }

    get mentality() {
        const system = this.system;
        const SP = system.abilities?.prd?.value ?? 0;
        return 15 + (SP * 3);
    }
    get light() {
        const RANK = this.rank;
        return 3 + (RANK);
    }
    get attack_modifier() {
        return this.rank;
    }
    get block_modifier() {
        const system = this.system;
        return system.abilities?.tmp?.value ?? 0;
    }
    get evade_modifier() {
        const system = this.system;
        return system.abilities?.ins?.value ?? 0;
    }
    get equipment_limit() {
        const RANK = this.rank;
        return RANK + 1;
    }
    get tool_slots() {
        return 4;
    }
    clampBarAttribute(bar, maxCalc, minCalc = 0) {
        if (!bar) return;
        // Si maxCalc es una función, úsala para obtener el máximo dinámico
        const max = typeof maxCalc === "function" ? maxCalc() : (maxCalc ?? bar.max ?? Infinity);
        const min = typeof minCalc === "function" ? minCalc() : (minCalc ?? bar.min ?? 0);
        bar.max = max;
        bar.min = min;
        if (bar.value == null || bar.value > max) {
            bar.value = max;
        } else if (bar.value < min) {
            bar.value = min;
        }
    }

    /**
     * @override
     * Augment the actor source data with additional dynamic data. Typically,
     * you'll want to handle most of your calculated/derived data in this step.
     * Data calculated in this step should generally not exist in template.json
     * (such as ability modifiers rather than ability scores) and should be
     * available both inside and outside of character sheets (such as if an actor
     * is queried and has a roll executed directly from it).
     */
    prepareDerivedData() {
        const actorData = this;
        const systemData = actorData.system;
        const flags = actorData.flags.pmttrpg || {};

        this._prepareCharacterData(actorData);
        this._prepareAbnormalityData(actorData);
        this._prepareDistortionData(actorData);

        // Asignar valores calculados
        systemData.level = this.level;
        systemData.rank = this.rank;
        systemData.block_modifier = this.block_modifier;
        systemData.evade_modifier = this.evade_modifier;
        systemData.equipment_limit = this.equipment_limit;
        systemData.tool_slots = this.tool_slots;
        systemData.health_points = { value: systemData.health_points.value, max: this.health_points };
        systemData.stagger_threshold = { value: systemData.stagger_threshold.value, max: this.stagger_threshold };
        systemData.light = { value: systemData.light.value, max: this.light };
        systemData.attack_modifier = this.attack_modifier;
        if (this.type === 'Distortion' || this.type === 'character') {
            systemData.mentality = { value: systemData.mentality.value, max: this.mentality };
        }

        // Clamping de barras
        this.clampBarAttribute(systemData.health_points, () => this.health_points);
        this.clampBarAttribute(systemData.stagger_threshold, () => this.stagger_threshold);
        if (this.type === 'Distortion' || this.type === 'character') {
            this.clampBarAttribute(systemData.mentality, () => this.mentality);
        }
        this.clampBarAttribute(systemData.light, () => this.light);
    }

    /**
     * Prepare Character type specific data
     */
    _prepareCharacterData(actorData) {
        if (actorData.type !== 'character') return;

        // Make modifications to data here. For example:
        const systemData = actorData.system;

        // Loop through ability scores, and add their modifiers to our sheet output.
        for (let [key, ability] of Object.entries(systemData.abilities)) {
            // Calculate the modifier using d20 rules.
            ability.mod = ability.value;
        }
    }

    /**
     * Prepare Abno type specific data.
     */
    _prepareAbnormalityData(actorData) {
        if (actorData.type !== 'Abnormality') return;

        // Make modifications to data here. For example:
        const systemData = actorData.system;

        // Loop through ability scores, and add their modifiers to our sheet output.
        for (let [key, ability] of Object.entries(systemData.abilities)) {
            // Calculate the modifier using d20 rules.
            ability.mod = ability.value;
        }
    }

    /**
     * Prepare Distortion type specific data.
     */
    _prepareDistortionData(actorData) {
        if (actorData.type !== 'Distortion') return;

        // Make modifications to data here. For example:
        const systemData = actorData.system;

        // Loop through ability scores, and add their modifiers to our sheet output.
        for (let [key, ability] of Object.entries(systemData.abilities)) {
            // Calculate the modifier using d20 rules.
            ability.mod = ability.value;
        }
    }

    /**
     * Override getRollData() that's supplied to rolls.
     */
    getRollData() {
        // Starts off by populating the roll data with a shallow copy of `this.system`
        const data = {...this.system};

        // Prepare character roll data.
        this._getCharacterRollData(data);
        this._getAbnormalityRollData(data)
        this._getDistortionRollData(data);

        return data;
    }


    /**
     * Prepare character roll data.
     */
    _getCharacterRollData(data) {
        if (this.type !== 'character') return;

        // Copy the ability scores to the top level, so that rolls can use
        // formulas like `@str.mod + 4`.
        if (data.abilities) {
            for (let [k, v] of Object.entries(data.abilities)) {
                data[k] = foundry.utils.deepClone(v);
            }
        }

        // Add rank for easier access, or fall back to 0.
        if (data.attributes.rank) {
            data.rank = data.attributes.rank.value ?? 0;
        }
    }

    /**
     * Prepare NPC roll data.
     */
    _getAbnormalityRollData(data) {
        if (this.type !== 'Abnormality') return;

        // Copy the ability scores to the top level, so that rolls can use
        // formulas like `@str.mod + 4`.
        if (data.abilities) {
            for (let [k, v] of Object.entries(data.abilities)) {
                data[k] = foundry.utils.deepClone(v);
            }
        }

        // Add rank for easier access, or fall back to 0.
        if (data.attributes.rank) {
            data.rank = data.attributes.rank.value ?? 0;
        }
    }
    _getDistortionRollData(data) {
        if (this.type !== 'Distortion') return;

        // Copy the ability scores to the top level, so that rolls can use
        // formulas like `@str.mod + 4`.
        if (data.abilities) {
            for (let [k, v] of Object.entries(data.abilities)) {
                data[k] = foundry.utils.deepClone(v);
            }
        }

        // Add rank for easier access, or fall back to 0.
        if (data.attributes.rank) {
            data.rank = data.attributes.rank.value ?? 0;
        }
    }
}
