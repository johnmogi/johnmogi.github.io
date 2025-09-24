// Dungeon Master - Enhanced RPG Game Generator
class DungeonGame {
    constructor() {
        this.hero = null;
        this.monster = null;
        this.dungeonSize = 5;
        this.roomCount = 6;
        this.gameData = this.loadGameData();
        this.playMode = false;
        this.playerPosition = { x: 0, y: 0 };
        this.currentDungeon = null;
        this.gameHP = 100;
        this.gameLevel = 1;
        this.gameInventory = [];
        this.gameGold = 100;
        this.revealedTiles = new Set();
        this.encounterInProgress = false;
        this.experience = 0;
        this.init();
    }

    init() {
        this.showToast('Welcome to Dungeon Master! Ì∞â', 'success');
        this.bindEvents();
        this.setupMobileMenu();
        this.initializeGlobalAccess();
    }

    showToast(message, type = 'info') {
        const toastContainer = document.getElementById('toastContainer');
        if (!toastContainer) return;

        const toast = document.createElement('div');
        const colors = {
            success: 'bg-green-500',
            error: 'bg-red-500',
            warning: 'bg-yellow-500',
            info: 'bg-blue-500'
        };

        toast.className = `${colors[type]} text-white px-4 py-2 rounded-lg shadow-lg transform translate-x-full transition-transform duration-300`;
        toast.innerHTML = `
            <div class="flex items-center">
                <span>${message}</span>
                <button onclick="this.parentElement.parentElement.remove()" class="ml-3 text-white hover:text-gray-200">
                    <i class="fas fa-times"></i>
                </button>
            </div>
        `;

        toastContainer.appendChild(toast);

        // Animate in
        setTimeout(() => {
            toast.style.transform = 'translateX(0)';
        }, 100);

        // Auto remove
        setTimeout(() => {
            toast.style.transform = 'translateX(100%)';
            setTimeout(() => toast.remove(), 300);
        }, 3000);
    }

    addStoryEntry(message, type = 'info') {
        const storyContent = document.getElementById('storyContent');
        if (!storyContent) return;

        const entry = document.createElement('div');
        entry.className = `story-entry ${type}`;
        entry.innerHTML = `<small>${new Date().toLocaleTimeString()}</small><br>${message}`;

        storyContent.appendChild(entry);
        storyContent.scrollTop = storyContent.scrollHeight;
    }

    getRandomItem(array) {
        return array[Math.floor(Math.random() * array.length)];
    }

    getRandomItems(array, count) {
        const shuffled = [...array].sort(() => 0.5 - Math.random());
        return shuffled.slice(0, count);
    }

    bindEvents() {
        // Dice rolling
        document.querySelectorAll('.diceBtn').forEach(btn => {
            btn.addEventListener('click', (e) => this.rollDice(e.target.dataset.sides));
        });

        // Hero generation
        document.getElementById('generateHeroBtn')?.addEventListener('click', () => this.generateHero());

        // Monster generation
        document.getElementById('generateMonsterBtn')?.addEventListener('click', () => this.generateMonster());

        // Dungeon generation
        document.getElementById('dungeonSize')?.addEventListener('change', (e) => {
            this.dungeonSize = parseInt(e.target.value);
        });

        document.getElementById('roomCount')?.addEventListener('input', (e) => {
            this.roomCount = parseInt(e.target.value);
            document.getElementById('roomCountDisplay').textContent = this.roomCount;
        });

        document.getElementById('generateDungeonBtn')?.addEventListener('click', () => this.generateDungeon());

        // Combat
        document.getElementById('startCombatBtn')?.addEventListener('click', () => this.startCombat());

        // Story generation
        document.getElementById('generateStoryBtn')?.addEventListener('click', () => this.generateStory());

        // Dice roller
        document.getElementById('rollDiceBtn')?.addEventListener('click', () => this.openDiceModal());

        // Play mode toggle
        document.getElementById('togglePlayModeBtn')?.addEventListener('click', () => this.togglePlayMode());

        // Exit play mode
        document.getElementById('exitPlayModeBtn')?.addEventListener('click', () => this.exitPlayMode());
        document.getElementById('moveUp')?.addEventListener('click', () => this.movePlayer('up'));
        document.getElementById('moveDown')?.addEventListener('click', () => this.movePlayer('down'));
        document.getElementById('moveLeft')?.addEventListener('click', () => this.movePlayer('left'));
        document.getElementById('moveRight')?.addEventListener('click', () => this.movePlayer('right'));
        document.getElementById('interactBtn')?.addEventListener('click', () => this.interactWithRoom());
        document.getElementById('searchBtn')?.addEventListener('click', () => this.searchRoom());
        document.getElementById('restBtn')?.addEventListener('click', () => this.restInGame());
        document.getElementById('inventoryBtn')?.addEventListener('click', () => this.showInventory());

        // Encounter actions
        document.getElementById('encounterAttack')?.addEventListener('click', () => this.performCombat());
        document.getElementById('encounterFlee')?.addEventListener('click', () => this.attemptFlee());
        document.getElementById('encounterUseItem')?.addEventListener('click', () => this.useItemInCombat());
        document.getElementById('closeEncounterModal')?.addEventListener('click', () => this.closeEncounterModal());

        // Other buttons
        document.getElementById('generateStoryBtn')?.addEventListener('click', () => this.generateStory());
        document.getElementById('rollDiceBtn')?.addEventListener('click', () => this.openDiceModal());
        document.getElementById('startCombatBtn')?.addEventListener('click', () => this.startCombat());
    }

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
        
        this.showToast('Entered Play Mode! ÌæÆ', 'success');
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
            playerSprite.innerHTML = 'Ì∑ô';
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
        this.showToast('Good luck, adventurer! ÌΩÄ', 'success');
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

