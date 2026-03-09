import {CGFobject} from '../lib/CGF.js';
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
        ];

        //Counter-clockwise reference of vertices
        this.indices = [
            0, 2, 3,    // tras
            0, 1, 2,    // tras
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

