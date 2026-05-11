import {CGFobject} from '../lib/CGF.js';
/**
* MyBranch
* @constructor
* @param scene - Reference to MyScene object
* @param diameter - diameter of the cilinder
*/
export class MyBranch extends CGFobject {
    constructor(scene, radius) {
        super(scene);
        this.slices = 6;
        this.scale = radius;
        this.initBuffers();
    }

    setDefaultAppearance() {
        this.scene.setAmbient(0.6, 0.4, 0.2, 1.0);
        this.scene.setDiffuse(0.6, 0.4, 0.2, 1.0);
        this.scene.setSpecular(0.0, 0.0, 0.0, 1.0);
    }

    initBuffers() {
        this.vertices = [];
        this.indices = [];
        this.normals = [];

        var ang = 0;
        var alphaAng = 2*Math.PI/this.slices;

        for(var i = 0; i <= this.slices; i++){

            this.vertices.push(this.scale * Math.cos(ang), 0, -Math.sin(ang) * this.scale);
            this.vertices.push(this.scale * Math.cos(ang), 1, -Math.sin(ang) * this.scale);
            this.normals.push(Math.cos(ang), 0, -Math.sin(ang));
            this.normals.push(Math.cos(ang), 0, -Math.sin(ang));

            if (i < this.slices){
                this.indices.push(2*i, 2*i+2, 2*i+1);
                this.indices.push(2*i+1, 2*i+2, 2*i+3);
            }
            ang+=alphaAng;
        }


        this.primitiveType = this.scene.gl.TRIANGLES;
        this.initGLBuffers();
    }
}


