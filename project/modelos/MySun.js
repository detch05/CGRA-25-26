import { CGFappearance } from "../../lib/CGF.js";
import { MySphere } from "./MySphere.js";

export class MySun {

    constructor(scene, coords) {

        this.scene = scene;

        this.sphere = new MySphere(scene, 32, 16, false);

        this.material = new CGFappearance(scene);

        if (coords != undefined)
			this.updateTexCoords(coords);

        this.material.setAmbient(1,1,0,1);
        this.material.setDiffuse(1,1,0,1);
        this.material.setSpecular(1,1,0,1);
        this.material.setEmission(1, 1, 0, 1);
        this.material.setShininess(10);
        
    }

    display() {

        this.scene.pushMatrix();

        this.scene.translate(80, 60, -120);

        this.scene.scale(10,10,10);

        this.material.apply();

        this.sphere.display();

        this.scene.popMatrix();
    }
}