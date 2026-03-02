import {CGFobject} from '../lib/CGF.js';
/**
 * MyDiamond
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
            0, 0, 0,	//0
            0, 1, 0,    //1
            1, 1, 0,	//2
            1, 0, 0,    //3
            0, 0, 1,	//4
            0, 1, 1,    //5
            1, 1, 1,	//6
            1, 0, 1,    //7
        ];

        //Counter-clockwise reference of vertices
        this.indices = [
            0, 3, 2,    // tras
            0, 2, 1,    // tras
            4, 7, 6,    // frente
            4, 6, 5,    // frente
            1, 6, 2,    // cima
            1, 5, 6,    // cima
            0, 3, 7,    // baixo
            0, 7, 4,    // baixo
            0, 4, 5,    // esquerda
            0, 5, 1,    // esquerda
            7, 3, 2,    // direita
            7, 2, 6,    // direita
        ];

        //The defined indices (and corresponding vertices)
        //will be read in groups of three to draw triangles
        this.primitiveType = this.scene.gl.TRIANGLES;

        this.initGLBuffers();
    }
}

