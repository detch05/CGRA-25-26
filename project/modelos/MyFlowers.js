import { MyFlower } from "./MyFlower.js";

export class MyFlowers {

    constructor(scene, ground, rocks, clusterCount = 40) {
        this.scene  = scene;
        this.ground = ground;

        this.rockPositions = rocks.rocks.map(r => ({
            x: r.x, z: r.z,
            r: Math.max(r.scaleX, r.scaleZ) * 1.5
        }));

        // Paleta de cores — branco, amarelo, violeta, rosa (como no slide)
        this.colors = [
            [1.00, 1.00, 1.00],  // branco
            [1.00, 0.90, 0.15],  // amarelo
            [0.70, 0.20, 0.90],  // violeta
            [1.00, 0.50, 0.70],  // rosa
            [1.00, 0.35, 0.35],  // vermelho
            [0.50, 0.60, 1.00],  // azul claro
        ];

        this.clusters = this._generateClusters(clusterCount);
    }

    _rand(seed) {
        return (Math.abs(Math.sin(seed * 127.1 + 43.2) * 43758.5453)) % 1.0;
    }

    _isClearOfRocks(x, z) {
        for (const r of this.rockPositions) {
            const dx = x - r.x, dz = z - r.z;
            if (Math.sqrt(dx*dx + dz*dz) < r.r + 3.0) return false;
        }
        return true;
    }

    _generateClusters(count) {
        const clusters = [];
        const half     = 250;
        const pathW    = 12;

        for (let i = 0; i < count; i++) {
            const s = i * 19 + 7;

            let cx, cz, attempts = 0;
            do {
                cx = (this._rand(s + attempts)     * 2 - 1) * half;
                cz = (this._rand(s + attempts + 1) * 2 - 1) * half;
                attempts++;
            } while (Math.abs(cx) < pathW && attempts < 15);

            const colorIdx  = Math.floor(this._rand(s + 2) * this.colors.length);
            const baseColor = this.colors[colorIdx];
            const clusterR  = 2.0 + this._rand(s + 3) * 3.0;
            const flowerN   = 4 + Math.floor(this._rand(s + 4) * 6);

            const flowers = [];
            for (let j = 0; j < flowerN; j++) {
                const fs = s * 100 + j * 17;

                let fx, fz, fat = 0;
                do {
                    const angle = this._rand(fs + fat*2)     * Math.PI * 2;
                    const dist  = this._rand(fs + fat*2 + 1) * clusterR;
                    fx = cx + Math.cos(angle) * dist;
                    fz = cz + Math.sin(angle) * dist;
                    fat++;
                } while (!this._isClearOfRocks(fx, fz) && fat < 10);

                const fy = this.ground.getHeightAt(fx, fz);

                // Cor ligeiramente variada
                const r = Math.min(1, baseColor[0] + (this._rand(fs+2) - 0.5) * 0.1);
                const g = Math.min(1, baseColor[1] + (this._rand(fs+3) - 0.5) * 0.1);
                const b = Math.min(1, baseColor[2] + (this._rand(fs+4) - 0.5) * 0.1);

                flowers.push({
                    x: fx, y: fy, z: fz,
                    rotY: this._rand(fs+5) * Math.PI * 2,
                    flower: new MyFlower(this.scene, {
                        petalCount: 5 + Math.floor(this._rand(fs+6) * 5),
                        petalColor: [r, g, b],
                        stemHeight: 1.0 + this._rand(fs+7) * 1.0,
                        scale:      0.8 + this._rand(fs+8) * 0.8,
                        leafCount:  1 + Math.floor(this._rand(fs+9) * 3),
                    })
                });
            }
            clusters.push(flowers);
        }
        return clusters;
    }

    display() {
        for (const cluster of this.clusters) {
            for (const f of cluster) {
                this.scene.pushMatrix();
                this.scene.translate(f.x, f.y, f.z);
                this.scene.rotate(f.rotY, 0, 1, 0);
                f.flower.display();
                this.scene.popMatrix();
            }
        }
    }
}