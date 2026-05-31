import { CGFinterface, dat } from './lib/CGF.js';

export class MyUI extends CGFinterface {
	constructor() {
		super();
		this.hudRoot = null;
		this.damageLayer = null;
		this.hpFill = null;
		this.hpText = null;
		this.balesText = null;
		this.timeText = null;
	}

	init(application) {
		super.init(application);

		this.gui = new dat.GUI();
		this.gui.width = 300;

		this.gui.add(this.scene, 'displayAxis').name('Display Axis');

		const sceneFolder = this.gui.addFolder('Scene Elements');

		sceneFolder.add(this.scene, 'showBarn').name('Barn');
		sceneFolder.add(this.scene, 'showFlowers').name('Flowers');
		sceneFolder.add(this.scene, 'showMountains').name('Mountains');
		sceneFolder.add(this.scene, 'showRocks').name('Rocks');
		sceneFolder.add(this.scene, 'showSunMoon').name('Sun & Moon');
		sceneFolder.add(this.scene, 'showClouds').name('Clouds');
		sceneFolder.add(this.scene, 'showGrass').name('Grass');
		sceneFolder.add(this.scene, 'showHayBales').name('Hay Bales');

		sceneFolder.open();

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

		const damageLayer = document.createElement('div');
		damageLayer.style.position = 'absolute';
		damageLayer.style.inset = '0';
		damageLayer.style.pointerEvents = 'none';
		damageLayer.style.overflow = 'hidden';

		root.appendChild(leftPanel);
		root.appendChild(timePanel);
		root.appendChild(damageLayer);
		document.body.appendChild(root);

		this.hudRoot = root;
		this.damageLayer = damageLayer;
	}

	_projectWorldToScreen(worldX, worldY, worldZ) {
		const scene = this.scene;
		const camera = scene?.camera;
		const canvas = scene?.gl?.canvas;

		if (!camera || !canvas) {
			return null;
		}

		const width = canvas.width;
		const height = canvas.height;

		if (!width || !height) {
			return null;
		}

		const view = camera.getViewMatrix();
		const projection = camera.getProjectionMatrix(width, height);

		const world = vec4.fromValues(worldX, worldY, worldZ, 1);
		const clip = vec4.create();
		vec4.transformMat4(clip, world, view);
		vec4.transformMat4(clip, clip, projection);

		if (Math.abs(clip[3]) < 1e-6) {
			return null;
		}

		const ndcX = clip[0] / clip[3];
		const ndcY = clip[1] / clip[3];
		const ndcZ = clip[2] / clip[3];

		if (ndcZ < -1 || ndcZ > 1) {
			return null;
		}

		return {
			x: (ndcX * 0.5 + 0.5) * width,
			y: (1 - (ndcY * 0.5 + 0.5)) * height
		};
	}

	showDamageOnWagon(damage) {
		if (!this.damageLayer || !this.scene?.wagon) {
			return;
		}

		const value = Math.max(1, Math.floor(Math.abs(damage || 0)));
		const wagon = this.scene.wagon;
		const randomX = (Math.random() - 0.5) * 1.3;
		const randomY = 2.2 + Math.random() * 0.6;
		const randomZ = (Math.random() - 0.5) * 1.0;
		const screenPos = this._projectWorldToScreen(
			wagon.position.x + randomX,
			wagon.position.y + randomY,
			wagon.position.z + randomZ
		);

		if (!screenPos) {
			return;
		}

		const text = document.createElement('div');
		text.textContent = `-${value}`;
		text.style.position = 'absolute';
		text.style.left = `${screenPos.x}px`;
		text.style.top = `${screenPos.y}px`;
		text.style.transform = 'translate(-50%, -50%)';
		text.style.color = '#ffb3b3';
		text.style.fontSize = '34px';
		text.style.fontWeight = '800';
		text.style.letterSpacing = '0.04em';
		text.style.textShadow = '0 0 2px rgba(0,0,0,0.95), 0 3px 12px rgba(0,0,0,0.45)';
		text.style.opacity = '1';
		text.style.willChange = 'transform, opacity';

		this.damageLayer.appendChild(text);

		const driftX = (Math.random() - 0.5) * 34;
		const driftY = 38 + Math.random() * 26;
		const animation = text.animate([
			{ transform: 'translate(-50%, -50%) scale(1)', opacity: 1 },
			{ transform: `translate(calc(-50% + ${driftX}px), calc(-50% - ${driftY}px)) scale(1.06)`, opacity: 100 }
		], {
			duration: 1000,
			easing: 'cubic-bezier(0.22, 1, 0.36, 1)',
			fill: 'forwards'
		});

		animation.onfinish = () => {
			if (text.parentNode) {
				text.parentNode.removeChild(text);
			}
		};
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
		this.balesText.textContent = `Hay Bales Delivered: ${game.getDeliveredBales()}`;
		this.timeText.textContent = this._formatElapsedTime(game.getElapsedTime());
	}
}
