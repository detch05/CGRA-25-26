/*
 * Copyright (c) 2009 The Chromium Authors. All rights reserved.
 *
 * Redistribution and use in source and binary forms, with or without
 * modification, are permitted provided that the following conditions are
 * met:
 *
 *    * Redistributions of source code must retain the above copyright
 * notice, this list of conditions and the following disclaimer.
 *    * Redistributions in binary form must reproduce the above
 * copyright notice, this list of conditions and the following disclaimer
 * in the documentation and/or other materials provided with the
 * distribution.
 *    * Neither the name of Google Inc. nor the names of its
 * contributors may be used to endorse or promote products derived from
 * this software without specific prior written permission.
 *
 * THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS
 * "AS IS" AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT
 * LIMITED TO, THE IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR
 * A PARTICULAR PURPOSE ARE DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT
 * OWNER OR CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL,
 * SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT
 * LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE,
 * DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY
 * THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT
 * (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE
 * OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
 */
import {CGFobject} from '../lib/CGF.js';
export class Teapot extends CGFobject
{
	constructor(scene) {
		super(scene);
		this.initBuffers();
	}
 
	initBuffers() 
	{ 
		var approximations = 1
		this.vertices = [
			
		]

		this.normals = [] 

		this.texCoords1 = []

		var nverts=this.texCoords1.length / 3;
		this.texCoords=new Array(nverts*2);
		for (var i= 0; i< nverts; i++)
		{
			this.texCoords[i*2]=this.texCoords1[i*3]/2;
			this.texCoords[i*2+1]=-this.texCoords1[i*3+1]/2;
		}
		

		var ntris=this.indicesTris.length / 3;
		this.indicesLines=new Array(ntris*6);
		for (var i= 0; i< ntris; i++)
		{
			this.indicesLines[i*6]=this.indicesTris[i*3];
			this.indicesLines[i*6+1]=this.indicesTris[i*3+1];

			this.indicesLines[i*6+2]=this.indicesTris[i*3+1];
			this.indicesLines[i*6+3]=this.indicesTris[i*3+2];
			
			this.indicesLines[i*6+4]=this.indicesTris[i*3+2];
			this.indicesLines[i*6+5]=this.indicesTris[i*3];
		}


		this.setFillMode();
		
		this.initGLBuffers();
	};

	setFillMode() { 
		this.indices=this.indicesTris;
		this.primitiveType=this.scene.gl.TRIANGLES;
	}

	setLineMode() 
	{ 
		this.indices=this.indicesLines;
		this.primitiveType=this.scene.gl.LINES;
	};
};


