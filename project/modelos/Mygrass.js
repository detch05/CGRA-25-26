import { CGFshader } from "../../lib/CGF.js";
import { MyGrassBlade } from "./MyGrassBlade.js";

/**
 * MyGrass
 *
 * Sistema de erva com shader de vento.
 * Distribui patches de erva verde densa e erva seca pelo terreno.
 *
 * @param scene        – cena CGF
 * @param ground       – instância de MyGround
 * @param patchCount   – número de patches (default 60)
 */
export class MyGrass {

    constructor(scene, ground, rocks, patchCount = 150) {
        this.scene  = scene;
        this.ground = ground;

        this.rockPositions = rocks.rocks.map(r => ({
        x: r.x, z: r.z,
        r: Math.max(r.scaleX, r.scaleZ) * 1.5
         }));

        // Shader de erva com vento
        this.shader = new CGFshader(
            scene.gl,
            "shaders/grass.vert",
            "shaders/grass.frag"
        );

        // Lâmina partilhada por todas as instâncias
        this.blade = new MyGrassBlade(scene);

        // Gerar patches
        this.patches = this._generatePatches(patchCount);
    }

    _rand(seed) {
        return (Math.abs(Math.sin(seed * 127.1 + 43.2) * 43758.5453)) % 1.0;
    }

    _isClearOfRocks(x,z) {
        for (const r of this.rockPositions) {
            const dx = x - r.x, dz = z - r.z;
            if (Math.sqrt(dx*dx + dz*dz) < r.r + 2.0) return false;
        }
        return true;
    }

    _generatePatches(count) {
        const patches = [];
        const half    = 290;
        const pathW   = 14;   // evitar caminho

        for (let i = 0; i < count; i++) {
            const s = i * 23 + 11;

            // Posição do centro do patch fora do caminho
            let cx, cz, attempts = 0;
            do {
                cx = (this._rand(s + attempts)     * 2 - 1) * half;
                cz = (this._rand(s + attempts + 1) * 2 - 1) * half;
                attempts++;
            } while ((Math.abs(cx) < pathW || !this._isClearOfRocks(cx, cz)) && attempts < 20);

            const cy = this.ground.getHeightAt(cx, cz);

            // 30% dos patches são erva seca
            const isDry      = this._rand(s + 2) < 0.30;
            const bladeCount = 25 + Math.floor(this._rand(s + 3) * 30);  
            const patchR = 4.0 + this._rand(s + 4) * 5.0;

            // Gerar posições individuais das lâminas
            const blades = [];
            for (let j = 0; j < bladeCount; j++) {
                const bs = s * 50 + j * 13;
 
                let bx, bz, bat = 0;
                do {
                    const angle = this._rand(bs + bat*2)     * Math.PI * 2;
                    const dist  = this._rand(bs + bat*2 + 1) * patchR;
                    bx = cx + Math.cos(angle) * dist;
                    bz = cz + Math.sin(angle) * dist;
                    bat++;
                } while (!this._isClearOfRocks(bx, bz) && bat < 8);
 
                const by     = this.ground.getHeightAt(bx, bz);
                const rotY   = this._rand(bs + 2) * Math.PI * 2;
                const height = isDry ? 1.2 + this._rand(bs + 3) * 1.5 : 0.8 + this._rand(bs + 3) * 1.0;
                const lean    = this._rand(bs + 4) * 0.3;
                const leanDir = this._rand(bs + 5) * Math.PI * 2;
 
                blades.push({ x: bx, y: by, z: bz, rotY, height, lean, leanDir });
            }

            patches.push({ isDry, blades });
        }
        return patches;
    }

    display() {
        const scene = this.scene;
        const gl    = scene.gl;

        gl.disable(gl.CULL_FACE);
        scene.setActiveShaderSimple(this.shader);

        // Passar tempo e vento ao shader
        const time = scene.currentTime * 240;  // converter para segundos aprox.
        this.shader.setUniformsValues({
            uTime:        time,
            uWindStrength: 0.35,
            uWindDir:     0.8,   // direcção do vento (radianos)
            uDry:         0.0,   // começa verde, muda por patch
        });

        for (const patch of this.patches) {
            // Alternar cor entre erva verde e seca
            this.shader.setUniformsValues({
                uDry: patch.isDry ? 1.0 : 0.0,
            });

            for (const b of patch.blades) {
                scene.pushMatrix();
                scene.translate(b.x, b.y, b.z);
                scene.rotate(b.rotY,   0, 1, 0);
                scene.rotate(b.leanDir, 0, 1, 0);
                scene.rotate(b.lean,   0, 0, 1);  // inclinação lateral
                scene.scale(1.0, b.height, 1.0);
                this.blade.display();
                scene.popMatrix();
            }
        }

        scene.setActiveShaderSimple(scene.defaultShader);
        gl.enable(gl.CULL_FACE);
    }
}