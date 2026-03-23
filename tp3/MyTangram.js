import { CGFobject, CGFappearance } from '../lib/CGF.js';
import { MyDiamond } from "./MyDiamond.js";
import { MyTriangle } from "./MyTriangle.js";
import { MyParallelogram } from "./MyParallelogram.js";

export class MyTangram extends CGFobject {
    constructor(scene) {
        super(scene);
        this.diamond = new MyDiamond(scene);
        this.triangle = new MyTriangle(scene);
        this.parallelogram = new MyParallelogram(scene);
        this.initMaterials(scene);
    }

    enableNormalViz() {
        this.diamond.enableNormalViz();
        this.parallelogram.enableNormalViz();
        this.triangle.enableNormalViz();
    }

    disableNormalViz() {
        this.diamond.disableNormalViz();
        this.parallelogram.disableNormalViz();
        this.triangle.disableNormalViz();
    }


    initMaterials(scene) {
        // Green diamond high specularity
        this.diamondMaterial = new CGFappearance(scene);
        this.diamondMaterial.setAmbient(0, 1.0, 0, 1.0);
        this.diamondMaterial.setDiffuse(0.0, 1, 0, 1.0);
        this.diamondMaterial.setSpecular(1.0, 1.0, 1.0, 1.0);
        this.diamondMaterial.setShininess(100);

        // Pink triangle high specularity
        this.pinkMaterial = new CGFappearance(scene);
        this.pinkMaterial.setAmbient(227/255, 61/255, 148/255, 1.0);
        this.pinkMaterial.setDiffuse(227/255, 61/255, 148/255, 1.0);
        this.pinkMaterial.setSpecular(1.0, 1.0, 1.0, 1.0);
        this.pinkMaterial.setShininess(100);

        // Red triangle hight specularity
        this.redMaterial = new CGFappearance(scene);
        this.redMaterial.setAmbient(1.0, 0.0, 0.0, 1.0);
        this.redMaterial.setDiffuse(1.0, 0.0, 0.0, 1.0);
        this.redMaterial.setSpecular(1.0, 1.0, 1.0, 1.0);
        this.redMaterial.setShininess(100);

        // Blue triangle
        this.blueMaterial = new CGFappearance(scene);
        this.blueMaterial.setAmbient(0.0, 0.0, 1.0, 1.0);
        this.blueMaterial.setDiffuse(0.0, 0.0, 1.0, 1.0);
        this.blueMaterial.setSpecular(1.0, 1.0, 1.0, 1.0);
        this.blueMaterial.setShininess(100);

        // Orange triangle
        this.orangeMaterial = new CGFappearance(scene);
        this.orangeMaterial.setAmbient(1.0, 165/255, 0.0, 1.0);
        this.orangeMaterial.setDiffuse(1.0, 165/255, 0.0, 1.0);
        this.orangeMaterial.setSpecular(1.0, 1.0, 1.0, 1.0);
        this.orangeMaterial.setShininess(100);

        // Purple triangle
        this.purpleMaterial = new CGFappearance(scene);
        this.purpleMaterial.setAmbient(0.5, 0.0, 0.5, 1.0);
        this.purpleMaterial.setDiffuse(0.5, 0.0, 0.5, 1.0);
        this.purpleMaterial.setSpecular(1.0, 1.0, 1.0, 1.0);
        this.purpleMaterial.setShininess(100);

        // Yellow parallelogram
        this.yellowMaterial = new CGFappearance(scene);
        this.yellowMaterial.setAmbient(1.0, 1.0, 0.0, 1.0);
        this.yellowMaterial.setDiffuse(1.0, 1.0, 0.0, 1.0);
        this.yellowMaterial.setSpecular(1.0, 1.0, 1.0, 1.0);
        this.yellowMaterial.setShininess(100);
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
        //this.diamondMaterial.apply();
        this.scene.customMaterial.apply();
        this.diamond.display();
        this.scene.popMatrix();

        // pink triangle
        this.scene.pushMatrix();
        this.scene.translate(0, -1, 0);
        this.pinkMaterial.apply();
        this.triangle.display();
        this.scene.popMatrix();

        // red triangle
        this.scene.pushMatrix();
        this.scene.translate(0, 1.7, 0);
        this.scene.scale(-0.7, -0.7, 1);
        this.redMaterial.apply();
        this.triangle.display();
        this.scene.popMatrix();

        // blue triangle
        this.scene.pushMatrix();
        this.scene.translate(0, 1.7 + Math.sqrt(2), 0);
        this.scene.rotate(Math.PI * 3/4, 0, 0, 1);
        this.blueMaterial.apply();
        this.triangle.display();
        this.scene.popMatrix();

        // orange triangle
        this.scene.pushMatrix();
        this.scene.translate(0, 1.7 + Math.sqrt(2), 0);
        this.scene.rotate(Math.PI * 5/4, 0, 0, 1);
        this.orangeMaterial.apply();
        this.triangle.display();
        this.scene.popMatrix();

        // purple triangle
        this.scene.pushMatrix();
        this.scene.translate(-0.7, -1, 0);
        this.scene.scale(-0.7, -0.7, 1);
        this.purpleMaterial.apply();
        this.triangle.display();
        this.scene.popMatrix();

        // yellow parallelogram
        this.scene.pushMatrix();
        this.scene.translate(0, -1.7, 0);
        this.scene.scale(0.7, -0.7, 1);
        this.yellowMaterial.apply();
        this.parallelogram.display();
        this.scene.popMatrix();
    }
}
