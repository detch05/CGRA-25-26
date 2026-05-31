import { CGFobject, CGFappearance } from "../../lib/CGF.js";
import { MyWagonBack } from "./shapes/MyWagonBack.js";
import { CGFobjModel } from "../../lib/extra/CGFobjModel.js";
import { MyHay } from "./MyHay.js";


export class MyWagon extends CGFobject {
    constructor(scene, x = -6, y = 0, z = 6) {
        super(scene);
        this.WagonBack = new MyWagonBack(scene);
        this.horse = new CGFobjModel(scene, "objects/horse.obj");

        // horse-specific appearance
        this.horseAppearance = new CGFappearance(scene);
        this.horseAppearance.loadTexture("images/horse_diffuse.jpg");
        this.horseAppearance.setAmbient(0.3, 0.3, 0.3, 1);
        this.horseAppearance.setDiffuse(1.0, 1.0, 1.0, 1);
        this.horseAppearance.setSpecular(0.2, 0.2, 0.2, 1);
        this.horseAppearance.setShininess(20);
        this.horseAppearance.setTextureWrap("REPEAT", "REPEAT");

        this.position = { x, y, z };
        this.orientation = 0;
        this.speed = 0;
        this.maxSpeed = 6;
        this.accel = 4;
        this.brake = 7;
        this.drag = 2;
        this.steerAngle = 0;
        this.maxSteer = 0.3;
        this.steerSpeed = 2.5;
        this.wheelBase = 1.4;
        this.wheelRadius = 0.3;
        this.wheelSpin = 0;
        this.rearAxleOffset = { x: -1.25, y: 0.37, z: 0.76 };
        this.groundOffset = 0.4;
        this.lastUpdateTime = 0;
        this.lastDamage = 0;

        this.pickKeyHeld = false;
        this.dropKeyHeld = false;
        this.pickupRadius = 3.0;

        this.collisionRadius = 2.5;
        this.lastCollisionTime = 0;
        this.collisonCooldown = 1000;

        this.carriedHay = [];
        this.maxHay = 2;
        this.haySlots = [
            { x: 1.0, y: 0.2, z: 0.6 },
            { x: 1.8, y: 0.2, z: 1.4 }
        ];
        this.hayScale = 1;
    }

    canCarryHay() {
        return this.carriedHay.length < this.maxHay;
    }

    addHay(hay) {
        if (!this.canCarryHay()) {
            return false;
        }
        this.carriedHay.push(hay);
        return true;
    }

    hasHay() {
        return this.carriedHay.length > 0;
    }

    dropHay() {
        if (!this.carriedHay.length) {
            return null;
        }
        return this.carriedHay.shift();
    }

    isInDropZone() {
        const center = this.scene?.dropZoneCenter;
        const radius = this.scene?.dropZoneRadius;

        if (!center || typeof radius !== "number") {
            return false;
        }

        const dx = this.position.x - center.x;
        const dz = this.position.z - center.z;
        return (dx * dx + dz * dz) <= (radius * radius);
    }

