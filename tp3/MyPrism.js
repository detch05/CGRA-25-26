import {CGFobject} from '../lib/CGF.js';
/**
 * MyPrism
 * @constructor
 * @param scene - Reference to MyScene object
 */
export class MyPrism extends CGFobject {
    constructor(scene, slices, stacks) {
        super(scene);
        this.slices = slices;
        this.stacks = stacks;
        this.initBuffers();
        this.initNormalVizBuffers();
    }
    
    initBuffers() {
        this.vertices = [];
        this.indices = [];
        this.normals = [];

        let alpha = 2*Math.PI / this.slices;
        let stackHeight = 1 / this.stacks;

        for(let i = 0; i < this.slices; i++){

            let ang = i*alpha;
            let angNext = (i+1)*alpha;

            let x1 = Math.cos(ang);
            let y1 = Math.sin(ang);

            let x2 = Math.cos(angNext);
            let y2 = Math.sin(angNext);

            // normal da face
            let nx = Math.cos(ang + alpha/2);
            let ny = Math.sin(ang + alpha/2);

            for(let j = 0;  j < this.stacks; j++){
                let z1 = j * stackHeight;
                let z2 = (j+1) * stackHeight;

                let base = this.vertices.length/3;

                // vertices
                this.vertices.push(x1, y1, z1);
                this.vertices.push(x2, y2, z1);
                this.vertices.push(x1, y1, z2);
                this.vertices.push(x2, y2, z2);

                // indices
                this.indices.push(base, base+1, base+2);
                this.indices.push(base+1, base+3, base+2);

                // normals
                for(let k=0; k < 4; k++){
                    this.normals.push(nx,ny,0);
                }
            }
        }

        // Add base vertices and normals
        let centerBottom = this.vertices.length / 3;
        this.vertices.push(0, 0, 0);
        this.normals.push(0, 0, -1);

        let centerTop = this.vertices.length / 3;
        this.vertices.push(0, 0, 1);
        this.normals.push(0, 0, 1);

        // Add base indices
        for(let i = 0; i < this.slices; i++){
            let baseBottom = i * this.stacks * 4;
            let v1Bottom = baseBottom;
            let v2Bottom = baseBottom + 1;

            this.indices.push(centerBottom, v2Bottom, v1Bottom);

            let baseTop = (i * this.stacks + this.stacks - 1) * 4;
            let v1Top = baseTop + 2;
            let v2Top = baseTop + 3;

            this.indices.push(centerTop, v1Top, v2Top);
        }

        this.primitiveType = this.scene.gl.TRIANGLES;
        this.initGLBuffers();
    }

    updateBuffers(complexity) {
        this.slices = 3 + Math.round(9 * complexity); //complexity varies 0-1, so slices varies 3-12

        // reinitialize buffers
        this.initBuffers();
        this.initNormalVizBuffers();
    }
}
