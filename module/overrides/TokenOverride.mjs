/**
 * Custom Token class for PMTTRPG that overrides the default `_drawBar` method.
 * This method customizes the drawing of token bars, such as health and stagger thresholds.
 */
export default class PMTTRPGToken extends Token {
    /**
     * Draws a custom bar on the token.
     *
     * @param {number} number - The index of the bar being drawn (0 for the first bar, 1 for the second, etc.).
     * @param {PIXI.Graphics} bar - The PIXI.Graphics object used to draw the bar.
     * @param {Object} data - Additional data related to the token or actor.
     * @returns {boolean} - Returns `true` if the bar is drawn, `false` otherwise.
     */
    _drawBar(number, bar, data) {
        console.log("Usando clase:", this.constructor.name);

        // ❌ Skip drawing the second bar (index 1)
        if (number === 1) return false;

        // Calculate percentages for stagger threshold and health points
        const pctstagger = Math.clamp(
            this.actor.system.stagger_threshold?.value,
            0,
            this.actor.system.stagger_threshold?.max
        ) / this.actor.system.stagger_threshold?.max;

        const pcthp = Math.clamp(
            this.actor.system.health_points?.value,
            0,
            this.actor.system.health_points?.max
        ) / this.actor.system.health_points?.max;

        // Get token size
        const {width, height} = this.getSize();
        const bw = width; // Bar width
        const bh = Math.max(canvas.dimensions.size / 12, 8) * (this.document.height >= 2 ? 1.6 : 1); // Bar height
        const bs = Math.clamp(bh / 8, 1, 2); // Bar spacing

        // Define the color for the stagger threshold bar
        const color = Color.fromRGB([1, 1, 0]);

        // Prepare the bar for drawing
        bar.clear();
        const r = 40; // Radius of the arc
        const cx = bw / 2; // Center X
        const cy = 0; // Center Y

        // Draw black outline
        bar.lineStyle({
            width: 6,
            color: 0x000000,
            alpha: 1,
            cap: PIXI.LINE_CAP.ROUND
        });
        bar.moveTo(cx + r * Math.cos(0), cy + r * Math.sin(-0.05));
        bar.arc(cx, cy, r, 0, Math.PI + 0.05, false);

        // Draw stagger threshold arc
        bar.lineStyle({
            width: 4,
            color: color,
            alpha: 1,
            cap: PIXI.LINE_CAP.ROUND
        });
        const startAngle = (Math.PI / 2) - 0.05; // Start angle (90 degrees)
        const fullArc = Math.PI / 2; // Full arc length
        const endAngleStagger = startAngle - pctstagger * fullArc; // End angle for stagger
        bar.moveTo(cx + r * Math.cos(startAngle), cy + r * Math.sin(startAngle));
        bar.arc(cx, cy, r, startAngle, endAngleStagger, true); // Counterclockwise

        // Draw health points arc
        const otroColor = 0x00ff00; // Color for health points
        bar.lineStyle({
            width: 4,
            color: otroColor,
            alpha: 1,
            cap: PIXI.LINE_CAP.ROUND
        });
        const startAngle2 = (Math.PI / 2) + 0.05; // Start angle (90 degrees)
        const fullArc2 = Math.PI / 2; // Full arc length
        const endAngleHP = startAngle2 + pcthp * fullArc2; // End angle for health points
        bar.moveTo(cx + r * Math.cos(startAngle2), cy + r * Math.sin(startAngle2));
        bar.arc(cx, cy, r, startAngle2, endAngleHP, false); // Clockwise

        // Apply elliptical scaling to the bar
        bar.scale.y = 0.5;

        // Position the bar below the token
        bar.position.set(0, height - bh);

        return true;
    }
}