    // Enhanced Combat System
    performCombat() {
        if (!this.currentEncounter || !this.hero) return;

        // Generate monster if not already present
        if (!this.monster) {
            this.generateMonsterForEncounter();
        }

        const heroDamage = Math.floor(Math.random() * 20) + this.hero.stats.str;
        const monsterDamage = Math.floor(Math.random() * 15) + this.monster.level * 2;

        // Apply damage
        this.monster.hp -= heroDamage;
        this.gameHP -= monsterDamage;
        this.gameHP = Math.max(0, this.gameHP);

        // Log combat
        this.addCombatLog(`${this.hero.name} attacks ${this.monster.name} for ${heroDamage} damage!`);
        this.addCombatLog(`${this.monster.name} retaliates for ${monsterDamage} damage!`);

        // Update UI
        this.updateGameUI();
        this.displayMonster(this.monster);

        // Check combat results
        if (this.gameHP <= 0) {
            this.addCombatLog(`${this.hero.name} has fallen! Ì≤Ä`);
            this.showToast('You have been defeated!', 'error');
            this.exitPlayMode();
        } else if (this.monster.hp <= 0) {
            this.addCombatLog(`${this.monster.name} defeated! Ìæâ`);
            this.showToast(`${this.monster.name} defeated!`, 'success');
            this.resolveEncounter();
            this.gainExperience(this.monster.level * 50);
            this.collectMonsterLoot();
        } else {
            this.addCombatLog(`Combat continues! You have ${this.gameHP} HP remaining.`);
        }
    }

    generateMonsterForEncounter() {
        const name = this.getRandomItem(this.gameData.monsterNames);
        const type = this.getRandomItem(this.gameData.monsterTypes);
        
        this.monster = {
            name,
            type,
            level: Math.floor(Math.random() * 10) + this.gameLevel,
            hp: Math.floor(Math.random() * 50) + 30 + (this.gameLevel * 10),
            maxHp: Math.floor(Math.random() * 50) + 30 + (this.gameLevel * 10),
            abilities: this.getRandomItems(this.gameData.abilities, 2),
            loot: this.generateMonsterLoot()
        };

        this.addCombatLog(`A wild ${this.monster.name} appears!`);
        this.displayMonster(this.monster);
    }

    generateMonsterLoot() {
        const loot = [];
        const lootChance = Math.random();
        
        if (lootChance < 0.3) { // 30% chance for gold
            loot.push({ type: 'gold', amount: Math.floor(Math.random() * 20) + 10 });
        }
        
        if (lootChance < 0.2) { // 20% chance for item
            const items = ['Health Potion', 'Mana Potion', 'Strength Potion', 'Defense Potion'];
            loot.push({ type: 'item', name: items[Math.floor(Math.random() * items.length)] });
        }
        
        return loot;
    }

    collectMonsterLoot() {
        if (!this.monster || !this.monster.loot) return;
        
        this.monster.loot.forEach(item => {
            if (item.type === 'gold') {
                this.gameGold += item.amount;
                this.addCombatLog(`Gained ${item.amount} gold!`);
            } else if (item.type === 'item') {
                this.gameInventory.push({ name: item.name, type: 'consumable' });
                this.addCombatLog(`Found ${item.name}!`);
            }
        });
        
        this.showToast('Loot collected!', 'success');
    }

    gainExperience(amount) {
        this.experience += amount;
        const oldLevel = this.gameLevel;
        this.gameLevel = Math.floor(this.experience / 200) + 1;
        
        if (this.gameLevel > oldLevel) {
            this.showToast(`Level up! You are now level ${this.gameLevel}!`, 'success');
            this.gameHP = 100; // Full heal on level up
            this.updateGameUI();
        }
        
        this.addCombatLog(`Gained ${amount} experience points!`);
    }

    // Enhanced item usage
    useItemInCombat() {
        if (this.gameInventory.length === 0) {
            this.addCombatLog('No items available!');
            return;
        }

        // Show item selection interface
        this.showItemSelection();
    }

    showItemSelection() {
        const modal = document.getElementById('encounterModal');
        const title = document.getElementById('encounterTitle');
        const content = document.getElementById('encounterContent');

        title.textContent = 'Use Item';
        content.innerHTML = `
            <p class="mb-2">Choose an item to use:</p>
            <div class="space-y-2">
                ${this.gameInventory.map((item, index) => 
                    `<button onclick="window.dungeonGame.useItemByIndex(${index})" 
                            class="w-full text-left p-2 bg-gray-700 hover:bg-gray-600 rounded">
                        ${item.name} - ${item.description || 'No description'}
                    </button>`
                ).join('')}
            </div>
            <button onclick="window.dungeonGame.closeEncounterModal()" 
                    class="mt-4 w-full p-2 bg-red-600 hover:bg-red-700 rounded">
                Cancel
            </button>
        `;

        modal.classList.remove('hidden');
        modal.classList.add('flex');
    }

    useItemByIndex(index) {
        if (index < 0 || index >= this.gameInventory.length) return;

        const item = this.gameInventory[index];
        this.gameInventory.splice(index, 1);

        switch (item.type) {
            case 'healing':
                const healAmount = 30;
                this.gameHP = Math.min(100, this.gameHP + healAmount);
                this.updateGameUI();
                this.addCombatLog(`Used ${item.name} and healed ${healAmount} HP!`);
                this.showToast(`Healed ${healAmount} HP!`, 'success');
                break;
            case 'utility':
                this.addCombatLog(`Used ${item.name} in combat!`);
                break;
            default:
                this.addCombatLog(`Used ${item.name} - effect unknown.`);
        }

        this.closeEncounterModal();
    }

