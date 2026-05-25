import {CGFobject} from '../../../lib/CGF.js';
/**
 * MyUnitCube
 * @constructor
 * @param scene - Reference to MyScene object
 */
export class MyUnitCube extends CGFobject {
    constructor(scene) {
        super(scene);
        this.initBuffers();
    }
    
    initBuffers() {
        this.vertices = [
            0, 0, 0,	// 0 - back  bottom left
            0, 1, 0,    // 1 - back  top    left
            1, 1, 0,	// 2 - back  top    right
            1, 0, 0,    // 3 - back  bottom right

            0, 0, 1,	// 4 - front bottom left
            0, 1, 1,    // 5 - front top    left
            1, 1, 1,	// 6 - front top    right
            1, 0, 1,    // 7 - front bottom right

            0, 1, 0,    // 8 - top   back   left
            0, 1, 1,    // 9 - top   front  left
            1, 1, 1,    // 10- top   front  right
            1, 1, 0,    // 11- top   back   right

            0, 0, 0,    // 12- bottom
            1, 0, 0,    // 13- bottom
            0, 0, 1,    // 14- bottom
            1, 0, 1,    // 15- bottom

            0, 0, 0,    // 16- left
            0, 1, 0,    // 17- left
            0, 0, 1,    // 18- left
            0, 1, 1,    // 19- left

            1, 1, 0,  // 20- right
            1, 0, 0,  // 21- right
            1, 1, 1,  // 22- right
            1, 0, 1,  // 23- right
        ];

        //Counter-clockwise reference of vertices
        this.indices = [
            0, 2, 3,    // tras
            0, 1, 2,    // tras

            4, 7, 6,    // frente
            4, 6, 5,    // frente

            8, 10, 11,  // cima
            8, 9, 10,   // cima

            12, 13, 15, // baixo
            12, 15, 14, // baixo

            16, 18, 19, // esquerda
            16, 19, 17, // esquerda

            20, 22, 23, // direita
            20, 23, 21, // direita
        ];

        this.normals = [
            0,0,-1,  // back
            0,0,-1,
            0,0,-1,
            0,0,-1,

            0,0,1,  // front
            0,0,1,
            0,0,1,
            0,0,1,

            0,1,0,  // top
            0,1,0,
            0,1,0,
            0,1,0,

            0,-1,0, // bottom
            0,-1,0,
            0,-1,0,
            0,-1,0,

            -1,0,0, // left
            -1,0,0,
            -1,0,0,
            -1,0,0,

            1,0,0,  // right
            1,0,0,
            1,0,0,
            1,0,0
            
        ];

        this.texCoords = [
            0, 1, 0, 0, 1, 0, 1, 1, // back
            0, 1, 0, 0, 1, 0, 1, 1, // front
            0, 1, 0, 0, 1, 0, 1, 1, // top
            0, 1, 0, 0, 1, 0, 1, 1, // bottom
            0, 1, 0, 0, 1, 0, 1, 1, // left
            0, 1, 0, 0, 1, 0, 1, 1  // right
        ];

        // this.normals = [];
        // for (var i = 0; i < this.vertices.length; i ++) {
        //     if (this.vertices[i] === 1) this.normals.push(1);
        //     else this.normals.push(-1);
        // }

        //The defined indices (and corresponding vertices)
        //will be read in groups of three to draw triangles
        this.primitiveType = this.scene.gl.TRIANGLES;

        this.initGLBuffers();
    }
}

