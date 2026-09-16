import { CGFobject } from "../lib/CGF.js";

/**
 * MyGrassBlade
 *
 * Lâmina de erva de baixo polígono — triângulo estreito e alongado
 * com ligeira curvatura. Reutilizada muitas vezes nos patches.
 */
export class MyGrassBlade extends CGFobject {

    constructor(scene) {
        super(scene);
        this.initBuffers();
    }

    initBuffers() {
        // Lâmina: base larga, afunila até à ponta
        // 3 segmentos em altura para a animação de vento ficar suave
        this.vertices = [
            -0.08, 0.00, 0,   // 0 base esquerda
             0.08, 0.00, 0,   // 1 base direita
            -0.05, 0.33, 0,   // 2 meio esquerda
             0.05, 0.33, 0,   // 3 meio direita
            -0.02, 0.66, 0,   // 4 cima esquerda
             0.02, 0.66, 0,   // 5 cima direita
             0.00, 1.00, 0,   // 6 ponta
        ];

        this.normals = [
            0,0,1, 0,0,1, 0,0,1, 0,0,1,
            0,0,1, 0,0,1, 0,0,1,
        ];

        this.texCoords = [
            0,1, 1,1,
            0.1,0.66, 0.9,0.66,
            0.2,0.33, 0.8,0.33,
            0.5,0,
        ];

        this.indices = [
            0,1,2,  1,3,2,
            2,3,4,  3,5,4,
            4,5,6,
        ];

        this.primitiveType = this.scene.gl.TRIANGLES;
        this.initGLBuffers();
    }
}