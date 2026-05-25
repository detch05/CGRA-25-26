import { CGFappearance } from "../../lib/CGF.js";
import { MyCube } from "./MyCube.js";

export class MyHay {

    constructor(scene) {

        this.scene = scene;

        this.hayBale = new MyCube(scene);

        this.hayMaterial = new CGFappearance(scene);

        this.hayMaterial.setAmbient(1.0, 0.9, 0.5, 1);
        this.hayMaterial.setDiffuse(1.0, 0.85, 0.3, 1);
        this.hayMaterial.setSpecular(1.0, 0.95, 0.6, 1);
        this.hayMaterial.setEmission(0.9, 0.75, 0.2, 1);  // forte emissão amarela/laranja
        this.hayMaterial.setShininess(120);
        this.hayMaterial.loadTexture("images/hay.jpg");

    }

    display() {

        this.scene.pushMatrix();
        this.scene.translate(0, 0, 0);
        this.hayMaterial.apply();
        this.hayBale.display();
        this.scene.popMatrix();
    }
}