// Dungeon Master RPG - Main Game Logic
// Organized and properly structured

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

// Sprite definitions
const heroSprite = `
<svg width="32" height="32" xmlns="http://www.w3.org/2000/svg">
  <rect width="32" height="32" fill="#4A90E2" rx="4"/>
  <circle cx="12" cy="12" r="2" fill="#000"/>
  <circle cx="20" cy="12" r="2" fill="#000"/>
  <path d="M10 20 Q16 24 22 20" stroke="#000" stroke-width="2" fill="none"/>
  <rect x="8" y="8" width="16" height="16" fill="none" stroke="#FFD700" stroke-width="1"/>
</svg>
`;

const monsterSprite = `
<svg width="32" height="32" xmlns="http://www.w3.org/2000/svg">
  <rect width="32" height="32" fill="#E74C3C" rx="4"/>
  <circle cx="10" cy="10" r="2" fill="#000"/>
  <circle cx="22" cy="10" r="2" fill="#000"/>
  <rect x="8" y="18" width="4" height="6" fill="#000"/>
  <rect x="12" y="20" width="2" height="4" fill="#FFF"/>
  <rect x="18" y="20" width="2" height="4" fill="#FFF"/>
  <rect x="20" y="18" width="4" height="6" fill="#000"/>
</svg>
`;

const wallSprite = `
<svg width="32" height="32" xmlns="http://www.w3.org/2000/svg">
  <rect width="32" height="32" fill="#666" rx="2"/>
  <rect x="0" y="0" width="16" height="16" fill="#777" rx="1"/>
  <rect x="16" y="16" width="16" height="16" fill="#777" rx="1"/>
  <rect x="8" y="8" width="4" height="4" fill="#555"/>
  <rect x="20" y="4" width="4" height="4" fill="#555"/>
</svg>
`;

const floorSprite = `
<svg width="32" height="32" xmlns="http://www.w3.org/2000/svg">
  <rect width="32" height="32" fill="#8B4513" rx="1"/>
  <rect x="0" y="0" width="16" height="16" fill="#A0522D"/>
  <rect x="16" y="16" width="16" height="16" fill="#A0522D"/>
  <circle cx="8" cy="8" r="1" fill="#654321"/>
  <circle cx="24" cy="24" r="1" fill="#654321"/>
</svg>
`;

const treasureSprite = `
<svg width="32" height="32" xmlns="http://www.w3.org/2000/svg">
  <rect width="32" height="32" fill="#FFD700" rx="4"/>
  <polygon points="16,8 20,16 16,20 12,16" fill="#FFA500"/>
  <circle cx="16" cy="12" r="2" fill="#FF4500"/>
</svg>
`;

const potionSprite = `
<svg width="32" height="32" xmlns="http://www.w3.org/2000/svg">
  <rect width="32" height="32" fill="#00FF00" rx="4"/>
  <ellipse cx="16" cy="16" rx="12" ry="8" fill="#32CD32"/>
  <path d="M8 16 Q16 8 24 16" stroke="#228B22" stroke-width="2" fill="none"/>
</svg>
`;

// Convert SVG to data URL
function svgToDataURL(svg) {
    return 'data:image/svg+xml;base64,' + btoa(svg);
}

// Room-based dungeon functions
function generateDungeon(width, height) {
    const dungeon = [];
    const roomTypes = ['empty', 'monster', 'treasure', 'potion', 'trap', 'dark'];

    for (let y = 0; y < height; y++) {
        dungeon[y] = [];
        for (let x = 0; x < width; x++) {
            // Entrance is always at (0,0)
            const type = (x === 0 && y === 0) ? 'entrance' :
                       Math.random() < 0.1 ? getRandomItem(roomTypes) : 'empty';
            dungeon[y][x] = {
                type: type,
                visited: (x === 0 && y === 0),
                discovered: (x === 0 && y === 0),
                content: generateRoomContent(type)
            };
        }
    }

    return dungeon;
}