    // Enhanced flee system
    attemptFlee() {
        const fleeChance = 0.6 + (this.hero.stats.dex - 10) * 0.05; // Base 60% + 5% per DEX above 10
        const success = Math.random() < fleeChance;

        if (success) {
            this.addCombatLog(`Successfully fled from combat! (Flee chance: ${Math.round(fleeChance * 100)}%)`);
            this.showToast('Escaped successfully!', 'success');
            this.resolveEncounter();
        } else {
            this.addCombatLog(`Failed to flee! (Flee chance: ${Math.round(fleeChance * 100)}%)`);
            // Enemy gets a free attack
            const enemyDamage = Math.floor(Math.random() * 10) + 5;
            this.gameHP -= enemyDamage;
            this.gameHP = Math.max(0, this.gameHP);
            this.updateGameUI();
            this.addCombatLog(`Took ${enemyDamage} damage while fleeing!`);
            
            if (this.gameHP <= 0) {
                this.addCombatLog(`${this.hero.name} has fallen while fleeing!`);
                this.showToast('You have been defeated!', 'error');
                this.exitPlayMode();
            }
        }
    }

    resolveEncounter() {
        this.encounterInProgress = false;
        this.currentEncounter = null;

        const modal = document.getElementById('encounterModal');
        modal.classList.add('hidden');
        modal.classList.remove('flex');

        // Mark encounter as resolved
        if (this.currentDungeon[this.playerPosition.y][this.playerPosition.x].encounter) {
            this.currentDungeon[this.playerPosition.y][this.playerPosition.x].encounter.resolved = true;
        }

        this.addCombatLog('Encounter resolved!');
    }

    // Enhanced inventory display
    showInventory() {
        if (this.gameInventory.length === 0) {
            this.addCombatLog('Inventory is empty.');
            return;
        }

        const inventoryList = this.gameInventory.map((item, index) => 
            `${index + 1}. ${item.name} - ${item.description || 'No description'}`
        ).join('\n');
        
        this.addCombatLog(`Inventory:\n${inventoryList}\n\nGold: ${this.gameGold} coins`);
        this.showToast(`Inventory: ${this.gameInventory.length} items`, 'info');
    }

    // Enhanced rest system
    restInGame() {
        if (this.encounterInProgress) {
            this.addCombatLog('Cannot rest during combat!');
            return;
        }

        const healAmount = Math.min(40, 100 - this.gameHP);
        this.gameHP += healAmount;

        this.updateGameUI();
        this.addCombatLog(`Rested and healed ${healAmount} HP. Current HP: ${this.gameHP}/100`);
        this.showToast(`Healed ${healAmount} HP! Ì≤§`, 'success');
        this.addStoryEntry(`Rested and recovered ${healAmount} HP`, 'success');
    }

    // Enhanced search system
    searchRoom() {
        const currentRoom = this.currentDungeon[this.playerPosition.y][this.playerPosition.x];

        if (currentRoom.type === 'treasure' || currentRoom.type === 'trap') {
            this.addCombatLog('You already know what\'s in this room.');
            return;
        }

        // Chance to find hidden treasure based on WIS
        const searchChance = 0.4 + (this.hero.stats.wis - 10) * 0.03; // Base 40% + 3% per WIS above 10
        const foundSomething = Math.random() < searchChance;

        if (foundSomething) {
            const goldAmount = Math.floor(Math.random() * 25) + 10;
            this.gameGold += goldAmount;
            this.addCombatLog(`Found hidden treasure: ${goldAmount} gold! (Search chance: ${Math.round(searchChance * 100)}%)`);
            this.showToast(`Found ${goldAmount} gold!`, 'success');
        } else {
            this.addCombatLog(`Found nothing of interest. (Search chance: ${Math.round(searchChance * 100)}%)`);
        }
    }

    // Enhanced trap system
    triggerTrap() {
        const trapTypes = ['Spike Pit', 'Arrow Trap', 'Poison Gas', 'Fire Trap'];
        const trapType = trapTypes[Math.floor(Math.random() * trapTypes.length)];
        
        let damage = Math.floor(Math.random() * 20) + 10;
        
        // Check for trap resistance (DEX save)
        const dexSave = Math.random() * 20 + this.hero.stats.dex;
        if (dexSave > 15) {
            damage = Math.floor(damage / 2);
            this.addCombatLog(`Your agility helps you avoid some damage! (DEX save: ${Math.round(dexSave)})`);
        }

        this.gameHP -= damage;
        this.gameHP = Math.max(0, this.gameHP);

        this.updateGameUI();
        this.addCombatLog(`Triggered ${trapType}! Took ${damage} damage!`);

        if (this.gameHP <= 0) {
            this.addCombatLog(`${this.hero.name} has fallen to a trap!`);
            this.showToast('You have been defeated by a trap! Ì≤Ä', 'error');
            this.exitPlayMode();
        } else {
            this.addCombatLog(`You have ${this.gameHP} HP remaining.`);
        }
    }

    // Enhanced treasure system
    collectTreasure() {
        const goldAmount = Math.floor(Math.random() * 50) + 20;
        this.gameGold += goldAmount;

        // Add random item to inventory
        const items = ['Health Potion', 'Mana Potion', 'Strength Potion', 'Defense Potion', 'Scroll of Protection'];
        const item = items[Math.floor(Math.random() * items.length)];
        this.gameInventory.push({ 
            name: item, 
            type: 'consumable',
            description: this.getItemDescription(item)
        });

        this.addCombatLog(`Found ${goldAmount} gold and ${item}!`);
        this.showToast(`Treasure collected! Ì≤∞`, 'success');
        this.gainExperience(25); // Experience for finding treasure
    }

    getItemDescription(itemName) {
        const descriptions = {
            'Health Potion': 'Restores 30 HP',
            'Mana Potion': 'Restores 30 MP',
            'Strength Potion': 'Temporarily increases STR by 3',
            'Defense Potion': 'Temporarily increases DEF by 3',
            'Scroll of Protection': 'Provides temporary damage resistance'
        };
        return descriptions[itemName] || 'No description available';
    }

