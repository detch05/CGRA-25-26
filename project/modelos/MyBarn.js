import { CGFobject, CGFappearance } from "../../lib/CGF.js";
import { MyQuad } from "./shapes/MyQuad.js";
import { MyTriangle } from "./shapes/MyTriangle.js";

export class MyBarn extends CGFobject {
    constructor(scene) {
        super(scene);
        this.Quad = new MyQuad(scene);
        this.Triangle = new MyTriangle(scene);

        this.woodMaterial = new CGFappearance(scene);
        this.woodMaterial.loadTexture("./images/wood.jpg");
        this.woodMaterial.setAmbient(0.45, 0.35, 0.3, 1);
        this.woodMaterial.setDiffuse(0.85, 0.72, 0.6, 1);
        this.woodMaterial.setSpecular(0.25, 0.22, 0.18, 1);
        this.woodMaterial.setShininess(25);

        this.roofMaterial = new CGFappearance(scene);
        this.roofMaterial.loadTexture("./images/darkwood.jpg");
        this.roofMaterial.setTextureWrap('REPEAT','REPEAT');
        this.roofMaterial.setAmbient(0.28, 0.18, 0.12, 1);
        this.roofMaterial.setDiffuse(0.6, 0.4, 0.3, 1);
        this.roofMaterial.setSpecular(0.18, 0.15, 0.12, 1);
        this.roofMaterial.setShininess(40);
        
        // Door material
        this.doorMaterial = new CGFappearance(scene);
        this.doorMaterial.loadTexture("./images/door.jpg");
        this.doorMaterial.setAmbient(0.4, 0.3, 0.25, 1);
        this.doorMaterial.setDiffuse(0.9, 0.9, 0.9, 1);
        this.doorMaterial.setSpecular(0.1, 0.1, 0.1, 1);
        this.doorMaterial.setShininess(10);

        // Window material
        this.windowMaterial = new CGFappearance(scene);
        this.windowMaterial.loadTexture("./images/window.jpg");
        this.windowMaterial.setAmbient(0.28, 0.18, 0.12, 1);
        this.windowMaterial.setDiffuse(0.6, 0.4, 0.3, 1);
        this.windowMaterial.setSpecular(0.18, 0.15, 0.12, 1);
        this.windowMaterial.setShininess(10);
        
    }

    display() {
        this.scene.pushMatrix();
        this.scene.rotate(-Math.PI/2, 0, 1, 0);

        // --------------Ground Floor---------------
        // frente
        this.scene.pushMatrix();
        this.scene.translate(0, 0, 0);
        this.scene.scale(4, 3, 1);
        this.woodMaterial.apply();
        this.Quad.display();
        this.scene.pushMatrix();
        this.scene.translate(0.165, 0, 0.02, 0.01);
        this.scene.scale(0.7, 0.8, 0);
        // set UVs so texture fills the door quad
        this.Quad.updateTexCoords([0,1, 0,0, 1,0, 1,1]);
        this.doorMaterial.apply();
        this.Quad.display();
        this.scene.popMatrix();
        this.scene.popMatrix();

        // tras
        this.scene.pushMatrix();
        this.scene.translate(0, 0, -4);
        this.scene.scale(4, 3, -1);
        this.woodMaterial.apply();
        this.Quad.display();
        //janela
        this.scene.pushMatrix();
        this.scene.translate(0.39, 1.1, 0.01);
        this.scene.scale(0.18, 0.22, 0);
        this.windowMaterial.apply();
        this.Quad.display();
        this.scene.popMatrix();
        this.scene.popMatrix();


        // baixo
        this.scene.pushMatrix();
        this.scene.translate(0, 0, -4);
        this.scene.scale(4, 3, 4);
        this.scene.rotate(Math.PI/2, 1, 0, 0);
        this.woodMaterial.apply();
        this.Quad.display();
        this.scene.popMatrix();

        // esquerda
        this.scene.pushMatrix();
        this.scene.translate(4, 0, 0);
        this.scene.scale(3, 3, 4);
        this.scene.rotate(Math.PI/2, 0, 1, 0);
        this.woodMaterial.apply();
        this.Quad.display();
        this.scene.popMatrix();

        // direita
        this.scene.pushMatrix();
        this.scene.translate(0, 0, -4);
        this.scene.scale(3, 3, 4);
        this.scene.rotate(-Math.PI/2, 0, 1, 0);
        this.woodMaterial.apply();
        this.Quad.display();
        this.scene.popMatrix();

        // -------------------------------


        // --------------Roof----------------

        // frente
        this.scene.pushMatrix();
        this.scene.translate(0, 3, 0);
        this.scene.scale(2, 2, 1);
        this.roofMaterial.apply();
        this.Triangle.display();
        this.scene.popMatrix();
        
        // tras
        this.scene.pushMatrix();
        this.scene.translate(0, 3, -4);
        this.scene.scale(2, 2, -1);
        this.roofMaterial.apply();
        this.Triangle.display();
        this.scene.popMatrix();

        // telhado direita
        this.scene.pushMatrix();
        this.scene.translate(2, 5, 0);
        this.scene.scale(Math.sqrt(8), 3, 4);
        this.scene.rotate(-Math.PI/2, 1, 0, 0);
        this.scene.rotate(Math.atan(0.942), 0, 1, 0);
        this.Quad.updateTexCoords([0,4, 0,0, 4,0, 4,4]);
        this.roofMaterial.apply();
        this.Quad.display();
        this.scene.popMatrix();

        // telhado esquerda
        this.scene.pushMatrix();
        this.scene.translate(2, 5, -4);
        this.scene.scale(Math.sqrt(8), 3, 4);
        this.scene.rotate(Math.PI/2, 1, 0, 0);
        this.scene.rotate(-(Math.atan(1.061) + Math.PI/2), 0, 1, 0);
        // manter mesma repetição no outro lado
        this.Quad.updateTexCoords([0,4, 0,0, 4,0, 4,4]);
        this.roofMaterial.apply();
        this.Quad.display();
        this.scene.popMatrix();

        // restaurar coordenadas de textura padrão para outras quads
        this.Quad.updateTexCoords([0,1, 0,0, 1,0, 1,1]);

        this.scene.popMatrix();

        // ------------------------------- 
    }
    
}