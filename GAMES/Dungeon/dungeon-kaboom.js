// Dungeon Master RPG - Kaboom.js Version
// A complete rebuild using Kaboom.js game engine

import kaboom from "https://unpkg.com/kaboom/dist/kaboom.mjs";

// Import sprites
import "./sprites.js";

// Initialize Kaboom
kaboom({
    global: true,
    fullscreen: false,
    scale: 1,
    debug: true,
    clearColor: [0, 0, 0, 1],
    width: 1200,
    height: 800,
    canvas: document.querySelector("#gameCanvas"),
});

// Game state
window.gameState = {
    hero: null,
    monsters: [],
    currentDungeon: null,
    gameData: null,
    score: 0,
    level: 1,
    cameraLocked: true
};

// Game data
const gameData = {
    heroNames: ['Aragorn', 'Legolas', 'Gimli', 'Frodo', 'Gandalf', 'Eowyn', 'Boromir'],
    races: ['Human', 'Elf', 'Dwarf', 'Hobbit', 'Half-Elf'],
    classes: ['Fighter', 'Wizard', 'Rogue', 'Cleric', 'Ranger', 'Barbarian'],
    monsterNames: ['Goblin', 'Orc', 'Dragon', 'Skeleton', 'Troll', 'Spider', 'Ghost'],
    monsterTypes: ['Undead', 'Beast', 'Dragon', 'Humanoid', 'Elemental'],
    abilities: ['Fire Breath', 'Magic Missile', 'Sword Strike', 'Poison Bite', 'Life Drain'],
    items: [
        { name: 'Sword of Flames', type: 'weapon', rarity: 'legendary', damage: 20 },
        { name: 'Ring of Invisibility', type: 'accessory', rarity: 'rare' },
        { name: 'Health Potion', type: 'consumable', rarity: 'common', healing: 50 }
    ],
    rooms: [
        'Empty Room', 'Treasure Room', 'Monster Lair', 'Trap Room', 
        'Library', 'Armory', 'Altar Room', 'Garden'
    ]
};

// Utility functions
function getRandomItem(array) {
    return array[Math.floor(Math.random() * array.length)];
}

function getRandomItems(array, count) {
    const shuffled = [...array].sort(() => 0.5 - Math.random());
    return shuffled.slice(0, count);
}

function distance(a, b) {
    return Math.sqrt(Math.pow(a.pos.x - b.pos.x, 2) + Math.pow(a.pos.y - b.pos.y, 2));
}

// Generate hero
function generateHero() {
    const name = getRandomItem(gameData.heroNames);
    const race = getRandomItem(gameData.races);
    const characterClass = getRandomItem(gameData.classes);
    
    return {
        name,
        race,
        characterClass,
        level: 1,
        xp: 0,
        hp: 100,
        maxHp: 100,
        mp: 50,
        maxMp: 50,
        stats: {
            str: Math.floor(Math.random() * 6) + 10,
            dex: Math.floor(Math.random() * 6) + 10,
            int: Math.floor(Math.random() * 6) + 10,
            wis: Math.floor(Math.random() * 6) + 10
        },
        x: 100,
        y: 100,
        inventory: [],
        equipment: {
            weapon: null,
            armor: null,
            accessory: null
        }
    };
}

// Generate monster
function generateMonster(x = 400, y = 200) {
    const name = getRandomItem(gameData.monsterNames);
    const type = getRandomItem(gameData.monsterTypes);
    
    return {
        name,
        type,
        level: Math.floor(Math.random() * 3) + 1,
        hp: 30 + (Math.random() * 20),
        maxHp: 30 + (Math.random() * 20),
        abilities: getRandomItems(gameData.abilities, 2),
        x: x,
        y: y,
        speed: 50 + Math.random() * 50,
        damage: 5 + Math.random() * 15
    };
}

// Scene: Menu
scene("menu", () => {
    // Background
    add([
        rect(width(), height()),
        color(20, 20, 30),
        pos(0, 0)
    ]);
    
    // Title
    add([
        text("DUNGEON MASTER RPG", { size: 48, font: "sink" }),
        pos(width() / 2, height() / 2 - 150),
        origin("center"),
        color(255, 215, 0)
    ]);
    
    // Subtitle
    add([
        text("Kaboom.js Edition", { size: 24 }),
        pos(width() / 2, height() / 2 - 100),
        origin("center"),
        color(255, 255, 255)
    ]);
    
    // Menu options
    add([
        text("â–¶ START GAME", { size: 24 }),
        pos(width() / 2, height() / 2 - 20),
        origin("center"),
        color(255, 255, 255)
    ]);
    
    add([
        text("í³– HOW TO PLAY", { size: 24 }),
        pos(width() / 2, height() / 2 + 20),
        origin("center"),
        color(255, 255, 255)
    ]);
    
    add([
        text("âš™ï¸  SETTINGS", { size: 24 }),
        pos(width() / 2, height() / 2 + 60),
        origin("center"),
        color(255, 255, 255)
    ]);
    
    // Instructions
    add([
        text("Use WASD to move, SPACE to attack", { size: 16 }),
        pos(width() / 2, height() - 80),
        origin("center"),
        color(150, 150, 150)
    ]);
    
    // Controls
    onKeyPress("space", () => {
        go("game");
    });
    
    onKeyPress("enter", () => {
        go("game");
    });
    
    onKeyPress("h", () => {
        go("help");
    });
});

