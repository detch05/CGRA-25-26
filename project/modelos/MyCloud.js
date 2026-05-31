import { CGFappearance } from "../lib/CGF.js";
import { MyQuad } from "./shapes/MyQuad.js";

export class MyCloud {

    constructor(scene) {

        this.scene = scene;

        this.quad = new MyQuad(scene);

        // Camadas de nuvens (distancia, altura, escala, velocidade, fase, opacidade)
        this.clouds = [
            // Camada perto: rapida, pequena, opaca
            { radius: 345, height: 15, scaleX: 1.05, scaleY: 0.55, speed: -1.05, phase: 0.12, opacity: 0.75 },
            { radius: 350, height: 20, scaleX: -0.9, scaleY: 0.5, speed: -1.2, phase: 0.46, opacity: 0.8 },
            { radius: 355, height: 25, scaleX: 1.2, scaleY: 0.65, speed: -0.95, phase: 0.78, opacity: 0.7 },

            // Camada media: intermedia em tudo
            { radius: 375, height: 34, scaleX: 1.9, scaleY: 0.9, speed: 0.75, phase: 0.2, opacity: 0.6 },
            { radius: 380, height: 40, scaleX: 2.1, scaleY: 1.0, speed: 0.7, phase: 0.58, opacity: 0.55 },
            { radius: 385, height: 43, scaleX: -1.7, scaleY: 0.85, speed: 0.8, phase: 0.9, opacity: 0.58 },

            // Camada longe: lenta, grande, menos opaca
            { radius: 405, height: 56, scaleX: -3.1, scaleY: 1.35, speed: -0.4, phase: 0.05, opacity: 0.45 },
            { radius: 410, height: 50, scaleX: 3.6, scaleY: 1.55, speed: -0.35, phase: 0.42, opacity: 0.4 },
            { radius: 415, height: 68, scaleX: 2.9, scaleY: 1.25, speed: -0.38, phase: 0.73, opacity: 0.43 },

            // Camada muito longe: bem lenta, bem grande, bem transparente
            { radius: 435, height: 84, scaleX: -4.4, scaleY: 1.85, speed: 0.25, phase: 0.18, opacity: 0.32 },
            { radius: 440, height: 90, scaleX: 4.8, scaleY: 2.0, speed: 0.22, phase: 0.55, opacity: 0.3 },
            { radius: 445, height: 80, scaleX: -4.0, scaleY: 1.7, speed: 0.28, phase: 0.86, opacity: 0.34 }
        ];

        // Material base para nuvem
        this.material = new CGFappearance(scene);

        this.material.setAmbient(0, 0, 0, 0);
        this.material.setDiffuse(0, 0, 0, 0);
        this.material.setSpecular(0, 0, 0, 0);
        this.material.setEmission(1, 1, 1, 0.5);
        this.material.setShininess(1);

        // Carregar textura de nuvem
        this.material.loadTexture("images/nuvem.png");
    }

    display() {
        // Blending para opacidades por camada
        this.scene.gl.enable(this.scene.gl.BLEND);
        this.scene.gl.blendFunc(this.scene.gl.SRC_ALPHA, this.scene.gl.ONE_MINUS_SRC_ALPHA);
        this.scene.gl.depthMask(false);

        // Evitar culling para ver sempre a nuvem
        this.scene.gl.disable(this.scene.gl.CULL_FACE);

        for (const cloud of this.clouds) {
            this.scene.pushMatrix();

            // Orbita em torno do eixo Y global
            const angle = (this.scene.currentTime * cloud.speed + cloud.phase) * Math.PI * 2;
            this.scene.rotate(angle, 0, 1, 0);
            this.scene.translate(0, cloud.height, cloud.radius);
            this.scene.scale(cloud.scaleX * 40, cloud.scaleY * 40, 1);
            this.scene.translate(-0.5, -0.5, 0);

            this.material.setEmission(1, 1, 1, cloud.opacity);
            this.material.apply();
            this.quad.display();

            this.scene.popMatrix();
        }

        this.scene.gl.enable(this.scene.gl.CULL_FACE);

        this.scene.gl.depthMask(true);
        this.scene.gl.disable(this.scene.gl.BLEND);
    }
}