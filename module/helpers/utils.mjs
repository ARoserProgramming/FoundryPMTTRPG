export default class PMTTRPGUtils {

    static getResistanceImage(valor, resource, type) {
        if (valor == null) return "";
        const base = "/systems/pmttrpg/assets/imgs/resistances";
        const map = {
            slash: {
                health: [
                    { max: 0.26, path: `${base}/slash_ineffective_health.png` },
                    { max: 0.51, path: `${base}/slash_endured_health.png` },
                    { max: 1.5, path: `${base}/slash_normal_health.png` },
                    { max: 2, path: `${base}/slash_weak_health.png` },
                    { max: Infinity, path: `${base}/slash_fatal_health.png` }
                ],
                stagger: [
                    { max: 0.26, path: `${base}/slash_ineffective_stagger.png` },
                    { max: 0.51, path: `${base}/slash_endured_stagger.png` },
                    { max: 1.5, path: `${base}/slash_normal_stagger.png` },
                    { max: 2, path: `${base}/slash_weak_stagger.png` },
                    { max: Infinity, path: `${base}/slash_fatal_stagger.png` }
                ]
            },
            pierce: {
                health: [
                    { max: 0.26, path: `${base}/pierce_ineffective_health.png` },
                    { max: 0.51, path: `${base}/pierce_endured_health.png` },
                    { max: 1.5, path: `${base}/pierce_normal_health.png` },
                    { max: 2, path: `${base}/pierce_weak_health.png` },
                    { max: Infinity, path: `${base}/pierce_fatal_health.png` }
                ],
                stagger: [
                    { max: 0.26, path: `${base}/pierce_ineffective_stagger.png` },
                    { max: 0.51, path: `${base}/pierce_endured_stagger.png` },
                    { max: 1.5, path: `${base}/pierce_normal_stagger.png` },
                    { max: 2, path: `${base}/pierce_weak_stagger.png` },
                    { max: Infinity, path: `${base}/pierce_fatal_stagger.png` }
                ]
            },
            blunt: {
                health: [
                    { max: 0.26, path: `${base}/blunt_ineffective_health.png` },
                    { max: 0.51, path: `${base}/blunt_endured_health.png` },
                    { max: 1.5, path: `${base}/blunt_normal_health.png` },
                    { max: 2, path: `${base}/blunt_weak_health.png` },
                    { max: Infinity, path: `${base}/blunt_fatal_health.png` }
                ],
                stagger: [
                    { max: 0.26, path: `${base}/blunt_ineffective_stagger.png` },
                    { max: 0.51, path: `${base}/blunt_endured_stagger.png` },
                    { max: 1.5, path: `${base}/blunt_normal_stagger.png` },
                    { max: 2, path: `${base}/blunt_weak_stagger.png` },
                    { max: Infinity, path: `${base}/blunt_fatal_stagger.png` }
                ]
            }
        };
        const arr = map[type]?.[resource];
        if (!arr) return valor;
        for (const entry of arr) {
            if (valor < entry.max) return entry.path;
        }
        return valor;
    }
}