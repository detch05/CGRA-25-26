import { CGFobject, CGFappearance } from "../../../lib/CGF.js";
import { MyUnitCube } from "./MyUnitCube.js";
import { MyWheel } from "./MyWheel.js";
import { MySemiArch } from "./MySemiArch.js";

export class MyWagonBack extends CGFobject {
    constructor(scene) {
        super(scene);
        this.wheel = new MyWheel(scene);
        this.cube = new MyUnitCube(scene);
        this.semiarch = new MySemiArch(scene);

        this.steerAngle = 0;
        this.wheelSpin = 0;

        // texture
        this.wagonWood = new CGFappearance(scene);
        this.wagonWood.loadTexture("./images/wagon_wood.jpg");
        this.wagonWood.setTextureWrap("REPEAT", "REPEAT");
        // coverage (cobertura) appearance
        this.coverAppearance = new CGFappearance(scene);
        this.coverAppearance.loadTexture("./images/cobertura.jpg");
        this.coverAppearance.setTextureWrap("REPEAT", "REPEAT");
        // amarração appearance
        this.amarraAppearance = new CGFappearance(scene);
        this.amarraAppearance.loadTexture("./images/couro.jpg");
        this.amarraAppearance.setTextureWrap("REPEAT", "REPEAT");

    }

    setSteerAngle(angle) {
        this.steerAngle = angle;
    }

    setWheelSpin(angle) {
        this.wheelSpin = angle;
    }

