import { CGFappearance } from "../lib/CGF.js";
import { MySphere } from "./MySphere.js";

export class MyCloud {

    constructor(scene, x, y, z) {

        this.scene = scene;

        this.x = x;
        this.y = y;
        this.z = z;

        this.sphere = new MySphere(scene, 16, 8, false);

        this.material = new CGFappearance(scene);

        this.material.setAmbient(0.9,0.9,0.9,1);
        this.material.setDiffuse(1,1,1,1);
        this.material.setSpecular(0,0,0,1);
        this.material.setEmission(0.2, 0.2, 0.2, 1);
        this.material.setShininess(5);
    }

    display() {

        this.scene.pushMatrix();

        this.scene.translate(this.x, this.y, this.z);

        this.scene.scale(15, 4, 8);

        this.material.apply();

        this.sphere.display();

        this.scene.popMatrix();
    }
}