function generateRoomContent(roomType) {
    switch(roomType) {
        case 'monster':
            return generateMonster();
        case 'treasure':
            return getRandomItem(gameData.items);
        case 'potion':
            return { type: 'potion', healing: 20 + Math.random() * 30 };
        case 'trap':
            return { type: 'trap', damage: 10 + Math.random() * 20 };
        default:
            return null;
    }
}

function drawDungeonGrid() {
    const gridSize = 80; // Much larger grid
    const startX = 100; // Move to left side but give space for legend
    const startY = 100;

    // Draw main grid background - make it very prominent
    add([
        rect(gridSize * window.gameState.dungeon[0].length + 40,
             gridSize * window.gameState.dungeon.length + 40),
        color(20, 30, 50), // Dark blue background
        pos(startX - 20, startY - 20),
        "minimap",
        outline(4, color(100, 150, 255)) // Bright blue outline
    ]);

    // Add grid title
    add([
        text("DUNGEON MAP", { size: 24 }),
        pos(startX + (gridSize * window.gameState.dungeon[0].length)/2, startY - 50),
        anchor("center"),
        color(255, 255, 255)
    ]);

    // Draw legend/key on the left
    drawLegend(startX - 80, startY);

    // Draw rooms with much better visibility
    for (let y = 0; y < window.gameState.dungeon.length; y++) {
        for (let x = 0; x < window.gameState.dungeon[0].length; x++) {
            const room = window.gameState.dungeon[y][x];
            const roomX = startX + x * gridSize;
            const roomY = startY + y * gridSize;

            let roomColor = [50, 50, 50]; // Default empty room
            if (room.type === 'entrance') roomColor = [0, 200, 100]; // Green
            else if (room.type === 'monster') roomColor = [200, 50, 50]; // Red
            else if (room.type === 'treasure') roomColor = [200, 200, 0]; // Yellow
            else if (room.type === 'potion') roomColor = [0, 200, 200]; // Cyan
            else if (room.type === 'trap') roomColor = [200, 0, 200]; // Magenta

            if (room.discovered) {
                // Main room background
                add([
                    rect(gridSize - 8, gridSize - 8),
                    color(roomColor[0]/2, roomColor[1]/2, roomColor[2]/2), // Darker background
                    pos(roomX, roomY),
                    "room"
                ]);

                // Room border
                add([
                    rect(gridSize - 8, gridSize - 8),
                    color(roomColor[0], roomColor[1], roomColor[2]),
                    pos(roomX, roomY),
                    outline(2, color(255, 255, 255)),
                    "room"
                ]);

                // Add room type indicator - larger and clearer
                let symbol = '';
                let symbolColor = [255, 255, 255];
                if (room.type === 'entrance') { symbol = 'E'; symbolColor = [255, 255, 255]; }
                else if (room.type === 'monster') { symbol = 'M'; symbolColor = [255, 255, 255]; }
                else if (room.type === 'treasure') { symbol = 'T'; symbolColor = [0, 0, 0]; }
                else if (room.type === 'potion') { symbol = 'P'; symbolColor = [0, 0, 0]; }
                else if (room.type === 'trap') { symbol = 'X'; symbolColor = [255, 255, 255]; }

                if (symbol) {
                    add([
                        text(symbol, { size: 24 }), // Larger text
                        pos(roomX + gridSize/2, roomY + gridSize/2),
                        anchor("center"),
                        color(symbolColor[0], symbolColor[1], symbolColor[2])
                    ]);
                }

                // Current room indicator - very obvious
                if (x === window.gameState.currentRoom.x && y === window.gameState.currentRoom.y) {
                    // Multiple indicators for current room
                    add([
                        rect(gridSize - 8, gridSize - 8),
                        color(255, 255, 255),
                        pos(roomX, roomY),
                        opacity(0.3),
                        "current"
                    ]);
                    add([
                        rect(gridSize - 8, gridSize - 8),
                        color(255, 255, 0), // Yellow border
                        pos(roomX, roomY),
                        outline(4, color(255, 255, 0)),
                        "current"
                    ]);
                    // Add animated "YOU" text
                    add([
                        text("YOU", { size: 16 }),
                        pos(roomX + gridSize/2, roomY + gridSize/2 - 12),
                        anchor("center"),
                        color(255, 0, 0), // Red text
                        "current"
                    ]);
                }
            } else {
                // Undiscovered rooms - clearly marked
                add([
                    rect(gridSize - 8, gridSize - 8),
                    color(20, 20, 20), // Very dark
                    pos(roomX, roomY),
                    "room"
                ]);
                add([
                    rect(gridSize - 8, gridSize - 8),
                    color(100, 100, 100),
                    pos(roomX, roomY),
                    outline(1, color(150, 150, 150)),
                    "room"
                ]);
                add([
                    text("?", { size: 24 }),
                    pos(roomX + gridSize/2, roomY + gridSize/2),
                    anchor("center"),
                    color(150, 150, 150)
                ]);
            }
        }
    }

    // Add directional indicators
    addDirectionalIndicators(startX, startY, gridSize);
}

