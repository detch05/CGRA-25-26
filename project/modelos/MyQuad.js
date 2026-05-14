import { CGFobject } from "../../lib/CGF.js";

export class MyQuad extends CGFobject {
    constructor(scene, coords) {
        super(scene);
        this.initBuffers();
        if (coords !== undefined) {
            this.updateTexCoords(coords);
        }
    }

    initBuffers() {
        this.vertices = [
            -0.5, -0.5, 0,
            0.5, -0.5, 0,
            -0.5, 0.5, 0,
            0.5, 0.5, 0
        ];

        this.indices = [
            0, 1, 2,
            1, 3, 2
        ];

        this.normals = [
            0, 0, 1,
            0, 0, 1,
            0, 0, 1,
            0, 0, 1
        ];

        this.texCoords = [
            0, 1,
            1, 1,
            0, 0,
            1, 0
        ];

        this.primitiveType = this.scene.gl.TRIANGLES;
        this.initGLBuffers();
    }

    updateTexCoords(coords) {
        this.texCoords = [...coords];
        this.updateTexCoordsGLBuffers();
    }
}
