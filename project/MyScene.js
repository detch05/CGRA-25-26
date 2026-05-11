import { CGFscene, CGFcamera, CGFaxis } from "../lib/CGF.js";
import { MySky } from "./MySky.js";
import { MySun } from "./MySun.js";
import { MyCloud } from "./MyCloud.js";
//import { MyGround } from "./MyGround.js";

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
        this.displayAxis = true;

        // SKY
        this.sky = new MySky(this);

        // SUN
        this.sun = new MySun(this);

        // CLOUDS
        this.cloud1 = new MyCloud(this, -50, 50, -80);

        this.cloud2 = new MyCloud(this, 40, 55, -100);

        this.cloud3 = new MyCloud(this, 0, 45, -60);

        // GROUND
        //this.ground = new MyGround(this);
    }

    initLights() {

        this.lights[0].setPosition(50, 100, 50, 1);

        this.lights[0].setDiffuse(1.0, 1.0, 1.0, 1.0);

        this.lights[0].enable();

        this.lights[0].update();
    }

    initCameras() {

        this.camera = new CGFcamera(
            0.4,
            0.1,
            500,
            vec3.fromValues(5, 5, 5),
            vec3.fromValues(0, 0, 0)
        );
    }

    display() {

        // Clear buffers
        this.gl.viewport(0, 0, this.gl.canvas.width, this.gl.canvas.height);

        this.gl.clear(this.gl.COLOR_BUFFER_BIT | this.gl.DEPTH_BUFFER_BIT);

        // Camera
        this.updateProjectionMatrix();

        this.loadIdentity();

        this.applyViewMatrix();

        // Axis
        if (this.displayAxis)
            this.axis.display();

        // SKY
        this.sky.display();

        // SUN
        this.sun.display();

        // CLOUDS
        this.cloud1.display();

        this.cloud2.display();

        this.cloud3.display();
    }
}