    // Movement and exploration
    movePlayer(direction) {
        if (this.encounterInProgress) {
            this.addCombatLog('Cannot move during combat!');
            return;
        }

        let newX = this.playerPosition.x;
        let newY = this.playerPosition.y;

        switch (direction) {
            case 'up':
                newY = Math.max(0, newY - 1);
                break;
            case 'down':
                newY = Math.min(this.dungeonSize - 1, newY + 1);
                break;
            case 'left':
                newX = Math.max(0, newX - 1);
                break;
            case 'right':
                newX = Math.min(this.dungeonSize - 1, newX + 1);
                break;
        }

        // Check if movement is valid (not into unexplored areas)
        if (this.isTileExplored(newX, newY)) {
            this.playerPosition.x = newX;
            this.playerPosition.y = newY;
            this.updatePlayerPosition();
            this.updateGameUI();
            this.revealTile(newX, newY); // Reveal new tile
            this.addCombatLog(`Moved to position (${this.playerPosition.x + 1},${this.playerPosition.y + 1})`);
        } else {
            this.addCombatLog('Cannot move into unexplored areas!');
        }
    }

    isTileExplored(x, y) {
        return this.revealedTiles.has(`${x},${y}`);
    }

    revealTile(x, y) {
        this.revealedTiles.add(`${x},${y}`);

        // Reveal adjacent tiles (fog of war reveal)
        const adjacent = [
            [x-1, y], [x+1, y], [x, y-1], [x, y+1],
            [x-1, y-1], [x-1, y+1], [x+1, y-1], [x+1, y+1]
        ];

        adjacent.forEach(([adjX, adjY]) => {
            if (adjX >= 0 && adjX < this.dungeonSize && adjY >= 0 && adjY < this.dungeonSize) {
                this.revealedTiles.add(`${adjX},${adjY}`);
            }
        });

        this.updateMapVisibility();
    }

    updateMapVisibility() {
        // Update visual appearance of revealed vs hidden tiles
        for (let y = 0; y < this.dungeonSize; y++) {
            for (let x = 0; x < this.dungeonSize; x++) {
                const tileKey = `${x},${y}`;
                const roomElement = document.querySelector(`.dungeon-room:nth-child(${y * this.dungeonSize + x + 1})`);

                if (roomElement) {
                    if (this.isTileExplored(x, y)) {
                        roomElement.classList.remove('dungeon-unexplored');
                        roomElement.classList.add('dungeon-revealed');
                    } else {
                        roomElement.classList.add('dungeon-unexplored');
                        roomElement.classList.remove('dungeon-revealed');
                    }
                }
            }
        }
    }

    updatePlayerPosition() {
        const playerSprite = document.getElementById('playerSprite');
        const gameplayArea = document.querySelector('#gameplayScreen .border-2');
        const rect = gameplayArea.getBoundingClientRect();
        const cellSize = Math.min(rect.width, rect.height) / Math.max(this.dungeonSize, 5);

        const x = (this.playerPosition.x * cellSize) + (cellSize / 2) - 16;
        const y = (this.playerPosition.y * cellSize) + (cellSize / 2) - 16;

        playerSprite.style.left = `${x}px`;
        playerSprite.style.top = `${y}px`;

        // Check for encounters in the new position
        this.checkForEncounter();
    }

    updateGameUI() {
        // Update gameplay UI elements
        document.getElementById('gameHP')?.textContent = `${this.gameHP}/100`;
        document.getElementById('gamePosition')?.textContent = `(${this.playerPosition.x + 1},${this.playerPosition.y + 1})`;
        document.getElementById('gameLevel')?.textContent = this.gameLevel;
        document.getElementById('gameGold')?.textContent = this.gameGold;
        document.getElementById('gameInventoryCount')?.textContent = this.gameInventory.length;
    }

    checkForEncounter() {
        if (this.encounterInProgress) return;

        const currentRoom = this.currentDungeon[this.playerPosition.y][this.playerPosition.x];

        if (currentRoom && currentRoom.encounter && !currentRoom.encounter.resolved) {
            this.triggerEncounter(currentRoom.encounter);
        }
    }

    triggerEncounter(encounter) {
        this.encounterInProgress = true;
        this.currentEncounter = encounter;

        const modal = document.getElementById('encounterModal');
        const title = document.getElementById('encounterTitle');
        const content = document.getElementById('encounterContent');

        title.textContent = 'Encounter!';
        content.innerHTML = `
            <p class="text-lg mb-2">${encounter.description}</p>
            <p class="text-sm text-gray-600 dark:text-gray-400">Choose your action:</p>
        `;

        modal.classList.remove('hidden');
        modal.classList.add('flex');

        this.addCombatLog(`Encountered: ${encounter.description}`);
    }

    interactWithRoom() {
        const currentRoom = this.currentDungeon[this.playerPosition.y][this.playerPosition.x];

        if (!currentRoom) return;

        switch (currentRoom.type) {
            case 'treasure':
                this.collectTreasure();
                break;
            case 'trap':
                this.triggerTrap();
                break;
            case 'entrance':
                this.addCombatLog('You are at the dungeon entrance - a safe place to rest.');
                break;
            default:
                this.addCombatLog('Nothing interesting here.');
        }
    }

    closeEncounterModal() {
        const modal = document.getElementById('encounterModal');
        modal.classList.add('hidden');
        modal.classList.remove('flex');
    }

    addCombatLog(message) {
        const combatLog = document.getElementById('combatLog');
        if (!combatLog) return;

        const entry = document.createElement('div');
        entry.className = 'text-xs text-white mb-1';
        entry.textContent = message;

        combatLog.appendChild(entry);
        combatLog.scrollTop = combatLog.scrollHeight;

        // Keep only last 15 entries
        while (combatLog.children.length > 15) {
            combatLog.removeChild(combatLog.firstChild);
        }
    }