    update(t) {
        if (!this.scene.gui || !this.scene.gui.isKeyPressed) {
            return;
        }
        
        if (!this.lastUpdateTime) {
            this.lastUpdateTime = t;
            return;
        }

        const dt = (t - this.lastUpdateTime) / 1000;
        this.lastUpdateTime = t;

        const forward = this.scene.gui.isKeyPressed("KeyW");
        const brake = this.scene.gui.isKeyPressed("KeyS");
        const left = this.scene.gui.isKeyPressed("KeyA");
        const right = this.scene.gui.isKeyPressed("KeyD");

        if (forward) {
            this.speed = Math.min(this.speed + this.accel * dt, this.maxSpeed);
        }
        if (brake) {
            this.speed = Math.max(this.speed - this.brake * dt, 0);
        }
        if (!forward && !brake) {
            this.speed = Math.max(this.speed - this.drag * dt, 0);
        }

        if (left) {
            this.steerAngle = Math.min(this.steerAngle + this.steerSpeed * dt, this.maxSteer);
        } else if (right) {
            this.steerAngle = Math.max(this.steerAngle - this.steerSpeed * dt, -this.maxSteer);
        } else if (this.steerAngle !== 0) {
            const returnStep = this.steerSpeed * dt;
            if (this.steerAngle > 0) {
                this.steerAngle = Math.max(0, this.steerAngle - returnStep);
            } else {
                this.steerAngle = Math.min(0, this.steerAngle + returnStep);
            }
        }

        const turnRate = (this.speed / this.wheelBase) * Math.tan(this.steerAngle);
        this.orientation += turnRate * dt;

        const dirX = Math.sin(this.orientation);
        const dirZ = Math.cos(this.orientation);
        const distance = this.speed * dt;

        this.position.x += dirX * distance;
        this.position.z += dirZ * distance;

        if (this.wheelRadius > 0) {
            this.wheelSpin -= distance / this.wheelRadius;
        }

        this.WagonBack.setSteerAngle(this.steerAngle);
        this.WagonBack.setWheelSpin(this.wheelSpin);

        if (this.scene.ground && this.scene.ground.getHeightAt) {
            const groundY = this.scene.ground.getHeightAt(this.position.x, this.position.z);
            this.position.y = groundY + this.groundOffset;
        }

        this._handlePickupDrop();
        this._checkRockCollisions();
        this._resolveRockCollisions();
    }

    _resolveRockCollisions() {
        if (!this.scene.rocks || !this.scene.rocks.rocks) return;

        for (const rock of this.scene.rocks.rocks) {
            const dx = this.position.x - rock.x;
            const dz = this.position.z - rock.z;
            const dist = Math.sqrt(dx*dx + dz*dz);
            const rockRadius = Math.max(rock.scaleX, rock.scaleZ);
            const minDist = this.collisionRadius + rockRadius;

            if (dist < minDist && dist > 0.001) {
                // Empurrar a carroça para fora da pedra
                const nx = dx / dist;
                const nz = dz / dist;
                const overlap = minDist - dist;

                this.position.x += nx * overlap;
                this.position.z += nz * overlap;

                // Parar o movimento na direcção da pedra
                const dot = Math.sin(this.orientation) * nx + Math.cos(this.orientation) * nz;
                if (dot > 0) {
                    this.speed *= 0.3;  // reduz velocidade ao colidir
                }
            }
        }
    }

    _handlePickupDrop() {
        if (!this.scene.gui || !this.scene.gui.isKeyPressed) {
            return;
        }

        const pickPressed = this.scene.gui.isKeyPressed("KeyP");
        if (pickPressed && !this.pickKeyHeld) {
            this._tryPickupHay();
        }

        const dropPressed = this.scene.gui.isKeyPressed("KeyL");
        if (dropPressed && !this.dropKeyHeld) {
            this._tryDropHay();
        }

        this.pickKeyHeld = pickPressed;
        this.dropKeyHeld = dropPressed;
    }

    _tryPickupHay() {
        const hayBales = this.scene.hayBales;
        if (!hayBales || !hayBales.length) {
            return;
        }

        if (!this.canCarryHay()) {
            return;
        }

        let closestIndex = -1;
        let closestDist2 = this.pickupRadius * this.pickupRadius;

        for (let i = 0; i < hayBales.length; i++) {
            const hay = hayBales[i];
            const dx = hay.x - this.position.x;
            const dz = hay.z - this.position.z;
            const dist2 = dx * dx + dz * dz;
            if (dist2 <= closestDist2) {
                closestDist2 = dist2;
                closestIndex = i;
            }
        }

        if (closestIndex === -1) {
            return;
        }

        const pickedHay = hayBales.splice(closestIndex, 1)[0];
        if (this.addHay(pickedHay)) {
            this.scene.game?.registerBaleCollected();
            return;
        }

        hayBales.splice(closestIndex, 0, pickedHay);
    }

