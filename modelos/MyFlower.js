import { CGFobject, CGFappearance } from "../lib/CGF.js";

/**
 * MyFlower
 *
 * Flor paramétrica 3D:
 *  - Caule cilíndrico verde fino
 *  - Folhas laterais no caule
 *  - Pétalas planas grandes em leque horizontal
 *  - Centro esférico amarelo
 *
 * @param petalCount  – número de pétalas (5–9)
 *  @param petalColor  – [r, g, b] cor das pétalas
 *  @param stemHeight  – altura do caule
 *  @param scale       – escala geral
 *  @param leafCount   – número de folhas no caule (1–3)
 */
export class MyFlower {

    constructor(scene, {
        petalCount = 7,
        petalColor = [1.0, 1.0, 1.0],
        stemHeight = 2.5,
        scale      = 1.0,
        leafCount  = 2,
    } = {}) {
        this.scene      = scene;
        this.petalCount = petalCount;
        this.petalColor = petalColor;
        this.stemHeight = stemHeight;
        this.scale      = scale;
        this.leafCount  = leafCount;

        this._initMeshes();
        this._initMaterials();
    }

    _initMeshes() {
        this.stem   = new _Cylinder(this.scene, 6);
        this.center = new _Sphere(this.scene, 10, 6);
        this.petal  = new _EllipsePetal(this.scene);
        this.leaf   = new _Leaf(this.scene);
    }

    _initMaterials() {
        const scene = this.scene;

        // Verde brilhante para o caule e folhas
        this.stemMat = new CGFappearance(scene);
        this.stemMat.setAmbient(0.15, 0.55, 0.10, 1);
        this.stemMat.setDiffuse(0.20, 0.75, 0.15, 1);
        this.stemMat.setSpecular(0.02, 0.05, 0.02, 1);
        this.stemMat.setShininess(5);

        // Centro amarelo
        this.centerMat = new CGFappearance(scene);
        this.centerMat.setAmbient(0.60, 0.45, 0.02, 1);
        this.centerMat.setDiffuse(1.00, 0.80, 0.05, 1);
        this.centerMat.setSpecular(0.10, 0.08, 0.01, 1);
        this.centerMat.setShininess(25);

        // Pétalas com cor parametrizada
        const [r, g, b] = this.petalColor;
        this.petalMat = new CGFappearance(scene);
        this.petalMat.setAmbient(r*0.6, g*0.6, b*0.6, 1);
        this.petalMat.setDiffuse(r, g, b, 1);
        this.petalMat.setSpecular(0.05, 0.05, 0.05, 1);
        this.petalMat.setShininess(8);
    }

    display() {
        const scene = this.scene;
        const gl    = scene.gl;
        const sh    = this.stemHeight;

        gl.disable(gl.CULL_FACE);

        scene.pushMatrix();
        scene.scale(this.scale, this.scale, this.scale);

        // ── Caule ─────────────────────────────────────────────────
        this.stemMat.apply();
        scene.pushMatrix();
        scene.scale(0.08, sh, 0.08);
        this.stem.display();
        scene.popMatrix();

        // ── Folhas ao longo do caule ──────────────────────────────
        for (let i = 0; i < this.leafCount; i++) {
            const leafH   = sh * (0.3 + i * 0.25);
            const leafDir = (i % 2 === 0) ? 0 : Math.PI;  // lados opostos
            scene.pushMatrix();
            scene.translate(0, leafH, 0);
            scene.rotate(leafDir, 0, 1, 0);
            scene.rotate(0.4, 0, 0, 1);  // inclinação para fora
            scene.scale(0.15, 0.5, 0.06);
            this.stemMat.apply();
            this.leaf.display();
            scene.popMatrix();
        }

        // ── Cabeça da flor no topo do caule 
        scene.pushMatrix();
        scene.translate(0, sh, 0);

        // Pétalas planas em leque horizontal
        this.petalMat.apply();
        const angleStep = (Math.PI * 2) / this.petalCount;
        for (let i = 0; i < this.petalCount; i++) {
            scene.pushMatrix();
            scene.rotate(i * angleStep, 0, 1, 0);
            scene.translate(0.55, 0, 0);           // afastar do centro
            scene.rotate(Math.PI / 2, 0, 1, 0);    // orientar para fora
            scene.rotate(-Math.PI / 2, 1, 0, 0);   // deitar horizontal
            scene.scale(0.45, 0.70, 0.06);          // pétala elíptica
            this.petal.display();
            scene.popMatrix();
        }

        // Centro esférico amarelo
        scene.pushMatrix();
        scene.scale(0.18, 0.16, 0.18);
        this.centerMat.apply();
        this.center.display();
        scene.popMatrix();

        scene.popMatrix(); // fim cabeça
        scene.popMatrix(); // fim scale

        gl.enable(gl.CULL_FACE);
    }
}

