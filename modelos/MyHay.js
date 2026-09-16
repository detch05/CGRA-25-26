import { CGFappearance, CGFshader } from "../lib/CGF.js";
import { MyCube } from "./shapes/MyCube.js";

export class MyHay {

    constructor(scene, x = 0, y = 0, z = 0) {

        this.scene = scene;
        this.x = x;
        this.y = y;
        this.z = z;

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
        this.displayAt(this.x, this.y, this.z);
    }

    displayAt(x, y, z) {
        this.scene.pushMatrix();
        this.scene.translate(x, y, z);

        this.hayShader.setUniformsValues({
            uTime: this.scene.currentTime * Math.PI * 2 * 40
        });
        this.scene.setActiveShader(this.hayShader);
        this.hayMaterial.apply();
        this.hayBale.display();
        this.scene.setActiveShader(this.scene.defaultShader);

        this.scene.popMatrix();
    }

    static createBales(scene, count, maxRadius, ground = null) {
        const bales = [];
        const terrain = ground || scene?.ground;

        if (!scene || !terrain || !terrain.getHeightAt) {
            return bales;
        }

        for (let i = 0; i < count; i++) {
            const angle = Math.random() * Math.PI * 2;
            const radius = Math.sqrt(Math.random()) * maxRadius;
            const x = Math.cos(angle) * radius;
            const z = Math.sin(angle) * radius;
            const y = terrain.getHeightAt(x, z);
            bales.push(new MyHay(scene, x, y, z));
        }

        return bales;
    }
}