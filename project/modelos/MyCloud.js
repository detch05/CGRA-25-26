import { CGFappearance } from "../../lib/CGF.js";
import { MyQuad } from "./MyQuad.js";

export class MyCloud {

    constructor(scene) {

        this.scene = scene;

<<<<<<< HEAD
=======
        this.orbitRadius = 80;
        this.height = 50;
        this.size = 40;
        this.rotationSpeed = 0.5;
        this.opacity = 0.5;

>>>>>>> master
        this.quad = new MyQuad(scene);

        // Lista de nuvens
        this.clouds = [

            { radius: 80,  height: 50, size: 40, speed: 1.0 },

            { radius: 120, height: 70, size: 30, speed: 0.7 },

            { radius: 60,  height: 90, size: 25, speed: 1.3 },

            { radius: 150, height: 60, size: 50, speed: 0.5 },

            { radius: 100, height: 85, size: 35, speed: 0.9 },

            { radius: 180, height: 75, size: 45, speed: 0.6 },

            { radius: 140, height: 95, size: 28, speed: 1.1 }
        ];

        // Material da nuvem
        this.material = new CGFappearance(scene);

        this.material.setAmbient(0, 0, 0, 0);

        this.material.setDiffuse(0, 0, 0, 0);

        this.material.setSpecular(0, 0, 0, 0);

        this.material.setEmission(1, 1, 1, 0.5);

        this.material.setShininess(1);

        // Textura
        this.material.loadTexture("images/nuvem.png");
    }

    display() {

        for (let i = 0; i < this.clouds.length; i++) {

<<<<<<< HEAD
            const cloud = this.clouds[i];
=======
        // Orbita em torno do eixo Y global
        const angle = (this.scene.currentTime % 1.0) * Math.PI * 2 * this.rotationSpeed;
        this.scene.rotate(angle, 0, 1, 0);
        this.scene.translate(0, this.height, this.orbitRadius);
        this.scene.scale(this.size*2.5, this.size, 1);
>>>>>>> master

            this.scene.pushMatrix();

            // Movimento orbital
            const angle =
                this.scene.currentTime *
                Math.PI * 2 *
                cloud.speed +
                i;

            this.scene.rotate(angle, 0, 1, 0);

            this.scene.translate(
                0,
                cloud.height,
                cloud.radius
            );

            // Escala da nuvem
            this.scene.scale(
                cloud.size * 2.5,
                cloud.size,
                1
            );

            // Transparência
            this.scene.gl.enable(this.scene.gl.BLEND);

            this.scene.gl.blendFunc(
                this.scene.gl.SRC_ALPHA,
                this.scene.gl.ONE_MINUS_SRC_ALPHA
            );

            this.scene.gl.depthMask(false);

            // Ver dos dois lados
            this.scene.gl.disable(this.scene.gl.CULL_FACE);

            this.material.apply();

            this.quad.display();

            this.scene.gl.enable(this.scene.gl.CULL_FACE);

            this.scene.gl.depthMask(true);

            this.scene.gl.disable(this.scene.gl.BLEND);

            this.scene.popMatrix();
        }
    }
}