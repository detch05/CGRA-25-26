import { CGFscene, CGFcamera, CGFaxis, CGFappearance, CGFtexture } from "../lib/CGF.js";
import { MySphere } from "./MySphere.js";

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

        //Background color
        this.gl.clearColor(0.0, 0.0, 0.0, 1.0);

        this.gl.clearDepth(100.0);
        this.gl.enable(this.gl.DEPTH_TEST);
        this.gl.enable(this.gl.CULL_FACE);
        this.gl.depthFunc(this.gl.LEQUAL);
        this.enableTextures(true);

        //Initialize scene objects
        this.axis = new CGFaxis(this);
        this.sphere = new MySphere(this, 64, 32, true);

        //------ Textures
        this.skyTexture = new CGFtexture(this, 'images/sky.jpg');

        //------- Material
        this.skyMaterial = new CGFappearance(this);
        this.skyMaterial.setAmbient(1,1,1,1);
        this.skyMaterial.setDiffuse(1,1,1,1);
        this.skyMaterial.setSpecular(0,0,0,1);
        this.skyMaterial.setShininess(10);
        this.skyMaterial.setTexture(this.skyTexture);

        //-------Objects connected to MyInterface
        this.displayAxis = true;
       
      }

    initLights() {
        this.lights[0].setPosition(5, 10, 5, 1);
        this.lights[0].setDiffuse(1.0, 1.0, 1.0, 1.0);
        this.lights[0].enable();
        this.lights[0].update();
    }

    initCameras() {
        this.camera = new CGFcamera(0.4, 0.1, 500, vec3.fromValues(5, 5, 5), vec3.fromValues(0, 0, 0));
    }

    display() {
  
        // ---- BEGIN Background, camera and axis setup
        // Clear image and depth buffer everytime we update the scene
        this.gl.viewport(0, 0, this.gl.canvas.width, this.gl.canvas.height);
        this.gl.clear(this.gl.COLOR_BUFFER_BIT | this.gl.DEPTH_BUFFER_BIT);
        // Initialize Model-View matrix as identity (no transformation
        this.updateProjectionMatrix();
        this.loadIdentity();
        // Apply transformations corresponding to the camera position relative to the origin
        this.applyViewMatrix();

        // Draw axis
        if (this.displayAxis)
            this.axis.display();

        this.pushMatrix();

        this.gl.disable(this.gl.CULL_FACE);

        this.scale(50, 50, 50);

        this.skyMaterial.apply();

        this.sphere.display();

        this.gl.enable(this.gl.CULL_FACE);

        this.popMatrix();
        // ---- BEGIN Primitive drawing section

        

        // Default texture filtering in WebCGF is LINEAR. 
        // Uncomment next line for NEAREST when magnifying, or 
        // add a checkbox in the GUI to alternate in real time
        
        // this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_MAG_FILTER, this.gl.NEAREST);

        
        // ---- END Primitive drawing section
    }
}