// Enhanced Combat System with proper monster generation and combat resolution
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
        this.addCombatLog(`${this.hero.name} has fallen! í²€`);
        this.showToast('You have been defeated!', 'error');
        this.exitPlayMode();
    } else if (this.monster.hp <= 0) {
        this.addCombatLog(`${this.monster.name} defeated! í¾‰`);
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
