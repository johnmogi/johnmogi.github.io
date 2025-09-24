// Enhanced Play Mode System with comprehensive initialization
togglePlayMode() {
    if (!this.hero) {
        this.showToast('Generate a hero first!', 'warning');
        return;
    }

    if (!this.currentDungeon) {
        this.showToast('Generate a dungeon first!', 'warning');
        return;
    }

    this.playMode = !this.playMode;

    const centerPanelContainer = document.getElementById('centerPanelContainer');
    const gameplayScreen = document.getElementById('gameplayScreen');

    if (this.playMode) {
        // Enter play mode
        this.enterPlayMode();
    } else {
        // Exit play mode
        this.exitPlayMode();
    }
}

enterPlayMode() {
    const centerPanelContainer = document.getElementById('centerPanelContainer');
    const gameplayScreen = document.getElementById('gameplayScreen');

    // Hide main interface
    centerPanelContainer.style.display = 'none';
    
    // Show gameplay screen
    gameplayScreen.classList.remove('hidden');
    gameplayScreen.classList.add('flex');

    // Initialize all gameplay components
    this.initializeGameplay();
    
    this.showToast('Entered Play Mode! í¾®', 'success');
    this.addStoryEntry('Started dungeon adventure', 'success');
}

initializeGameplay() {
    // Reset all gameplay state
    this.resetGameplayState();
    
    // Initialize gameplay UI
    this.initializeGameplayUI();
    
    // Set up player
    this.initializePlayer();
    
    // Initialize dungeon
    this.initializeDungeon();
    
    // Initialize combat system
    this.initializeCombatSystem();
    
    // Initialize inventory system
    this.initializeInventorySystem();
    
    // Start adventure
    this.startAdventure();
}

resetGameplayState() {
    this.playerPosition = { x: 0, y: 0 };
    this.gameHP = this.hero ? this.hero.hp : 100;
    this.gameLevel = this.hero ? this.hero.level : 1;
    this.gameInventory = [];
    this.gameGold = 100;
    this.revealedTiles = new Set();
    this.encounterInProgress = false;
    this.experience = 0;
    this.currentEncounter = null;
    this.monster = null;
}

initializeGameplayUI() {
    // Ensure all UI elements are properly set up
    this.createGameplayUI();
    this.updateGameUI();
    this.updatePlayerPosition();
    this.setupGameplayControls();
}

createGameplayUI() {
    const gameplayScreen = document.getElementById('gameplayScreen');
    if (!gameplayScreen) return;

    // Create player sprite if it doesn't exist
    let playerSprite = document.getElementById('playerSprite');
    if (!playerSprite) {
        playerSprite = document.createElement('div');
        playerSprite.id = 'playerSprite';
        playerSprite.className = 'absolute w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-white font-bold';
        playerSprite.innerHTML = 'í·™';
        gameplayScreen.appendChild(playerSprite);
    }

    // Create combat log if it doesn't exist
    let combatLog = document.getElementById('combatLog');
    if (!combatLog) {
        combatLog = document.createElement('div');
        combatLog.id = 'combatLog';
        combatLog.className = 'bg-black bg-opacity-75 p-2 rounded max-h-32 overflow-y-auto text-xs';
        gameplayScreen.appendChild(combatLog);
    }
}

initializePlayer() {
    // Set player at dungeon entrance
    this.playerPosition = { x: 0, y: 0 };
    this.revealTile(0, 0);
    this.addCombatLog('You stand at the dungeon entrance, ready for adventure!');
}

initializeDungeon() {
    // Ensure dungeon is properly set up
    if (!this.currentDungeon) {
        this.generateDungeon();
        return;
    }

    // Reset dungeon encounters
    for (let y = 0; y < this.dungeonSize; y++) {
        for (let x = 0; x < this.dungeonSize; x++) {
            const room = this.currentDungeon[y][x];
            if (room && room.encounter) {
                room.encounter.resolved = false;
            }
        }
    }
}

initializeCombatSystem() {
    // Set up combat-related variables
    this.encounterInProgress = false;
    this.currentEncounter = null;
    this.monster = null;
}

initializeInventorySystem() {
    // Initialize with starting items
    this.gameInventory = [
        { name: 'Health Potion', type: 'healing', description: 'Restores 30 HP' },
        { name: 'Torch', type: 'utility', description: 'Provides light in dark areas' }
    ];
}

setupGameplayControls() {
    // Ensure all control buttons are properly bound
    this.bindGameplayControls();
}

bindGameplayControls() {
    // Movement controls
    document.getElementById('moveUp')?.addEventListener('click', () => this.movePlayer('up'));
    document.getElementById('moveDown')?.addEventListener('click', () => this.movePlayer('down'));
    document.getElementById('moveLeft')?.addEventListener('click', () => this.movePlayer('left'));
    document.getElementById('moveRight')?.addEventListener('click', () => this.movePlayer('right'));
    
    // Action controls
    document.getElementById('interactBtn')?.addEventListener('click', () => this.interactWithRoom());
    document.getElementById('searchBtn')?.addEventListener('click', () => this.searchRoom());
    document.getElementById('restBtn')?.addEventListener('click', () => this.restInGame());
    document.getElementById('inventoryBtn')?.addEventListener('click', () => this.showInventory());
    
    // Combat controls
    document.getElementById('encounterAttack')?.addEventListener('click', () => this.performCombat());
    document.getElementById('encounterFlee')?.addEventListener('click', () => this.attemptFlee());
    document.getElementById('encounterUseItem')?.addEventListener('click', () => this.useItemInCombat());
    document.getElementById('closeEncounterModal')?.addEventListener('click', () => this.closeEncounterModal());
}

startAdventure() {
    // Start the adventure with initial setup
    this.updateGameUI();
    this.updatePlayerPosition();
    this.addCombatLog('Adventure begins! Explore the dungeon and face its challenges!');
    this.showToast('Good luck, adventurer! í½€', 'success');
}

exitPlayMode() {
    this.playMode = false;
    const gameplayScreen = document.getElementById('gameplayScreen');
    const centerPanelContainer = document.getElementById('centerPanelContainer');

    gameplayScreen.classList.add('hidden');
    gameplayScreen.classList.remove('flex');
    centerPanelContainer.style.display = 'flex';
    this.showToast('Exited Play Mode', 'info');
}
