import { CGFinterface, dat } from '../lib/CGF.js';

export class MyUI extends CGFinterface {
	constructor() {
		super();
		this.hudRoot = null;
		this.hpFill = null;
		this.hpText = null;
		this.balesText = null;
		this.timeText = null;
	}

	init(application) {
		super.init(application);

		this.gui = new dat.GUI();
		this.gui.add(this.scene, 'displayAxis').name('Display Axis');
		this.gui.add(this.scene, 'timeSpeed', 0, 20)
			.step(0.1)
			.name('Time Speed');

		this.initKeys();
		this._createHud();
		this.updateHud();

		return true;
	}

	initKeys() {
		this.scene.gui = this;
		this.activeKeys = {};
		this.processKeyboard = function () {};
	}

	processKeyDown(event) {
		this.activeKeys[event.code] = true;
	}

	processKeyUp(event) {
		this.activeKeys[event.code] = false;
	}

	processMouseDown(event) {
		super.processMouseDown(event);
	}

	processMouseMove(event) {
		super.processMouseMove(event);
	}

	processMouseUp(event) {
		super.processMouseUp(event);
	}

	isKeyPressed(keyCode) {
		return this.activeKeys[keyCode] || false;
	}

	update() {
		this.updateHud();
	}

	_createHud() {
		const root = document.createElement('div');
		root.style.position = 'fixed';
		root.style.inset = '0';
		root.style.pointerEvents = 'none';
		root.style.zIndex = '50';
		root.style.fontFamily = 'Georgia, "Times New Roman", serif';
		root.style.color = '#f5efe1';

		const leftPanel = document.createElement('div');
		leftPanel.style.position = 'absolute';
		leftPanel.style.left = '24px';
		leftPanel.style.top = '20px';
		leftPanel.style.minWidth = '240px';
		leftPanel.style.padding = '14px 16px 12px';
		leftPanel.style.borderRadius = '16px';
		leftPanel.style.background = 'linear-gradient(180deg, rgba(20, 24, 18, 0.82), rgba(10, 12, 10, 0.62))';
		leftPanel.style.border = '1px solid rgba(255, 255, 255, 0.14)';
		leftPanel.style.boxShadow = '0 10px 30px rgba(0, 0, 0, 0.25)';
		leftPanel.style.backdropFilter = 'blur(6px)';

		const hpLabel = document.createElement('div');
		hpLabel.textContent = 'HP';
		hpLabel.style.fontSize = '13px';
		hpLabel.style.letterSpacing = '0.18em';
		hpLabel.style.textTransform = 'uppercase';
		hpLabel.style.marginBottom = '8px';

		const hpTrack = document.createElement('div');
		hpTrack.style.position = 'relative';
		hpTrack.style.height = '18px';
		hpTrack.style.borderRadius = '999px';
		hpTrack.style.overflow = 'hidden';
		hpTrack.style.background = 'rgba(255, 255, 255, 0.14)';

		this.hpFill = document.createElement('div');
		this.hpFill.style.height = '100%';
		this.hpFill.style.width = '100%';
		this.hpFill.style.borderRadius = '999px';
		this.hpFill.style.background = 'linear-gradient(90deg, #6ddc6d, #d8e86f 65%, #ff9d52)';
		this.hpFill.style.transition = 'width 0.2s ease';

		this.hpText = document.createElement('div');
		this.hpText.style.marginTop = '8px';
		this.hpText.style.fontSize = '14px';
		this.hpText.style.letterSpacing = '0.04em';

		hpTrack.appendChild(this.hpFill);
		leftPanel.appendChild(hpLabel);
		leftPanel.appendChild(hpTrack);
		leftPanel.appendChild(this.hpText);

		this.balesText = document.createElement('div');
		this.balesText.style.marginTop = '12px';
		this.balesText.style.fontSize = '16px';
		this.balesText.style.fontWeight = '700';

		leftPanel.appendChild(this.balesText);

		const timePanel = document.createElement('div');
		timePanel.style.position = 'absolute';
		timePanel.style.left = '50%';
		timePanel.style.top = '18px';
		timePanel.style.transform = 'translateX(-50%)';
		timePanel.style.padding = '12px 20px';
		timePanel.style.borderRadius = '999px';
		timePanel.style.background = 'rgba(16, 18, 28, 0.72)';
		timePanel.style.border = '1px solid rgba(255, 255, 255, 0.14)';
		timePanel.style.boxShadow = '0 10px 30px rgba(0, 0, 0, 0.22)';
		timePanel.style.backdropFilter = 'blur(6px)';
		timePanel.style.fontSize = '18px';
		timePanel.style.fontWeight = '700';
		timePanel.style.letterSpacing = '0.08em';
		timePanel.style.textTransform = 'uppercase';

		this.timeText = document.createElement('span');
		this.timeText.textContent = '00:00';
		timePanel.appendChild(this.timeText);

		root.appendChild(leftPanel);
		root.appendChild(timePanel);
		document.body.appendChild(root);

		this.hudRoot = root;
	}

	_formatElapsedTime(seconds) {
		const totalSeconds = Math.max(0, Math.floor(seconds || 0));
		const minutes = Math.floor(totalSeconds / 60);
		const remainingSeconds = totalSeconds % 60;
		return `${String(minutes).padStart(2, '0')}:${String(remainingSeconds).padStart(2, '0')}`;
	}

	updateHud() {
		if (!this.scene || !this.scene.game || !this.hpFill || !this.hpText || !this.balesText || !this.timeText) {
			return;
		}

		const game = this.scene.game;
		const maxHp = game.maxHp || 1;
		const hp = Math.max(0, Math.min(game.getHp(), maxHp));
		const hpPercent = (hp / maxHp) * 100;

		this.hpFill.style.width = `${hpPercent}%`;
		this.hpText.textContent = `${hp} / ${maxHp}`;
		this.balesText.textContent = `Hay Bales entregues: ${game.getDeliveredBales()}`;
		this.timeText.textContent = this._formatElapsedTime(game.getElapsedTime());
	}
}
