import { CGFcamera } from "../../lib/CGF.js";

/**
 * MyCameras
 * Gerencia duas câmaras de acompanhamento:
 * - câmara normal
 * - câmara de distância
 * A tecla V ativa a câmara de distância enquanto estiver pressionada.
 */
export class MyCameras {
    constructor(scene) {
        this.scene = scene;

        // Câmaras (inicializadas com posições padrão)
        this.normalCamera = new CGFcamera(0.4, 0.1, 2000, vec3.fromValues(0, 6, 0), vec3.fromValues(0, 1.5, 0));
        this.distanceCamera = new CGFcamera(0.4, 0.1, 2000, vec3.fromValues(0, 10, 0), vec3.fromValues(0, 1.5, 0));

        // Config da câmara normal
        this.normalConfig = {
            distance: 8,
            height: 2.5,
            yaw: 0,
            pitch: -0.3,
            minPitch: -Math.PI / 2 + 0.01,
            maxPitch: Math.PI / 2 - 0.01,
            mouseSpeed: 0.003
        };

        // Config da câmara de distância
        this.distanceConfig = {
            distance: 24,
            height: 7,
            yaw: 0,
            pitch: -0.25,
            minPitch: -Math.PI / 2 + 0.01,
            maxPitch: Math.PI / 2 - 0.01,
            mouseSpeed: 0.003
        };

        this.activeCameraIndex = 0;
        this._prevV = false;
        this.normalState = {
            lastWagonPosition: null,
            lastWagonOrientation: null
        };
        this.distanceState = {
            lastWagonPosition: null,
            lastWagonOrientation: null
        };
    }

    update() {
        const gui = this.scene.gui;

        const vPressed = gui && typeof gui.isKeyPressed === 'function' ? gui.isKeyPressed('KeyV') : false;
        this.activeCameraIndex = vPressed ? 1 : 0;
        this._prevV = vPressed;

        if (gui && typeof gui.setActiveCamera === 'function') {
            gui.setActiveCamera(this.getActiveCamera());
        }

        this._updateThirdPersonCamera(this.normalCamera, this.normalConfig, this.normalState);
        this._updateThirdPersonCamera(this.distanceCamera, this.distanceConfig, this.distanceState);

        // Aplicar câmara ativa na cena
        this.scene.camera = this.getActiveCamera();
    }

    _updateThirdPersonCamera(camera, config, state) {
        if (!this.scene.wagon) return;

        const wagon = this.scene.wagon;
        const wp = wagon.position;
        const currentWagonPosition = { x: wp.x, y: wp.y, z: wp.z };
        const currentWagonOrientation = wagon.orientation;

        if (!state.lastWagonPosition) {
            const behindAngle = wagon.orientation + Math.PI;
            const x = wp.x + Math.sin(behindAngle) * config.distance;
            const y = wp.y + config.height;
            const z = wp.z + Math.cos(behindAngle) * config.distance;

            camera.setPosition(vec3.fromValues(x, y, z));
            camera.setTarget(vec3.fromValues(wp.x, wp.y + 1.5, wp.z));
            state.lastWagonPosition = currentWagonPosition;
            state.lastWagonOrientation = currentWagonOrientation;
            return;
        }

        const dx = wp.x - state.lastWagonPosition.x;
        const dy = wp.y - state.lastWagonPosition.y;
        const dz = wp.z - state.lastWagonPosition.z;
        const rotationDelta = currentWagonOrientation - state.lastWagonOrientation;

        if (dx !== 0 || dy !== 0 || dz !== 0 || rotationDelta !== 0) {
            const previousWagonPosition = vec3.fromValues(state.lastWagonPosition.x, state.lastWagonPosition.y, state.lastWagonPosition.z);
            const positionOffset = vec3.subtract(vec3.create(), vec3.clone(camera.position), previousWagonPosition);
            const targetOffset = vec3.subtract(vec3.create(), vec3.clone(camera.target), previousWagonPosition);

            if (rotationDelta !== 0) {
                vec3.transformMat4(positionOffset, positionOffset, mat4.rotateY(mat4.create(), mat4.create(), rotationDelta));
                vec3.transformMat4(targetOffset, targetOffset, mat4.rotateY(mat4.create(), mat4.create(), rotationDelta));
            }

            const currentWagonPosVec = vec3.fromValues(wp.x, wp.y, wp.z);
            camera.setPosition(vec3.add(vec3.create(), currentWagonPosVec, positionOffset));
            camera.setTarget(vec3.add(vec3.create(), currentWagonPosVec, targetOffset));
        }

        state.lastWagonPosition = currentWagonPosition;
        state.lastWagonOrientation = currentWagonOrientation;
    }

    getActiveCamera() {
        return this.activeCameraIndex === 0 ? this.normalCamera : this.distanceCamera;
    }

    resetThirdPersonView() {
        if (!this.scene.wagon) {
            return;
        }

        const wagon = this.scene.wagon;
        const wp = wagon.position;
        const behindAngle = wagon.orientation + Math.PI;
        const x = wp.x + Math.sin(behindAngle) * this.normalConfig.distance;
        const y = wp.y + this.normalConfig.height;
        const z = wp.z + Math.cos(behindAngle) * this.normalConfig.distance;

        this.normalCamera.setPosition(vec3.fromValues(x, y, z));
        this.normalCamera.setTarget(vec3.fromValues(wp.x, wp.y + 1.5, wp.z));

        const dx = wp.x + Math.sin(behindAngle) * this.distanceConfig.distance;
        const dy = wp.y + this.distanceConfig.height;
        const dz = wp.z + Math.cos(behindAngle) * this.distanceConfig.distance;

        this.distanceCamera.setPosition(vec3.fromValues(dx, dy, dz));
        this.distanceCamera.setTarget(vec3.fromValues(wp.x, wp.y + 1.5, wp.z));

        const currentState = { lastWagonPosition: { x: wp.x, y: wp.y, z: wp.z }, lastWagonOrientation: wagon.orientation };
        this.normalState = { ...currentState };
        this.distanceState = { ...currentState };

        if (this.scene.gui && typeof this.scene.gui.setActiveCamera === 'function') {
            this.scene.gui.setActiveCamera(this.getActiveCamera());
        }

        this.scene.camera = this.getActiveCamera();
    }

    isFreeCameraMode() {
        return false;
    }

    reset() {
        this.normalState = {
            lastWagonPosition: null,
            lastWagonOrientation: null
        };
        this.distanceState = {
            lastWagonPosition: null,
            lastWagonOrientation: null
        };
    }

}
