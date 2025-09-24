// Sprite definitions for Dungeon Master RPG
// Using simple colored rectangles as placeholders

// Hero sprite - Blue rectangle with simple face
const heroSprite = `
<svg width="32" height="32" xmlns="http://www.w3.org/2000/svg">
  <rect width="32" height="32" fill="#4A90E2" rx="4"/>
  <!-- Face -->
  <circle cx="12" cy="12" r="2" fill="#000"/>
  <circle cx="20" cy="12" r="2" fill="#000"/>
  <path d="M10 20 Q16 24 22 20" stroke="#000" stroke-width="2" fill="none"/>
  <!-- Armor -->
  <rect x="8" y="8" width="16" height="16" fill="none" stroke="#FFD700" stroke-width="1"/>
</svg>
`;

// Monster sprite - Red rectangle with teeth
const monsterSprite = `
<svg width="32" height="32" xmlns="http://www.w3.org/2000/svg">
  <rect width="32" height="32" fill="#E74C3C" rx="4"/>
  <!-- Eyes -->
  <circle cx="10" cy="10" r="2" fill="#000"/>
  <circle cx="22" cy="10" r="2" fill="#000"/>
  <!-- Mouth with teeth -->
  <rect x="8" y="18" width="4" height="6" fill="#000"/>
  <rect x="12" y="20" width="2" height="4" fill="#FFF"/>
  <rect x="18" y="20" width="2" height="4" fill="#FFF"/>
  <rect x="20" y="18" width="4" height="6" fill="#000"/>
</svg>
`;

// Wall sprite - Gray stone texture
const wallSprite = `
<svg width="32" height="32" xmlns="http://www.w3.org/2000/svg">
  <rect width="32" height="32" fill="#666" rx="2"/>
  <rect x="0" y="0" width="16" height="16" fill="#777" rx="1"/>
  <rect x="16" y="16" width="16" height="16" fill="#777" rx="1"/>
  <rect x="8" y="8" width="4" height="4" fill="#555"/>
  <rect x="20" y="4" width="4" height="4" fill="#555"/>
</svg>
`;

// Floor sprite - Brown texture
const floorSprite = `
<svg width="32" height="32" xmlns="http://www.w3.org/2000/svg">
  <rect width="32" height="32" fill="#8B4513" rx="1"/>
  <rect x="0" y="0" width="16" height="16" fill="#A0522D"/>
  <rect x="16" y="16" width="16" height="16" fill="#A0522D"/>
  <circle cx="8" cy="8" r="1" fill="#654321"/>
  <circle cx="24" cy="24" r="1" fill="#654321"/>
</svg>
`;

// Convert SVG to data URL
function svgToDataURL(svg) {
    return 'data:image/svg+xml;base64,' + btoa(svg);
}

// Load sprites into Kaboom
loadSprite("hero", svgToDataURL(heroSprite));
loadSprite("monster", svgToDataURL(monsterSprite));
loadSprite("wall", svgToDataURL(wallSprite));
loadSprite("floor", svgToDataURL(floorSprite));

// Additional sprites
loadSprite("treasure", svgToDataURL(`
<svg width="32" height="32" xmlns="http://www.w3.org/2000/svg">
  <rect width="32" height="32" fill="#FFD700" rx="4"/>
  <polygon points="16,8 20,16 16,20 12,16" fill="#FFA500"/>
  <circle cx="16" cy="12" r="2" fill="#FF4500"/>
</svg>
`));

loadSprite("potion", svgToDataURL(`
<svg width="32" height="32" xmlns="http://www.w3.org/2000/svg">
  <rect width="32" height="32" fill="#00FF00" rx="4"/>
  <ellipse cx="16" cy="16" rx="12" ry="8" fill="#32CD32"/>
  <path d="M8 16 Q16 8 24 16" stroke="#228B22" stroke-width="2" fill="none"/>
</svg>
`));

console.log('✅ Sprites loaded successfully');
