import {CGFobject} from '../lib/CGF.js';
/**
 * MyLSystem
 * @constructor
 * @param scene - Reference to MyScene object
 */
export class MyLSystem extends CGFobject {
	constructor(scene) {
        super(scene);
        this.init();
    }

    // inicializa o Sistema L
    init(){
        // copia o axioma da cena para iniciar a sequência de desenvolvimento
        this.axiom = this.scene.axiom;

        // numero de iteracoes
        this.iterations = this.scene.iterations;

        // angulo de rotacao
        this.angle = this.scene.angle * Math.PI / 180.0;

        // escalamento dos elementos dependente do numero de iteracoes
        this.scale = Math.pow(this.scene.scaleFactor, this.iterations-1);
        console.log(this.scale);

        // cria o lexico da gramática
        this.iniGrammar();
    
        // cria as producoes
        this.initProductions();

        // desenvolve a sequencia de desenvolvimento do Sistema L
        this.iterate()
     }

    // Cria o lexico da gramatica
    iniGrammar(){
        this.grammar = []
        this.primitives = []

        // adicionar pares caracter / primitiva
        this.grammar.push("F")
        this.primitives.push(new MyQuad(this.scene, 0.2 * this.scale, this.scale));
    }

    // cria as producoes
    initProductions(){
        // cria dois arrays para as producoes: predecessor -> successor
        this.predecessor = ["X", "F"];
        this.successor = [this.scene.ruleX, this.scene.ruleF];
    }
    // desenvolve o axioma ao longo de uma sequência de desenvolvimento com um determinado número de iterações
    iterate(){
        var i, j, p;
        for (i=0; i < this.iterations; ++i){
            var newString = "";

            // substitui cada um dos caracteres da cadeia de caracteres de acordo com as produções
            for (j=0; j<this.axiom.length; ++j){
                var productions = []

                // verificar as producoes aplicaveis
                for (p=0; p < this.predecessor.length; ++p){
                    if (this.axiom[j] == this.predecessor[p]){
                        // se o predecessor esta na cadeia substitui pelos sucessores
                        productions.push(p);
                    }               
                }

                // aplicar producoes
                if (productions.length == 0){
                    // caso nao se aplique nenhuma producao deixa estar o caracter original
                    newString += this.axiom[j];
                }else if (productions.length == 1) {
                    // caso apenas exista uma producao, aplica-a
                    newString += this.successor[productions[0]];
                } else {
                    // sistema estocastico - varias producoes sao aplicaveis - seleciona aleatoriamente
                    newString += this.successor[productions[Math.floor(Math.random() * productions.length)]];                    
                }
            }

            this.axiom = newString;
        }
    }

    display(){
        var i, j;

        // percorre a cadeia de caracteres
        for (i=0; i<this.axiom.length; ++i){

            // verifica se sao caracteres especiais
            switch(this.axiom[i]){
                case "+":
                    // roda a esquerda
                    this.scene.rotate(this.angle, 0, 0, 1);
                    break;

                case "-":
                    // roda a direita
                    this.scene.rotate(-this.angle, 0, 0, 1);
                    break;

                case "\\":
                    // roda a esquerda
                    this.scene.rotate(-this.angle, 0, 1, 0);
                    break;

                case "/":
                    // roda a esquerda
                    this.scene.rotate(-this.angle, 0, 1, 0);
                    break;

                case "^":
                    // roda a esquerda
                    this.scene.rotate(-this.angle, 1, 0, 0);
                    break;

                case "&":
                    // roda a esquerda
                    this.scene.rotate(-this.angle, 1, 0, 0);
                    break;

                case "[":
                    // push
                    this.scene.pushMatrix();
                    break;

                case "]":
                    // pop
                    this.scene.popMatrix();
                    break;

                // percorre o lexico da gramatica para procurar primitivas
                default:
                    for (j=0; j < this.grammar.length; ++j){
                        if (this.axiom[i] == this.grammar[j]){
                            this.scene.pushMatrix();
                            this.scene.scale(this.scale, this.scale, this.scale);
                            this.primitives[j].setDefaultAppearance();
                            this.primitives[j].display();
                            this.scene.popMatrix();
                            this.scene.translate(0, this.scale, 0);
                            break;
                        }
                    }
                    break;
            }
        }
    }
}