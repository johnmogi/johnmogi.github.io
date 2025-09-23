// Dungeon Master - Enhanced RPG Game Generator
class DungeonGame {
    constructor() {
        this.hero = null;
        this.monster = null;
        this.dungeonSize = 5;
        this.roomCount = 6;
        this.gameData = this.loadGameData();
        this.init();
    }

    init() {
        this.bindEvents();
        this.setupMobileMenu();
        this.showToast('Welcome to Dungeon Master! 🐉', 'success');
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

        // Save/Load
        document.getElementById('saveGameBtn')?.addEventListener('click', () => this.saveGame());
        document.getElementById('loadGameBtn')?.addEventListener('click', () => this.loadGame());
    }

    setupMobileMenu() {
        const mobileMenuBtn = document.getElementById('mobileMenuBtn');
        const mobileMenu = document.getElementById('mobileMenu');

        if (mobileMenuBtn && mobileMenu) {
            mobileMenuBtn.addEventListener('click', () => {
                mobileMenu.classList.toggle('hidden');
                const icon = mobileMenuBtn.querySelector('i');
                icon.className = mobileMenu.classList.contains('hidden') ? 'fas fa-bars text-xl' : 'fas fa-times text-xl';
            });
        }

        // Dark mode toggle
        document.getElementById('darkModeToggle')?.addEventListener('click', () => this.toggleDarkMode());
    }

    toggleDarkMode() {
        document.documentElement.classList.toggle('dark');
        const icon = document.querySelector('#darkModeToggle i');
        icon.className = document.documentElement.classList.contains('dark') ? 'fas fa-sun' : 'fas fa-moon';
    }

    rollDice(sides) {
        const result = Math.floor(Math.random() * sides) + 1;
        const diceResults = document.getElementById('diceResults');
        diceResults.innerHTML = `<span class="text-2xl font-bold text-primary-600">D${sides}: ${result}</span>`;

        // Animate dice roll
        diceResults.style.transform = 'scale(1.1)';
        setTimeout(() => {
            diceResults.style.transform = 'scale(1)';
        }, 200);

        this.showToast(`Rolled D${sides}: ${result}`, 'info');
        return result;
    }

    generateHero() {
        const hero = {
            name: this.getRandomItem(this.gameData.heroNames),
            race: this.getRandomItem(this.gameData.races),
            characterClass: this.getRandomItem(this.gameData.classes),
            level: Math.floor(Math.random() * 10) + 1,
            age: Math.floor(Math.random() * 50) + 18,
            hp: Math.floor(Math.random() * 50) + 20,
            stats: {
                str: Math.floor(Math.random() * 10) + 10,
                dex: Math.floor(Math.random() * 10) + 10,
                int: Math.floor(Math.random() * 10) + 10,
                wis: Math.floor(Math.random() * 10) + 10,
                con: Math.floor(Math.random() * 10) + 10,
                cha: Math.floor(Math.random() * 10) + 10
            }
        };

        this.hero = hero;
        this.displayHero(hero);
        this.showToast(`Generated ${hero.name} the ${hero.race} ${hero.characterClass}!`, 'success');
    }

    displayHero(hero) {
        const heroCard = document.getElementById('heroCard');
        const heroName = document.getElementById('heroName');
        const heroRace = document.getElementById('heroRace');
        const heroClass = document.getElementById('heroClass');
        const heroLevel = document.getElementById('heroLevel');
        const heroAge = document.getElementById('heroAge');
        const heroHP = document.getElementById('heroHP');

        // Stats
        const heroSTR = document.getElementById('heroSTR');
        const heroDEX = document.getElementById('heroDEX');
        const heroINT = document.getElementById('heroINT');
        const heroSTRBar = document.getElementById('heroSTRBar');
        const heroDEXBar = document.getElementById('heroDEXBar');
        const heroINTBar = document.getElementById('heroINTBar');

        if (heroCard && heroName && heroRace && heroClass && heroLevel && heroAge && heroHP) {
            heroName.textContent = hero.name;
            heroRace.textContent = hero.race;
            heroClass.textContent = hero.characterClass;
            heroLevel.textContent = `Level ${hero.level}`;
            heroAge.textContent = hero.age;
            heroHP.textContent = hero.hp;

            heroSTR.textContent = hero.stats.str;
            heroDEX.textContent = hero.stats.dex;
            heroINT.textContent = hero.stats.int;

            heroSTRBar.style.width = `${(hero.stats.str / 20) * 100}%`;
            heroDEXBar.style.width = `${(hero.stats.dex / 20) * 100}%`;
            heroINTBar.style.width = `${(hero.stats.int / 20) * 100}%`;

            heroCard.classList.remove('hidden');
        }
    }

