import { CGFscene, CGFcamera, CGFaxis, CGFappearance } from "../lib/CGF.js";
import { MyInterface } from "./MyInterface.js";
import { MySky } from "./modelos/MySky.js";
import { MySun } from "./modelos/MySun.js";
import { MyCloud } from "./modelos/MyCloud.js";
import { MyGround } from "./modelos/MyGround.js";
import { MyWagon } from "./modelos/MyWagon.js";
import { MyPath } from "./modelos/MyPath.js";
import { MyRocks } from "./modelos/MyRocks.js";
import { MyMountains } from "./modelos/MyMountains.js";
import { MyFlowers } from "./modelos/MyFlowers.js";
import { MyGrass } from "./modelos/Mygrass.js";
import { MyBarn } from "./modelos/MyBarn.js";
import { MyHay } from "./modelos/MyHay.js";
import { MyCap } from "./modelos/shapes/MyCap.js";


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

        //GROUND
        this.ground = new MyGround(this);
        
        // ROCKS
        this.rocks = new MyRocks(this, this.ground, 80);

        // GRASS
        this.grass = new MyGrass(this, this.ground,this.rocks, 260);

        // FLOWERS
        this.flowers = new MyFlowers(this, this.ground, this.rocks, 280);

        // SKY
        this.sky = new MySky(this);

        // SUN
        this.sun = new MySun(this);

        // CLOUD LAYER
        this.cloudLayer = new MyCloud(this);

        // BARN
        this.barn = new MyBarn(this);

        //MOUNTAIN
        this.mountains = new MyMountains(this, this.ground, 16);

        //PATH
        this.path = new MyPath(this); 
        
        //ROCKS
        this.rocks = new MyRocks(this, this.ground, 80);

        // SKY
        this.sky = new MySky(this);

        // SUN
        this.sun = new MySun(this);

        // CLOUD LAYER
        this.cloudLayer = new MyCloud(this);

        // BARN
        this.barn = new MyBarn(this);
        this.barnPosition = { x: 4.5, y: 0, z: 0 };
        this.barnRotation = -Math.PI / 2;

        this.dropZoneLocalCenter = { x: 2.0, z: 1.2 };
        this.dropZoneRadius = 2.5;
        this.dropZoneCenter = { x: 2.5, z: 2 };

        this.dropZoneMesh = new MyCap(this, 64, 1.0, 0.7, 1);
        this.dropZoneMaterial = this._createDropZoneMaterial();
        
        // BALE
        this.haySpawnRadius = 30;
        this.hayBales = MyHay.createBales(this, 4, this.haySpawnRadius);

        // WAGON
        this.wagon = new MyWagon(this);

        this.setUpdatePeriod(16);
        // -----

    }

    _createDropZoneMaterial() {
        const mat = new CGFappearance(this);
        mat.setAmbient(0.05, 0.25, 0.05, 0.7);
        mat.setDiffuse(0.1, 0.6, 0.1, 0.7);
        mat.setSpecular(0.0, 0.0, 0.0, 0.0);
        mat.setEmission(0.0, 0.4, 0.0, 0.7);
        mat.setShininess(1);
        return mat;
    }

    _barnLocalToWorld(localX, localZ) {
        const cos = Math.cos(this.barnRotation);
        const sin = Math.sin(this.barnRotation);
        return {
            x: this.barnPosition.x + localX * cos + localZ * sin,
            z: this.barnPosition.z - localX * sin + localZ * cos
        };
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

    update(t)
    {
        if (this.wagon && this.wagon.update) {
            this.wagon.update(t);
        }
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

        // GROUND
        if (this.ground) this.ground.display();

        // MOUNTAINS
        if (this.mountains) this.mountains.display();
        // PATH
        if (this.path) this.path.display();

        // ROCKS
        if (this.rocks) this.rocks.display();

        // FLOWERS
        this.flowers.display();

        // GRASS
        this.grass.display();
        // SKY
        if (this.sky) this.sky.display();

        // SUN AND MOON
        if (this.sun) this.sun.display();

        // CLOUDS
        if (this.cloudLayer) this.cloudLayer.display();

        // BARN
        if (this.barn) {
            this.pushMatrix();
            this.translate(this.barnPosition.x, this.barnPosition.y, this.barnPosition.z);
            this.barn.display();
            this.popMatrix();
        }

        if (this.dropZoneMesh && this.dropZoneMaterial) {
            const zoneY = this.ground.getHeightAt(this.dropZoneCenter.x, this.dropZoneCenter.z) + 0.051;
            const inZone = this.wagon ? this.wagon.isInDropZone() : false;

            this.pushMatrix();
            this.translate(this.dropZoneCenter.x, zoneY, this.dropZoneCenter.z);
            this.rotate(-Math.PI / 2, 1, 0, 0);
            this.scale(this.dropZoneRadius, this.dropZoneRadius, this.dropZoneRadius);

            if (inZone) {
                this.dropZoneMaterial.setEmission(0.0, 0.8, 0.0, 0.85);
                this.dropZoneMaterial.setDiffuse(0.2, 0.9, 0.2, 0.85);
            } else {
                this.dropZoneMaterial.setEmission(0.0, 0.4, 0.0, 0.7);
                this.dropZoneMaterial.setDiffuse(0.1, 0.6, 0.1, 0.7);
            }

            this.gl.enable(this.gl.BLEND);
            this.gl.blendFunc(this.gl.SRC_ALPHA, this.gl.ONE_MINUS_SRC_ALPHA);
            this.dropZoneMaterial.apply();
            this.dropZoneMesh.display();
            this.gl.disable(this.gl.BLEND);
            this.popMatrix();
        }

        // WAGON
        if (this.wagon) this.wagon.display();
        
        // HAY BALE
        if (this.hayBales) {
            for (const hay of this.hayBales) {
                hay.display();
            }
        }
    }
}