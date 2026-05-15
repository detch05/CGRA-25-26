import { CGFappearance } from "../../lib/CGF.js";
import { MyQuad } from "./MyQuad.js";

export class MyCloud {

    constructor(scene) {

        this.scene = scene;

        this.orbitRadius = 80;
        this.height = 50;
        this.size = 40;
        this.rotationSpeed = 1.0;
        this.opacity = 0.5;

        this.quad = new MyQuad(scene);

        // Material base para nuvem
        this.material = new CGFappearance(scene);

        this.material.setAmbient(0, 0, 0, 0);
        this.material.setDiffuse(0, 0, 0, 0);
        this.material.setSpecular(0, 0, 0, 0);
        this.material.setEmission(1, 1, 1, this.opacity);
        this.material.setShininess(1);

        // Carregar textura de nuvem
        this.material.loadTexture("images/nuvem.png");
    }

    display() {

        this.scene.pushMatrix();

        // Orbita em torno do eixo Y global
        const angle = this.scene.currentTime * Math.PI * 2 * this.rotationSpeed;
        this.scene.rotate(angle, 0, 1, 0);
        this.scene.translate(0, this.height, this.orbitRadius);
        this.scene.scale(this.size*2.5, this.size, 1);

        // Blending para opacidades por camada
        this.scene.gl.enable(this.scene.gl.BLEND);
        this.scene.gl.blendFunc(this.scene.gl.SRC_ALPHA, this.scene.gl.ONE_MINUS_SRC_ALPHA);
        this.scene.gl.depthMask(false);

        // Evitar culling para ver sempre a nuvem
        this.scene.gl.disable(this.scene.gl.CULL_FACE);

        this.material.apply();
        this.quad.display();

        this.scene.gl.enable(this.scene.gl.CULL_FACE);

        this.scene.gl.depthMask(true);
        this.scene.gl.disable(this.scene.gl.BLEND);

        this.scene.popMatrix();
    }
}