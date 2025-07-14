export default class PMTTRPGToken extends Token {
    /**
     * Sobrescribe el método _drawBar para que la segunda barra sea amarilla.
     */
    _drawBar(number, bar, data) {
        const val = Number(data.value);
        const pct = Math.clamp(val, 0, data.max) / data.max;

        // Determine sizing
        const {width, height} = this.getSize();
        const bw = width;
        const bh = Math.max(canvas.dimensions.size / 12, 8) * (this.document.height >= 2 ? 1.6 : 1);
        const bs = Math.clamp(bh / 8, 1, 2);

        // Determine the color to use
        let color;
        if (number === 0) {
            color = Color.fromRGB([0.2 + 0.8 * pct, 0.2 + 0.8 * pct, 0]);
        } else {
            color = Color.fromRGB([0, 0.2 + 0.8 * pct, 0]);
        }

        // Draw the bar
        bar.clear();
        bar.lineStyle(bs, 0x000000, 1.0);
        bar.beginFill(0x000000, 0.5).drawRoundedRect(0, 0, bw, bh, 3);
        bar.beginFill(color, 1.0).drawRoundedRect(0, 0, pct * bw, bh, 2);

        // Set position
        const posY = number === 0 ? height - bh : 0;
        bar.position.set(0, posY);
        return true;
    }
}