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

    getRandomItems(array, count) {
        const shuffled = [...array].sort(() => 0.5 - Math.random());
        return shuffled.slice(0, count);
    }

    loadGameData() {
        return {
            heroNames: [
                'Aragorn', 'Legolas', 'Gimli', 'Frodo', 'Sam', 'Merry', 'Pippin',
                'Gandalf', 'Boromir', 'Eowyn', 'Faramir', 'Galadriel', 'Elrond',
                'Thorin', 'Balin', 'Dwalin', 'Kili', 'Fili', 'Bifur', 'Bofur',
                'Bombur', 'Dori', 'Nori', 'Ori', 'Oin', 'Gloin', 'Bilbo'
            ],
            races: [
                'Human', 'Elf', 'Dwarf', 'Hobbit', 'Half-Elf', 'Half-Orc',
                'Tiefling', 'Dragonborn', 'Gnome', 'Aarakocra', 'Genasi', 'Aasimar'
            ],
            classes: [
                'Fighter', 'Wizard', 'Rogue', 'Cleric', 'Ranger', 'Barbarian',
                'Bard', 'Druid', 'Monk', 'Paladin', 'Sorcerer', 'Warlock'
            ],
            monsterNames: [
                'Ancient Red Dragon', 'Beholder', 'Mind Flayer', 'Lich', 'Vampire',
                'Aboleth', 'Pit Fiend', 'Balor', 'Kraken', 'Tarrasque', 'Death Knight',
                'Iron Golem', 'Stone Golem', 'Clay Golem', 'Flesh Golem', 'Bone Devil'
            ],
            monsterTypes: [
                'Dragon', 'Aberration', 'Undead', 'Fiend', 'Elemental', 'Construct',
                'Monstrosity', 'Giant', 'Celestial', 'Fey', 'Plant', 'Ooze'
            ],
            abilities: [
                'Fire Breath', 'Poison Sting', 'Magic Resistance', 'Regeneration',
                'Flight', 'Invisibility', 'Teleport', 'Mind Control', 'Paralysis',
                'Acid Spray', 'Lightning Bolt', 'Ice Storm', 'Earthquake', 'Summon Minions'
            ]
        };
    }
}

// Initialize game when DOM loads
document.addEventListener('DOMContentLoaded', () => {
    window.dungeonGame = new DungeonGame();
});