    generateMonster() {
        const monster = {
            name: this.getRandomItem(this.gameData.monsterNames),
            type: this.getRandomItem(this.gameData.monsterTypes),
            size: this.getRandomItem(['Tiny', 'Small', 'Medium', 'Large', 'Huge']),
            challengeRating: Math.floor(Math.random() * 5) + 1,
            armorClass: Math.floor(Math.random() * 10) + 10,
            hitPoints: Math.floor(Math.random() * 100) + 20,
            abilities: this.getRandomItems(this.gameData.abilities, 3)
        };

        this.monster = monster;
        this.displayMonster(monster);
        this.showToast(`Generated ${monster.name} (${monster.type})!`, 'warning');
    }

    displayMonster(monster) {
        const monsterCard = document.getElementById('monsterCard');
        const monsterName = document.getElementById('monsterName');
        const monsterType = document.getElementById('monsterType');
        const monsterSize = document.getElementById('monsterSize');
        const monsterCR = document.getElementById('monsterCR');
        const monsterAC = document.getElementById('monsterAC');
        const monsterHP = document.getElementById('monsterHP');
        const monsterAbilities = document.getElementById('monsterAbilities');

        if (monsterCard && monsterName && monsterType && monsterSize && monsterCR && monsterAC && monsterHP && monsterAbilities) {
            monsterName.textContent = monster.name;
            monsterType.textContent = monster.type;
            monsterSize.textContent = monster.size;
            monsterCR.textContent = `CR ${monster.challengeRating}`;
            monsterAC.textContent = monster.armorClass;
            monsterHP.textContent = monster.hitPoints;

            monsterAbilities.innerHTML = monster.abilities.map(ability =>
                `<span class="inline-block bg-white bg-opacity-20 px-2 py-1 rounded text-xs mr-1 mb-1">${ability}</span>`
            ).join('');

            monsterCard.classList.remove('hidden');
        }
    }

    generateDungeon() {
        const dungeonContainer = document.getElementById('dungeonContainer');
        const dungeonGrid = document.getElementById('dungeonGrid');

        if (!dungeonContainer || !dungeonGrid) return;

        // Clear previous dungeon
        dungeonGrid.innerHTML = '';

        // Set grid template columns
        dungeonGrid.style.gridTemplateColumns = `repeat(${this.dungeonSize}, 1fr)`;

        // Generate rooms
        const rooms = [];
        for (let i = 0; i < this.dungeonSize; i++) {
            for (let j = 0; j < this.dungeonSize; j++) {
                const room = document.createElement('div');
                room.className = 'dungeon-room';

                // Randomly place rooms (ensuring connectivity)
                const isRoom = this.shouldPlaceRoom(i, j, rooms);
                if (isRoom) {
                    room.innerHTML = `<i class="fas fa-door-closed"></i>`;
                    room.classList.add('dungeon-entrance');

                    // Add room types
                    const roomTypes = ['treasure', 'trap', 'empty'];
                    const roomType = roomTypes[Math.floor(Math.random() * roomTypes.length)];

                    switch (roomType) {
                        case 'treasure':
                            room.innerHTML = `<i class="fas fa-coins text-yellow-400"></i>`;
                            room.classList.add('bg-yellow-900');
                            break;
                        case 'trap':
                            room.innerHTML = `<i class="fas fa-skull text-red-400"></i>`;
                            room.classList.add('bg-red-900');
                            break;
                    }

                    rooms.push({ x: i, y: j, type: roomType });
                } else {
                    room.classList.add('dungeon-path');
                }

                dungeonGrid.appendChild(room);
            }
        }

        dungeonContainer.classList.remove('hidden');
        this.showToast(`Generated ${this.dungeonSize}x${this.dungeonSize} dungeon with ${rooms.length} rooms!`, 'success');
    }

    shouldPlaceRoom(x, y, existingRooms) {
        // Always place entrance at top-left
        if (x === 0 && y === 0) return true;

        // Ensure minimum connectivity
        const neighbors = existingRooms.filter(room =>
            (Math.abs(room.x - x) === 1 && room.y === y) ||
            (Math.abs(room.y - y) === 1 && room.x === x)
        );

        return neighbors.length > 0 && Math.random() < 0.6;
    }

