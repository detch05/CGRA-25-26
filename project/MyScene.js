import { CGFscene, CGFcamera, CGFaxis } from "../lib/CGF.js";
import { MySky } from "./modelos/MySky.js";
import { MySun } from "./modelos/MySun.js";
import { MyCloud } from "./modelos/MyCloud.js";
import { MyBarn } from "./modelos/MyBarn.js";
import { MyGround } from "./modelos/MyGround.js";
import { MyWagonBack } from "./modelos/shapes/MyWagonBack.js";


/**
 * MyScene
 * @constructor
 */
export class MyScene extends CGFscene {

    constructor() {
        super();
    }

    init(application) {

        super.init(application);

        this.initCameras();
        this.initLights();

        // Background color
        this.gl.clearColor(0.53, 0.81, 0.92, 1.0);

        this.gl.clearDepth(100.0);

        this.gl.enable(this.gl.DEPTH_TEST);
        this.gl.enable(this.gl.CULL_FACE);

        this.gl.depthFunc(this.gl.LEQUAL);

        this.enableTextures(true);

        // Axis
        this.axis = new CGFaxis(this);

        // Interface
        this.currentTime = 0;  // 0 = noon, 0.5 = midnight, 1 = next noon
        this.timeSpeed = 1;    // Time speed multiplier
        this.lastTime = Date.now();
        this.displayAxis = true;

        // SKY
        this.sky = new MySky(this);

        // SUN
        this.sun = new MySun(this);

        // CLOUD LAYER
        this.cloudLayer = new MyCloud(this);

        // GROUND
        this.ground = new MyGround(this);

        // BARN
        this.barn = new MyBarn(this);

        // WAGON
        this.wagon = new MyWagonBack(this);

    }

    initLights() {

        this.lights[0].setPosition(50, 100, 50, 1);

        this.lights[0].setDiffuse(1.0, 1.0, 1.0, 1.0);

        this.lights[0].enable();

        this.lights[0].update();

        // Additional light focused on the barn to improve its illumination
        this.lights[1].setPosition(5, 15, 5, 1);
        this.lights[1].setDiffuse(0.6, 0.6, 0.55, 1.0);
        this.lights[1].setSpecular(0.3, 0.3, 0.28, 1.0);
        this.lights[1].enable();
        this.lights[1].update();

        // Additional light focused on the barn to improve its illumination
        this.lights[1].setPosition(7, 7, -3, 1);
        this.lights[1].setDiffuse(0.6, 0.6, 0.55, 1.0);
        this.lights[1].setSpecular(0.3, 0.3, 0.28, 1.0);
        this.lights[1].enable();
        this.lights[1].update();
    }

    initCameras() {

        this.camera = new CGFcamera(
            0.4,
            0.1,
            2000,
            vec3.fromValues(15, 15, 15),
            vec3.fromValues(0, 0, 0)
        );
    }

    updateLighting() {
        const angle = (this.currentTime % 1.0) * Math.PI * 2;

        // Match sun orbit (rotate around Z, then translate on +Y)
        const sunDist = 560;
        const sunX = -Math.sin(angle) * sunDist;
        const sunY = Math.cos(angle) * sunDist;

        this.lights[0].setPosition(sunX, sunY, 0, 1);

        // Day factor: 1 at noon, 0 at midnight
        const dayFactor = (Math.cos(angle) + 1) / 2;

        const rDay = 1.0;
        const gDay = 0.9;
        const bDay = 0.5;

        const rNight = 0.6;
        const gNight = 0.7;
        const bNight = 1.0;

        const r = rNight + (rDay - rNight) * dayFactor;
        const g = gNight + (gDay - gNight) * dayFactor;
        const b = bNight + (bDay - bNight) * dayFactor;

        const intensity = 0.2 + dayFactor * 0.8;

        this.lights[0].setDiffuse(r * intensity, g * intensity, b * intensity, 1.0);
        this.lights[0].update();
    }
    display() {

        // Clear buffers
        this.gl.viewport(0, 0, this.gl.canvas.width, this.gl.canvas.height);

        this.gl.clear(this.gl.COLOR_BUFFER_BIT | this.gl.DEPTH_BUFFER_BIT);

        // Update timer
        const currentTime = Date.now();
        const deltaTime = (currentTime - this.lastTime) / 1000.0;
        this.lastTime = currentTime;

        const timeIncrement = (deltaTime / 240) * this.timeSpeed;
        this.currentTime = (this.currentTime + timeIncrement);

        this.updateLighting();

        // Camera
        this.updateProjectionMatrix();

        this.loadIdentity();

        this.applyViewMatrix();

        // Axis
        if (this.displayAxis)
            this.axis.display();

        // // SKY
        // this.sky.display();

        // // SUN AND MOON
        // this.sun.display();

        // // CLOUDS
        // this.cloudLayer.display();

        // // BARN
        // this.barn.display();
        
        // WAGON
        this.wagon.display();

    }
}