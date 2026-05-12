import {CGFobject} from '../../../lib/CGF.js';
/**
 * MyUnitCube
 * @constructor
 * @param scene - Reference to MyScene object
 */
export class MyQuad extends CGFobject {
    constructor(scene) {
        super(scene);
        this.initBuffers();
    }
    
    initBuffers() {
        this.vertices = [
            0, 0, 0,	
            0, 1, 0,    
            1, 1, 0,	
            1, 0, 0,    
        ];

        //Counter-clockwise reference of vertices
        this.indices = [
            0, 2, 3,    
            0, 1, 2,
            0, 3, 2,
            0, 2, 1
        ];

        //The defined indices (and corresponding vertices)
        //will be read in groups of three to draw triangles
        this.primitiveType = this.scene.gl.TRIANGLES;

        this.initGLBuffers();
    }
}