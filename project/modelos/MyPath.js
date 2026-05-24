import { CGFappearance } from "../../lib/CGF.js";
import { MyQuad } from "./MyQuad.js";

export class MyPath {

    constructor(scene) {

        this.scene = scene;

        this.quad = new MyQuad(scene);

        this.material = new CGFappearance(scene);

        this.material.setAmbient(1,1,1,1);
        this.material.setDiffuse(1,1,1,1);

        this.material.loadTexture("images/path.jpg");
        this.material.setTextureWrap('REPEAT', 'REPEAT');
    }

    display() {

        this.material.apply();

        for(let z = -300; z <= 300; z += 8) {

            this.scene.pushMatrix();

            this.scene.translate(0, 0.05, z);

            this.scene.rotate(-Math.PI/2, 1, 0, 0);

            this.scene.scale(12, 8, 1);

            this.quad.display();

            this.scene.popMatrix();
        }
    }
}