import { CGFobject } from '../lib/CGF.js';
import { MyQuad } from './MyQuad.js';

export class MyUnitCubeQuad extends CGFobject {
    constructor(scene) {
        super(scene);
        this.Quad = new MyQuad(scene);
    }

    display() {

        // frente
        this.scene.pushMatrix();
        this.scene.translate(-1.7, -2, 0);
        this.scene.scale(3.5, 5.5, 1);
        this.Quad.display();
        this.scene.popMatrix();

        // tras
        this.scene.pushMatrix();
        this.scene.translate(-1.7, -2, -1);
        this.scene.scale(3.5, 5.5, 1);
        this.Quad.display();
        this.scene.popMatrix();

        // cima
        this.scene.pushMatrix();
        this.scene.translate(-1.7, 3.5, -1);
        this.scene.scale(3.5, 5.5, 1);
        this.scene.rotate(Math.PI/2, 1, 0, 0);
        this.Quad.display();
        this.scene.popMatrix();

        // baixo
        this.scene.pushMatrix();
        this.scene.translate(-1.7, -2, -1);
        this.scene.scale(3.5, 5.5, 1);
        this.scene.rotate(Math.PI/2, 1, 0, 0);
        this.Quad.display();
        this.scene.popMatrix();

        // esquerda
        this.scene.pushMatrix();
        this.scene.translate(-1.7, -2, 0);
        this.scene.scale(3.5, 5.5, 1);
        this.scene.rotate(Math.PI/2, 0, 1, 0);
        this.Quad.display();
        this.scene.popMatrix();

        // direita
        this.scene.pushMatrix();
        this.scene.translate(1.8, -2, 0);
        this.scene.scale(3.5, 5.5, 1);
        this.scene.rotate(Math.PI/2, 0, 1, 0);
        this.Quad.display();
        this.scene.popMatrix();

    }
}