function drawLegend(startX, startY) {
    const legendY = startY;

    // Legend background
    add([
        rect(70, 200),
        color(30, 30, 50),
        pos(startX, legendY),
        outline(2, color(100, 150, 255))
    ]);

    // Legend title
    add([
        text("LEGEND", { size: 16 }),
        pos(startX + 35, legendY + 10),
        anchor("center"),
        color(255, 255, 255)
    ]);

    // Room type explanations
    const legendItems = [
        { symbol: "E", color: [0, 200, 100], desc: "Entrance" },
        { symbol: "M", color: [200, 50, 50], desc: "Monster" },
        { symbol: "T", color: [200, 200, 0], desc: "Treasure" },
        { symbol: "P", color: [0, 200, 200], desc: "Potion" },
        { symbol: "X", color: [200, 0, 200], desc: "Trap" },
        { symbol: "?", color: [150, 150, 150], desc: "Unknown" }
    ];

    legendItems.forEach((item, i) => {
        const y = legendY + 30 + i * 25;

        // Color square
        add([
            rect(15, 15),
            color(item.color[0], item.color[1], item.color[2]),
            pos(startX + 10, y)
        ]);

        // Symbol
        add([
            text(item.symbol, { size: 14 }),
            pos(startX + 25, y + 7),
            anchor("left"),
            color(255, 255, 255)
        ]);

        // Description
        add([
            text(item.desc, { size: 12 }),
            pos(startX + 45, y + 7),
            anchor("left"),
            color(200, 200, 200)
        ]);
    });

    // Current room indicator
    add([
        text("Yellow border =", { size: 12 }),
        pos(startX + 5, legendY + 180),
        color(255, 255, 0)
    ]);
    add([
        text("Your location", { size: 12 }),
        pos(startX + 5, legendY + 195),
        color(255, 255, 0)
    ]);
}

function addDirectionalIndicators(startX, startY, gridSize) {
    // North arrow
    add([
        text("N", { size: 16 }),
        pos(startX + (gridSize * window.gameState.dungeon[0].length)/2, startY - 30),
        anchor("center"),
        color(255, 255, 255)
    ]);

    // South arrow
    add([
        text("S", { size: 16 }),
        pos(startX + (gridSize * window.gameState.dungeon[0].length)/2,
            startY + gridSize * window.gameState.dungeon.length + 25),
        anchor("center"),
        color(255, 255, 255)
    ]);

    // West arrow
    add([
        text("W", { size: 16 }),
        pos(startX - 25, startY + (gridSize * window.gameState.dungeon.length)/2),
        anchor("center"),
        color(255, 255, 255)
    ]);

    // East arrow
    add([
        text("E", { size: 16 }),
        pos(startX + gridSize * window.gameState.dungeon[0].length + 25,
            startY + (gridSize * window.gameState.dungeon.length)/2),
        anchor("center"),
        color(255, 255, 255)
    ]);
}

