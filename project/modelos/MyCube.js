import { CGFobject } from "../../lib/CGF.js";
import { MyQuad } from "./MyQuad.js";

export class MyCube extends CGFobject {
    constructor(scene) {
        super(scene);
        this.quad = new MyQuad(scene);
    }

    display() {
        // Front (+Z)
        this.scene.pushMatrix();
        this.scene.translate(0, 0.5, 0.5);
        this.quad.display();
        this.scene.popMatrix();

        // Back (-Z)
        this.scene.pushMatrix();
        this.scene.translate(0, 0.5, -0.5);
        this.scene.rotate(Math.PI, 0, 1, 0);
        this.quad.display();
        this.scene.popMatrix();

        // Right (+X)
        this.scene.pushMatrix();
        this.scene.translate(0.5, 0.5, 0);
        this.scene.rotate(Math.PI / 2, 0, 1, 0);
        this.quad.display();
        this.scene.popMatrix();

        // Left (-X)
        this.scene.pushMatrix();
        this.scene.translate(-0.5, 0.5, 0);
        this.scene.rotate(-Math.PI / 2, 0, 1, 0);
        this.quad.display();
        this.scene.popMatrix();

        // Top (+Y)
        this.scene.pushMatrix();
        this.scene.translate(0, 1, 0);
        this.scene.rotate(-Math.PI / 2, 1, 0, 0);
        this.quad.display();
        this.scene.popMatrix();

        // Bottom (-Y)
        this.scene.pushMatrix();
        this.scene.rotate(Math.PI / 2, 1, 0, 0);
        this.quad.display();
        this.scene.popMatrix();
    }
}
