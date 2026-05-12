import { CGFobject } from "../../lib/CGF.js";
import { MyQuad } from "./shapes/MyQuad.js";
import { MyTriangle } from "./shapes/MyTriangle.js";

export class MyBarn extends CGFobject {
    constructor(scene) {
        super(scene);
        this.Quad = new MyQuad(scene);
        this.Triangle = new MyTriangle(scene);
    }

    display() {
        // --------------Ground Floor---------------
        // frente
        this.scene.pushMatrix();
        this.scene.translate(0, 0, 0);
        this.scene.scale(4, 3, 1);
        this.Quad.display();
        this.scene.popMatrix();

        // tras
        this.scene.pushMatrix();
        this.scene.translate(0, 0, -4);
        this.scene.scale(4, 3, 1);
        this.Quad.display();
        this.scene.popMatrix();

        // baixo
        this.scene.pushMatrix();
        this.scene.translate(0, 0, -4);
        this.scene.scale(4, 3, 4);
        this.scene.rotate(Math.PI/2, 1, 0, 0);
        this.Quad.display();
        this.scene.popMatrix();

        // esquerda
        this.scene.pushMatrix();
        this.scene.translate(4, 0, 0);
        this.scene.scale(3, 3, 4);
        this.scene.rotate(Math.PI/2, 0, 1, 0);
        this.Quad.display();
        this.scene.popMatrix();

        // direita
        this.scene.pushMatrix();
        this.scene.translate(0, 0, 0);
        this.scene.scale(3, 3, 4);
        this.scene.rotate(Math.PI/2, 0, 1, 0);
        this.Quad.display();
        this.scene.popMatrix();

        // -------------------------------


        // --------------Roof----------------

        // frente
        this.scene.pushMatrix();
        this.scene.translate(0, 3, 0);
        this.scene.scale(2, 2, 1);
        this.Triangle.display();
        this.scene.popMatrix();
        
        // tras
        this.scene.pushMatrix();
        this.scene.translate(0, 3, -4);
        this.scene.scale(2, 2, 1);
        this.Triangle.display();
        this.scene.popMatrix();

        // telhado direita
        this.scene.pushMatrix();
        this.scene.translate(2, 5, -4);
        this.scene.scale(Math.sqrt(8), 3, 4);
        this.scene.rotate(Math.PI/2, 1, 0, 0);
        this.scene.rotate(-Math.atan(0.942), 0, 1, 0);
        this.Quad.display();
        this.scene.popMatrix();

        // telhado esquerda
        this.scene.pushMatrix();
        this.scene.translate(2, 5, -4);
        this.scene.scale(Math.sqrt(8), 3, 4);
        this.scene.rotate(Math.PI/2, 1, 0, 0);
        this.scene.rotate(-(Math.atan(1.061) + Math.PI/2), 0, 1, 0);
        this.Quad.display();
        this.scene.popMatrix();

        

        // ------------------------------- 
    }
    
}