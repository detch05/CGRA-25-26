import {CGFobject} from '../lib/CGF.js';

/**
* MyLeaf
* @constructor
* @param scene - MyLeaf reference
* @param scale - scale of the leaf

*/

export class MyLeaf extends CGFobject {
	constructor(scene, scale) {
		super(scene);
		this.scale = scale;
		this.initBuffers();
	}

	setDefaultAppearance() {
        this.scene.setAmbient(0.3, 0.8, 0.3, 1.0);
        this.scene.setDiffuse(0.3, 0.8, 0.3, 1.0);
		this.scene.setSpecular(1.0, 1.0, 1.0, 1.0);
		this.scene.setShininess(10.0);
  }

	initBuffers() {
		var i;

		this.vertices = [
			0, 0, 0, 
			0.5, 0.35, 0,
			0, 1, 0,
			-0.5, 0.35, 0
		];

		this.indices = [];
		this.normals = [];
		for (i=0; i<this.vertices.length/3; ++i){
			this.vertices[i] = this.vertices[i] * this.scale;
			this.indices.push(i);
			this.normals.push(0, 0, 1);
		}

	   this.primitiveType = this.scene.gl.TRIANGLE_FAN;
	   this.initGLBuffers();
	}
}



/*
Essa classe deve definir na função initBuffers os 8 vértices do cubo,
e a conectividade entre eles de forma a formar os triângulos que constituem as faces
quadradas do cubo. Recomenda-se que sejam inseridos comentários identificando os
vértices e as faces que estão a ser definidas.

Cubo centrado na origem e de aresta unitária, ou
seja , com coordenadas entre (-0.5, -0.5, -0.5) e (0.5, 0.5, 0.5), construído com uma única
malha de triângulos.

Ordem da escolha dos indices tem de ser no sentido da mao direita!! sentido anti-horario

*/ 