// Scene: Help
scene("help", () => {
    add([
        rect(width(), height()),
        color(20, 20, 30),
        pos(0, 0)
    ]);
    
    add([
        text("HOW TO PLAY", { size: 36 }),
        pos(width() / 2, 50),
        origin("center"),
        color(255, 215, 0)
    ]);
    
    const controls = [
        "í¾® CONTROLS:",
        "WASD - Move your hero",
        "SPACE - Attack nearby enemies",
        "E - Interact with objects",
        "I - Open inventory",
        "M - View map",
        "",
        "í¾¯ COMBAT:",
        "Get close to enemies and press SPACE",
        "Use strategy and positioning",
        "Collect items to increase power",
        "",
        "í¿† OBJECTIVE:",
        "Explore the dungeon",
        "Defeat monsters",
        "Collect treasure",
        "Level up your character"
    ];
    
    controls.forEach((text, i) => {
        add([
            text(text, { size: text.startsWith("í¾®") || text.startsWith("í¾¯") || text.startsWith("í¿†") ? 20 : 16 }),
            pos(width() / 2, 120 + i * 25),
            origin("center"),
            color(text.includes("WASD") || text.includes("SPACE") ? [100, 255, 100] : [255, 255, 255])
        ]);
    });
    
    add([
        text("Press SPACE to return to menu", { size: 18 }),
        pos(width() / 2, height() - 50),
        origin("center"),
        color(255, 255, 0)
    ]);
    
    onKeyPress("space", () => {
        go("menu");
    });
});

