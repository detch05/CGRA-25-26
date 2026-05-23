import { CGFappearance, CGFtexture } from "../../lib/CGF.js";
import { MyRock } from "./MyRock.js";

export class MyRocks {

    constructor(scene, ground, count = 40) {
        this.scene  = scene;
        this.ground = ground;

        // Um material por tipo de pedra (3 texturas diferentes)
        this.materials = [];
        const textures = ["images/rock1.jpg", "images/rock2.jpg", "images/rock3.jpg"];

        for (const texPath of textures) {
            const mat = new CGFappearance(scene);
            mat.setAmbient(0.8, 0.8, 0.8, 1);
            mat.setDiffuse(1.0, 1.0, 1.0, 1);
            mat.setSpecular(0.1, 0.1, 0.1, 1);
            mat.setShininess(10);
            mat.loadTexture(texPath);
            mat.setTextureWrap('REPEAT', 'REPEAT');
            this.materials.push(mat);
        }

        this.rocks = this._generateRocks(count);
    }

    _seededRand(seed) {
        return (Math.abs(Math.sin(seed * 127.1 + 43.2) * 43758.5453)) % 1.0;
    }

    _generateRocks(count) {
        const rocks = [];
        const half  = 90;
        const pathW = 12;

        for (let i = 0; i < count; i++) {
            const s = i * 7 + 13;

            let x, z, attempts = 0;
            do {
                x = (this._seededRand(s + attempts)     * 2 - 1) * half;
                z = (this._seededRand(s + attempts + 1) * 2 - 1) * half;
                attempts++;
            } while (Math.abs(x) < pathW && attempts < 20);

            const y      = this.ground.getHeightAt(x, z);
            const scaleB = 1.5 + this._seededRand(s + 2) * 3.0;
            const scaleX = scaleB * (0.8 + this._seededRand(s + 3) * 0.6);
            const scaleY = scaleB * (0.5 + this._seededRand(s + 4) * 0.5);
            const scaleZ = scaleB * (0.8 + this._seededRand(s + 5) * 0.6);
            const rotY   = this._seededRand(s + 6) * Math.PI * 2;
            const seed   = Math.floor(this._seededRand(s + 7) * 1000);
            const rough  = 0.25 + this._seededRand(s + 8) * 0.3;
            const matIdx = Math.floor(this._seededRand(s + 9) * 3);  // qual das 3 texturas
            const slices = 8  + Math.floor(this._seededRand(s + 10) * 8);
            const stacks = 6  + Math.floor(this._seededRand(s + 11) * 6);

            rocks.push({
                x, y: y - scaleY * 0.35, z,
                scaleX, scaleY, scaleZ,
                rotY, matIdx,
                mesh: new MyRock(this.scene, slices, stacks, seed, rough)
            });
        }
        return rocks;
    }

    display() {
        this.scene.gl.disable(this.scene.gl.CULL_FACE);

        for (const rock of this.rocks) {
            this.scene.pushMatrix();

            this.scene.translate(rock.x, rock.y, rock.z);
            this.scene.rotate(rock.rotY, 0, 1, 0);
            this.scene.scale(rock.scaleX, rock.scaleY, rock.scaleZ);

            this.materials[rock.matIdx].apply();
            rock.mesh.display();

            this.scene.popMatrix();
        }
        this.scene.gl.enable(this.scene.gl.CULL_FACE);
    }
}