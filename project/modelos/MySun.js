import { CGFappearance } from "../../lib/CGF.js";
import { MySphere } from "./shapes/MySphere.js";

export class MySun {

    constructor(scene) {

        this.scene = scene;

        this.sunSphere = new MySphere(scene, 32, 16, false);
        this.moonSphere = new MySphere(scene, 32, 16, false);

        this.sunMaterial = new CGFappearance(scene);
        this.moonMaterial = new CGFappearance(scene);

        // SOL - brilhante, quente, auto-iluminado
        this.sunMaterial.setAmbient(1.0, 0.9, 0.5, 1);
        this.sunMaterial.setDiffuse(1.0, 0.85, 0.3, 1);
        this.sunMaterial.setSpecular(1.0, 0.95, 0.6, 1);
        this.sunMaterial.setEmission(0.9, 0.75, 0.2, 1);  // forte emissão amarela/laranja
        this.sunMaterial.setShininess(120);
        this.sunMaterial.loadTexture("images/sun_tex.png");

        // LUA - mais brilhante e visível
        this.moonMaterial.setAmbient(0.8, 0.8, 0.85, 1);    // muito mais alto
        this.moonMaterial.setDiffuse(0.9, 0.9, 0.95, 1);    
        this.moonMaterial.setSpecular(0.2, 0.2, 0.25, 1);   
        this.moonMaterial.setEmission(0.7, 0.7, 0.7, 1);  // emissão suficiente para ser visível
        this.moonMaterial.setShininess(15);                  
        this.moonMaterial.loadTexture("images/moon_tex.png");

        // Raio do sol/lua
        this.radius = 15;
        this.orbitRadius = 560;
    }

    display() {

        const angle = (this.scene.currentTime % 1.0) * Math.PI * 2;

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
        this.scene.scale(this.radius * 0.8, this.radius * 0.8, this.radius * 0.8);
        this.scene.rotate(Math.PI/2, 1, 0, 0);
        this.moonMaterial.apply();
        this.moonSphere.display();
        this.scene.popMatrix();
    }
}