import { CGFappearance, CGFshader } from "../../lib/CGF.js";
import { MySphere } from "./MySphere.js";

export class MySky {

    constructor(scene) {

        this.scene = scene;

        // Half sphere virada para dentro
        this.sphere = new MySphere(scene, 64, 32, true);

        // Material do céu
        this.material = new CGFappearance(scene);

        this.material.setAmbient(1, 1, 1, 1);
        this.material.setDiffuse(1, 1, 1, 1);
        this.material.setSpecular(0, 0, 0, 1);
        this.material.setShininess(5);

        // Gradient shader (day/night)
        this.shader = new CGFshader(this.scene.gl, "shaders/sky.vert", "shaders/sky.frag");
        this.shader.setUniformsValues({
            uTopColor: [0.1, 0.4, 0.9],
            uBottomColor: [0.9, 0.6, 0.3],
            uSunsetColor: [1.0, 0.5, 0.2],
            uSunsetStrength: 0.0
        });
    }

    display() {

        this.scene.pushMatrix();

        // Desabilitar face culling para ver interior
        this.scene.gl.disable(this.scene.gl.CULL_FACE);

        // Dome gigante
        this.scene.scale(600, 600, 600);

        // Update gradient based on time
        const angle = (this.scene.currentTime % 1.0) * Math.PI * 2;
        const dayFactor = (Math.cos(angle) + 1) / 2;
        const sunsetStrength = Math.max(0, 1 - Math.abs(dayFactor - 0.5) * 2);

        const topDay = [0.1, 0.4, 0.9];
        const bottomDay = [0.7, 0.8, 1.0];
        const topNight = [0.02, 0.03, 0.08];
        const bottomNight = [0.05, 0.06, 0.12];

        const topColor = [
            topNight[0] + (topDay[0] - topNight[0]) * dayFactor,
            topNight[1] + (topDay[1] - topNight[1]) * dayFactor,
            topNight[2] + (topDay[2] - topNight[2]) * dayFactor
        ];

        const bottomColor = [
            bottomNight[0] + (bottomDay[0] - bottomNight[0]) * dayFactor,
            bottomNight[1] + (bottomDay[1] - bottomNight[1]) * dayFactor,
            bottomNight[2] + (bottomDay[2] - bottomNight[2]) * dayFactor
        ];

        this.shader.setUniformsValues({
            uTopColor: topColor,
            uBottomColor: bottomColor,
            uSunsetColor: [1.0, 0.45, 0.2],
            uSunsetStrength: sunsetStrength
        });

        this.scene.setActiveShader(this.shader);
        this.material.apply();

        this.sphere.display();

        this.scene.setActiveShader(this.scene.defaultShader);

        this.scene.gl.enable(this.scene.gl.CULL_FACE);

        this.scene.popMatrix();
    }
}