    startCombat() {
        if (!this.hero || !this.monster) {
            this.showToast('Generate a hero and monster first!', 'error');
            return;
        }

        const combatLog = document.getElementById('combatLog');
        const combatHero = document.getElementById('combatHero');
        const combatMonster = document.getElementById('combatMonster');

        if (!combatLog || !combatHero || !combatMonster) return;

        combatHero.classList.remove('hidden');
        combatMonster.classList.remove('hidden');

        let heroHP = this.hero.hp;
        let monsterHP = this.monster.hitPoints;

        combatLog.innerHTML = '<div class="text-center font-bold mb-2">⚔️ COMBAT BEGINS! ⚔️</div>';

        const combatInterval = setInterval(() => {
            // Hero attacks
            const heroDamage = Math.floor(Math.random() * 10) + this.hero.stats.str - 10;
            monsterHP -= heroDamage;
            this.logCombat(`💙 ${this.hero.name} hits for ${heroDamage} damage!`);

            if (monsterHP <= 0) {
                this.logCombat(`🎉 ${this.hero.name} defeats ${this.monster.name}!`);
                clearInterval(combatInterval);
                this.showToast(`${this.hero.name} wins! 🎉`, 'success');
                return;
            }

            // Monster attacks
            const monsterDamage = Math.floor(Math.random() * 8) + 5;
            heroHP -= monsterDamage;
            this.logCombat(`❤️ ${this.monster.name} hits for ${monsterDamage} damage!`);

            if (heroHP <= 0) {
                this.logCombat(`💀 ${this.monster.name} defeats ${this.hero.name}!`);
                clearInterval(combatInterval);
                this.showToast(`${this.monster.name} wins! 💀`, 'error');
                return;
            }
        }, 1000);
    }

    logCombat(message) {
        const combatLog = document.getElementById('combatLog');
        if (combatLog) {
            const logEntry = document.createElement('div');
            logEntry.className = 'text-sm';
            logEntry.textContent = message;
            combatLog.appendChild(logEntry);
            combatLog.scrollTop = combatLog.scrollHeight;
        }
    }

    saveGame() {
        const gameState = {
            hero: this.hero,
            monster: this.monster,
            dungeonSize: this.dungeonSize,
            roomCount: this.roomCount,
            timestamp: new Date().toISOString()
        };

        localStorage.setItem('dungeonGameSave', JSON.stringify(gameState));
        this.showToast('Game saved successfully! 💾', 'success');
    }