    // Dungeon Generation
    generateDungeon() {
        const dungeonContainer = document.getElementById('dungeonContainer');
        const dungeonGrid = document.getElementById('dungeonGrid');

        if (!dungeonContainer || !dungeonGrid) {
            return;
        }

        // Clear previous dungeon
        dungeonGrid.innerHTML = '';

        // Set grid template columns
        dungeonGrid.style.gridTemplateColumns = `repeat(${this.dungeonSize}, 1fr)`;

        // Generate rooms
        this.currentDungeon = [];

        for (let y = 0; y < this.dungeonSize; y++) {
            this.currentDungeon[y] = [];
            for (let x = 0; x < this.dungeonSize; x++) {
                const room = document.createElement('div');
                room.className = 'dungeon-room';

                // Always place entrance at (0,0)
                if (x === 0 && y === 0) {
                    room.innerHTML = `<i class="fas fa-door-open text-green-400"></i>`;
                    room.classList.add('dungeon-entrance');
                    this.currentDungeon[y][x] = {
                        type: 'entrance',
                        content: { description: 'The dungeon entrance. A safe place to start your adventure.' }
                    };
                } else if (Math.random() < 0.6) {
                    // Place interesting rooms
                    const roomTypes = ['treasure', 'trap', 'monster', 'empty'];
                    const roomType = roomTypes[Math.floor(Math.random() * roomTypes.length)];

                    switch (roomType) {
                        case 'treasure':
                            room.innerHTML = `<i class="fas fa-coins text-yellow-400"></i>`;
                            room.classList.add('dungeon-treasure');
                            this.currentDungeon[y][x] = {
                                type: 'treasure',
                                content: { description: 'A room filled with treasure! Gold and items await.' }
                            };
                            break;
                        case 'trap':
                            room.innerHTML = `<i class="fas fa-skull text-red-400"></i>`;
                            room.classList.add('dungeon-trap');
                            this.currentDungeon[y][x] = {
                                type: 'trap',
                                content: { description: 'A dangerous trap room. Tread carefully!' }
                            };
                            break;
                        case 'monster':
                            room.innerHTML = `<i class="fas fa-dragon text-purple-400"></i>`;
                            room.classList.add('dungeon-monster');
                            this.currentDungeon[y][x] = {
                                type: 'monster',
                                encounter: {
                                    description: 'A hostile creature blocks your path!',
                                    type: 'combat'
                                },
                                content: { description: 'A monster lurks in the shadows of this room.' }
                            };
                            break;
                        default:
                            room.innerHTML = `<i class="fas fa-circle text-gray-400"></i>`;
                            room.classList.add('dungeon-empty');
                            this.currentDungeon[y][x] = {
                                type: 'empty',
                                content: { description: 'An empty room. Nothing of interest here.' }
                            };
                    }
                } else {
                    room.classList.add('dungeon-path');
                    this.currentDungeon[y][x] = {
                        type: 'empty',
                        content: { description: 'A dark corridor. Nothing to see here.' }
                    };
                }

                dungeonGrid.appendChild(room);
            }
        }

        dungeonContainer.classList.remove('hidden');
        this.showToast(`Generated ${this.dungeonSize}x${this.dungeonSize} dungeon!`, 'success');
        this.addStoryEntry(`Explored a ${this.dungeonSize}x${this.dungeonSize} dungeon`, 'success');
    }

    // Character Generation
    generateHero() {
        const name = this.getRandomItem(this.gameData.heroNames);
        const race = this.getRandomItem(this.gameData.races);
        const characterClass = this.getRandomItem(this.gameData.classes);

        // Generate stats based on class
        const baseStats = { str: 10, dex: 10, int: 10, wis: 10 };
        const classBonuses = {
            'Fighter': { str: 3, dex: 1 },
            'Wizard': { int: 3, wis: 1 },
            'Rogue': { dex: 3, int: 1 },
            'Cleric': { wis: 3, str: 1 },
            'Ranger': { dex: 2, wis: 2 },
            'Barbarian': { str: 4 },
            'Bard': { int: 2, wis: 2 },
            'Druid': { wis: 3, int: 1 },
            'Monk': { dex: 3, wis: 1 },
            'Paladin': { str: 2, wis: 2 },
            'Sorcerer': { int: 4 },
            'Warlock': { int: 3, wis: 1 }
        };

        const bonuses = classBonuses[characterClass] || { str: 1, dex: 1, int: 1, wis: 1 };

        this.hero = {
            name,
            race,
            characterClass,
            level: 1,
            hp: 100,
            maxHp: 100,
            stats: {
                str: baseStats.str + bonuses.str + Math.floor(Math.random() * 4),
                dex: baseStats.dex + bonuses.dex + Math.floor(Math.random() * 4),
                int: baseStats.int + bonuses.int + Math.floor(Math.random() * 4),
                wis: baseStats.wis + bonuses.wis + Math.floor(Math.random() * 4)
            }
        };

        this.updateCharacterSheet();
        this.showToast(`Generated hero: ${name} the ${race} ${characterClass}! ‚öîÔ∏è`, 'success');
        this.addStoryEntry(`Created hero: ${name} (${race} ${characterClass})`, 'success');
    }

    generateMonster() {
        const name = this.getRandomItem(this.gameData.monsterNames);
        const type = this.getRandomItem(this.gameData.monsterTypes);

        this.monster = {
            name,
            type,
            level: Math.floor(Math.random() * 10) + 1,
            hp: Math.floor(Math.random() * 60) + 40,
            maxHp: Math.floor(Math.random() * 60) + 40,
            abilities: this.getRandomItems(this.gameData.abilities, 3),
            loot: this.generateMonsterLoot()
        };

        this.displayMonster(this.monster);
        this.showToast(`Spawned monster: ${name}! Ì±π`, 'warning');
        this.addStoryEntry(`Encountered a ${name} (${type})`, 'warning');
    }

