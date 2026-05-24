import { CGFobject, CGFappearance } from "../../lib/CGF.js";
import { MyNoise } from "./MyNoise.js";

class MyMountain extends CGFobject {

    constructor(scene, divisions = 48, seed = 0, roughness = 1.0) {
        super(scene);
        this.divisions = divisions;
        this.seed      = seed;
        this.roughness = roughness;
        this.noise     = new MyNoise();
        this.initBuffers();
    }

    _height(u, v) {
        const d2      = u * u + v * v;
        const d       = Math.sqrt(d2);
        const profile = Math.exp(-d2 * 3.2);
        const nx      = u * 2.5 + this.seed * 6.1;
        const nz      = v * 2.5 + this.seed * 3.7;
        const n       = this.noise.fbm(nx, nz, 5);
        const edge    = Math.max(0, 1 - (d / 0.88) * (d / 0.88));
        return profile * (0.55 + n * 0.45 * this.roughness) * edge;
    }

    initBuffers() {
        this.vertices  = [];
        this.normals   = [];
        this.texCoords = [];
        this.indices   = [];

        const N    = this.divisions;
        const step = 2.0 / N;

        for (let i = 0; i <= N; i++) {
            for (let j = 0; j <= N; j++) {
                const u = -1 + j * step;
                const v = -1 + i * step;
                const y = this._height(u, v);
                this.vertices.push(u, y, v);
                this.texCoords.push(j / N * 4, i / N * 4);
            }
        }

        const eps = step * 0.5;
        for (let i = 0; i <= N; i++) {
            for (let j = 0; j <= N; j++) {
                const u   = -1 + j * step;
                const v   = -1 + i * step;
                const hL  = this._height(u - eps, v);
                const hR  = this._height(u + eps, v);
                const hD  = this._height(u, v - eps);
                const hU  = this._height(u, v + eps);
                const nx  = (hL - hR) / (2 * eps);
                const nz  = (hD - hU) / (2 * eps);
                const ny  = 1.0;
                const len = Math.sqrt(nx*nx + ny*ny + nz*nz);
                this.normals.push(nx/len, ny/len, nz/len);
            }
        }

        for (let i = 0; i < N; i++) {
            for (let j = 0; j < N; j++) {
                const a = i*(N+1)+j, b = a+1, c = a+(N+1), d = c+1;
                this.indices.push(a, c, b, b, c, d);
            }
        }

        this.primitiveType = this.scene.gl.TRIANGLES;
        this.initGLBuffers();
    }
}

export class MyMountains {

    constructor(scene, ground, count = 14) {
        this.scene  = scene;
        this.ground = ground;

        this.rockMaterial = new CGFappearance(scene);
        this.rockMaterial.loadTexture("images/rock.jpg");
        this.rockMaterial.setTextureWrap('REPEAT', 'REPEAT');
        this.rockMaterial.setAmbient(0.55, 0.52, 0.48, 1);
        this.rockMaterial.setDiffuse(0.75, 0.70, 0.65, 1);
        this.rockMaterial.setSpecular(0.05, 0.05, 0.05, 1);
        this.rockMaterial.setShininess(8);

        this.mountains = this._generate(count);
    }

    _rand(seed) {
        return (Math.abs(Math.sin(seed * 127.1 + 43.2) * 43758.5453)) % 1.0;
    }

    _generate(count) {
        const list = [];

        for (let i = 0; i < count; i++) {
            const s = i * 13 + 5;

            // Tentar encontrar ângulo fora do caminho (|x| > 25)
            let angle, x, z, attempts = 0;
            do {
                angle    = (i / count) * Math.PI * 2 + this._rand(s + attempts) * 0.35;
                const r  = 220 + this._rand(s + 1) * 60;
                x        = Math.cos(angle) * r;
                z        = Math.sin(angle) * r;
                attempts++;
            } while (Math.abs(x) < 25 && attempts < 10);

            const radius = 220 + this._rand(s + 1) * 60;
            x = Math.cos(angle) * radius;
            z = Math.sin(angle) * radius;
            const y = this.ground.getHeightAt(x, z);

            const height = 25 + this._rand(s + 2) * 30;
            const width  = 35 + this._rand(s + 3) * 35;
            const rotY   = this._rand(s + 4) * Math.PI * 2;
            const seed   = this._rand(s + 5) * 50;
            const rough  = 0.5 + this._rand(s + 6) * 0.5;

            list.push({
                x, y, z,
                height, width, rotY,
                mesh: new MyMountain(this.scene, 48, seed, rough)
            });
        }
        return list;
    }

    display() {
        this.scene.gl.disable(this.scene.gl.CULL_FACE);

        for (const m of this.mountains) {
            this.scene.pushMatrix();
            this.scene.translate(m.x, m.y - 2, m.z);
            this.scene.rotate(m.rotY, 0, 1, 0);
            this.scene.scale(m.width, m.height, m.width);
            this.rockMaterial.apply();
            m.mesh.display();
            this.scene.popMatrix();
        }

        this.scene.gl.enable(this.scene.gl.CULL_FACE);
    }
}