    loadGame() {
        const savedGame = localStorage.getItem('dungeonGameSave');
        if (!savedGame) {
            this.showToast('No saved game found!', 'error');
            return;
        }

        try {
            const gameState = JSON.parse(savedGame);

            if (gameState.hero) {
                this.hero = gameState.hero;
                this.displayHero(this.hero);
            }

            if (gameState.monster) {
                this.monster = gameState.monster;
                this.displayMonster(this.monster);
            }

            this.dungeonSize = gameState.dungeonSize || 5;
            this.roomCount = gameState.roomCount || 6;

            document.getElementById('dungeonSize').value = this.dungeonSize;
            document.getElementById('roomCount').value = this.roomCount;
            document.getElementById('roomCountDisplay').textContent = this.roomCount;

            this.showToast('Game loaded successfully! 🎮', 'success');
        } catch (error) {
            this.showToast('Error loading game!', 'error');
        }
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

    getRandomItem(array) {
        return array[Math.floor(Math.random() * array.length)];
    }

    generateStory() {
        const storyCard = document.getElementById('storyCard');
        const storyContent = document.getElementById('storyContent');
        
        if (!storyCard || !storyContent) return;
        
        const story = this.getRandomItem(this.gameData.stories);
        storyContent.textContent = story;
        storyCard.classList.remove('hidden');
        
        this.showToast('Story generated! 📖', 'success');
    }

    exploreRoom() {
        const roomResult = document.getElementById('roomResult');
        const roomContent = document.getElementById('roomContent');
        const currentRoom = document.getElementById('currentRoom');
        
        if (!roomResult || !roomContent || !currentRoom) return;
        
        // Random room content types
        const roomTypes = ['monster', 'item', 'trap', 'story', 'merchant', 'rest'];
        const roomType = this.getRandomItem(roomTypes);
        
        let content = '';
        let icon = '';
        
        switch(roomType) {
            case 'monster':
                const monster = this.generateMonsterForRoom();
                content = `<div class="text-red-600">
                    <i class="fas fa-dragon text-2xl mb-2"></i>
                    <p><strong>Monster Encounter!</strong></p>
                    <p>${monster.name} (${monster.type})</p>
                    <p>HP: ${monster.hitPoints} | AC: ${monster.armorClass}</p>
                    <button onclick="window.dungeonGame.startCombatWithMonster()" class="bg-red-500 text-white px-3 py-1 rounded text-sm mt-2">Fight!</button>
                </div>`;
                icon = 'fas fa-skull text-red-500';
                break;
            case 'item':
                const item = this.getRandomItem(this.gameData.items);
                content = `<div class="text-yellow-600">
                    <i class="fas fa-gem text-2xl mb-2"></i>
                    <p><strong>Found Item!</strong></p>
                    <p>${item.name}</p>
                    <p class="text-sm">${item.description}</p>
                    <button onclick="window.dungeonGame.addItemToInventory('${item.name}')" class="bg-yellow-500 text-white px-3 py-1 rounded text-sm mt-2">Take Item</button>
                </div>`;
                icon = 'fas fa-coins text-yellow-500';
                break;
            case 'trap':
                const trap = this.getRandomItem(this.gameData.traps);
                content = `<div class="text-orange-600">
                    <i class="fas fa-exclamation-triangle text-2xl mb-2"></i>
                    <p><strong>Trap Triggered!</strong></p>
                    <p>${trap}</p>
                    <p class="text-sm text-red-600">You take damage!</p>
                </div>`;
                icon = 'fas fa-fire text-orange-500';
                break;
            case 'story':
                const story = this.getRandomItem(this.gameData.stories);
                content = `<div class="text-purple-600">
                    <i class="fas fa-book text-2xl mb-2"></i>
                    <p><strong>Ancient Story</strong></p>
                    <p class="text-sm italic">${story}</p>
                </div>`;
                icon = 'fas fa-scroll text-purple-500';
                break;
            case 'merchant':
                const merchant = this.getRandomItem(this.gameData.merchants);
                content = `<div class="text-blue-600">
                    <i class="fas fa-store text-2xl mb-2"></i>
                    <p><strong>${merchant}</strong></p>
                    <p class="text-sm">Offers rare goods and services</p>
                    <button onclick="window.dungeonGame.openMerchant()" class="bg-blue-500 text-white px-3 py-1 rounded text-sm mt-2">Browse Goods</button>
                </div>`;
                icon = 'fas fa-shopping-cart text-blue-500';
                break;
            case 'rest':
                const restArea = this.getRandomItem(this.gameData.restAreas);
                content = `<div class="text-green-600">
                    <i class="fas fa-bed text-2xl mb-2"></i>
                    <p><strong>${restArea}</strong></p>
                    <p class="text-sm">Restore your health and energy</p>
                    <button onclick="window.dungeonGame.restInArea()" class="bg-green-500 text-white px-3 py-1 rounded text-sm mt-2">Rest Here</button>
                </div>`;
                icon = 'fas fa-heart text-green-500';
                break;
        }
        
        roomContent.innerHTML = content;
        currentRoom.innerHTML = `<i class="${icon} text-3xl mb-2"></i><p>Room explored!</p>`;
        roomResult.classList.remove('hidden');
        
        this.showToast(`Found: ${roomType}!`, 'info');
    }

    generateMonsterForRoom() {
        return {
            name: this.getRandomItem(this.gameData.monsterNames),
            type: this.getRandomItem(this.gameData.monsterTypes),
            hitPoints: Math.floor(Math.random() * 50) + 20,
            armorClass: Math.floor(Math.random() * 5) + 12
        };
    }

    addItemToInventory(itemName) {
        this.showToast(`Added ${itemName} to inventory!`, 'success');
    }

    openMerchant() {
        this.showToast('Merchant interface coming soon!', 'info');
    }

    restInArea() {
        this.showToast('Health restored! 💚', 'success');
    }

    startCombatWithMonster() {
        this.showToast('Combat system activated!', 'warning');
    }

    rest() {
        this.showToast('You rest and recover your strength! 💤', 'success');
    }

    useItem() {
        this.showToast('Select an item from your inventory', 'info');
    }

    checkInventory() {
        this.showToast('Inventory: Empty (for now)', 'info');
    }

    saveGame() {
        const gameState = {
            hero: this.hero,
            monster: this.monster,
            dungeonSize: this.dungeonSize,
            roomCount: this.roomCount,
            timestamp: new Date().toISOString()
        };

        localStorage.setItem('dungeonGameSave', JSON.stringify(gameState));
        this.showToast('Game saved successfully! 💾', 'success');
    }

    loadGame() {
        const savedGame = localStorage.getItem('dungeonGameSave');
        if (!savedGame) {
            this.showToast('No saved game found!', 'error');
            return;
        }

        try {
            const gameState = JSON.parse(savedGame);

            if (gameState.hero) {
                this.hero = gameState.hero;
                this.displayHero(this.hero);
            }

            if (gameState.monster) {
                this.monster = gameState.monster;
                this.displayMonster(this.monster);
            }

            this.dungeonSize = gameState.dungeonSize || 5;
            this.roomCount = gameState.roomCount || 6;

            document.getElementById('dungeonSize').value = this.dungeonSize;
            document.getElementById('roomCount').value = this.roomCount;
            document.getElementById('roomCountDisplay').textContent = this.roomCount;

            this.showToast('Game loaded successfully! 🎮', 'success');
        } catch (error) {
            this.showToast('Error loading game!', 'error');
        }
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

// ... (rest of the code remains the same)

// Initialize game when DOM loads
document.addEventListener('DOMContentLoaded', () => {
    window.dungeonGame = new DungeonGame();
});
