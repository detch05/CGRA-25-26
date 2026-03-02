import { CGFscene, CGFcamera, CGFaxis } from "../lib/CGF.js";
import { MyDiamond } from "./MyDiamond.js";
import { MyTriangle } from "./MyTriangle.js";
import { MyParallelogram } from "./MyParallelogram.js";

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

    //Initialize scene objects
    this.axis = new CGFaxis(this);
    this.diamond = new MyDiamond(this);
    this.triangle = new MyTriangle(this);
    this.parallelogram = new MyParallelogram(this);

    //Objects connected to MyInterface
    this.displayAxis = true;
    this.displayDiamond = true;
    this.displayTriangle = true;
    this.displayParallelogram = true;

    /* this.scaleFactor = 1;
    this.translateFactorX = 0;
    this.translateFactorY = 0;
    this.translateFactorZ = 0;
    this.rotateAngle = 0; */
  }
  initLights() {
    this.lights[0].setPosition(15, 2, 5, 1);
    this.lights[0].setDiffuse(1.0, 1.0, 1.0, 1.0);
    this.lights[0].enable();
    this.lights[0].update();
  }
  initCameras() {
    this.camera = new CGFcamera(
      0.4,
      0.1,
      500,
      vec3.fromValues(15, 15, 15),
      vec3.fromValues(0, 0, 0)
    );
  }
  setDefaultAppearance() {
    this.setAmbient(0.2, 0.4, 0.8, 1.0);
    this.setDiffuse(0.2, 0.4, 0.8, 1.0);
    this.setSpecular(0.2, 0.4, 0.8, 1.0);
    this.setShininess(10.0);
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
    if (this.displayAxis) this.axis.display();

    this.setDefaultAppearance();

    // Transformations
    var s = 1.0 / Math.sqrt(2);
    var scale = [
      s,   0.0, 0.0, 0.0,
      0.0, s,   0.0, 0.0,
      0.0, 0.0, 1.0, 0.0,
      0.0, 0.0, 0.0, 1.0
    ];

    var translate = [
      1.0, 0.0, 0.0, 0.0,
      0.0, 1.0, 0.0, 0.0,
      0.0, 0.0, 1.0, 0.0,
      0.5, 0.0, 0.0, 1.0
    ]

    var rotate = [
      Math.cos(Math.PI/4), Math.sin(Math.PI/4), 0.0, 0.0,
      -Math.sin(Math.PI/4), Math.cos(Math.PI/4), 0.0, 0.0,
      0.0, 0.0, 1.0, 0.0,
      0.0, 0.0, 0.0, 1.0
    ]
    

    // ---- BEGIN Primitive drawing section
    // green square
    this.pushMatrix();
    this.multMatrix(translate);
    this.multMatrix(rotate);
    this.multMatrix(scale);

    this.setAmbient(0.0, 1.0, 0.0, 1.0);   // R, G, B, A
    this.setDiffuse(0.0, 1.0, 0.0, 1.0);
    this.setSpecular(0.0, 1.0, 0.0, 1.0);

    this.diamond.display();
    this.popMatrix();

    // pink triangle
    this.pushMatrix();
    this.translate(0, -1, 0);

    this.setAmbient (227/255, 61/255, 148/255, 1.0);   // R, G, B, A
    this.setDiffuse (227/255, 61/255, 148/255, 1.0);
    this.setSpecular(227/255, 61/255, 148/255, 1.0);

    this.triangle.display();
    this.popMatrix();

    // red triangle
    this.pushMatrix();
    this.translate(0, 1.7, 0);
    this.scale(-0.7, -0.7 ,0);

    this.setAmbient(1.0, 0.0, 0.0, 1.0);   // R, G, B, A
    this.setDiffuse(1.0, 0.0, 0.0, 1.0);
    this.setSpecular(1.0, 0.0, 0.0, 1.0);

    this.triangle.display();
    this.popMatrix();

    // blue triangle
    this.pushMatrix();
    this.translate(0, 1.7+Math.sqrt(2), 0);
    this.rotate(Math.PI*3/4, 0, 0, 1);

    this.setAmbient (0.0, 0.0, 1.0, 1.0);   // R, G, B, A
    this.setDiffuse (0.0, 0.0, 1.0, 1.0);
    this.setSpecular(0.0, 0.0, 1.0, 1.0);

    this.triangle.display();
    this.popMatrix();

    // orange triangle
    this.pushMatrix();
    this.translate(0, 1.7+Math.sqrt(2), 0);
    this.rotate(Math.PI*5/4, 0, 0, 1);

    this.setAmbient (1.0, 165.0/255, 0.0, 1.0);   // R, G, B, A
    this.setDiffuse (1.0, 165.0/255, 0.0, 1.0);
    this.setSpecular(1.0, 165.0/255, 0.0, 1.0);

    this.triangle.display();
    this.popMatrix();

    // purple triangle
    this.pushMatrix();
    this.translate(-0.7, -1, 0);
    this.scale(-0.7, -0.7 ,0);

    this.setAmbient (0.5, 0.0, 0.5, 1.0);   // R, G, B, A
    this.setDiffuse (0.5, 0.0, 0.5, 1.0);
    this.setSpecular(0.5, 0.0, 0.5, 1.0);

    this.triangle.display();
    this.popMatrix();

    // yellow parallelogram
    this.pushMatrix();
    this.translate(0, -1.7, 0)
    this.scale(0.7, -0.7, 0);

    this.setAmbient(1.0, 1.0, 0.0, 1.0);   // R, G, B, A
    this.setDiffuse(1.0, 1.0, 0.0, 1.0);
    this.setSpecular(1.0, 1.0, 0.0, 1.0);

    this.parallelogram.display();
    this.popMatrix();

    // ---- END Primitive drawing section
  }
}