function updateRoomDescriptionPanel() {
    // Remove existing panel
    destroyAll("roomPanel");

    // Add updated room description panel
    add([
        rect(300, 120),
        color(20, 30, 50),
        pos(width() - 320, 20),
        outline(2, color(100, 150, 255)),
        "roomPanel"
    ]);

    add([
        text("CURRENT ROOM", { size: 18 }),
        pos(width() - 170, 35),
        anchor("center"),
        color(255, 255, 255),
        "roomPanel"
    ]);

    add([
        text(`${describeRoom().toUpperCase()}`, { size: 16 }),
        pos(width() - 170, 60),
        anchor("center"),
        color(255, 215, 0),
        "roomPanel"
    ]);

    add([
        text("Use WASD to move", { size: 14 }),
        pos(width() - 170, 85),
        anchor("center"),
        color(200, 200, 200),
        "roomPanel"
    ]);

    add([
        text("SPACE to interact", { size: 14 }),
        pos(width() - 170, 105),
        anchor("center"),
        color(200, 200, 200),
        "roomPanel"
    ]);
}

function showMovementFeedback(direction) {
    add([
        text(`→ ${direction}`, { size: 24 }),
        pos(width() / 2, height() / 2 - 100),
        anchor("center"),
        color(255, 255, 0),
        lifespan(1)
    ]);
}

function drawCurrentRoom() {
    const room = window.gameState.dungeon[window.gameState.currentRoom.y][window.gameState.currentRoom.x];

    // Mark room as discovered and visited
    room.discovered = true;
    room.visited = true;

    // Update UI with room info
    updateRoomDisplay(room);
}

function updateRoomDisplay(room) {
    // This would update the UI to show room information
    // For now, we'll use the adventure log
}

function addRoomEntry(message) {
    // Add message to adventure log (we'll implement this properly later)
    console.log(`[ADVENTURE LOG] ${message}`);
}

function describeRoom() {
    const room = window.gameState.dungeon[window.gameState.currentRoom.y][window.gameState.currentRoom.x];
    const roomNames = {
        'entrance': 'the dungeon entrance',
        'empty': 'an empty room',
        'monster': 'a room with a monster',
        'treasure': 'a treasure room',
        'potion': 'a room with a healing potion',
        'trap': 'a dangerous trap room',
        'dark': 'a dark, mysterious room'
    };
    return roomNames[room.type] || 'an unknown room';
}

function interactWithRoom() {
    const room = window.gameState.dungeon[window.gameState.currentRoom.y][window.gameState.currentRoom.x];

    if (room.content) {
        switch(room.type) {
            case 'monster':
                // Combat system
                const monster = room.content;
                const damage = Math.floor(Math.random() * 10) + window.gameState.hero.stats.str / 2;
                monster.hp -= damage;
                addRoomEntry(`You attack the ${monster.name} for ${damage} damage!`);

                if (monster.hp <= 0) {
                    addRoomEntry(`You defeated the ${monster.name}! Gained ${monster.level * 10} XP.`);
                    window.gameState.hero.xp += monster.level * 10;
                    room.type = 'empty';
                    room.content = null;
                } else {
                    // Monster counterattacks
                    const monsterDamage = monster.damage;
                    window.gameState.hero.hp -= monsterDamage;
                    addRoomEntry(`The ${monster.name} attacks you for ${monsterDamage} damage!`);

                    if (window.gameState.hero.hp <= 0) {
                        addRoomEntry("You have been defeated! Game Over.");
                        go("menu");
                    }
                }
                break;

            case 'treasure':
                window.gameState.hero.inventory.push(room.content);
                addRoomEntry(`You found ${room.content.name}!`);
                room.type = 'empty';
                room.content = null;
                break;

            case 'potion':
                const healing = room.content.healing;
                window.gameState.hero.hp = Math.min(window.gameState.hero.maxHp,
                                                   window.gameState.hero.hp + healing);
                addRoomEntry(`You drink the potion and heal ${healing} HP!`);
                room.type = 'empty';
                room.content = null;
                break;

            case 'trap':
                const trapDamage = room.content.damage;
                window.gameState.hero.hp -= trapDamage;
                addRoomEntry(`You trigger a trap and take ${trapDamage} damage!`);

                if (window.gameState.hero.hp <= 0) {
                    addRoomEntry("You have been defeated by a trap! Game Over.");
                    go("menu");
                } else {
                    room.type = 'empty';
                    room.content = null;
                }
                break;
        }
    } else {
        addRoomEntry(`You search ${describeRoom()} but find nothing interesting.`);
    }
}

