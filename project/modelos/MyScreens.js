export class MyScreens {
	constructor(scene) {
		this.scene = scene;
		this.state = "lobby";
		this.spaceWasPressed = false;

		this.root = null;
		this.lobbyPanel = null;
		this.pauseOverlay = null;
		this.gameOverOverlay = null;
		this.gameOverTimer = null;

		this._buildDom();
		this.showLobby();
	}

	_buildDom() {
		const root = document.createElement("div");
		root.style.position = "fixed";
		root.style.inset = "0";
		root.style.zIndex = "80";
		root.style.pointerEvents = "none";
		root.style.fontFamily = 'Georgia, "Times New Roman", serif';
		root.style.color = "#f4ead4";

		const lobbyPanel = document.createElement("div");
		lobbyPanel.style.position = "absolute";
		lobbyPanel.style.right = "28px";
		lobbyPanel.style.top = "50%";
		lobbyPanel.style.transform = "translateY(-50%)";
		lobbyPanel.style.width = "220px";
		lobbyPanel.style.padding = "18px";
		lobbyPanel.style.borderRadius = "18px";
		lobbyPanel.style.background = "linear-gradient(180deg, rgba(24, 21, 16, 0.84), rgba(10, 12, 10, 0.68))";
		lobbyPanel.style.border = "1px solid rgba(255, 255, 255, 0.14)";
		lobbyPanel.style.boxShadow = "0 18px 38px rgba(0, 0, 0, 0.32)";
		lobbyPanel.style.backdropFilter = "blur(6px)";
		lobbyPanel.style.pointerEvents = "auto";

		const startButton = document.createElement("button");
		startButton.type = "button";
		startButton.textContent = "Start";
		startButton.style.display = "block";
		startButton.style.width = "100%";
		startButton.style.padding = "12px 22px";
		startButton.style.border = "none";
		startButton.style.borderRadius = "999px";
		startButton.style.background = "linear-gradient(180deg, #e0b56a, #93612c)";
		startButton.style.color = "#1c1208";
		startButton.style.fontSize = "15px";
		startButton.style.fontWeight = "700";
		startButton.style.letterSpacing = "0.12em";
		startButton.style.textTransform = "uppercase";
		startButton.style.cursor = "pointer";
		startButton.style.boxShadow = "0 10px 24px rgba(0, 0, 0, 0.26)";
		startButton.style.margin = "0";
		startButton.addEventListener("click", () => {
			this.scene.startGame();
		});

		lobbyPanel.appendChild(startButton);

		const pauseOverlay = document.createElement("div");
		pauseOverlay.style.position = "absolute";
		pauseOverlay.style.inset = "0";
		pauseOverlay.style.background = "rgba(8, 10, 8, 0.34)";
		pauseOverlay.style.backdropFilter = "blur(1px)";
		pauseOverlay.style.pointerEvents = "none";
		pauseOverlay.style.display = "none";

		const pausePanel = document.createElement("div");
		pausePanel.style.position = "absolute";
		pausePanel.style.right = "28px";
		pausePanel.style.bottom = "28px";
		pausePanel.style.width = "220px";
		pausePanel.style.padding = "18px";
		pausePanel.style.borderRadius = "18px";
		pausePanel.style.background = "linear-gradient(180deg, rgba(24, 21, 16, 0.88), rgba(10, 12, 10, 0.72))";
		pausePanel.style.border = "1px solid rgba(255, 255, 255, 0.14)";
		pausePanel.style.boxShadow = "0 18px 38px rgba(0, 0, 0, 0.34)";
		pausePanel.style.pointerEvents = "auto";
		pausePanel.style.display = "grid";
		pausePanel.style.gap = "12px";

		const backButton = document.createElement("button");
		backButton.type = "button";
		backButton.textContent = "Back to Lobby";
		backButton.style.padding = "12px 22px";
		backButton.style.border = "none";
		backButton.style.borderRadius = "999px";
		backButton.style.background = "linear-gradient(180deg, #e0b56a, #93612c)";
		backButton.style.color = "#1c1208";
		backButton.style.fontSize = "15px";
		backButton.style.fontWeight = "700";
		backButton.style.letterSpacing = "0.12em";
		backButton.style.textTransform = "uppercase";
		backButton.style.cursor = "pointer";
		backButton.style.boxShadow = "0 10px 24px rgba(0, 0, 0, 0.26)";
		backButton.style.width = "100%";
		backButton.addEventListener("click", () => {
			this.scene.setScreenState("lobby");
		});

		const restartButton = document.createElement("button");
		restartButton.type = "button";
		restartButton.textContent = "Restart";
		restartButton.style.padding = "12px 22px";
		restartButton.style.border = "none";
		restartButton.style.borderRadius = "999px";
		restartButton.style.background = "linear-gradient(180deg, #e0b56a, #93612c)";
		restartButton.style.color = "#1c1208";
		restartButton.style.fontSize = "15px";
		restartButton.style.fontWeight = "700";
		restartButton.style.letterSpacing = "0.12em";
		restartButton.style.textTransform = "uppercase";
		restartButton.style.cursor = "pointer";
		restartButton.style.boxShadow = "0 10px 24px rgba(0, 0, 0, 0.26)";
		restartButton.style.width = "100%";
		restartButton.addEventListener("click", () => {
			this.scene.restartGame();
		});

		pausePanel.appendChild(backButton);
		pausePanel.appendChild(restartButton);
		pauseOverlay.appendChild(pausePanel);

		const gameOverOverlay = document.createElement("div");
		gameOverOverlay.style.position = "absolute";
		gameOverOverlay.style.inset = "0";
		gameOverOverlay.style.display = "none";
		gameOverOverlay.style.alignItems = "center";
		gameOverOverlay.style.justifyContent = "center";
		gameOverOverlay.style.pointerEvents = "none";
		gameOverOverlay.style.background = "rgba(8, 10, 8, 0.24)";
		gameOverOverlay.style.backdropFilter = "blur(1px)";

		const gameOverText = document.createElement("div");
		gameOverText.textContent = "GameOver";
		gameOverText.style.fontSize = "72px";
		gameOverText.style.fontWeight = "800";
		gameOverText.style.letterSpacing = "0.08em";
		gameOverText.style.textTransform = "uppercase";
		gameOverText.style.color = "#f4ead4";
		gameOverText.style.textShadow = "0 8px 24px rgba(0, 0, 0, 0.55)";

		gameOverOverlay.appendChild(gameOverText);

		root.appendChild(lobbyPanel);
		root.appendChild(pauseOverlay);
		root.appendChild(gameOverOverlay);
		document.body.appendChild(root);

		this.root = root;
		this.lobbyPanel = lobbyPanel;
		this.pauseOverlay = pauseOverlay;
		this.pausePanel = pausePanel;
		this.gameOverOverlay = gameOverOverlay;
	}

	_isSpacePressed() {
		return !!(this.scene?.gui && typeof this.scene.gui.isKeyPressed === "function" && this.scene.gui.isKeyPressed("Space"));
	}

	update() {
		const spacePressed = this._isSpacePressed();

		if (spacePressed && !this.spaceWasPressed) {
			if (this.state === "playing") {
				this.scene.pauseGame();
			} else if (this.state === "pause") {
				this.scene.resumeGame();
			}
		}

		this.spaceWasPressed = spacePressed;
	}

	showLobby() {
		this.state = "lobby";
		this.spaceWasPressed = false;
		this.lobbyPanel.style.display = "block";
		this.pauseOverlay.style.display = "none";
		this.gameOverOverlay.style.display = "none";
		this._clearGameOverTimer();
	}

	showPlaying() {
		this.state = "playing";
		this.spaceWasPressed = false;
		this.lobbyPanel.style.display = "none";
		this.pauseOverlay.style.display = "none";
		this.gameOverOverlay.style.display = "none";
		this._clearGameOverTimer();
	}

	showPause() {
		this.state = "pause";
		this.spaceWasPressed = false;
		this.lobbyPanel.style.display = "none";
		this.pauseOverlay.style.display = "block";
		this.gameOverOverlay.style.display = "none";
		this._clearGameOverTimer();
	}

	showGameOver() {
		this.state = "gameover";
		this.spaceWasPressed = false;
		this.lobbyPanel.style.display = "none";
		this.pauseOverlay.style.display = "none";
		this.gameOverOverlay.style.display = "flex";
		this._clearGameOverTimer();
		this.gameOverTimer = window.setTimeout(() => {
			this.gameOverTimer = null;
			this.scene.returnToLobbyAfterGameOver();
		}, 2000);
	}

	_clearGameOverTimer() {
		if (this.gameOverTimer !== null) {
			window.clearTimeout(this.gameOverTimer);
			this.gameOverTimer = null;
		}
	}
}
