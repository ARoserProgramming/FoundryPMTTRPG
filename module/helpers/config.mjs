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
        img: 'systems/pmttrpg/assets/imgs/conditions/devastating.png',
    },
    physical: {
        label: 'PMTTRPG.DAMAGE_TYPE.Physical',
        img: 'systems/pmttrpg/assets/imgs/conditions/physical.png',
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
    },
    frostbite: {
        name: 'PMTTRPG.Condition.Frostbite',
        img: 'systems/pmttrpg/assets/imgs/conditions/frostbite.png',
    },
    bleed: {
        name: 'PMTTRPG.Condition.Bleed',
        img: 'systems/pmttrpg/assets/imgs/conditions/bleed.png',
    },
    rupture: {
        name: 'PMTTRPG.Condition.Rupture',
        img: 'systems/pmttrpg/assets/imgs/conditions/rupture.png',
    },
    tremor: {
        name: 'PMTTRPG.Condition.Tremor',
        img: 'systems/pmttrpg/assets/imgs/conditions/tremor.png',
    },
    sinking: {
        name: 'PMTTRPG.Condition.Sinking',
        img: 'systems/pmttrpg/assets/imgs/conditions/sinking.png',
    },
    poise: {
        name: 'PMTTRPG.Condition.Poise',
        img: 'systems/pmttrpg/assets/imgs/conditions/poise.png',
    },
    critical: {
        name: 'PMTTRPG.Condition.Critical',
        img: 'systems/pmttrpg/assets/imgs/conditions/critical.png',
    },
    ruin: {
        name: 'PMTTRPG.Condition.Ruin',
        img: 'systems/pmttrpg/assets/imgs/conditions/ruin.png',
    },
    devastation: {
        name: 'PMTTRPG.Condition.Devastation',
        img: 'systems/pmttrpg/assets/imgs/conditions/devastation.png',
    },
    paralysis: {
        name: 'PMTTRPG.Condition.Paralysis',
        img: 'systems/pmttrpg/assets/imgs/conditions/paralysis.png',
    },
    protection: {
        name: 'PMTTRPG.Condition.Protection',
        img: 'systems/pmttrpg/assets/imgs/conditions/protection.png',
    },
    stagger_protection: {
        name: 'PMTTRPG.Condition.StaggerProtection',
        img: 'systems/pmttrpg/assets/imgs/conditions/stagger_protection.png',
    },
    stagger_fragile:{
        name: 'PMTTRPG.Condition.StaggerFragile',
        img: 'systems/pmttrpg/assets/imgs/conditions/stagger_fragile.png',
    },
    slash_protection: {
        name: 'PMTTRPG.Condition.SlashProtection',
        img: 'systems/pmttrpg/assets/imgs/conditions/slash_protection.png',
    },
    pierce_protection: {
        name: 'PMTTRPG.Condition.PierceProtection',
        img: 'systems/pmttrpg/assets/imgs/conditions/pierce_protection.png',
    },
    blunt_protection: {
        name: 'PMTTRPG.Condition.BluntProtection',
        img: 'systems/pmttrpg/assets/imgs/conditions/blunt_protection.png',
    },
    fragile: {
        name: 'PMTTRPG.Condition.Fragile',
        img: 'systems/pmttrpg/assets/imgs/conditions/fragile.png',
    },
    slash_fragile: {
        name: 'PMTTRPG.Condition.SlashFragile',
        img: 'systems/pmttrpg/assets/imgs/conditions/slash_fragile.png',
    },
    pierce_fragile: {
        name: 'PMTTRPG.Condition.PierceFragile',
        img: 'systems/pmttrpg/assets/imgs/conditions/pierce_fragile.png',
    },
    blunt_fragile: {
        name: 'PMTTRPG.Condition.BluntFragile',
        img: 'systems/pmttrpg/assets/imgs/conditions/blunt_fragile.png',
    },
    strength: {
        name: 'PMTTRPG.Condition.Strength',
        img: 'systems/pmttrpg/assets/imgs/conditions/strength.png',
    },
    feeble: {
        name: 'PMTTRPG.Condition.Feeble',
        img: 'systems/pmttrpg/assets/imgs/conditions/feeble.png',
    },
    endurance: {
        name: 'PMTTRPG.Condition.Endurance',
        img: 'systems/pmttrpg/assets/imgs/conditions/endurance.png',
    },
    disarm: {
        name: 'PMTTRPG.Condition.Disarm',
        img: 'systems/pmttrpg/assets/imgs/conditions/disarm.png',
    },
    haste: {
        name: 'PMTTRPG.Condition.Haste',
        img: 'systems/pmttrpg/assets/imgs/conditions/haste.png',
    },
    bind: {
        name: 'PMTTRPG.Condition.Bind',
        img: 'systems/pmttrpg/assets/imgs/conditions/bind.png',
    },
    smoke: {
        name: 'PMTTRPG.Condition.Smoke',
        img: 'systems/pmttrpg/assets/imgs/conditions/smoke.png',
    },
    charge: {
        name: 'PMTTRPG.Condition.Charge',
        img: 'systems/pmttrpg/assets/imgs/conditions/charge.png',
    },
    charge_barrier: {
        name: 'PMTTRPG.Condition.ChargeBarrier',
        img: 'systems/pmttrpg/assets/imgs/conditions/charge_barrier.png',
    },
    overcharge: {
        name: 'PMTTRPG.Condition.Overcharge',
        img: 'systems/pmttrpg/assets/imgs/conditions/overcharge.png',
    },
    mark: {
        name: 'PMTTRPG.Condition.Mark',
        img: 'systems/pmttrpg/assets/imgs/conditions/mark.png',
    },
    combo: {
        name: 'PMTTRPG.Condition.Combo',
        img: 'systems/pmttrpg/assets/imgs/conditions/combo.png',
    },
    staggered: {
        name: 'PMTTRPG.Condition.Staggered',
        img: 'systems/pmttrpg/assets/imgs/conditions/staggered.png',
    },
    panic: {
        name: 'PMTTRPG.Condition.Panic',
        img: 'systems/pmttrpg/assets/imgs/conditions/panic.png',
    },
    defeated: {
        name: 'PMTTRPG.Condition.Defeated',
        img: 'systems/pmttrpg/assets/imgs/conditions/defeated.png',
    },
    alert: {
        name: 'PMTTRPG.Condition.Alert',
        img: 'systems/pmttrpg/assets/imgs/conditions/alert.png',
    },
    hidden: {
        name: 'PMTTRPG.Condition.Hidden',
        img: 'systems/pmttrpg/assets/imgs/conditions/hidden.png',
    },
    grappling_grappler: {
        name: 'PMTTRPG.Condition.GrapplingGrappler',
        img: 'systems/pmttrpg/assets/imgs/conditions/grappling_grappler.png',
    },
    grappling_target: {
        name: 'PMTTRPG.Condition.GrapplingTarget',
        img: 'systems/pmttrpg/assets/imgs/conditions/grappling_target.png',
    },
    scarred: {
        name: 'PMTTRPG.Condition.Scarred',
        img: 'systems/pmttrpg/assets/imgs/conditions/scared.png',
    },
    limb_loss: {
        name: 'PMTTRPG.Condition.LimbLoss',
        img: 'systems/pmttrpg/assets/imgs/conditions/limb_loss.png',
    },
    limb_loss_arm: {
        name: 'PMTTRPG.Condition.LimbLossArm',
        img: 'systems/pmttrpg/assets/imgs/conditions/limb_loss_arm.png',
    },
    limb_loss_leg: {
        name: 'PMTTRPG.Condition.LimbLossLeg',
        img: 'systems/pmttrpg/assets/imgs/conditions/limb_loss_leg.png',
    },
}