    generateStory() {
        const story = this.getRandomItem(this.gameData.stories);
        this.addStoryEntry(story, 'info');
        this.showToast('New story generated! Ì≥ñ', 'info');
    }

    openDiceModal() {
        const modal = document.getElementById('diceModal');
        if (modal) {
            modal.classList.remove('hidden');
            modal.classList.add('flex');
        }
    }

    toggleDungeonDarkMode() {
        const dungeonContainer = document.getElementById('dungeonContainer');
        if (dungeonContainer) {
            dungeonContainer.classList.toggle('dungeon-dark');
            const isDark = dungeonContainer.classList.contains('dungeon-dark');
            this.showToast(`Dungeon ${isDark ? 'darkened' : 'illuminated'}! Ìºô`, 'info');
        }
    }

    displayMonster(monster) {
        const monsterDisplay = document.getElementById('monsterDisplay');
        if (!monsterDisplay) return;

        monsterDisplay.innerHTML = `
            <div class="bg-red-900 p-4 rounded-lg">
                <h3 class="text-xl font-bold text-red-200">${monster.name}</h3>
                <p class="text-red-300">${monster.type}</p>
                <p class="text-sm text-red-400">Level ${monster.level}</p>
                <div class="mt-2">
                    <p class="text-sm text-red-400">Abilities:</p>
                    <ul class="text-xs text-red-300">
                        ${monster.abilities.map(ability => `<li>‚Ä¢ ${ability}</li>`).join('')}
                    </ul>
                </div>
            </div>
        `;
    }

    startCombat() {
        if (!this.hero || !this.monster) {
            this.showToast('Need both hero and monster for combat! ‚öîÔ∏è', 'error');
            return;
        }

        const heroDamage = Math.floor(Math.random() * 20) + this.hero.stats.str;
        const monsterDamage = Math.floor(Math.random() * 15) + 10;

        this.logCombat(`${this.hero.name} attacks ${this.monster.name} for ${heroDamage} damage!`);
        this.logCombat(`${this.monster.name} retaliates for ${monsterDamage} damage!`);

        this.hero.hp -= monsterDamage;
        this.monster.hp -= heroDamage;

        if (this.hero.hp <= 0) {
            this.showToast(`${this.hero.name} has fallen! Ì≤Ä`, 'error');
            this.addStoryEntry(`${this.hero.name} was defeated by ${this.monster.name}`, 'error');
        } else if (this.monster.hp <= 0) {
            this.showToast(`${this.monster.name} defeated! Ìæâ`, 'success');
            this.addStoryEntry(`${this.hero.name} defeated ${this.monster.name}`, 'success');
        } else {
            this.showToast('Combat continues! ‚öîÔ∏è', 'info');
        }

        this.updateCharacterSheet();
    }

    logCombat(message) {
        const combatLog = document.getElementById('combatLog');
        if (!combatLog) return;

        const entry = document.createElement('div');
        entry.className = 'combat-entry';
        entry.textContent = message;

        combatLog.appendChild(entry);
        combatLog.scrollTop = combatLog.scrollHeight;
    }

    updateCharacterSheet() {
        // Update character sheet with current hero data
        if (this.hero) {
            document.getElementById('charName')?.textContent = this.hero.name;
            document.getElementById('charRaceClass')?.textContent = `${this.hero.race} ${this.hero.characterClass}`;
            document.getElementById('charLevel')?.textContent = this.hero.level;
            document.getElementById('charXP')?.textContent = `0/${this.hero.level * 100}`;
            document.getElementById('charHP')?.textContent = `${this.hero.hp}/${this.hero.maxHp}`;
            document.getElementById('charHPBar')?.style.width = `${(this.hero.hp / this.hero.maxHp) * 100}%`;
            document.getElementById('charMana')?.textContent = '50/50';
            document.getElementById('charManaBar')?.style.width = '100%';
            document.getElementById('charSTR')?.textContent = this.hero.stats.str;
            document.getElementById('charDEX')?.textContent = this.hero.stats.dex;
            document.getElementById('charINT')?.textContent = this.hero.stats.int;
            document.getElementById('charWIS')?.textContent = this.hero.stats.wis;
            document.getElementById('charWeapon')?.textContent = 'Sword';
            document.getElementById('charArmor')?.textContent = 'Leather';
            document.getElementById('charGold')?.textContent = this.gameGold;
        } else {
            // Default values
            document.getElementById('charName')?.textContent = 'Adventurer';
            document.getElementById('charRaceClass')?.textContent = 'Human Fighter';
            document.getElementById('charLevel')?.textContent = '1';
            document.getElementById('charXP')?.textContent = '0/100';
            document.getElementById('charHP')?.textContent = '100/100';
            document.getElementById('charHPBar')?.style.width = '100%';
            document.getElementById('charMana')?.textContent = '50/50';
            document.getElementById('charManaBar')?.style.width = '100%';
            document.getElementById('charSTR')?.textContent = '12';
            document.getElementById('charDEX')?.textContent = '14';
            document.getElementById('charINT')?.textContent = '10';
            document.getElementById('charWIS')?.textContent = '13';
            document.getElementById('charWeapon')?.textContent = 'Sword';
            document.getElementById('charArmor')?.textContent = 'Leather';
            document.getElementById('charGold')?.textContent = '100';
        }
    }

