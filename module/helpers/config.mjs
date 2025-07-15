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
PMTTRPG.damageTypes = {
    slash: {
        label: 'PMTTRPG.DAMAGE_TYPE.Slash',
        img: 'systems/pmttrpg/assets/imgs/conditions/slash.svg',
    },
    pierce: {
        label: 'PMTTRPG.DAMAGE_TYPE.Pierce',
        img: 'systems/pmttrpg/assets/imgs/conditions/pierce.svg',
    },
    blunt: {
        label: 'PMTTRPG.DAMAGE_TYPE.Blunt',
        img: 'systems/pmttrpg/assets/imgs/conditions/blunt.svg',
    },
    burn: {
        label: 'PMTTRPG.DAMAGE_TYPE.Burn',
        img: 'systems/pmttrpg/assets/imgs/conditions/burn.svg',
    },
    sinking: {
        label: 'PMTTRPG.DAMAGE_TYPE.Sinking',
        img: 'systems/pmttrpg/assets/imgs/conditions/sinking.svg',
    },
    rupture: {
        label: 'PMTTRPG.DAMAGE_TYPE.Rupture',
        img: 'systems/pmttrpg/assets/imgs/conditions/rupture.svg',
    },
    frostbite: {
        label: 'PMTTRPG.DAMAGE_TYPE.Frostbite',
        img: 'systems/pmttrpg/assets/imgs/conditions/frostbite.svg',
    },
    bleed: {
        label: 'PMTTRPG.DAMAGE_TYPE.Bleed',
        img: 'systems/pmttrpg/assets/imgs/conditions/bleed.svg',
    },
    tremor: {
        label: 'PMTTRPG.DAMAGE_TYPE.Tremor',
        img: 'systems/pmttrpg/assets/imgs/conditions/tremor.svg',
    },
    critical: {
        label: 'PMTTRPG.DAMAGE_TYPE.Critical',
        img: 'systems/pmttrpg/assets/imgs/conditions/critical.svg',
    },
    devastating: {
        label: 'PMTTRPG.DAMAGE_TYPE.Devastating',
        img: 'systems/pmttrpg/assets/imgs/conditions/devastating.svg',
    },
    physical: {
        label: 'PMTTRPG.DAMAGE_TYPE.Physical',
        img: 'systems/pmttrpg/assets/imgs/conditions/physical.svg',
    },
    force: {
        label: 'PMTTRPG.DAMAGE_TYPE.Force',
        img: 'systems/pmttrpg/assets/imgs/conditions/force.svg',
    },
    falling: {
        label: 'PMTTRPG.DAMAGE_TYPE.Falling',
        img: 'systems/pmttrpg/assets/imgs/conditions/falling.svg',
    }
}
PMTTRPG.healingTypes = {
    value: "PMTTRPG.HealingType.Value",
    temporary: "PMTTRPG.HealingType.Temporary",
}
PMTTRPG.conditions = {
    burn: {
        name: 'PMTTRPG.Condition.Burn',
        img: 'systems/pmttrpg/assets/imgs/conditions/burn.svg',
    },
    frostbite: {
        name: 'PMTTRPG.Condition.Frostbite',
        img: 'systems/pmttrpg/assets/imgs/conditions/frostbite.svg',
    },
    bleed: {
        name: 'PMTTRPG.Condition.Bleed',
        img: 'systems/pmttrpg/assets/imgs/conditions/bleed.svg',
    },
    rupture: {
        name: 'PMTTRPG.Condition.Rupture',
        img: 'systems/pmttrpg/assets/imgs/conditions/rupture.svg',
    },
    tremor: {
        name: 'PMTTRPG.Condition.Tremor',
        img: 'systems/pmttrpg/assets/imgs/conditions/tremor.svg',
    },
    sinking: {
        name: 'PMTTRPG.Condition.Sinking',
        img: 'systems/pmttrpg/assets/imgs/conditions/sinking.svg',
    },
    poise: {
        name: 'PMTTRPG.Condition.Poise',
        img: 'systems/pmttrpg/assets/imgs/conditions/poise.svg',
    },
    critical: {
        name: 'PMTTRPG.Condition.Critical',
        img: 'systems/pmttrpg/assets/imgs/conditions/critical.svg',
    },
    ruin: {
        name: 'PMTTRPG.Condition.Ruin',
        img: 'systems/pmttrpg/assets/imgs/conditions/ruin.svg',
    },
    devastation: {
        name: 'PMTTRPG.Condition.Devastation',
        img: 'systems/pmttrpg/assets/imgs/conditions/devastation.svg',
    },
    paralysis: {
        name: 'PMTTRPG.Condition.Paralysis',
        img: 'systems/pmttrpg/assets/imgs/conditions/paralysis.svg',
    },
    protection: {
        name: 'PMTTRPG.Condition.Protection',
        img: 'systems/pmttrpg/assets/imgs/conditions/protection.svg',
    },
    stagger_protection: {
        name: 'PMTTRPG.Condition.StaggerProtection',
        img: 'systems/pmttrpg/assets/imgs/conditions/stagger_protection.svg',
    },
    stagger_fragile:{
        name: 'PMTTRPG.Condition.StaggerFragile',
        img: 'systems/pmttrpg/assets/imgs/conditions/stagger_fragile.svg',
    },
    slash_protection: {
        name: 'PMTTRPG.Condition.SlashProtection',
        img: 'systems/pmttrpg/assets/imgs/conditions/slash_protection.svg',
    },
    pierce_protection: {
        name: 'PMTTRPG.Condition.PierceProtection',
        img: 'systems/pmttrpg/assets/imgs/conditions/pierce_protection.svg',
    },
    blunt_protection: {
        name: 'PMTTRPG.Condition.BluntProtection',
        img: 'systems/pmttrpg/assets/imgs/conditions/blunt_protection.svg',
    },
    fragile: {
        name: 'PMTTRPG.Condition.Fragile',
        img: 'systems/pmttrpg/assets/imgs/conditions/fragile.svg',
    },
    slash_fragile: {
        name: 'PMTTRPG.Condition.SlashFragile',
        img: 'systems/pmttrpg/assets/imgs/conditions/slash_fragile.svg',
    },
    pierce_fragile: {
        name: 'PMTTRPG.Condition.PierceFragile',
        img: 'systems/pmttrpg/assets/imgs/conditions/pierce_fragile.svg',
    },
    blunt_fragile: {
        name: 'PMTTRPG.Condition.BluntFragile',
        img: 'systems/pmttrpg/assets/imgs/conditions/blunt_fragile.svg',
    },
    strength: {
        name: 'PMTTRPG.Condition.Strength',
        img: 'systems/pmttrpg/assets/imgs/conditions/strength.svg',
    },
    feeble: {
        name: 'PMTTRPG.Condition.Feeble',
        img: 'systems/pmttrpg/assets/imgs/conditions/feeble.svg',
    },
    endurance: {
        name: 'PMTTRPG.Condition.Endurance',
        img: 'systems/pmttrpg/assets/imgs/conditions/endurance.svg',
    },
    disarm: {
        name: 'PMTTRPG.Condition.Disarm',
        img: 'systems/pmttrpg/assets/imgs/conditions/disarm.svg',
    },
    haste: {
        name: 'PMTTRPG.Condition.Haste',
        img: 'systems/pmttrpg/assets/imgs/conditions/haste.svg',
    },
    bind: {
        name: 'PMTTRPG.Condition.Bind',
        img: 'systems/pmttrpg/assets/imgs/conditions/bind.svg',
    },
    smoke: {
        name: 'PMTTRPG.Condition.Smoke',
        img: 'systems/pmttrpg/assets/imgs/conditions/smoke.svg',
    },
    charge: {
        name: 'PMTTRPG.Condition.Charge',
        img: 'systems/pmttrpg/assets/imgs/conditions/charge.svg',
    },
    charge_barrier: {
        name: 'PMTTRPG.Condition.ChargeBarrier',
        img: 'systems/pmttrpg/assets/imgs/conditions/charge_barrier.svg',
    },
    overcharge: {
        name: 'PMTTRPG.Condition.Overcharge',
        img: 'systems/pmttrpg/assets/imgs/conditions/overcharge.svg',
    },
    mark: {
        name: 'PMTTRPG.Condition.Mark',
        img: 'systems/pmttrpg/assets/imgs/conditions/mark.svg',
    },
    combo: {
        name: 'PMTTRPG.Condition.Combo',
        img: 'systems/pmttrpg/assets/imgs/conditions/combo.svg',
    },
    staggered: {
        name: 'PMTTRPG.Condition.Staggered',
        img: 'systems/pmttrpg/assets/imgs/conditions/staggered.svg',
    },
    panic: {
        name: 'PMTTRPG.Condition.Panic',
        img: 'systems/pmttrpg/assets/imgs/conditions/panic.svg',
    },
    defeated: {
        name: 'PMTTRPG.Condition.Defeated',
        img: 'systems/pmttrpg/assets/imgs/conditions/defeated.svg',
    },
    alert: {
        name: 'PMTTRPG.Condition.Alert',
        img: 'systems/pmttrpg/assets/imgs/conditions/alert.svg',
    },
    hidden: {
        name: 'PMTTRPG.Condition.Hidden',
        img: 'systems/pmttrpg/assets/imgs/conditions/hidden.svg',
    },
    grappling_grappler: {
        name: 'PMTTRPG.Condition.GrapplingGrappler',
        img: 'systems/pmttrpg/assets/imgs/conditions/grappling_grappler.svg',
    },
    grappling_target: {
        name: 'PMTTRPG.Condition.GrapplingTarget',
        img: 'systems/pmttrpg/assets/imgs/conditions/grappling_target.svg',
    },
    scarred: {
        name: 'PMTTRPG.Condition.Scarred',
        img: 'systems/pmttrpg/assets/imgs/conditions/scared.svg',
    },
    limb_loss: {
        name: 'PMTTRPG.Condition.LimbLoss',
        img: 'systems/pmttrpg/assets/imgs/conditions/limb_loss.svg',
    },
    limb_loss_arm: {
        name: 'PMTTRPG.Condition.LimbLossArm',
        img: 'systems/pmttrpg/assets/imgs/conditions/limb_loss_arm.svg',
    },
    limb_loss_leg: {
        name: 'PMTTRPG.Condition.LimbLossLeg',
        img: 'systems/pmttrpg/assets/imgs/conditions/limb_loss_leg.svg',
    },
}