// Scene: Menu
scene("menu", () => {
    add([
        rect(width(), height()),
        color(20, 20, 30),
        pos(0, 0)
    ]);

    add([
        text("DUNGEON MASTER RPG", { size: 48, font: "sink" }),
        pos(width() / 2, height() / 2 - 150),
        anchor("center"),
        color(255, 215, 0)
    ]);

    add([
        text("Kaboom.js Edition", { size: 24 }),
        pos(width() / 2, height() / 2 - 100),
        anchor("center"),
        color(255, 255, 255)
    ]);

    add([
        text("▶ START GAME", { size: 24 }),
        pos(width() / 2, height() / 2 - 20),
        anchor("center"),
        area(),
        color(255, 255, 255)
    ]);

    add([
        text("📖 HOW TO PLAY", { size: 24 }),
        pos(width() / 2, height() / 2 + 20),
        anchor("center"),
        area(),
        color(255, 255, 255)
    ]);

    add([
        text("⚙️  SETTINGS", { size: 24 }),
        pos(width() / 2, height() / 2 + 60),
        anchor("center"),
        area(),
        color(255, 255, 255)
    ]);

    add([
        text("Use WASD to move between rooms, SPACE to interact", { size: 16 }),
        pos(width() / 2, height() - 80),
        anchor("center"),
        color(150, 150, 150)
    ]);

    onKeyPress("space", () => {
        go("game");
    });

    onKeyPress("enter", () => {
        go("game");
    });

    onKeyPress("h", () => {
        go("help");
    });

    // Mouse support for menu - specific to clickable buttons only
    onClick((obj) => {
        // Check if object is a text component by looking for text property
        if (obj && obj.text && typeof obj.text === 'string' && (
            obj.text.includes("START GAME") ||
            obj.text.includes("HOW TO PLAY") ||
            obj.text.includes("SETTINGS")
        )) {
            if (obj.text.includes("START GAME")) {
                go("game");
            } else if (obj.text.includes("HOW TO PLAY")) {
                go("help");
            } else if (obj.text.includes("SETTINGS")) {
                go("game");
            }
        }
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
        anchor("center"),
        area(),
        color(255, 215, 0)
    ]);

    const controls = [
        "🎮 CONTROLS:",
        "WASD - Move between rooms (North, South, East, West)",
        "SPACE - Interact with room contents",
        "E - Examine room details",
        "I - View inventory",
        "M - View dungeon map",
        "",
        "🗺️ EXPLORATION:",
        "Move through the dungeon room by room",
        "Each room may contain treasures, monsters, or traps",
        "Search rooms to find hidden items",
        "Level up by defeating monsters",
        "",
        "🎯 OBJECTIVE:",
        "Explore the dungeon",
        "Collect treasures",
        "Defeat monsters",
        "Find your way out"
    ];

    controls.forEach((text, i) => {
        add([
            text(text, { size: text.startsWith("🎮") || text.startsWith("🗺️") || text.startsWith("🎯") ? 20 : 16 }),
            pos(width() / 2, 120 + i * 25),
            anchor("center"),
            area(),
            color(text.includes("WASD") || text.includes("SPACE") ? [100, 255, 100] : [255, 255, 255])
        ]);
    });

    add([
        text("Press SPACE to return to menu", { size: 18 }),
        pos(width() / 2, height() - 50),
        anchor("center"),
        area(),
        color(255, 255, 0)
    ]);

    onKeyPress("space", () => {
        go("menu");
    });

    // Mouse support for help scene - specific to return text only
    onClick((obj) => {
        // Check if object is a text component by looking for text property
        if (obj && obj.text && typeof obj.text === 'string' &&
            obj.text.includes("Press SPACE to return to menu")) {
            go("menu");
        }
    });
});

