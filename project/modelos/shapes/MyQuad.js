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
            0, 0, 0,
            0, 1, 0,
            1, 1, 0,
            1, 0, 0
        ];

        // Counter-clockwise reference of vertices
        this.indices = [
            0, 2, 3,
            0, 1, 2,
            0, 3, 2,
            0, 2, 1
        ];

        this.normals = [
            0, 0, 1,
            0, 0, 1,
            0, 0, 1,
            0, 0, 1
        ];

        this.texCoords = [
            0, 1,
            0, 0,
            1, 0,
            1, 1
        ];

        this.primitiveType = this.scene.gl.TRIANGLES;
        this.initGLBuffers();
    }

    updateTexCoords(coords) {
        this.texCoords = [...coords];
        this.updateTexCoordsGLBuffers();
    }
}
