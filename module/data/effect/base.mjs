// import SavingThrowDialog from "../../applications/apps/saving-throw-dialog.mjs";
// import SavingThrowRoll from "../../rolls/saving-throw.mjs";
// import enrichHTML from "../../utils/enrich-html.mjs";
// import FormulaField from "../fields/formula-field.mjs";

/** @import { PMTTRPGChatMessage } from "../../documents/_module.mjs" */

/**
 * A data model used by default effects with properties to control the expiration behavior
 */
export default class BaseEffectModel extends foundry.abstract.TypeDataModel {
    /**
     * Key information about this ActiveEffect subtype
     */
    static metadata = Object.freeze({
        type: "base",
    });

    /* -------------------------------------------------- */

    /* -------------------------------------------------- */

    /** @inheritdoc */
    static defineSchema() {
        const fields = foundry.data.fields;
        const config = pmttrpg  .CONFIG;
        return {
            end: new fields.SchemaField({
                type: new fields.StringField({ choices: config.effectEnd, blank: true, required: true }),
                roll: new fields.StringField({deterministic: false, initial: "1d10 + @combat.save.bonus" }),
            }),
            potencyReduce: new fields.SchemaField({
                type: new fields.StringField({
                    choices: config.potencyReduce,
                    blank: true,
                    required: true
                }),
                value: new fields.NumberField({
                    initial: 0,
                    integer: true,
                    min: 0,
                    required: true
                })
            }),
            targetAttribute: new fields.SchemaField({
                type: new fields.StringField({
                    choices: config.attributes,
                    blank: true,
                    required: true
                })
            })
        };
    }

    /* -------------------------------------------------- */

    /**
     * An effect is also temporary if it has the `end` property set even though they have indeterminate lengths
     * @returns {boolean | null}
     * @internal
     */
    get _isTemporary() {
        if (this.end.type) return true;
        else return null;
    }

    /* -------------------------------------------------- */

    /**
     * Returns the duration label appropriate to this model's `end` property
     * @returns {string}
     */
    get durationLabel() {
        return pmttrpg.CONFIG.effectEnd[this.end.type]?.abbreviation ?? "";
    }

    /* -------------------------------------------------- */

    /** @import { ActiveEffectDuration, EffectDurationData } from "./_types" */

    /**
     * Subtype specific duration calculations
     * @returns {Omit<ActiveEffectDuration, keyof EffectDurationData> | null}
     * @internal
     */
    get _prepareDuration() {
        if (!this.end.type) return null;
        return {
            type: "pmttrpg",
            duration: null,
            remaining: null,
            label: this.durationLabel,
        };
    }

    /* -------------------------------------------------- */

    /** @inheritdoc */
    // async toEmbed(config, options = {}) {
    //
    //     const enriched = await enrichHTML(this.parent.description, { ...options, relativeTo: this.parent });
    //
    //     const embed = document.createElement("div");
    //     embed.classList.add("draw-steel", this.parent.type);
    //     embed.innerHTML = enriched;
    //
    //     return embed;
    // }

    /* -------------------------------------------------- */

    /**
     * Rolls a saving throw for the actor and disables the effect if it passes
     * @param {object} [rollOptions={}]     Options forwarded to new {@linkcode SavingThrowRoll}
     * @param {object} [dialogOptions={}]   Options forwarded to {@linkcode SavingThrowDialog.create}
     * @param {object} [messageData={}]     The data object to use when creating the message
     * @param {object} [messageOptions={}]  Additional options which modify the created message.
     * @returns {Promise<PMTTRPGChatMessage|object>} A promise which resolves to the created ChatMessage document if create is
     *                                                 true, or the Object of prepared chatData otherwise.
     */
    // async rollSave(rollOptions = {}, dialogOptions = {}, messageData = {}, messageOptions = {}) {
    //     const rollData = this.parent.getRollData();
    //
    //     let formula = SavingThrowRoll.replaceFormulaData(this.end.roll, rollData);
    //
    //     dialogOptions.context ??= {};
    //     dialogOptions.context.effectFormula = formula;
    //     dialogOptions.context.successThreshold = rollOptions.successThreshold ?? 6;
    //
    //     const fd = await SavingThrowDialog.create(dialogOptions);
    //
    //     if (!fd) return;
    //
    //     if (fd.situationalBonus) formula += ` + ${fd.situationalBonus}`;
    //     rollOptions.successThreshold = fd.successThreshold;
    //
    //     const roll = new SavingThrowRoll(formula, rollData, rollOptions);
    //
    //     await roll.evaluate();
    //
    //     if (roll.product) await this.parent.update({ disabled: true });
    //
    //     foundry.utils.setProperty(messageData, "system.effectUuid", this.parent.uuid);
    //
    //     return roll.toMessage(messageData, messageOptions);
    // }
}
