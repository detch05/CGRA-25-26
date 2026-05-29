import { CGFobject } from "../../../lib/CGF.js";
import { MyBow } from "./MyArch.js";
import { MyCap } from "./MyCap.js";
import { MyUnitCube } from "./MyUnitCube.js";

export class MyWheel extends CGFobject {
    constructor(scene) {
        super(scene);
        this.bow = new MyBow(scene);
        this.cube = new MyUnitCube(scene);

        this.outerTop = new MyCap(scene, 20, 1.0, 0.85, 1);
        this.outerBottom = new MyCap(scene, 20, 1.0, 0.85, -1);
        this.middleTop = new MyCap(scene, 20, 0.9, 0.2, 1);
        this.middleBottom = new MyCap(scene, 20, 0.9, 0.2, -1);
        this.centerTop = new MyCap(scene, 20, 0.2, 0.0, 1);
        this.centerBottom = new MyCap(scene, 20, 0.2, 0.0, -1);

        this.height = 0.2;
    }

    display() {
        // arco maior
        this.scene.pushMatrix();
        this.bow.display();
        this.scene.popMatrix();

        // arco menor
        this.scene.pushMatrix();
        this.scene.scale(0.85, 0.85, 1);
        this.bow.display();
        this.scene.popMatrix();

        // arco central
        this.scene.pushMatrix();
        this.scene.scale(0.2, 0.2, 1);
        this.bow.display();
        this.scene.popMatrix();

        // tampas do arco maior
        this.scene.pushMatrix();
        this.scene.translate(0, 0, this.height);
        this.outerTop.display();
        this.scene.popMatrix();

        this.scene.pushMatrix();
        this.outerBottom.display();
        this.scene.popMatrix();

        // tampas do arco central
        this.scene.pushMatrix();
        this.scene.translate(0, 0, this.height);
        this.centerTop.display();
        this.scene.popMatrix();

        this.scene.pushMatrix();
        this.centerBottom.display();
        this.scene.popMatrix();

        // raios 
        for (let i = 0; i < 8; i++) {
            this.scene.pushMatrix();
            this.scene.rotate(i * Math.PI / 4, 0, 0, 1);
            this.scene.translate(-0.05, 0, 0);
            this.scene.scale(0.1, 0.9, this.height);
            this.cube.display();
            this.scene.popMatrix();
        }
    }
}