import {CGFobject} from '../../lib/CGF.js';

export class MySemiArch extends CGFobject {
    constructor(scene, slices = 20, stacks = 1, height = 0.2) {
        super(scene);

        this.slices = slices;
        this.stacks = stacks;
        this.height = height;
        
        this.initBuffers();
    }

    initBuffers(){

        this.vertices = [];
        this.indices = [];
        this.normals = [];
        this.texCoords = [];

        let alpha = Math.PI / this.slices;

        for(let j = 0; j <= this.stacks; j++){

            let z = (j / this.stacks) * this.height;

            for(let i = 0; i <= this.slices; i++){

                let ang = i * alpha;

                let x = Math.cos(ang);
                let y = Math.sin(ang);

                this.vertices.push(x,y,z);
                this.normals.push(x,y,0);
                this.texCoords.push(i / this.slices, j / this.stacks);
            }
        }

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

    /**
     * Update texture coordinates to control tiling.
     * repeatU / repeatV specify how many times the texture repeats along each axis.
     */
    updateTexCoords(repeatU = 1, repeatV = 1) {
        this.texCoords = [];
        for (let j = 0; j <= this.stacks; j++) {
            for (let i = 0; i <= this.slices; i++) {
                this.texCoords.push((i / this.slices) * repeatU, (j / this.stacks) * repeatV);
            }
        }
        if (this.updateTexCoordsGLBuffers) this.updateTexCoordsGLBuffers();
    }

    display() {
        this.scene.gl.disable(this.scene.gl.CULL_FACE);
        super.display();
        this.scene.gl.enable(this.scene.gl.CULL_FACE);
    }
}