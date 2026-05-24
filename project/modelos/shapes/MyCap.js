import { CGFobject } from '../../../lib/CGF.js';

export class MyCap extends CGFobject {
    constructor(scene, slices = 20, outerRadius = 1, innerRadius = 0, normalSign = 1) {
        super(scene);

        this.slices = slices;
        this.outerRadius = outerRadius;
        this.innerRadius = innerRadius;
        this.normalSign = normalSign >= 0 ? 1 : -1;

        this.initBuffers();
    }

    initBuffers() {
        this.vertices = [];
        this.indices = [];
        this.normals = [];

        const alpha = (2 * Math.PI) / this.slices;

        if (this.innerRadius <= 0) {
            this.vertices.push(0, 0, 0);
            this.normals.push(0, 0, this.normalSign);

            for (let i = 0; i <= this.slices; i++) {
                const ang = i * alpha;
                const x = Math.cos(ang) * this.outerRadius;
                const y = Math.sin(ang) * this.outerRadius;

                this.vertices.push(x, y, 0);
                this.normals.push(0, 0, this.normalSign);
            }

            for (let i = 1; i <= this.slices; i++) {
                if (this.normalSign > 0) {
                    this.indices.push(0, i, i + 1);
                } else {
                    this.indices.push(0, i + 1, i);
                }
            }
        } else {
            for (let i = 0; i <= this.slices; i++) {
                const ang = i * alpha;
                const cos = Math.cos(ang);
                const sin = Math.sin(ang);

                this.vertices.push(cos * this.outerRadius, sin * this.outerRadius, 0);
                this.normals.push(0, 0, this.normalSign);
            }

            const innerStart = this.vertices.length / 3;

            for (let i = 0; i <= this.slices; i++) {
                const ang = i * alpha;
                const cos = Math.cos(ang);
                const sin = Math.sin(ang);

                this.vertices.push(cos * this.innerRadius, sin * this.innerRadius, 0);
                this.normals.push(0, 0, this.normalSign);
            }

            for (let i = 0; i < this.slices; i++) {
                const outer = i;
                const outerNext = i + 1;
                const inner = innerStart + i;
                const innerNext = innerStart + i + 1;

                if (this.normalSign > 0) {
                    this.indices.push(outer, outerNext, innerNext);
                    this.indices.push(outer, innerNext, inner);
                } else {
                    this.indices.push(outer, innerNext, outerNext);
                    this.indices.push(outer, inner, innerNext);
                }
            }
        }

        this.primitiveType = this.scene.gl.TRIANGLES;
        this.initGLBuffers();
    }
}