    displayHero(hero) {
        const heroDisplay = document.getElementById('heroDisplay');
        if (!heroDisplay) return;

        heroDisplay.innerHTML = `
            <div class="bg-blue-900 p-4 rounded-lg">
                <h3 class="text-xl font-bold text-blue-200">${hero.name}</h3>
                <p class="text-blue-300">${hero.race} ${hero.characterClass}</p>
                <p class="text-sm text-blue-400">Level ${hero.level}</p>
                <div class="mt-2">
                    <p class="text-sm text-blue-400">Stats:</p>
                    <div class="text-xs text-blue-300 grid grid-cols-2 gap-1">
                        <span>STR: ${hero.stats.str}</span>
                        <span>DEX: ${hero.stats.dex}</span>
                        <span>INT: ${hero.stats.int}</span>
                        <span>WIS: ${hero.stats.wis}</span>
                    </div>
                </div>
            </div>
        `;
    }

    toggleDarkMode() {
        document.body.classList.toggle('dark');
        const isDark = document.body.classList.contains('dark');
        localStorage.setItem('darkMode', isDark);
        this.showToast(`Switched to ${isDark ? 'dark' : 'light'} mode! ${isDark ? 'Ìºô' : '‚òÄÔ∏è'}`, 'info');
    }

    initializeGlobalAccess() {
        // Make methods globally accessible for HTML onclick handlers
        window.dungeonGame = this;
    }

