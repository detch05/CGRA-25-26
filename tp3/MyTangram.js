import { CGFobject } from '../lib/CGF.js';
import { MyDiamond } from "./MyDiamond.js";
import { MyTriangle } from "./MyTriangle.js";
import { MyParallelogram } from "./MyParallelogram.js";

export class MyTangram extends CGFobject {
    constructor(scene) {
        super(scene);
        this.diamond = new MyDiamond(scene);
        this.triangle = new MyTriangle(scene);
        this.parallelogram = new MyParallelogram(scene);
    }

    display() {
        var s = 1.0 / Math.sqrt(2);
        var scale = [
            s,   0.0, 0.0, 0.0,
            0.0, s,   0.0, 0.0,
            0.0, 0.0, 1.0, 0.0,
            0.0, 0.0, 0.0, 1.0
        ];

        var translate = [
            1.0, 0.0, 0.0, 0.0,
            0.0, 1.0, 0.0, 0.0,
            0.0, 0.0, 1.0, 0.0,
            0.5, 0.0, 0.0, 1.0
        ];

        var rotate = [
            Math.cos(Math.PI/4), Math.sin(Math.PI/4), 0.0, 0.0,
            -Math.sin(Math.PI/4), Math.cos(Math.PI/4), 0.0, 0.0,
            0.0, 0.0, 1.0, 0.0,
            0.0, 0.0, 0.0, 1.0
        ];

        // green diamond
        this.scene.pushMatrix();
        this.scene.multMatrix(translate);
        this.scene.multMatrix(rotate);
        this.scene.multMatrix(scale);
        this.scene.setAmbient(0.0, 1.0, 0.0, 1.0);
        this.scene.setDiffuse(0.0, 1.0, 0.0, 1.0);
        this.scene.setSpecular(0.0, 1.0, 0.0, 1.0);
        this.diamond.display();
        this.scene.popMatrix();

        // pink triangle
        this.scene.pushMatrix();
        this.scene.translate(0, -1, 0);
        this.scene.setAmbient(227/255, 61/255, 148/255, 1.0);
        this.scene.setDiffuse(227/255, 61/255, 148/255, 1.0);
        this.scene.setSpecular(227/255, 61/255, 148/255, 1.0);
        this.triangle.display();
        this.scene.popMatrix();

        // red triangle
        this.scene.pushMatrix();
        this.scene.translate(0, 1.7, 0);
        this.scene.scale(-0.7, -0.7, 0);
        this.scene.setAmbient(1.0, 0.0, 0.0, 1.0);
        this.scene.setDiffuse(1.0, 0.0, 0.0, 1.0);
        this.scene.setSpecular(1.0, 0.0, 0.0, 1.0);
        this.triangle.display();
        this.scene.popMatrix();

        // blue triangle
        this.scene.pushMatrix();
        this.scene.translate(0, 1.7 + Math.sqrt(2), 0);
        this.scene.rotate(Math.PI * 3/4, 0, 0, 1);
        this.scene.setAmbient(0.0, 0.0, 1.0, 1.0);
        this.scene.setDiffuse(0.0, 0.0, 1.0, 1.0);
        this.scene.setSpecular(0.0, 0.0, 1.0, 1.0);
        this.triangle.display();
        this.scene.popMatrix();

        // orange triangle
        this.scene.pushMatrix();
        this.scene.translate(0, 1.7 + Math.sqrt(2), 0);
        this.scene.rotate(Math.PI * 5/4, 0, 0, 1);
        this.scene.setAmbient(1.0, 165.0/255, 0.0, 1.0);
        this.scene.setDiffuse(1.0, 165.0/255, 0.0, 1.0);
        this.scene.setSpecular(1.0, 165.0/255, 0.0, 1.0);
        this.triangle.display();
        this.scene.popMatrix();

        // purple triangle
        this.scene.pushMatrix();
        this.scene.translate(-0.7, -1, 0);
        this.scene.scale(-0.7, -0.7, 0);
        this.scene.setAmbient(0.5, 0.0, 0.5, 1.0);
        this.scene.setDiffuse(0.5, 0.0, 0.5, 1.0);
        this.scene.setSpecular(0.5, 0.0, 0.5, 1.0);
        this.triangle.display();
        this.scene.popMatrix();

        // yellow parallelogram
        this.scene.pushMatrix();
        this.scene.translate(0, -1.7, 0);
        this.scene.scale(0.7, -0.7, 0);
        this.scene.setAmbient(1.0, 1.0, 0.0, 1.0);
        this.scene.setDiffuse(1.0, 1.0, 0.0, 1.0);
        this.scene.setSpecular(1.0, 1.0, 0.0, 1.0);
        this.parallelogram.display();
        this.scene.popMatrix();
    }
}