// ── Primitivas internas ───────────────────────────────────────────

class _Cylinder extends CGFobject {
    constructor(scene, slices = 6) {
        super(scene); this.slices = slices; this.initBuffers();
    }
    initBuffers() {
        this.vertices = []; this.normals = [];
        this.texCoords = []; this.indices = [];
        const step = (2 * Math.PI) / this.slices;
        for (let i = 0; i <= this.slices; i++) {
            const a = i * step, x = Math.cos(a), z = Math.sin(a);
            this.vertices.push(x, 0, z,  x, 1, z);
            this.normals.push(x, 0, z,   x, 0, z);
            this.texCoords.push(i/this.slices, 1,  i/this.slices, 0);
        }
        for (let i = 0; i < this.slices; i++) {
            const b = i * 2;
            this.indices.push(b, b+2, b+1,  b+1, b+2, b+3);
        }
        this.primitiveType = this.scene.gl.TRIANGLES;
        this.initGLBuffers();
    }
}

class _Sphere extends CGFobject {
    constructor(scene, slices = 10, stacks = 6) {
        super(scene); this.slices = slices; this.stacks = stacks; this.initBuffers();
    }
    initBuffers() {
        this.vertices = []; this.normals = []; this.texCoords = []; this.indices = [];
        const ss = Math.PI / this.stacks, sl = (2 * Math.PI) / this.slices;
        for (let i = 0; i <= this.stacks; i++) {
            const phi = Math.PI/2 - i*ss, cp = Math.cos(phi), sp = Math.sin(phi);
            for (let j = 0; j <= this.slices; j++) {
                const t = j*sl, x = cp*Math.cos(t), y = sp, z = cp*Math.sin(t);
                this.vertices.push(x, y, z); this.normals.push(x, y, z);
                this.texCoords.push(j/this.slices, i/this.stacks);
            }
        }
        for (let i = 0; i < this.stacks; i++)
            for (let j = 0; j < this.slices; j++) {
                const a = i*(this.slices+1)+j;
                this.indices.push(a, a+this.slices+1, a+1,
                                  a+1, a+this.slices+1, a+this.slices+2);
            }
        this.primitiveType = this.scene.gl.TRIANGLES; this.initGLBuffers();
    }
}

/** Pétala elíptica simples — quad com forma de elipse */
class _EllipsePetal extends CGFobject {
    constructor(scene) {
        super(scene); this.initBuffers();
    }
    initBuffers() {
        this.vertices = [
             0.0,  0.0, 0,   // centro base
            -0.5,  0.2, 0,
             0.5,  0.2, 0,
            -0.4,  0.6, 0,
             0.4,  0.6, 0,
            -0.2,  0.9, 0,
             0.2,  0.9, 0,
             0.0,  1.0, 0,   // ponta
        ];
        this.normals = [
            0,0,1, 0,0,1, 0,0,1, 0,0,1,
            0,0,1, 0,0,1, 0,0,1, 0,0,1,
        ];
        this.texCoords = [
            0.5,1, 0,0.8, 1,0.8, 0.1,0.4,
            0.9,0.4, 0.2,0.1, 0.8,0.1, 0.5,0,
        ];
        this.indices = [
            0,1,2,
            1,3,2, 2,3,4,
            3,5,4, 4,5,6,
            5,7,6,
        ];
        this.primitiveType = this.scene.gl.TRIANGLES;
        this.initGLBuffers();
    }
}

/** Folha simples — triângulo alongado */
class _Leaf extends CGFobject {
    constructor(scene) {
        super(scene); this.initBuffers();
    }
    initBuffers() {
        this.vertices = [
            -0.5, 0.0, 0,
             0.5, 0.0, 0,
            -0.3, 0.5, 0,
             0.3, 0.5, 0,
             0.0, 1.0, 0,
        ];
        this.normals = [
            0,0,1, 0,0,1, 0,0,1, 0,0,1, 0,0,1,
        ];
        this.texCoords = [
            0,1, 1,1, 0.1,0.5, 0.9,0.5, 0.5,0,
        ];
        this.indices = [
            0,2,1, 1,2,3,
            2,4,3,
        ];
        this.primitiveType = this.scene.gl.TRIANGLES;
        this.initGLBuffers();
    }
}