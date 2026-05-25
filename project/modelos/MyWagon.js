import { CGFobject, CGFappearance } from "../../lib/CGF.js";
import { MyWagonBack } from "./shapes/MyWagonBack.js";
import { CGFobjModel } from "../../lib/extra/CGFobjModel.js";


export class MyWagon extends CGFobject {
    constructor(scene) {
        super(scene);
        this.WagonBack = new MyWagonBack(scene);
        this.horse = new CGFobjModel(scene, "objects/horse.obj");

        // horse-specific appearance
        this.horseAppearance = new CGFappearance(scene);
        this.horseAppearance.loadTexture("images/horse_diffuse.jpg");
        this.horseAppearance.setAmbient(0.3, 0.3, 0.3, 1);
        this.horseAppearance.setDiffuse(1.0, 1.0, 1.0, 1);
        this.horseAppearance.setSpecular(0.2, 0.2, 0.2, 1);
        this.horseAppearance.setShininess(20);
        this.horseAppearance.setTextureWrap("REPEAT", "REPEAT");


    }

    display() {
        // wagon back
        this.scene.pushMatrix();
        this.scene.translate(0, 0.78, 0);
        this.scene.rotate(Math.PI, 0, 1, 0);
        this.scene.scale(1.1, 1.1, 1.1);
        this.WagonBack.display();
        this.scene.popMatrix();

        // horse
        this.scene.pushMatrix();
        this.scene.translate(2.31, 0, -1.15);
        this.scene.scale(0.12, 0.12, 0.12);
        this.scene.rotate(Math.PI/2, 0, 1, 0);
        this.horseAppearance.apply();
        this.horse.display();
        this.scene.popMatrix();
    }
}

