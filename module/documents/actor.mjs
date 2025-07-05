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

    get health_points() {
        if (this.type !== 'character') return 0;
        const system = this.system;
        const FTD = system.abilities?.ftd?.value ?? 0;
        const RANK = system.attributes?.rank?.value ?? 0;
        return 72 + (8 * FTD) + (8 * RANK);
    }

    get stagger_threshold() {
        if (this.type !== 'character') return 0;
        const system = this.system;
        const CHR = system.abilities?.chr?.value ?? 0;
        const RANK = system.attributes?.rank?.value ?? 0;
        return 20 + (CHR * 4) + (RANK * 4);
    }
    clampBarAttribute(bar) {
        if (!bar) return;
        if (bar.value == null || bar.value > bar.max) {
            bar.value = bar.max;
        } else if (bar.value < 0) {
            bar.value = 0;
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

        // Make separate methods for each Actor type (character, npc, etc.) to keep
        // things organized.
        this._prepareCharacterData(actorData);
        this._prepareAbnormalityData(actorData);
        this._prepareDistortionData(actorData);
        if (actorData.type === 'character') {
            const prevHpMax = systemData.health_points.max;
            const prevStaggerMax = systemData.stagger_threshold.max;


            const newHpMax = this.health_points;
            const newStaggerMax = this.stagger_threshold;

            // Si el valor era igual al máximo anterior, actualízalo al nuevo máximo
            if (systemData.health_points.value === prevHpMax) {
                systemData.health_points.value = newHpMax;
            }
            if (systemData.stagger_threshold.value === prevStaggerMax) {
                systemData.stagger_threshold.value = newStaggerMax;
            }

            // Actualiza los máximos
            systemData.health_points.max = newHpMax;
            systemData.stagger_threshold.max = newStaggerMax;

            // Aplica el clamp para asegurar los límites
            this.clampBarAttribute(systemData.health_points);
            this.clampBarAttribute(systemData.stagger_threshold);
        }
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
        if (actorData.type !== 'abnormality') return;

        // Make modifications to data here. For example:
        const systemData = actorData.system;
    }
    /**
     * Prepare Distortion type specific data.
     */
    _prepareDistortionData(actorData) {
        if (actorData.type !== 'distortion') return;

        // Make modifications to data here. For example:
        const systemData = actorData.system;
    }

    /**
     * Override getRollData() that's supplied to rolls.
     */
    getRollData() {
        // Starts off by populating the roll data with a shallow copy of `this.system`
        const data = {...this.system};

        // Prepare character roll data.
        this._getCharacterRollData(data);
        this._getNpcRollData(data);

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

        // Add level for easier access, or fall back to 0.
        if (data.attributes.level) {
            data.lvl = data.attributes.level.value ?? 0;
        }
    }

    /**
     * Prepare NPC roll data.
     */
    _getNpcRollData(data) {
        if (this.type !== 'npc') return;

        // Process additional NPC data here.
    }

}
