import { CGFobject } from "../lib/CGF.js";

export class MySphere extends CGFobject {
    /**
    * @param scene   – a cena CGF
    * @param slices  – número de fatias (divisões em torno de Y)
    * @param stacks  – número de camadas (divisões de polo a polo)
    * @param inside  – se true, inverte winding e normais para ser vista de dentro
    */

    constructor(scene, slices, stacks, inside = false) {
        super(scene);
        this.slices = slices;
        this.stacks = stacks;
        this.inside = inside;
        this.initBuffers();
    }

    initBuffers() {
        this.vertices = [];
        this.normals = [];
        this.texCoords = [];
        this.indices = [];


        //calcular o "ângulo" entre camadas e fatias
        const stackAngleI = Math.PI / this.stacks;
        const sliceAngleI = (2 * Math.PI) / this.slices;

        //Gerar vertices, normais e texCords
        for (let i = 0; i <= this.stacks; i++) {
            const stackAngle = Math.PI / 2 - i * stackAngleI; 
            const xy = Math.cos(stackAngle); 
            const z = Math.sin(stackAngle);  

            for (let j = 0; j <= this.slices; j++) {
                const sliceAngle = j * sliceAngleI; 

                // Posições em XYZ
                const x = xy * Math.cos(sliceAngle);
                const y = z;
                const w = xy * Math.sin(sliceAngle);
                this.vertices.push(x, y, w);

                // Normais (mas caso estejamos inside, devemos invertê-las)
                if (this.inside) this.normals.push(-x, -y, -w);
                else this.normals.push(x, y, w);

                
                // Textura equirectangulaer
                const u = j / this.slices;
                const v = i / this.stacks;       
                this.texCoords.push(u, v);
            }
        }

        // Aqui é para os índices dos triângulos
        for (let i = 0; i < this.stacks; i++) {
            for (let j = 0; j < this.slices; j++) {
                const first = (i * (this.slices + 1)) + j;
                const second = first + this.slices + 1;

                if (!this.inside) {                    
                    this.indices.push(first, second, first + 1);
                    this.indices.push(second, second + 1, first + 1);
                } else {   
                    //Aqui temos que inverter o y e o z, para os triângulos estarem virados pra dentro
                    this.indices.push(first, first + 1, second);
                    this.indices.push(second, first + 1, second + 1);
                }
            }
        }

        this.primitiveType = this.scene.gl.TRIANGLES;
        this.initGLBuffers();
    }
}