    display() {
        // WAGON

        // Base
        this.scene.pushMatrix();
        this.wagonWood.apply();
        this.scene.scale(3, 0.15, 2.25);
        this.cube.display();
        this.scene.popMatrix();

        // Direita
        this.scene.pushMatrix();
        this.wagonWood.apply();
        this.scene.rotate(-Math.PI/2, 1, 0, 0);
        this.scene.scale(3, 0.15, 1.2);    
        this.cube.display();
        this.scene.popMatrix();

        // Esquerda
        this.scene.pushMatrix();
        this.wagonWood.apply();
        this.scene.translate(0, 0, 2.25);
        this.scene.rotate(-Math.PI/2, 1, 0, 0);
        this.scene.scale(3, 0.15, 1.2);    
        this.cube.display();
        this.scene.popMatrix();

        // Trás
        this.scene.pushMatrix();
        this.wagonWood.apply();
        this.scene.rotate(Math.PI/2, 0, 0, 1);
        this.scene.translate(0, 0, -0.15);
        this.scene.scale(1.2, 0.15, 2.4);    
        this.cube.display();
        this.scene.popMatrix();

        // Frente
        this.scene.pushMatrix();
        this.wagonWood.apply();
        this.scene.rotate(Math.PI/2, 0, 0, 1);
        this.scene.translate(0, -3, -0.15);
        this.scene.scale(1.2, 0.15, 2.4);    
        this.cube.display();
        this.scene.popMatrix();

        // suporte rodas
        this.scene.pushMatrix();
        this.wagonWood.apply();
        this.scene.translate(0.3, -0.1, -0.2);
        this.scene.scale(0.1, 0.1, 2.5);
        this.cube.display();
        this.scene.popMatrix();

        this.scene.pushMatrix();
        this.wagonWood.apply();
        this.scene.translate(2.4, -0.1, -0.2);
        this.scene.scale(0.1, 0.1, 2.5);
        this.cube.display();
        this.scene.popMatrix();

        // wheels
        this.scene.pushMatrix();
        this.scene.translate(2.4, -0.1, -0.2);
        this.scene.scale(0.1, 0.1, 2.5);
        this.scene.scale(6, 6, 0.2);
        this.scene.translate(0.1, 0.1, -0.15);
        this.scene.rotate(-this.wheelSpin, 0, 0, 1);
        this.wagonWood.apply();
        this.wheel.display();
        this.scene.popMatrix();
        
        this.scene.pushMatrix();
        this.scene.translate(2.4, -0.1, -0.2);
        this.scene.scale(0.1, 0.1, 2.5);
        this.scene.scale(6, 6, 0.2);
        this.scene.translate(0.1, 0.1, 4.95);
        this.scene.rotate(-this.wheelSpin, 0, 0, 1);
        this.wagonWood.apply();
        this.wheel.display();
        this.scene.popMatrix();
        
        this.scene.pushMatrix();
        this.scene.translate(2.4, -0.1, -0.2);
        this.scene.scale(0.1, 0.1, 2.5);
        this.scene.scale(6, 6, 0.2);
        this.scene.translate(-3.5, 0.1, -0.15);
        this.scene.rotate(this.steerAngle, 0, 1, 0);
        this.scene.rotate(-this.wheelSpin, 0, 0, 1);
        this.wagonWood.apply();
        this.wheel.display();
        this.scene.popMatrix();
        
        this.scene.pushMatrix();
        this.scene.translate(2.4, -0.1, -0.2);
        this.scene.scale(0.1, 0.1, 2.5);
        this.scene.scale(6, 6, 0.2);
        this.scene.translate(-3.5, 0.1, 4.95);
        this.scene.rotate(this.steerAngle, 0, 1, 0);
        this.scene.rotate(-this.wheelSpin, 0, 0, 1);
        this.wagonWood.apply();
        this.wheel.display();
        this.scene.popMatrix();

        // cobertura
        this.scene.pushMatrix();
        this.coverAppearance.apply();
        this.scene.rotate(Math.PI/2, 0, 1, 0);
        this.scene.translate(-1.05, 1, -0.15);
        this.scene.scale(1.19, 2, 15.75);
        this.semiarch.display();
        this.scene.popMatrix();
        
        //suporte de tração
        this.scene.pushMatrix();
        this.wagonWood.apply();
        this.scene.rotate(3*Math.PI/2, 0, 1, 0);
        this.scene.translate(0.4, 0.7, 0);
        this.scene.scale(0.1, 0.1, 2.5);
        this.cube.display();
        this.scene.popMatrix();

        this.scene.pushMatrix();
        this.wagonWood.apply();
        this.scene.rotate(3*Math.PI/2, 0, 1, 0);
        this.scene.translate(1.6, 0.7, 0);
        this.scene.scale(0.1, 0.1, 2.5);
        this.cube.display();
        this.scene.popMatrix();

        this.scene.pushMatrix();
        this.wagonWood.apply();
        this.scene.translate(-0.6, 0.8, 0.4);
        this.scene.scale(0.5, 0.1, 1.3);
        this.cube.display();
        this.scene.popMatrix();

        // amarração
        this.scene.pushMatrix();
        this.amarraAppearance.apply();
        this.scene.rotate(Math.PI/2, 0, 1, 0);
        this.scene.translate(-1.05, 0.7, -2.5);
        this.scene.scale(0.6, 0.55, 2);
        this.semiarch.display();
        this.scene.popMatrix();

        // banco
        this.scene.pushMatrix();
        this.wagonWood.apply();
        this.scene.translate(-0.15, 1.2, 0.4);
        this.scene.scale(0.6, 0.1, 1.3);
        this.cube.display();
        this.scene.popMatrix();

        this.scene.pushMatrix();
        this.wagonWood.apply();
        this.scene.rotate(Math.PI/2, 0, 0, 1);
        this.scene.translate(1.2, -0.5, 0.4);
        this.scene.scale(0.6, 0.1, 1.3);
        this.cube.display();
        this.scene.popMatrix();

        // pes do banco
        this.scene.pushMatrix();
        this.wagonWood.apply();
        this.scene.rotate(Math.PI/2, 1, 0, 0);
        this.scene.translate(0.4, 0.4, -1.2);
        this.scene.scale(0.1, 0.1, 1.2);
        this.cube.display();
        this.scene.popMatrix();

        this.scene.pushMatrix();
        this.wagonWood.apply();
        this.scene.rotate(Math.PI/2, 1, 0, 0);
        this.scene.translate(0.4, 1.6, -1.2);
        this.scene.scale(0.1, 0.1, 1.2);
        this.cube.display();
        this.scene.popMatrix();
    }
}