    _tryDropHay() {
        if (!this.hasHay()) {
            return;
        }

        if (!this.isInDropZone()) {
            return;
        }

        const dropped = this.dropHay();
        if (!dropped) {
            return;
        }

        this.scene.game?.addDeliveredBale();

        const radius = this.scene?.haySpawnRadius ?? 30;
        const [newHay] = MyHay.createBales(this.scene, 1, radius);

        if (newHay) {
            if (!this.scene.hayBales) {
                this.scene.hayBales = [];
            }
            this.scene.hayBales.push(newHay);
        }
    }

    _checkRockCollisions() {

        if (!this.scene.rocks || !this.scene.rocks.rocks)
            return;

        const now = Date.now();

        // evita perder HP continuamente
        if (now - this.lastCollisionTime < this.collisionCooldown)
            return;

        for (const rock of this.scene.rocks.rocks) {

            const dx = this.position.x - rock.x;
            const dz = this.position.z - rock.z;

            const distance = Math.sqrt(dx * dx + dz * dz);

            const rockRadius =
                Math.max(rock.scaleX, rock.scaleZ);

            if (distance < this.collisionRadius + rockRadius) {

                const damage =
                    5 + Math.floor(Math.random() * 11);
                this.lastDamage = damage;
                this.scene.hp =
                    Math.max(0, this.scene.hp - damage);

                this.lastCollisionTime = now;

                console.log(
                    `Collision! Damage: ${damage} HP`
                );
                break;
            }
        }
    }

    display() {
        this.scene.pushMatrix();
        this.scene.translate(this.position.x, this.position.y, this.position.z);
        this.scene.rotate(this.orientation, 0, 1, 0);
        this.scene.scale(0.5, 0.5, 0.5);
        this.scene.rotate(-Math.PI/2, 0, 1, 0);
        this.scene.translate(-this.rearAxleOffset.x, -this.rearAxleOffset.y, -this.rearAxleOffset.z);

        // wagon back
        this.scene.pushMatrix();
        this.scene.translate(0, 0.78, 0);
        this.scene.rotate(Math.PI, 0, 1, 0);
        this.scene.scale(1.1, 1.1, 1.1);
        this.WagonBack.display();
        this.scene.popMatrix();

        if (this.carriedHay.length) {
            const slotCount = Math.min(this.carriedHay.length, this.haySlots.length);
            this.scene.pushMatrix();
            this.scene.translate(0, 0.78, 0);
            this.scene.rotate(Math.PI, 0, 1, 0);
            this.scene.scale(1.1, 1.1, 1.1);
            this.scene.translate(0, 0, -1.05);

            for (let i = 0; i < slotCount; i++) {
                const slot = this.haySlots[i];
                this.scene.pushMatrix();
                this.scene.translate(slot.x, slot.y, slot.z);
                this.scene.scale(this.hayScale, this.hayScale, this.hayScale);
                this.carriedHay[i].displayAt(0, 0, 0);
                this.scene.popMatrix();
            }

            this.scene.popMatrix();
        }

        // horse
        this.scene.pushMatrix();
        this.scene.translate(2.2, 0, 0);
        this.scene.scale(0.12, 0.12, 0.12);

        if (this.steerAngle > 0) {
            this.scene.translate(-2, 0, -6);
            this.scene.rotate(this.steerAngle, 0, 1, 0);
        } else if (this.steerAngle < 0) {
            this.scene.translate(-2, 0, 6);
            this.scene.rotate(this.steerAngle, 0, 1, 0);
        }

        //this.scene.rotate(this.steerAngle, 0, 1, 0);

        this.scene.rotate(Math.PI/2, 0, 1, 0);
        this.horseAppearance.apply();
        this.horse.display();
        this.scene.popMatrix();

        this.scene.popMatrix();
    }
}

