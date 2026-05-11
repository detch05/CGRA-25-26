import { CGFappearance } from "../../lib/CGF.js";
import { MySphere } from "./MySphere.js";

export class MySky {

    constructor(scene) {

        this.scene = scene;

        // Half sphere virada para dentro
        this.sphere = new MySphere(scene, 64, 32, true);

        // Material do céu
        this.material = new CGFappearance(scene);

        this.material.setAmbient(0.6, 0.8, 1, 1);
        this.material.setDiffuse(0.6, 0.8, 1, 1);
        this.material.setSpecular(0,0,0,1);

        this.material.setShininess(5);
    }

    display() {

        this.scene.pushMatrix();

        // ver interior
        this.scene.gl.disable(this.scene.gl.CULL_FACE);

        // dome gigante
        this.scene.scale(200,200,200);

        this.material.apply();

        this.sphere.display();

        this.scene.gl.enable(this.scene.gl.CULL_FACE);

        this.scene.popMatrix();
    }
}