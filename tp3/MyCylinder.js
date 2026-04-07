import {CGFobject} from '../lib/CGF.js';
/**
 * MyCylinder
 * @constructor
 * @param scene - Reference to MyScene object
 */

export class MyCylinder extends CGFobject {

    constructor(scene, slices, stacks){
        super(scene);

        this.slices = slices;
        this.stacks = stacks;

        this.initBuffers();
    }

    initBuffers(){

        this.vertices = [];
        this.indices = [];
        this.normals = [];

        let alpha = 2*Math.PI / this.slices;

        // vertices + normals
        for(let j = 0; j <= this.stacks; j++){

            let z = j / this.stacks;

            for(let i = 0; i <= this.slices; i++){

                let ang = i * alpha;

                let x = Math.cos(ang);
                let y = Math.sin(ang);

                this.vertices.push(x,y,z);

                this.normals.push(x,y,0);
            }
        }

        // indices
        for(let j = 0; j < this.stacks; j++){

            for(let i = 0; i < this.slices; i++){

                let a = j*(this.slices+1) + i;
                let b = a + this.slices + 1;

                this.indices.push(a, a+1, b);
                this.indices.push(a+1, b+1, b);
            }
        }

        this.primitiveType = this.scene.gl.TRIANGLES;
        this.initGLBuffers();
    }
}