import { CGFappearance } from "../../lib/CGF.js";
import { MySphere } from "./MySphere.js";

export class MySun {

    constructor(scene) {

        this.scene = scene;

        this.sunSphere = new MySphere(scene, 32, 16, false);
        this.moonSphere = new MySphere(scene, 32, 16, false);

        this.sunMaterial = new CGFappearance(scene);
        this.moonMaterial = new CGFappearance(scene);

        this.sunMaterial.setAmbient(1, 1, 1, 1);
        this.sunMaterial.setDiffuse(1, 1, 1, 1);
        this.sunMaterial.setSpecular(1, 1, 1, 1);
        this.sunMaterial.setEmission(0.35, 0.3, 0.2, 1);
        this.sunMaterial.setShininess(100);

        this.moonMaterial.setAmbient(0.8, 0.8, 0.9, 1);
        this.moonMaterial.setDiffuse(0.9, 0.9, 1, 1);
        this.moonMaterial.setSpecular(0.8, 0.8, 0.9, 1);
        this.moonMaterial.setEmission(0.08, 0.08, 0.1, 1);
        this.moonMaterial.setShininess(80);

        // Textura com sol e lua (sol na metade esquerda, lua na metade direita)
        this.sunMaterial.loadTexture("images/sun_n_moon.png");
        this.moonMaterial.loadTexture("images/sun_n_moon.png");

        this.sunSphere.updateTexCoords(0.5, 0.0);
        this.moonSphere.updateTexCoords(0.5, 0.5);

        // Raio do sol/lua
        this.radius = 8;
        this.orbitRadius = 100;
    }

    display() {

        const angle = this.scene.currentTime * Math.PI * 2;

        // SOL
        this.scene.pushMatrix();
        this.scene.rotate(angle, 0, 0, 1);
        this.scene.translate(0, this.orbitRadius, 0);
        this.scene.scale(this.radius, this.radius, this.radius);
        this.sunMaterial.apply();
        this.sunSphere.display();
        this.scene.popMatrix();

        // LUA (oposta ao sol)
        this.scene.pushMatrix();
        this.scene.rotate(angle + Math.PI, 0, 0, 1);
        this.scene.translate(0, this.orbitRadius, 0);
        this.scene.scale(this.radius * 0.9, this.radius * 0.9, this.radius * 0.9);
        this.moonMaterial.apply();
        this.moonSphere.display();
        this.scene.popMatrix();
    }
}