// Scene: Game - Room-based Dungeon Crawler
scene("game", () => {
    add([
        rect(width(), height()),
        color(20, 20, 30),
        pos(0, 0)
    ]);

    if (!window.gameState.hero) {
        window.gameState.hero = generateHero();
    }

    // Initialize room system
    if (!window.gameState.dungeon) {
        window.gameState.dungeon = generateDungeon(5, 5); // 5x5 grid
        window.gameState.currentRoom = { x: 0, y: 0 }; // Start at entrance
    }

    // Draw dungeon grid (visible mini-map)
    drawDungeonGrid();

    // Draw current room info
    drawCurrentRoom();

    // Hero positioned in center - smaller since grid is large
    const hero = add([
        sprite("hero"),
        pos(width() / 2, height() / 2),
        scale(1.2), // Smaller hero since grid is prominent
        area(),
        "hero"
    ]);

    // Add large room description in upper right
    updateRoomDescriptionPanel();

    // Room navigation controls
    onKeyPress("w", () => {
        if (window.gameState.currentRoom.y > 0) {
            window.gameState.currentRoom.y--;
            drawCurrentRoom();
            addRoomEntry("You move north");
            // Update room description panel
            updateRoomDescriptionPanel();
            // Show movement feedback
            showMovementFeedback("NORTH");
        }
    });

    onKeyPress("s", () => {
        if (window.gameState.currentRoom.y < window.gameState.dungeon.length - 1) {
            window.gameState.currentRoom.y++;
            drawCurrentRoom();
            addRoomEntry("You move south");
            updateRoomDescriptionPanel();
            showMovementFeedback("SOUTH");
        }
    });

    onKeyPress("a", () => {
        if (window.gameState.currentRoom.x > 0) {
            window.gameState.currentRoom.x--;
            drawCurrentRoom();
            addRoomEntry("You move west");
            updateRoomDescriptionPanel();
            showMovementFeedback("WEST");
        }
    });

    onKeyPress("d", () => {
        if (window.gameState.currentRoom.x < window.gameState.dungeon[0].length - 1) {
            window.gameState.currentRoom.x++;
            drawCurrentRoom();
            addRoomEntry("You move east");
            updateRoomDescriptionPanel();
            showMovementFeedback("EAST");
        }
    });

    // Room interaction
    onKeyPress("space", () => {
        interactWithRoom();
        // Update room panel after interaction
        setTimeout(() => {
            updateRoomDescriptionPanel();
        }, 500);
    });

    // Initial room description
    addRoomEntry(`You enter the dungeon. You are in ${describeRoom()}`);
});

// Load all sprites first, then start the game
loadSprite("hero", svgToDataURL(heroSprite));
loadSprite("monster", svgToDataURL(monsterSprite));
loadSprite("wall", svgToDataURL(wallSprite));
loadSprite("floor", svgToDataURL(floorSprite));
loadSprite("treasure", svgToDataURL(treasureSprite));
loadSprite("potion", svgToDataURL(potionSprite));

// Start the game after loading
go("menu");
