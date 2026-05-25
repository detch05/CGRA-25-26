import { CGFappearance, CGFshader } from "../../lib/CGF.js";
import { MyCube } from "./shapes/MyCube.js";

export class MyHay {

    constructor(scene) {

        this.scene = scene;

        this.hayBale = new MyCube(scene);

        this.hayMaterial = new CGFappearance(scene);

        this.hayMaterial.setAmbient(0.3, 0.26, 0.18, 1);
        this.hayMaterial.setDiffuse(0.9, 0.82, 0.55, 1);
        this.hayMaterial.setSpecular(0.15, 0.13, 0.1, 1);
        this.hayMaterial.setEmission(0.0, 0.0, 0.0, 1);
        this.hayMaterial.setShininess(20);
        this.hayMaterial.loadTexture("images/hay.jpg");

        this.hayShader = new CGFshader(this.scene.gl, "shaders/hay.vert", "shaders/hay.frag");
        this.hayShader.setUniformsValues({
            uWindStrength: 0.02,
            uAmbientFactor: 0.2,
            uSpecularStrength: 0.25,
            uShininess: 18,
            uTime: 0
        });

    }

    display() {

        this.scene.pushMatrix();
        this.scene.translate(0, 0, 0);

        this.hayShader.setUniformsValues({
            uTime: this.scene.currentTime * Math.PI * 2 * 100
        });
        this.scene.setActiveShader(this.hayShader);
        this.hayMaterial.apply();
        this.hayBale.display();
        this.scene.setActiveShader(this.scene.defaultShader);

        this.scene.popMatrix();
    }
}