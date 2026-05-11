import { MyLSystem } from "./MyLSystem.js";
import { MyBranch } from "./MyBranch.js";
import { MyLeaf } from "./MyLeaf.js";

/**
 * MyLSPlant
 * @constructor
 * @param scene - Reference to MyScene object
 */
export class MyLSPlant extends MyLSystem {
	constructor(scene) {
        super(scene);
    }

    // Cria o lexico da gramatica
    iniGrammar(){
        this.grammar = []
        this.primitives = []

        // adicionar pares caracter / primitiva
        this.grammar.push("F")
        this.primitives.push(new MyBranch(this.scene, 0.25));
        this.grammar.push("X")
        this.primitives.push(new MyLeaf(this.scene, 3));
    }

    // cria as producoes
    initProductions(){
        // cria dois arrays para as producoes: predecessor -> successor
        this.predecessor = ["F", "X", "X", "X", "X", "X", "X", "X", "X", "X"];
        this.successor = ["FF", "F[-X][X]F[-X]+X", "F[-X][x]+X", "F[+X]-X", "F[/X][X]F[\\X]+X", "F[\\X][x]/X", "F[/X]\\X", "F[^X][X]F[&X]^X", "F[^X]&X", "F[&X]^X"];
    }
}