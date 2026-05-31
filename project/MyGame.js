export class MyGame {
	constructor(scene = null) {
		this.scene = scene;
		this.reset();
	}

	reset() {
		this.maxHp = 100;
		this.hp = this.maxHp;

		this.elapsedTime = 0;
		this.currentTime = 0;
		this.timeSpeed = 1;

		this.collectedBales = 0;
		this.hayBales = [];
        this.deliveredBales = 0;
	}

	attachScene(scene) {
		this.scene = scene;
		return this;
	}

	advanceTime(deltaSeconds) {
		if (!Number.isFinite(deltaSeconds) || deltaSeconds < 0) {
			return this.currentTime;
		}

		this.elapsedTime += deltaSeconds;

		const timeIncrement = (deltaSeconds / 240) * this.timeSpeed;
		this.currentTime = (this.currentTime + timeIncrement) % 1;
		if (this.currentTime < 0) {
			this.currentTime += 1;
		}

		return this.currentTime;
	}

	getCurrentTime() {
		return this.currentTime;
	}

	setCurrentTime(value) {
		if (Number.isFinite(value)) {
			this.currentTime = ((value % 1) + 1) % 1;
		}
		return this.currentTime;
	}

	getElapsedTime() {
		return this.elapsedTime;
	}

	setElapsedTime(value) {
		if (Number.isFinite(value) && value >= 0) {
			this.elapsedTime = value;
		}
		return this.elapsedTime;
	}

	addElapsedTime(deltaSeconds) {
		if (Number.isFinite(deltaSeconds) && deltaSeconds >= 0) {
			this.elapsedTime += deltaSeconds;
		}
		return this.elapsedTime;
	}

	getTimeSpeed() {
		return this.timeSpeed;
	}

	setTimeSpeed(value) {
		if (Number.isFinite(value)) {
			this.timeSpeed = Math.max(0, value);
		}
		return this.timeSpeed;
	}

	getHp() {
		return this.hp;
	}

	setHp(value) {
		if (Number.isFinite(value)) {
			this.hp = Math.min(this.maxHp, Math.max(0, value));
		}
		return this.hp;
	}

	damageHp(amount) {
		return this.setHp(this.hp - Math.abs(amount));
	}

	healHp(amount = 10) {
		return this.setHp(this.hp + Math.abs(amount));
	}

	isPlayerDead() {
		return this.hp <= 0;
	}

	getCollectedBales() {
		return this.collectedBales;
	}

	setCollectedBales(value) {
		if (Number.isFinite(value) && value >= 0) {
			this.collectedBales = value;
		}
		return this.collectedBales;
	}

	addCollectedBales(amount = 1) {
		if (Number.isFinite(amount) && amount > 0) {
			this.collectedBales += amount;
		}
		return this.collectedBales;
	}

	registerBaleCollected() {
		return this.addCollectedBales(1);
	}

    getDeliveredBales() {
        return this.deliveredBales;
    }

    setDeliveredBales(value) {
        if (Number.isFinite(value) && value >= 0) {
            this.deliveredBales = value;
        }
        return this.deliveredBales;
    }

    addDeliveredBale() {
        this.deliveredBales += 1;
    }

	getHayBales() {
		return this.hayBales;
	}

	setHayBales(hayBales) {
		this.hayBales = Array.isArray(hayBales) ? hayBales : [];
		return this.hayBales;
	}

	addHayBale(hayBale) {
		if (!hayBale) {
			return null;
		}

		this.hayBales.push(hayBale);
		return hayBale;
	}

	removeHayBale(index) {
		if (!Array.isArray(this.hayBales) || index < 0 || index >= this.hayBales.length) {
			return null;
		}

		return this.hayBales.splice(index, 1)[0] ?? null;
	}
}
