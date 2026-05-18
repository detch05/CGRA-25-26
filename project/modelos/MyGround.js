import { CGFobject, CGFappearance, CGFtexture } from "../../lib/CGF.js";

export class MyGround extends CGFobject {

    constructor(scene) {

        super(scene);

        this.material = new CGFappearance(scene);

        this.material.setAmbient(0.7, 0.7, 0.7, 1);

        this.material.setDiffuse(0.2, 0.8, 0.2, 1);

        this.material.setSpecular(0.8,0.8,0.8,1);

        this.material.setShininess(5);

        this.texture = new CGFtexture(scene, "images/ground.png");
        this.material.setTexture(this.texture);
        this.material.setTextureWrap('REPEAT', 'REPEAT');

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
            20,0,
            0,20,
            20,20
        ];

        this.primitiveType = this.scene.gl.TRIANGLES;

        this.initGLBuffers();
    }

    display() {

        this.scene.pushMatrix();
        this.scene.translate(0, -2, 0);
        this.scene.scale(50,1,50);
        this.scene.rotate (Math.PI, 1,0,0);
        this.material.apply();
        super.display();
        this.scene.popMatrix();
    }
}