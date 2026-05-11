import { CGFobject, CGFappearance } from "../../lib/CGF.js";

export class MyGround extends CGFobject {

    constructor(scene) {

        super(scene);

        this.material = new CGFappearance(scene);

        this.material.setAmbient(0.2, 0.8, 0.2, 1);

        this.material.setDiffuse(0.2, 0.8, 0.2, 1);

        this.material.setSpecular(0,0,0,1);

        this.material.setShininess(5);

        this.initBuffers();
    }

    initBuffers() {

        this.vertices = [
            -1, 0, -1,
             1, 0, -1,
            -1, 0,  1,
             1, 0,  1
        ];

        this.indices = [
            0, 1, 2,
            1, 3, 2
        ];

        this.normals = [
            0,1,0,
            0,1,0,
            0,1,0,
            0,1,0
        ];

        this.texCoords = [
            0,0,
            1,0,
            0,1,
            1,1
        ];

        this.primitiveType = this.scene.gl.TRIANGLES;

        this.initGLBuffers();
    }

    display() {

        this.scene.pushMatrix();

        // chão gigante
        this.scene.translate(0, -2, 0);

        this.scene.scale(300,1,300);

        this.material.apply();

        super.display();

        this.scene.popMatrix();
    }
}