// Scene: Game
scene("game", () => {
    // Background
    add([
        rect(width(), height()),
        color(20, 20, 30),
        pos(0, 0)
    ]);
    
    // Generate hero if not exists
    if (!window.gameState.hero) {
        window.gameState.hero = generateHero();
    }
    
    // Create dungeon floor
    for (let x = 0; x < width(); x += 32) {
        for (let y = 0; y < height(); y += 32) {
            add([
                sprite("floor"),
                pos(x, y),
                scale(1),
                "floor"
            ]);
        }
    }
    
    // Add some walls
    const walls = [
        {x: 200, y: 200}, {x: 232, y: 200}, {x: 264, y: 200},
        {x: 400, y: 300}, {x: 432, y: 300},
        {x: 600, y: 150}, {x: 632, y: 150}, {x: 664, y: 150}, {x: 696, y: 150}
    ];
    
    walls.forEach(wall => {
        add([
            sprite("wall"),
            pos(wall.x, wall.y),
            scale(1),
            area(),
            solid(),
            "wall"
        ]);
    });
    
    // Add some treasure
    add([
        sprite("treasure"),
        pos(500, 300),
        scale(1),
        area(),
        "treasure"
    ]);
    
    add([
        sprite("potion"),
        pos(300, 400),
        scale(1),
        area(),
        "potion"
    ]);
    
    // Hero sprite
    const hero = add([
        sprite("hero"),
        pos(window.gameState.hero.x, window.gameState.hero.y),
        scale(1.5),
        area(),
        "hero",
        {
            speed: 120,
            lastAttack: 0
        }
    ]);
    
    // Monsters
    const monster1 = add([
        sprite("monster"),
        pos(400, 200),
        scale(1.5),
        area(),
        "monster",
        {
            hp: 50,
            maxHp: 50,
            speed: 80,
            damage: 10,
            lastAttack: 0
        }
    ]);
    
    const monster2 = add([
        sprite("monster"),
        pos(600, 400),
        scale(1.5),
        area(),
        "monster",
        {
            hp: 30,
            maxHp: 30,
            speed: 60,
            damage: 8,
            lastAttack: 0
        }
    ]);
    
    window.gameState.monsters = [monster1, monster2];
    
    // Camera follow hero
    hero.onUpdate(() => {
        if (window.gameState.cameraLocked) {
            camPos(hero.pos.x, hero.pos.y);
        }
    });
    
    // Controls
    onKeyDown("a", () => {
        if (hero.pos.x > 0) {
            hero.move(-hero.speed, 0);
            window.gameState.hero.x = hero.pos.x;
        }
    });
    
    onKeyDown("d", () => {
        if (hero.pos.x < width() - 32) {
            hero.move(hero.speed, 0);
            window.gameState.hero.x = hero.pos.x;
        }
    });
    
    onKeyDown("w", () => {
        if (hero.pos.y > 0) {
            hero.move(0, -hero.speed);
            window.gameState.hero.y = hero.pos.y;
        }
    });
    
    onKeyDown("s", () => {
        if (hero.pos.y < height() - 32) {
            hero.move(0, hero.speed);
            window.gameState.hero.y = hero.pos.y;
        }
    });
    
    // Attack
    onKeyPress("space", () => {
        const now = Date.now();
        if (now - hero.lastAttack < 500) return; // Attack cooldown
        hero.lastAttack = now;
        
        window.gameState.monsters.forEach(monster => {
            if (distance(hero, monster) < 80) {
                // Attack successful
                const damage = Math.floor(Math.random() * 15) + window.gameState.hero.stats.str / 2;
                monster.hp -= damage;
                
                // Visual feedback
                add([
                    text(`-${damage}`, { size: 20 }),
                    pos(monster.pos.x, monster.pos.y - 20),
                    color(255, 0, 0),
                    lifespan(1)
                ]);
                
                // Shake effect
                shake(5);
                
                // Check if monster is dead
                if (monster.hp <= 0) {
                    // Monster defeated
                    add([
                        text("MONSTER DEFEATED!", { size: 24 }),
                        pos(width() / 2, height() / 2),
                        origin("center"),
                        color(255, 255, 0),
                        lifespan(2)
                    ]);
                    
                    destroy(monster);
                    window.gameState.monsters = window.gameState.monsters.filter(m => m !== monster);
                    window.gameState.hero.xp += 25;
                    
                    // Level up check
                    if (window.gameState.hero.xp >= window.gameState.hero.level * 100) {
                        window.gameState.hero.level++;
                        window.gameState.hero.maxHp += 20;
                        window.gameState.hero.hp = window.gameState.hero.maxHp;
                        add([
                            text(`LEVEL UP! Level ${window.gameState.hero.level}`, { size: 28 }),
                            pos(width() / 2, height() / 2),
                            origin("center"),
                            color(255, 215, 0),
                            lifespan(3)
                        ]);
                    }
                }
            }
        });
    });
    
    // Monster AI
    onUpdate(() => {
        window.gameState.monsters.forEach(monster => {
            if (monster.hp > 0) {
                const now = Date.now();
                if (now - monster.lastAttack > 2000) { // Monster attack cooldown
                    monster.lastAttack = now;
                    
                    if (distance(hero, monster) < 80) {
                        // Monster attacks hero
                        const damage = monster.damage;
                        window.gameState.hero.hp -= damage;
                        
                        add([
                            text(`-${damage}`, { size: 20 }),
                            pos(hero.pos.x, hero.pos.y - 20),
                            color(255, 100, 100),
                            lifespan(1)
                        ]);
                        
                        // Check if hero is dead
                        if (window.gameState.hero.hp <= 0) {
                            add([
                                text("GAME OVER!", { size: 48 }),
                                pos(width() / 2, height() / 2),
                                origin("center"),
                                color(255, 0, 0),
                                lifespan(3)
                            ]);
                            go("menu");
                        }
                    }
                }
            }
        });
    });
    
    // Item collection
    onCollide("hero", "treasure", (hero, treasure) => {
        destroy(treasure);
        const item = getRandomItem(gameData.items);
        window.gameState.hero.inventory.push(item);
        
        add([
            text(`Found: ${item.name}!`, { size: 20 }),
            pos(hero.pos.x, hero.pos.y - 30),
            color(255, 215, 0),
            lifespan(2)
        ]);
    });
    
    onCollide("hero", "potion", (hero, potion) => {
        destroy(potion);
        const healing = 30;
        window.gameState.hero.hp = Math.min(window.gameState.hero.maxHp, window.gameState.hero.hp + healing);
        
        add([
            text(`+${healing} HP!`, { size: 20 }),
            pos(hero.pos.x, hero.pos.y - 30),
            color(0, 255, 0),
            lifespan(2)
        ]);
    });
});

// Start with menu
go("menu");

// Debug info
onUpdate(() => {
    if (window.gameState.hero) {
        debug.log(`Hero: ${window.gameState.hero.name} | HP: ${window.gameState.hero.hp}/${window.gameState.hero.maxHp} | XP: ${window.gameState.hero.xp} | Level: ${window.gameState.hero.level}`);
    }
});