    loadGameData() {
        return {
            heroNames: [
                'Aragorn', 'Legolas', 'Gimli', 'Frodo', 'Sam', 'Merry', 'Pippin', 'Gandalf', 'Boromir',
                'Eowyn', 'Faramir', 'Galadriel', 'Elrond', 'Thorin', 'Balin', 'Dwalin', 'Kili', 'Fili',
                'Bifur', 'Bofur', 'Bombur', 'Dori', 'Nori', 'Ori', 'Oin', 'Gloin', 'Bilbo', 'Saruman',
                'Sauron', 'Gollum', 'Treebeard', 'Tom', 'Bombadil', 'Glorfindel', 'Haldir', 'Celeborn',
                'Thranduil', 'Bard', 'Beorn', 'Radagast', 'Eomer', 'Theoden', 'Grima', 'Denethor',
                'Arwen', 'Elenion', 'Mithrandir', 'Aerin', 'Brand', 'Dain', 'Borin', 'Bifur', 'Gloin',
                'Alatar', 'Pallando', 'Morinehtar', 'Romestamo', 'Aiwendil', 'Curumo', 'Olorin', 'Ol√≥rin',
                'Mithrandir', 'Thark√ªn', 'Gandalf', 'Inc√°nus', 'L√°thspell', 'Stormcrow', 'Grey Pilgrim'
            ],
            races: [
                'Human', 'Elf', 'Dwarf', 'Hobbit', 'Half-Elf', 'Half-Orc', 'Tiefling', 'Dragonborn',
                'Gnome', 'Aarakocra', 'Genasi', 'Aasimar', 'Tabaxi', 'Triton', 'Yuan-ti', 'Tortle',
                'Kobold', 'Orc', 'Goblin', 'Bugbear', 'Hobgoblin', 'Ogre', 'Troll', 'Giant', 'Firbolg',
                'Goliath', 'Kenku', 'Lizardfolk', 'Minotaur', 'Satyr', 'Centaur', 'Harengon', 'Owlin'
            ],
            classes: [
                'Fighter', 'Wizard', 'Rogue', 'Cleric', 'Ranger', 'Barbarian', 'Bard', 'Druid', 'Monk',
                'Paladin', 'Sorcerer', 'Warlock', 'Artificer', 'Blood Hunter', 'Psion', 'Swashbuckler',
                'Hexblade', 'Eldritch Knight', 'Arcane Trickster', 'Divine Soul', 'Shadow Monk', 'Beast Master',
                'Gloom Stalker', 'Hunter', 'Drakewarden', 'Spores Druid', 'Twilight Cleric', 'Oathbreaker',
                'Vengeance Paladin', 'Conquest Paladin', 'Redemption Paladin', 'Devotion Paladin', 'Ancients Paladin'
            ],
            monsterNames: [
                'Ancient Red Dragon', 'Adult Blue Dragon', 'Young Green Dragon', 'White Dragon Wyrmling',
                'Beholder', 'Death Tyrant', 'Mind Flayer', 'Intellect Devourer', 'Lich', 'Demilich',
                'Vampire Lord', 'Vampire Spawn', 'Ghost', 'Wraith', 'Specter', 'Banshee', 'Revenant',
                'Aboleth', 'Chuul', 'Umber Hulk', 'Roper', 'Piercer', 'Carrion Crawler', 'Gelatinous Cube',
                'Ochre Jelly', 'Black Pudding', 'Pit Fiend', 'Balor', 'Hezrou', 'Vrock', 'Glabrezu',
                'Nalfeshnee', 'Marilith', 'Goristro', 'Kraken', 'Leviathan', 'Tarrasque', 'Purple Worm',
                'Behir', 'Chimera', 'Manticore', 'Griffon', 'Hippogriff', 'Pegasus', 'Nightmare',
                'Death Knight', 'Iron Golem', 'Stone Golem', 'Clay Golem', 'Flesh Golem', 'Bone Devil',
                'Chain Devil', 'Barbed Devil', 'Ice Devil', 'Horned Devil', 'Erinyes', 'Succubus',
                'Incubus', 'Night Hag', 'Green Hag', 'Sea Hag', 'Annis Hag', 'Bheur Hag', 'Coven Hag'
            ],
            monsterTypes: [
                'Dragon', 'Aberration', 'Undead', 'Fiend', 'Elemental', 'Construct', 'Monstrosity',
                'Giant', 'Celestial', 'Fey', 'Plant', 'Ooze', 'Feywild', 'Shadowfell', 'Nine Hells',
                'Abyss', 'Mount Celestia', 'Arborea', 'Beastlands', 'Carceri', 'Hades', 'Limbo', 'Pandemonium',
                'Ysgard', 'Mechanus', 'Arcadia', 'Acheron', 'Ethereal', 'Astral', 'Inner Planes', 'Outer Planes'
            ],
            abilities: [
                'Fire Breath', 'Lightning Breath', 'Acid Breath', 'Poison Breath', 'Cold Breath', 'Necrotic Breath',
                'Radiant Breath', 'Thunder Breath', 'Force Breath', 'Psychic Breath', 'Paralysis', 'Petrification',
                'Poison Sting', 'Magic Resistance', 'Regeneration', 'Flight', 'Invisibility', 'Teleport',
                'Mind Control', 'Suggestion', 'Domination', 'Charm', 'Fear', 'Frightened', 'Stunned',
                'Blinded', 'Deafened', 'Incapacitated', 'Restrained', 'Grappled', 'Prone', 'Exhaustion',
                'Poisoned', 'Disease', 'Curse', 'Madness', 'Possession', 'Polymorph', 'Shapechange',
                'Antimagic', 'Counterspell', 'Dispel Magic', 'Antilife Shell', 'Globe of Invulnerability',
                'Mind Blank', 'Prismatic Spray', 'Sunburst', 'Moonbeam', 'Daylight', 'Darkness',
                'Fireball', 'Lightning Bolt', 'Ice Storm', 'Earthquake', 'Meteor Swarm', 'Summon Minions',
                'Conjure Animals', 'Conjure Elementals', 'Conjure Fey', 'Conjure Woodland Beings', 'Conjure Celestial',
                'Infernal Calling', 'Abyssal Calling', 'Planar Ally', 'Gate', 'Wish', 'Miracle', 'Divine Intervention',
                'Legendary Resistance', 'Legendary Actions', 'Lair Actions', 'Regional Effects', 'Multiattack',
                'Pack Tactics', 'Ambusher', 'Assassinate', 'Brute', 'Charger', 'Defensive', 'Disarming',
                'Dodger', 'Escapist', 'Flyby', 'Grappler', 'Healer', 'Hit-and-Run', 'Leader', 'Magic User',
                'Mounted', 'Opportunist', 'Sniper', 'Stealthy', 'Tank', 'Tracker', 'Turncoat', 'Utility',
                'Versatile', 'Wall Walker', 'Web Walker', 'Burrower', 'Swimmer', 'Climber', 'Jumper',
                'Etherealness', 'Incorporeal', 'Damage Immunity', 'Damage Resistance', 'Vulnerable', 'Absorb',
                'Reflect', 'Split', 'Amorphous', 'Illusion', 'Shapechanger', 'False Appearance', 'Mimicry',
                'Telepathy', 'Truesight', 'Darkvision', 'Blindsight', 'Tremorsense', 'Scent', 'Hearing',
                'Touch', 'Taste', 'Smell', 'Sixth Sense', 'Spider Climb', 'Web', 'Corrosive Form',
                'Gaseous Form', 'Liquid Form', 'Solid Form', 'Energy Form', 'Spirit Form', 'Astral Form'
            ],
            stories: [
                'You find an ancient tome that whispers secrets of the elder gods. Reading it grants you forbidden knowledge but curses your bloodline for seven generations.',
                'A mysterious merchant offers you a map to a lost city of gold. The journey will be perilous, but the rewards could make you wealthy beyond imagination.',
                'You discover a hidden grove where time flows differently. Spending a night here ages you by years, but grants wisdom of the ancients.',
                'An old wizard approaches you with a proposition: help him retrieve a stolen artifact from a dragon\'s hoard. The reward is a wish spell.',
                'You stumble upon a battlefield where two armies clashed centuries ago. The ghosts still fight their eternal battle, and you must choose a side.',
                'A fairy ring in the forest offers you a choice: dance for a night and gain eternal youth, or resist and face the consequences of refusing magic.',
                'You find a cursed mirror that shows you your future self. Breaking it changes your destiny, but the shards cut deep into your soul.',
                'An underground river leads you to a subterranean sea where merfolk trade in rare pearls that contain captured memories of the past.',
                'You discover a garden of crystal flowers that sing when the moonlight touches them. Plucking one grants a boon but withers your own life force.',
                'A forgotten temple holds a golden idol that promises power to whoever claims it. But the temple\'s guardians are not easily defeated.',
                'You encounter a wandering storyteller who knows the true history of your world. His tales reveal that your reality is just one thread in a vast tapestry.',
                'A blacksmith\'s forge burns with eternal flame. Weapons forged here never dull or break, but each strike draws a drop of the wielder\'s blood.',
                'You find a library of floating books that rearrange themselves based on the reader\'s desires. But knowledge comes at the cost of memories.',
                'An alchemist offers you a potion of immortality. The price is your ability to feel emotions, leaving you in eternal, emotionless existence.',
                'You discover a portal to the shadow realm. Crossing it allows you to walk through walls in the real world, but shadows pursue you relentlessly.',
                'A bard sings songs that can alter reality. His music can heal wounds or break minds, depending on how you listen to his melodies.',
                'You find a chest containing three keys: one opens any lock, one reveals hidden truths, one unleashes chaos wherever it\'s used.',
                'An oracle offers to show you three possible futures. Choosing one makes it real, but the other two paths are forever lost to you.',
                'You encounter a pack of wolves that speak in riddles. Solving their puzzles grants you their loyalty, but failing curses you with cowardice.',
                'A hidden laboratory contains experiments that blur the line between life and machine. The creations offer upgrades but at what cost to humanity?'
            ]
        };
    }
}

// Initialize game when DOM loads
document.addEventListener('DOMContentLoaded', () => {
    window.dungeonGame = new DungeonGame();
});
