import {CGFobject} from '../lib/CGF.js';
/**
 * MyQuad
 * @constructor
 * @param {MyScene} scene - Reference to MyScene object
 * @param {Array} coords - Array of texture coordinates (optional)
 */
export class MyQuad extends CGFobject {
	constructor(scene, radius, coords, slices) {
		super(scene);
		this.initBuffers();
		if (coords != undefined)
			this.updateTexCoords(coords);
		if (slices != undefined)
			this.slices = 1;
		if (radius != undefined)
			this.radius = 1;
	}
	
	initBuffers() {

		// começamos com o prisma triangular
		this.vertices = [
			this.radius, 0, 0, 		// cima frente direita
			0, 0, this.radius,		// 
			0, this.radius, 0,		// 

			-this.radius, 0, 0,		// cima frente esquerda
			0, 0, this.radius,		// 
			0, this.radius, 0,		// 

			this.radius, 0, 0, 		// cima tras direita
			0, 0, -this.radius,		//
			0, this.radius, 0,		//

			-this.radius, 0, 0, 	// cima tras esquerda
			0, 0, -this.radius,		//
			0, this.radius, 0,		//
		]

		this.indices = [
			0, 1, 2,				// cima frente direita

			3, 4, 5,				// cima frente esquerda
			
			6, 7, 8,				// cima tras direita
			
			9, 10, 11				// cima tras esquerda
		]

		// sub-dividimos cada face 
		for (var i = 0; )

		this.primitiveType = this.scene.gl.TRIANGLES;
		this.initGLBuffers();
	}

	/**
	 * @method updateTexCoords
	 * Updates the list of texture coordinates of the quad
	 * @param {Array} coords - Array of texture coordinates
	 */
	updateTexCoords(coords) {
		this.texCoords = [...coords];
		this.updateTexCoordsGLBuffers();
	}
}

