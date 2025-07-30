export const PMTTRPG = {};

/**
 * The set of Ability Scores used within the system.
 * @type {Object}
 */
PMTTRPG.abilities = {
    ftd: 'PMTTRPG.Ability.Ftd.long',
    prd: 'PMTTRPG.Ability.Prd.long',
    jst: 'PMTTRPG.Ability.Jst.long',
    chr: 'PMTTRPG.Ability.Chr.long',
    ins: 'PMTTRPG.Ability.Ins.long',
    tmp: 'PMTTRPG.Ability.Tmp.long',
};

PMTTRPG.abilityAbbreviations = {
    ftd: 'PMTTRPG.Ability.Ftd.long',
    prd: 'PMTTRPG.Ability.Prd.long',
    jst: 'PMTTRPG.Ability.Jst.long',
    chr: 'PMTTRPG.Ability.Chr.long',
    ins: 'PMTTRPG.Ability.Ins.long',
    tmp: 'PMTTRPG.Ability.Tmp.long',
};
PMTTRPG.abilityImages = {
    ftd: 'systems/pmttrpg/assets/imgs/ftd.png',
    prd: 'systems/pmttrpg/assets/imgs/prd.png',
    jst: 'systems/pmttrpg/assets/imgs/jst.png',
    chr: 'systems/pmttrpg/assets/imgs/chr.png',
    ins: 'systems/pmttrpg/assets/imgs/ins.png',
    tmp: 'systems/pmttrpg/assets/imgs/tmp.png',
};
PMTTRPG.abilityTooltips = {
    ftd: 'PMTTRPG.Ability.Ftd.tooltip',
    prd: 'PMTTRPG.Ability.Prd.tooltip',
    jst: 'PMTTRPG.Ability.Jst.tooltip',
    chr: 'PMTTRPG.Ability.Chr.tooltip',
    ins: 'PMTTRPG.Ability.Ins.tooltip',
    tmp: 'PMTTRPG.Ability.Tmp.tooltip',
}
PMTTRPG.damageTypes = {
    slash: {
        label: 'PMTTRPG.DAMAGE_TYPE.Slash',
        img: 'systems/pmttrpg/assets/imgs/conditions/slash.png',
    },
    pierce: {
        label: 'PMTTRPG.DAMAGE_TYPE.Pierce',
        img: 'systems/pmttrpg/assets/imgs/conditions/pierce.png',
    },
    blunt: {
        label: 'PMTTRPG.DAMAGE_TYPE.Blunt',
        img: 'systems/pmttrpg/assets/imgs/conditions/blunt.png',
    },
    stagger_slash: {
        label: 'PMTTRPG.DAMAGE_TYPE.StaggerSlash',
        img: 'systems/pmttrpg/assets/imgs/conditions/stagger_slash.png',
    },
    stagger_pierce: {
        label: 'PMTTRPG.DAMAGE_TYPE.StaggerPierce',
        img: 'systems/pmttrpg/assets/imgs/conditions/stagger_pierce.png',
    },
    stagger_blunt: {
        label: 'PMTTRPG.DAMAGE_TYPE.StaggerBlunt',
        img: 'systems/pmttrpg/assets/imgs/conditions/stagger_blunt.png',
    },
    burn: {
        label: 'PMTTRPG.DAMAGE_TYPE.Burn',
        img: 'systems/pmttrpg/assets/imgs/conditions/burn.png',
    },
    sinking: {
        label: 'PMTTRPG.DAMAGE_TYPE.Sinking',
        img: 'systems/pmttrpg/assets/imgs/conditions/sinking.png',
    },
    rupture: {
        label: 'PMTTRPG.DAMAGE_TYPE.Rupture',
        img: 'systems/pmttrpg/assets/imgs/conditions/rupture.png',
    },
    frostbite: {
        label: 'PMTTRPG.DAMAGE_TYPE.Frostbite',
        img: 'systems/pmttrpg/assets/imgs/conditions/frostbite.png',
    },
    bleed: {
        label: 'PMTTRPG.DAMAGE_TYPE.Bleed',
        img: 'systems/pmttrpg/assets/imgs/conditions/bleed.png',
    },
    tremor: {
        label: 'PMTTRPG.DAMAGE_TYPE.Tremor',
        img: 'systems/pmttrpg/assets/imgs/conditions/tremor.png',
    },
    critical: {
        label: 'PMTTRPG.DAMAGE_TYPE.Critical',
        img: 'systems/pmttrpg/assets/imgs/conditions/critical.png',
    },
    devastating: {
        label: 'PMTTRPG.DAMAGE_TYPE.Devastating',
        img: 'systems/pmttrpg/assets/imgs/conditions/devastation.png',
    },

    force: {
        label: 'PMTTRPG.DAMAGE_TYPE.Force',
        img: 'systems/pmttrpg/assets/imgs/conditions/force.png',
    },
    falling: {
        label: 'PMTTRPG.DAMAGE_TYPE.Falling',
        img: 'systems/pmttrpg/assets/imgs/conditions/falling.png',
    }
}
PMTTRPG.healingTypes = {
    value: "PMTTRPG.HealingType.Value",
    temporary: "PMTTRPG.HealingType.Temporary",
}
PMTTRPG.conditions = {
    burn: {
        name: 'PMTTRPG.Condition.Burn',
        img: 'systems/pmttrpg/assets/imgs/conditions/burn.png',
        potency: {value: 1, min: 0, max: 99},
        potencyReduceFormula: (potency) => Math.floor(potency / 2),
        damaging: true
    },
    frostbite: {
        name: 'PMTTRPG.Condition.Frostbite',
        img: 'systems/pmttrpg/assets/imgs/conditions/frostbite.png',
        potency: {value: 1, min: 0, max: 99},
        potencyReduceFormula: (potency) => Math.floor(potency / 2),
        damaging: true
    },
    bleed: {
        name: 'PMTTRPG.Condition.Bleed',
        img: 'systems/pmttrpg/assets/imgs/conditions/bleed.png',
        potency: {value: 1, min: 0, max: 99},
        potencyReduceFormula: (potency) => Math.floor(potency / 2),
        damaging: true
    },
    rupture: {
        name: 'PMTTRPG.Condition.Rupture',
        img: 'systems/pmttrpg/assets/imgs/conditions/rupture.png',
        potency: {value: 1, min: 0, max: 99},
        potencyReduceFormula: (potency) => 0,
        damaging: true
    },
    tremor: {
        name: 'PMTTRPG.Condition.Tremor',
        img: 'systems/pmttrpg/assets/imgs/conditions/tremor.png',
        potency: {value: 1, min: 0, max: 99},
        potencyReduceFormula: (potency) => 0,
        damaging: true

    },
    sinking: {
        name: 'PMTTRPG.Condition.Sinking',
        img: 'systems/pmttrpg/assets/imgs/conditions/sinking.png',
        potency: {value: 1, min: 0, max: 99},
        potencyReduceFormula: (potency) => 0,
        damaging: true
    },
    poise: {
        name: 'PMTTRPG.Condition.Poise',
        img: 'systems/pmttrpg/assets/imgs/conditions/poise.png',
        potency: {value: 1, min: 0, max: 99},
        potencyReduceFormula: (potency) => 0,
        damaging: false
    },
    critical: {
        name: 'PMTTRPG.Condition.Critical',
        img: 'systems/pmttrpg/assets/imgs/conditions/critical.png',
        potency: {value: 1, min: 0, max: 99},
        potencyReduceFormula: (potency) => 0,
        damaging: false
    },
    ruin: {
        name: 'PMTTRPG.Condition.Ruin',
        img: 'systems/pmttrpg/assets/imgs/conditions/ruin.png',
        potency: {value: 1, min: 0, max: 99},
        potencyReduceFormula: (potency) => 0,
        damaging: false
    },
    devastation: {
        name: 'PMTTRPG.Condition.Devastation',
        img: 'systems/pmttrpg/assets/imgs/conditions/devastation.png',
        potency: {value: 1, min: 0, max: 99},
        potencyReduceFormula: (potency) => 0,
        damaging: false
    },
    paralysis: {
        name: 'PMTTRPG.Condition.Paralysis',
        img: 'systems/pmttrpg/assets/imgs/conditions/paralysis.png',
        potency: {value: 1, min: 0, max: 99},
        potencyReduceFormula: (potency) => 0,
        damaging: false
    },
    protection: {
        name: 'PMTTRPG.Condition.Protection',
        img: 'systems/pmttrpg/assets/imgs/conditions/protection.png',
        potency: {value: 1, min: 0, max: 99},
        potencyReduceFormula: (potency) => 0,
        damaging: false
    },
    stagger_protection: {
        name: 'PMTTRPG.Condition.StaggerProtection',
        img: 'systems/pmttrpg/assets/imgs/conditions/stagger_protection.png',
        potency: {value: 1, min: 0, max: 99},
        potencyReduceFormula: (potency) => 0,
        damaging: false
    },
    stagger_fragile: {
        name: 'PMTTRPG.Condition.StaggerFragile',
        img: 'systems/pmttrpg/assets/imgs/conditions/stagger_fragile.png',
        potency: {value: 1, min: 0, max: 99},
        potencyReduceFormula: (potency) => 0,
        damaging: false
    },
    slash_protection: {
        name: 'PMTTRPG.Condition.SlashProtection',
        img: 'systems/pmttrpg/assets/imgs/conditions/slash_protection.png',
        potency: {value: 1, min: 0, max: 99},
        potencyReduceFormula: (potency) => 0,
        damaging: false
    },
    pierce_protection: {
        name: 'PMTTRPG.Condition.PierceProtection',
        img: 'systems/pmttrpg/assets/imgs/conditions/pierce_protection.png',
        potency: {value: 1, min: 0, max: 99},
        potencyReduceFormula: (potency) => 0,
        damaging: false
    },
    blunt_protection: {
        name: 'PMTTRPG.Condition.BluntProtection',
        img: 'systems/pmttrpg/assets/imgs/conditions/blunt_protection.png',
        potency: {value: 1, min: 0, max: 99},
        potencyReduceFormula: (potency) => 0,
        damaging: false
    },
    fragile: {
        name: 'PMTTRPG.Condition.Fragile',
        img: 'systems/pmttrpg/assets/imgs/conditions/fragile.png',
        potency: {value: 1, min: 0, max: 99},
        potencyReduceFormula: (potency) => 0,
        damaging: false
    },
    slash_fragile: {
        name: 'PMTTRPG.Condition.SlashFragile',
        img: 'systems/pmttrpg/assets/imgs/conditions/slash_fragile.png',
        potency: {value: 1, min: 0, max: 99},
        potencyReduceFormula: (potency) => 0,
        damaging: false
    },
    pierce_fragile: {
        name: 'PMTTRPG.Condition.PierceFragile',
        img: 'systems/pmttrpg/assets/imgs/conditions/pierce_fragile.png',
        potency: {value: 1, min: 0, max: 99},
        potencyReduceFormula: (potency) => 0,
        damaging: false
    },
    blunt_fragile: {
        name: 'PMTTRPG.Condition.BluntFragile',
        img: 'systems/pmttrpg/assets/imgs/conditions/blunt_fragile.png',
        potency: {value: 1, min: 0, max: 99},
        potencyReduceFormula: (potency) => 0,
        damaging: false
    },
    strength: {
        name: 'PMTTRPG.Condition.Strength',
        img: 'systems/pmttrpg/assets/imgs/conditions/strength.png',
        potency: {value: 1, min: 0, max: 99},
        potencyReduceFormula: (potency) => 0,
        damaging: false
    },
    feeble: {
        name: 'PMTTRPG.Condition.Feeble',
        img: 'systems/pmttrpg/assets/imgs/conditions/feeble.png',
        potency: {value: 1, min: 0, max: 99},
        potencyReduceFormula: (potency) => 0,
        damaging: false

    },
    endurance: {
        name: 'PMTTRPG.Condition.Endurance',
        img: 'systems/pmttrpg/assets/imgs/conditions/endurance.png',
        potency: {value: 1, min: 0, max: 99},
        potencyReduceFormula: (potency) => 0,
        damaging: false

    },
    disarm: {
        name: 'PMTTRPG.Condition.Disarm',
        img: 'systems/pmttrpg/assets/imgs/conditions/disarm.png',
        potency: {value: 1, min: 0, max: 99},
        potencyReduceFormula: (potency) => 0,
        damaging: false

    },
    haste: {
        name: 'PMTTRPG.Condition.Haste',
        img: 'systems/pmttrpg/assets/imgs/conditions/haste.png',
        potency: {value: 1, min: 0, max: 99},
        potencyReduceFormula: (potency) => 0,
        damaging: false

    },
    bind: {
        name: 'PMTTRPG.Condition.Bind',
        img: 'systems/pmttrpg/assets/imgs/conditions/bind.png',
        potency: {value: 1, min: 0, max: 99},
        potencyReduceFormula: (potency) => 0,
        damaging: false

    },
    smoke: {
        name: 'PMTTRPG.Condition.Smoke',
        img: 'systems/pmttrpg/assets/imgs/conditions/smoke.png',
        potency: {value: 1, min: 0, max: 20},
        potencyReduceFormula: (potency) => {
            if (potency > 10) return Math.max(0, potency - 4);
            return Math.max(0, potency - 2);
        },
        damaging: false
    },
    charge: {
        name: 'PMTTRPG.Condition.Charge',
        img: 'systems/pmttrpg/assets/imgs/conditions/charge.png',
        potency: {value: 1, min: 0, max: 999},
        damaging: false
    },
    charge_barrier: {
        name: 'PMTTRPG.Condition.ChargeBarrier',
        img: 'systems/pmttrpg/assets/imgs/conditions/charge_barrier.png',
        potency: {value: 1, min: 0, max: 99},
        potencyReduceFormula: (potency) => 0,
        damaging: false

    },
    overcharge: {
        name: 'PMTTRPG.Condition.Overcharge',
        img: 'systems/pmttrpg/assets/imgs/conditions/overcharge.png',
        potency: {value: 1, min: 0, max: 999},
        damaging: false
    },
    mark: {
        name: 'PMTTRPG.Condition.Mark',
        img: 'systems/pmttrpg/assets/imgs/conditions/mark.png',
        potency: {value: 1, min: 0, max: 99},
        damaging: false
    },
    combo: {
        name: 'PMTTRPG.Condition.Combo',
        img: 'systems/pmttrpg/assets/imgs/conditions/combo.png',
        potency: {value: 1, min: 0, max: 99},
        potencyReduceFormula: (potency) => Math.floor(potency / 2),
        damaging: false
    },
    staggered: {
        name: 'PMTTRPG.Condition.Staggered',
        img: 'systems/pmttrpg/assets/imgs/conditions/staggered.png',
        potency: {value: 1, min: 0, max: 1},
        potencyReduceFormula: (potency) => 0,
        damaging: false
    },
    panic: {
        name: 'PMTTRPG.Condition.Panic',
        img: 'systems/pmttrpg/assets/imgs/conditions/panic.png',
        potency: {value: 1, min: 0, max: 1},
        potencyReduceFormula: (potency) => 0,
        damaging: false
    },
    defeated: {
        name: 'PMTTRPG.Condition.Defeated',
        img: 'systems/pmttrpg/assets/imgs/conditions/defeated.png',
        potency: {value: 1, min: 0, max: 1},
        potencyReduceFormula: (potency) => 0,
        damaging: false
    },
    alert: {
        name: 'PMTTRPG.Condition.Alert',
        img: 'systems/pmttrpg/assets/imgs/conditions/alert.png',
        potency: {value: 1, min: 0, max: 1},
        potencyReduceFormula: (potency) => 0,
        damaging: false
    },
    hidden: {
        name: 'PMTTRPG.Condition.Hidden',
        img: 'systems/pmttrpg/assets/imgs/conditions/hidden.png',
        potency: {value: 1, min: 0, max: 1},
        potencyReduceFormula: (potency) => 0,
        damaging: false
    },
    grappling_grappler: {
        name: 'PMTTRPG.Condition.GrapplingGrappler',
        img: 'systems/pmttrpg/assets/imgs/conditions/grappling_grappler.png',
        potency: {value: 1, min: 0, max: 1},
        potencyReduceFormula: (potency) => 0,
        damaging: false
    },
    grappling_target: {
        name: 'PMTTRPG.Condition.GrapplingTarget',
        img: 'systems/pmttrpg/assets/imgs/conditions/grappling_target.png',
        potency: {value: 1, min: 0, max: 1},
        potencyReduceFormula: (potency) => 0,
        damaging: false
    },
    scarred: {
        name: 'PMTTRPG.Condition.Scarred',
        img: 'systems/pmttrpg/assets/imgs/conditions/scared.png',
        potency: {value: 1, min: 0, max: 1},
        potencyReduceFormula: (potency) => 0,
        damaging: false
    },
    limb_loss: {
        name: 'PMTTRPG.Condition.LimbLoss',
        img: 'systems/pmttrpg/assets/imgs/conditions/limb_loss.png',
        potency: {value: 1, min: 0, max: 4},
        damaging: false
    },
    limb_loss_arm: {
        name: 'PMTTRPG.Condition.LimbLossArm',
        img: 'systems/pmttrpg/assets/imgs/conditions/limb_loss_arm.png',
        potency: {value: 1, min: 0, max: 2},
        damaging: false
    },
    limb_loss_leg: {
        name: 'PMTTRPG.Condition.LimbLossLeg',
        img: 'systems/pmttrpg/assets/imgs/conditions/limb_loss_leg.png',
        potency: {value: 1, min: 0, max: 2},
        damaging: false
    }
}
PMTTRPG.effectEnd ={
    round_end: {
        label: 'PMTTRPG.EffectEnd.RoundEnd',
        value: 'round_end',
    },
    potency_to_zero: {
        label: 'PMTTRPG.EffectEnd.PotencyToZero',
        value: 'potency_to_zero',
    },
    burst_or_round_end:{
        label: 'PMTTRPG.EffectEnd.BurstOrRoundEnd',
        value: 'burst_or_round_end',
    },
    combat_end: {
        label: 'PMTTRPG.EffectEnd.CombatEnd',
        value: 'combat_end',
    },
    save: {
        label: 'PMTTRPG.EffectEnd.Save',
        value: 'save',
    },
    burst: {
        label: 'PMTTRPG.EffectEnd.Burst',
        value: 'burst',
    }
}
PMTTRPG.potencyReduce = {
    clash: {
        label: 'PMTTRPG.PotencyReduce.Clash',
        value: 'clash',
    },
    clash_end: {
        label: 'PMTTRPG.PotencyReduce.ClashEnd',
        value: 'clash_end',
        formula: '@effect.potency / 2'
    },
    clash_win: {
        label: 'PMTTRPG.PotencyReduce.ClashWin',
        value: 'clash_win',
    },
    clash_loss: {
        label: 'PMTTRPG.PotencyReduce.ClashLose',
        value: 'clash_loss',
    },
    consume: {
        label: 'PMTTRPG.PotencyReduce.Consume',
        value: 'consume',
    },
    use:{
        label: 'PMTTRPG.PotencyReduce.Use',
        value: 'use',
    },
    end: {
        label: 'PMTTRPG.PotencyReduce.End',
        value: 'end',
    },
}
PMTTRPG.target_attributes = {
    health_points:{
        label: 'PMTTRPG.TargetAttribute.HealthPoints',
        value: 'health_points',
    },
    stagger_threshold:{
        label: 'PMTTRPG.TargetAttribute.StaggerThreshold',
        value: 'stagger_threshold',
    },
    sanity_points:{
        label: 'PMTTRPG.TargetAttribute.SanityPoints',
        value: 'sanity_points',
    },
    other: {
        label: 'PMTTRPG.TargetAttribute.Other',
        value: 'other',
    }
}
