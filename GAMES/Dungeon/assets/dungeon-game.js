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
        this.showToast('Welcome to Dungeon Master! 🐉', 'success');
        this.bindEvents();
        this.setupMobileMenu();
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
        if (!this.hero || !this.currentDungeon) {
            this.showToast('Generate a hero and dungeon first!', 'warning');
            return;
        }

        this.playMode = !this.playMode;

        const centerPanelContainer = document.getElementById('centerPanelContainer');
        const gameplayScreen = document.getElementById('gameplayScreen');

        if (this.playMode) {
            centerPanelContainer.style.display = 'none';
            gameplayScreen.classList.remove('hidden');
            gameplayScreen.classList.add('flex');
            this.initializeGameplay();
            this.showToast('Entered Play Mode! 🎮', 'success');
            this.addStoryEntry('Started dungeon adventure', 'success');
        } else {
            gameplayScreen.classList.add('hidden');
            gameplayScreen.classList.remove('flex');
            centerPanelContainer.style.display = 'flex';
            this.showToast('Exited Play Mode', 'info');
        }
    }

    initializeGameplay() {
        // Reset player position to entrance
        this.playerPosition = { x: 0, y: 0 };
        this.gameHP = this.hero ? this.hero.hp : 100;
        this.gameLevel = this.hero ? this.hero.level : 1;
        this.gameInventory = [];
        this.gameGold = 100;
        this.revealedTiles = new Set(); // Track revealed map tiles
        this.encounterInProgress = false;
        this.experience = 0;

        this.updateGameUI();
        this.updatePlayerPosition();
        this.revealTile(0, 0); // Reveal starting tile
        this.addCombatLog('Adventure begins! You stand at the dungeon entrance.');
    }

    updateGameUI() {
        // Update gameplay UI elements
        document.getElementById('gameHP').textContent = `${this.gameHP}/100`;
        document.getElementById('gamePosition').textContent = `(${this.playerPosition.x + 1},${this.playerPosition.y + 1})`;
        document.getElementById('gameLevel').textContent = this.gameLevel;
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

    performCombat() {
        if (!this.currentEncounter) return;

        const playerDamage = Math.floor(Math.random() * 20) + this.hero.stats.str;
        const enemyDamage = Math.floor(Math.random() * 15) + 10;

        this.gameHP -= enemyDamage;
        this.gameHP = Math.max(0, this.gameHP);

        this.addCombatLog(`${this.hero.name} attacks for ${playerDamage} damage!`);
        this.addCombatLog(`Enemy strikes back for ${enemyDamage} damage!`);

        if (this.gameHP <= 0) {
            this.addCombatLog(`${this.hero.name} has fallen!`);
            this.showToast('You have been defeated! 💀', 'error');
            this.exitPlayMode();
        } else {
            this.addCombatLog(`You have ${this.gameHP} HP remaining`);
            this.updateGameUI();

            // Check if encounter is resolved (simplified)
            if (Math.random() < 0.3) { // 30% chance to resolve encounter
                this.resolveEncounter();
            }
        }
    }

    attemptFlee() {
        if (Math.random() < 0.5) { // 50% chance to flee
            this.addCombatLog('Successfully fled from combat!');
            this.resolveEncounter();
        } else {
            this.addCombatLog('Failed to flee! Combat continues...');
            // Enemy gets a free attack
            const enemyDamage = Math.floor(Math.random() * 10) + 5;
            this.gameHP -= enemyDamage;
            this.gameHP = Math.max(0, this.gameHP);
            this.updateGameUI();
            this.addCombatLog(`Took ${enemyDamage} damage while fleeing!`);
        }
    }

    useItemInCombat() {
        if (this.gameInventory.length === 0) {
            this.addCombatLog('No items available!');
            return;
        }

        // Use first available item (simplified)
        const item = this.gameInventory[0];
        this.gameInventory.shift();

        if (item.type === 'healing') {
            const healAmount = 30;
            this.gameHP = Math.min(100, this.gameHP + healAmount);
            this.updateGameUI();
            this.addCombatLog(`Used ${item.name} and healed ${healAmount} HP!`);
        } else {
            this.addCombatLog(`Used ${item.name} in combat!`);
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

    collectTreasure() {
        const goldAmount = Math.floor(Math.random() * 50) + 10;
        this.gameGold += goldAmount;

        // Add random item to inventory
        const items = ['Health Potion', 'Mana Potion', 'Scroll of Protection'];
        const item = items[Math.floor(Math.random() * items.length)];
        this.gameInventory.push({ name: item, type: 'consumable' });

        this.addCombatLog(`Found ${goldAmount} gold and ${item}!`);
        this.showToast(`Treasure collected! 💰`, 'success');
    }

    triggerTrap() {
        const damage = Math.floor(Math.random() * 20) + 10;
        this.gameHP -= damage;
        this.gameHP = Math.max(0, this.gameHP);

        this.updateGameUI();
        this.addCombatLog(`Triggered a trap! Took ${damage} damage!`);

        if (this.gameHP <= 0) {
            this.addCombatLog(`${this.hero.name} has fallen to a trap!`);
            this.showToast('You have been defeated by a trap! 💀', 'error');
            this.exitPlayMode();
        }
    }

    searchRoom() {
        const currentRoom = this.currentDungeon[this.playerPosition.y][this.playerPosition.x];

        if (currentRoom.type === 'treasure' || currentRoom.type === 'trap') {
            this.addCombatLog('You already know what\'s in this room.');
            return;
        }

        // Chance to find hidden treasure
        if (Math.random() < 0.3) {
            const goldAmount = Math.floor(Math.random() * 20) + 5;
            this.gameGold += goldAmount;
            this.addCombatLog(`Found hidden treasure: ${goldAmount} gold!`);
        } else {
            this.addCombatLog('Found nothing of interest.');
        }
    }

    restInGame() {
        const healAmount = Math.min(30, 100 - this.gameHP);
        this.gameHP += healAmount;

        this.updateGameUI();
        this.addCombatLog(`Rested and healed ${healAmount} HP`);
        this.showToast(`Healed ${healAmount} HP! 💤`, 'success');
    }

    showInventory() {
        if (this.gameInventory.length === 0) {
            this.addCombatLog('Inventory is empty.');
            return;
        }

        const inventoryList = this.gameInventory.map(item => `• ${item.name}`).join('\n');
        this.addCombatLog(`Inventory:\n${inventoryList}`);
    }

    addCombatLog(message) {
        const combatLog = document.getElementById('combatLog');
        if (!combatLog) return;

        const entry = document.createElement('div');
        entry.className = 'text-xs text-white mb-1';
        entry.textContent = message;

        combatLog.appendChild(entry);
        combatLog.scrollTop = combatLog.scrollHeight;

        // Keep only last 10 entries
        while (combatLog.children.length > 10) {
            combatLog.removeChild(combatLog.firstChild);
        }
    }

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

    generateHero() {
        const name = this.getRandomItem(this.gameData.heroNames);
        const race = this.getRandomItem(this.gameData.races);
        const characterClass = this.getRandomItem(this.gameData.classes);

        this.hero = {
            name,
            race,
            characterClass,
            level: Math.floor(Math.random() * 10) + 1,
            hp: Math.floor(Math.random() * 50) + 50,
            stats: {
                str: Math.floor(Math.random() * 6) + 8,
                dex: Math.floor(Math.random() * 6) + 8,
                int: Math.floor(Math.random() * 6) + 8,
                wis: Math.floor(Math.random() * 6) + 8
            }
        };

        this.updateCharacterSheet();
        this.showToast(`Generated hero: ${name} the ${race} ${characterClass}! ⚔️`, 'success');
        this.addStoryEntry(`Created hero: ${name} (${race} ${characterClass})`, 'success');
    }

    generateMonster() {
        const name = this.getRandomItem(this.gameData.monsterNames);
        const type = this.getRandomItem(this.gameData.monsterTypes);

        this.monster = {
            name,
            type,
            level: Math.floor(Math.random() * 15) + 1,
            hp: Math.floor(Math.random() * 100) + 20,
            abilities: this.getRandomItems(this.gameData.abilities, 3)
        };

        this.displayMonster(this.monster);
        this.showToast(`Spawned monster: ${name}! 👹`, 'warning');
        this.addStoryEntry(`Encountered a ${name} (${type})`, 'warning');
    }

    generateStory() {
        const story = this.getRandomItem(this.gameData.stories);
        this.addStoryEntry(story, 'info');
        this.showToast('New story generated! 📖', 'info');
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
            this.showToast(`Dungeon ${isDark ? 'darkened' : 'illuminated'}! 🌙`, 'info');
        }
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

    closeEncounterModal() {
        const modal = document.getElementById('encounterModal');
        modal.classList.add('hidden');
        modal.classList.remove('flex');
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
                        ${monster.abilities.map(ability => `<li>• ${ability}</li>`).join('')}
                    </ul>
                </div>
            </div>
        `;
    }

    startCombat() {
        if (!this.hero || !this.monster) {
            this.showToast('Need both hero and monster for combat! ⚔️', 'error');
            return;
        }

        const heroDamage = Math.floor(Math.random() * 20) + this.hero.stats.str;
        const monsterDamage = Math.floor(Math.random() * 15) + 10;

        this.logCombat(`${this.hero.name} attacks ${this.monster.name} for ${heroDamage} damage!`);
        this.logCombat(`${this.monster.name} retaliates for ${monsterDamage} damage!`);

        this.hero.hp -= monsterDamage;
        this.monster.hp -= heroDamage;

        if (this.hero.hp <= 0) {
            this.showToast(`${this.hero.name} has fallen! 💀`, 'error');
            this.addStoryEntry(`${this.hero.name} was defeated by ${this.monster.name}`, 'error');
        } else if (this.monster.hp <= 0) {
            this.showToast(`${this.monster.name} defeated! 🎉`, 'success');
            this.addStoryEntry(`${this.hero.name} defeated ${this.monster.name}`, 'success');
        } else {
            this.showToast('Combat continues! ⚔️', 'info');
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
            document.getElementById('charName').textContent = this.hero.name;
            document.getElementById('charRaceClass').textContent = `${this.hero.race} ${this.hero.characterClass}`;
            document.getElementById('charLevel').textContent = this.hero.level;
            document.getElementById('charXP').textContent = `0/${this.hero.level * 100}`;
            document.getElementById('charHP').textContent = `${this.hero.hp}/${this.hero.hp}`;
            document.getElementById('charHPBar').style.width = '100%';
            document.getElementById('charMana').textContent = '50/50';
            document.getElementById('charManaBar').style.width = '100%';
            document.getElementById('charSTR').textContent = this.hero.stats.str;
            document.getElementById('charDEX').textContent = this.hero.stats.dex;
            document.getElementById('charINT').textContent = this.hero.stats.int;
            document.getElementById('charWIS').textContent = this.hero.stats.wis;
            document.getElementById('charWeapon').textContent = 'Sword';
            document.getElementById('charArmor').textContent = 'Leather';
            document.getElementById('charGold').textContent = '100';
        } else {
            document.getElementById('charName').textContent = 'Adventurer';
            document.getElementById('charRaceClass').textContent = 'Human Fighter';
            document.getElementById('charLevel').textContent = '1';
            document.getElementById('charXP').textContent = '0/100';
            document.getElementById('charHP').textContent = '100/100';
            document.getElementById('charHPBar').style.width = '100%';
            document.getElementById('charMana').textContent = '50/50';
            document.getElementById('charManaBar').style.width = '100%';
            document.getElementById('charSTR').textContent = '12';
            document.getElementById('charDEX').textContent = '14';
            document.getElementById('charINT').textContent = '10';
            document.getElementById('charWIS').textContent = '13';
            document.getElementById('charWeapon').textContent = 'Sword';
            document.getElementById('charArmor').textContent = 'Leather';
            document.getElementById('charGold').textContent = '100';
        }
    }

    rest() {
        this.showToast('You rest and recover your strength! 💤', 'success');
        this.addStoryEntry('Rested and recovered strength', 'success');
    }

    useItem() {
        this.showToast('Select an item from your inventory', 'info');
        this.addStoryEntry('Attempted to use an item', 'info');
    }

    checkInventory() {
        this.showToast('Inventory: Empty (for now)', 'info');
        this.addStoryEntry('Checked inventory', 'info');
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
        this.showToast(`Switched to ${isDark ? 'dark' : 'light'} mode! ${isDark ? '🌙' : '☀️'}`, 'info');
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
                'Alatar', 'Pallando', 'Morinehtar', 'Romestamo', 'Aiwendil', 'Curumo', 'Olorin', 'Olórin',
                'Mithrandir', 'Tharkûn', 'Gandalf', 'Incánus', 'Láthspell', 'Stormcrow', 'Grey Pilgrim'
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
            ],
            items: [
                { name: 'Sword of Flames', type: 'weapon', rarity: 'legendary', description: 'A blade that burns with eternal fire' },
                { name: 'Ring of Invisibility', type: 'accessory', rarity: 'rare', description: 'Become unseen to mortal eyes' },
                { name: 'Potion of Healing', type: 'consumable', rarity: 'common', description: 'Restores health and cures wounds' },
                { name: 'Amulet of Protection', type: 'accessory', rarity: 'uncommon', description: 'Provides magical armor' },
                { name: 'Boots of Speed', type: 'armor', rarity: 'rare', description: 'Move with incredible velocity' },
                { name: 'Cloak of Shadows', type: 'armor', rarity: 'uncommon', description: 'Blend into darkness' },
                { name: 'Staff of Power', type: 'weapon', rarity: 'legendary', description: 'Channel devastating spells' },
                { name: 'Gem of Seeing', type: 'accessory', rarity: 'rare', description: 'See through illusions and invisibility' },
                { name: 'Bag of Holding', type: 'container', rarity: 'uncommon', description: 'Carry more than meets the eye' },
                { name: 'Wand of Magic Missiles', type: 'weapon', rarity: 'uncommon', description: 'Never miss your target' }
            ],
            traps: [
                'Spike Pit: A concealed pit with sharpened stakes at the bottom',
                'Arrow Trap: Pressure plate triggers a volley of poisoned arrows',
                'Illusion Wall: Fake wall that leads into a deadly drop',
                'Poison Gas: Room fills with toxic fumes when door closes',
                'Crushing Ceiling: Room slowly crushes anyone inside',
                'Teleport Trap: Randomly teleports victims to dangerous locations',
                'Fire Trap: Flames erupt from hidden nozzles',
                'Lightning Arc: Electrical discharge between metal plates',
                'Acid Spray: Corrosive liquid sprays from concealed vents',
                'Mind Trap: Illusory threats that damage the psyche'
            ],
            merchants: [
                'The Wandering Merchant: Sells exotic goods from distant lands',
                'The Black Market Dealer: Offers forbidden and dangerous items',
                'The Alchemist: Specializes in potions and magical concoctions',
                'The Weaponsmith: Master craftsman of blades and armor',
                'The Antiquarian: Deals in ancient artifacts and relics',
                'The Potion Vendor: Brews healing and enhancement elixirs',
                'The Scroll Merchant: Sells spells and magical writings',
                'The Gem Cutter: Expert in enchanted stones and crystals',
                'The Arcane Trader: Deals in components for spellcasting',
                'The Cursed Goods Seller: Offers items with mysterious powers'
            ],
            restAreas: [
                'Safe Room: A protected chamber with beds and supplies',
                'Healing Spring: Waters that restore health and cure ailments',
                'Meditation Chamber: A quiet space for mental recovery',
                'Library Nook: Books and scrolls for research and rest',
                'Garden Grove: Natural setting with calming effects',
                'Armory Rest: Weapons and armor maintenance area',
                'Altar Room: Divine presence aids in recovery',
                'Music Chamber: Soothing melodies promote healing',
                'Starry Observatory: View of the cosmos brings peace',
                'Herbalist Workshop: Plants and remedies for healing'
            ]
        };
    }
}

// Initialize game when DOM loads
document.addEventListener('DOMContentLoaded', () => {
    window.dungeonGame = new DungeonGame();
});
