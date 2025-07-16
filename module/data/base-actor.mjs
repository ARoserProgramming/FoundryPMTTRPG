import PMTTRPGDataModel from "./base-model.mjs";

export default class PMTTRPGActorBase extends PMTTRPGDataModel {

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
        schema.biography = new fields.StringField({required: true, blank: true}); // equivalent to passing ({initial: ""}) for StringFields
        // Iterate over ability names and create a new SchemaField for each.
        schema.abilities = new fields.SchemaField(Object.keys(CONFIG.PMTTRPG.abilities).reduce((obj, ability) => {
            obj[ability] = new fields.SchemaField({
                value: new fields.NumberField({...requiredInteger, initial: 0, min: -1, max: 6}),
            });
            return obj;
        }, {}));
        schema.resistances = new fields.SchemaField(
            Object.keys(CONFIG.PMTTRPG.damageTypes).reduce((obj, type) => {
                obj[type] = new fields.NumberField({ initial: 4, required: true, integer: true });
                return obj;
            }, {})
        );
        return schema;
    }

    prepareBaseData() {
        super.prepareBaseData();
        this.stagger_threshold.min = 0;
        this.health_points.min = 0;
        this.statuses = {};
    }
    prepareDerivedData() {
        // Lógica común de modificadores de habilidades
        if (this.abilities) {
            for (const key in this.abilities) {
                this.abilities[key].mod = this.abilities[key].value;
                this.abilities[key].label = game.i18n.localize(CONFIG.PMTTRPG.abilities[key]) ?? key;
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
        this.light.max= 3 + this.rank;

    }
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

    async takeDamage(damage, options = {}) {
        const damageType = options.type || "force";
        const ignoreResistances = options.ignoreResistances || [];
        const ignoreAll = ignoreResistances === "all";
        if (typeof damage !== "number" || damage < 0) {
            throw new Error("Invalid damage value. Must be a non-negative number.");
        }
        if (!this.resistances.hasOwnProperty(damageType) || options.type === "physical") {
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

        // Helper para decidir si ignorar resistencia
        const shouldIgnore = (type) => ignoreAll || (Array.isArray(ignoreResistances) && ignoreResistances.includes(type));

        if (isPhysical && options.targetResource === "health_points") {
            // HP Damage
            const hpResistance = shouldIgnore(damageType) ? 1 : this.resistances[damageType];
            const effectiveHPDamage = Math.max(0, damage * hpResistance);
            const damageToTempHP = Math.min(effectiveHPDamage, this.health_points.temporal);
            this.health_points.temporal = Math.max(0, this.health_points.temporal - damageToTempHP);
            const remainingHPDamage = Math.max(0, effectiveHPDamage - damageToTempHP);
            if (remainingHPDamage > 0) {
                this.health_points.value = Math.max(0, this.health_points.value - remainingHPDamage);
            }
            updates["system.health_points"] = this.health_points;

            // Stagger damage
            const staggerResKey = "stagger_" + damageType;
            if (!this.resistances.hasOwnProperty(staggerResKey)) {
                throw new Error(`Missing stagger resistance for: ${damageType}`);
            }
            const staggerResistance = shouldIgnore(staggerResKey) ? 1 : this.resistances[staggerResKey];
            const effectiveStaggerDamage = Math.max(0, damage * staggerResistance);
            const damageToTempStagger = Math.min(effectiveStaggerDamage, this.stagger_threshold.temporal);
            this.stagger_threshold.temporal = Math.max(0, this.stagger_threshold.temporal - damageToTempStagger);
            const remainingStaggerDamage = Math.max(0, effectiveStaggerDamage - damageToTempStagger);
            if (remainingStaggerDamage > 0) {
                this.stagger_threshold.value = Math.max(0, this.stagger_threshold.value - remainingStaggerDamage);
            }
            updates["system.stagger_threshold"] = this.stagger_threshold;
        } else {
            const resistance = shouldIgnore(damageType) ? 1 : this.resistances[damageType];
            const effectiveDamage = Math.max(0, damage * resistance);

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