import { PlayerStats, Vector2, Enemy, Projectile } from '../types';

export class GameEngine {
  canvas: HTMLCanvasElement;
  ctx: CanvasRenderingContext2D;
  
  width: number;
  height: number;
  
  lastTime: number = 0;
  animationId: number = 0;
  
  keys: Set<string> = new Set();
  
  // Game state
  paused: boolean = false;
  playerPos: Vector2 = { x: 400, y: 300 };
  playerVel: Vector2 = { x: 0, y: 0 };
  
  stats: PlayerStats;
  enemies: Enemy[] = [];
  projectiles: Projectile[] = [];
  
  // Callbacks
  onUpdateStats: (stats: PlayerStats) => void;
  onTriggerDialogue: (id: string) => void;
  
  // Logic tracking
  enemiesDefeated: number = 0;
  dialoguesTriggered = new Set<string>();

  constructor(
    canvas: HTMLCanvasElement, 
    initialStats: PlayerStats,
    onUpdateStats: (stats: PlayerStats) => void,
    onTriggerDialogue: (id: string) => void
  ) {
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d')!;
    this.width = canvas.width;
    this.height = canvas.height;
    
    this.stats = { ...initialStats };
    this.onUpdateStats = onUpdateStats;
    this.onTriggerDialogue = onTriggerDialogue;
    
    // Spawn initial enemies
    this.spawnEnemy();
    this.spawnEnemy();
    
    this.handleKeyDown = this.handleKeyDown.bind(this);
    this.handleKeyUp = this.handleKeyUp.bind(this);
    this.handleMouseDown = this.handleMouseDown.bind(this);
    
    window.addEventListener('keydown', this.handleKeyDown);
    window.addEventListener('keyup', this.handleKeyUp);
    canvas.addEventListener('mousedown', this.handleMouseDown);
  }
  
  cleanup() {
    window.removeEventListener('keydown', this.handleKeyDown);
    window.removeEventListener('keyup', this.handleKeyUp);
    this.canvas.removeEventListener('mousedown', this.handleMouseDown);
    cancelAnimationFrame(this.animationId);
  }
  
  handleKeyDown(e: KeyboardEvent) {
    this.keys.add(e.key.toLowerCase());
  }
  
  handleKeyUp(e: KeyboardEvent) {
    this.keys.delete(e.key.toLowerCase());
  }
  
  handleMouseDown(e: MouseEvent) {
    if (this.paused) return;
    
    const rect = this.canvas.getBoundingClientRect();
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;
    
    const dx = mouseX - this.playerPos.x;
    const dy = mouseY - this.playerPos.y;
    const dist = Math.sqrt(dx * dx + dy * dy);
    
    if (dist > 0) {
      const pSpeed = 400; // Projectile speed
      this.projectiles.push({
        pos: { x: this.playerPos.x, y: this.playerPos.y },
        vel: { x: (dx / dist) * pSpeed, y: (dy / dist) * pSpeed },
        radius: 5,
        damage: this.stats.damage,
        life: 1.5 // seconds
      });
      
      // Physics kickback on player (combat feel)
      this.playerVel.x -= (dx / dist) * 150;
      this.playerVel.y -= (dy / dist) * 150;
    }
  }
  
  spawnEnemy() {
    const angle = Math.random() * Math.PI * 2;
    const distance = 400 + Math.random() * 200;
    this.enemies.push({
      id: Math.random().toString(),
      pos: { x: this.playerPos.x + Math.cos(angle) * distance, y: this.playerPos.y + Math.sin(angle) * distance },
      vel: { x: 0, y: 0 },
      radius: 15,
      color: '#ef4444',
      hp: 30 + (this.stats.level * 10),
      maxHp: 30 + (this.stats.level * 10),
      damage: 10 + (this.stats.level * 2),
      speed: 100 + Math.random() * 50
    });
  }

  setPaused(paused: boolean) {
    this.paused = paused;
    if (!paused) {
      this.lastTime = performance.now();
      this.loop(this.lastTime);
    }
  }
  
  updateStats(newStats: PlayerStats) {
    this.stats = { ...newStats };
  }

  start() {
    this.lastTime = performance.now();
    this.loop(this.lastTime);
    
    // Check initial narrative
    setTimeout(() => {
      if (!this.dialoguesTriggered.has('intro')) {
        this.dialoguesTriggered.add('intro');
        this.onTriggerDialogue('intro');
      }
    }, 500);
  }
  
  loop(time: number) {
    if (this.paused) return;
    
    const dt = (time - this.lastTime) / 1000;
    this.lastTime = time;
    
    this.update(dt);
    this.draw();
    
    this.animationId = requestAnimationFrame((t) => this.loop(t));
  }
  
  gainXp(amount: number) {
    this.stats.xp += amount;
    const xpNeeded = this.stats.level * 100;
    if (this.stats.xp >= xpNeeded) {
      this.stats.xp -= xpNeeded;
      this.stats.level += 1;
      this.stats.maxHp += 20;
      this.stats.hp = this.stats.maxHp;
      this.stats.damage += 5;
      
      this.onTriggerDialogue('levelup');
    }
    this.onUpdateStats(this.stats);
  }
  
  update(dt: number) {
    if (dt > 0.1) dt = 0.1; // Cap dt to avoid huge jumps
    
    // Player Input
    let moveX = 0;
    let moveY = 0;
    
    if (this.keys.has('w') || this.keys.has('arrowup')) moveY -= 1;
    if (this.keys.has('s') || this.keys.has('arrowdown')) moveY += 1;
    if (this.keys.has('a') || this.keys.has('arrowleft')) moveX -= 1;
    if (this.keys.has('d') || this.keys.has('arrowright')) moveX += 1;
    
    // Normalize movement
    if (moveX !== 0 && moveY !== 0) {
      const len = Math.sqrt(moveX * moveX + moveY * moveY);
      moveX /= len;
      moveY /= len;
    }
    
    // Acceleration
    const accel = 2000;
    this.playerVel.x += moveX * accel * dt;
    this.playerVel.y += moveY * accel * dt;
    
    // Friction
    const friction = 10;
    this.playerVel.x -= this.playerVel.x * friction * dt;
    this.playerVel.y -= this.playerVel.y * friction * dt;
    
    // Cap speed
    const currentSpeed = Math.sqrt(this.playerVel.x ** 2 + this.playerVel.y ** 2);
    if (currentSpeed > this.stats.speed) {
      this.playerVel.x = (this.playerVel.x / currentSpeed) * this.stats.speed;
      this.playerVel.y = (this.playerVel.y / currentSpeed) * this.stats.speed;
    }
    
    // Update player pos
    this.playerPos.x += this.playerVel.x * dt;
    this.playerPos.y += this.playerVel.y * dt;
    
    // Boundaries
    const padding = 20;
    if (this.playerPos.x < padding) this.playerPos.x = padding;
    if (this.playerPos.x > this.width - padding) this.playerPos.x = this.width - padding;
    if (this.playerPos.y < padding) this.playerPos.y = padding;
    if (this.playerPos.y > this.height - padding) this.playerPos.y = this.height - padding;
    
    // Update Projectiles
    for (let i = this.projectiles.length - 1; i >= 0; i--) {
      const p = this.projectiles[i];
      p.pos.x += p.vel.x * dt;
      p.pos.y += p.vel.y * dt;
      p.life -= dt;
      
      if (p.life <= 0 || p.pos.x < 0 || p.pos.x > this.width || p.pos.y < 0 || p.pos.y > this.height) {
        this.projectiles.splice(i, 1);
      }
    }
    
    // Update Enemies
    for (let i = this.enemies.length - 1; i >= 0; i--) {
      const enemy = this.enemies[i];
      
      // Move towards player
      const dx = this.playerPos.x - enemy.pos.x;
      const dy = this.playerPos.y - enemy.pos.y;
      const dist = Math.sqrt(dx * dx + dy * dy);
      
      if (dist > 0) {
        enemy.vel.x += (dx / dist) * 500 * dt;
        enemy.vel.y += (dy / dist) * 500 * dt;
      }
      
      // Enemy friction
      enemy.vel.x -= enemy.vel.x * 5 * dt;
      enemy.vel.y -= enemy.vel.y * 5 * dt;
      
      // Enemy speed cap
      const eSpeed = Math.sqrt(enemy.vel.x ** 2 + enemy.vel.y ** 2);
      if (eSpeed > enemy.speed) {
        enemy.vel.x = (enemy.vel.x / eSpeed) * enemy.speed;
        enemy.vel.y = (enemy.vel.y / eSpeed) * enemy.speed;
      }
      
      enemy.pos.x += enemy.vel.x * dt;
      enemy.pos.y += enemy.vel.y * dt;
      
      // Player collision (damage)
      if (dist < 20 + enemy.radius) {
        // Physics bounce
        this.playerVel.x += (dx / dist) * 300;
        this.playerVel.y += (dy / dist) * 300;
        enemy.vel.x -= (dx / dist) * 300;
        enemy.vel.y -= (dy / dist) * 300;
        
        // Take damage
        this.stats.hp -= enemy.damage;
        if (this.stats.hp < 0) this.stats.hp = 0;
        this.onUpdateStats(this.stats);
      }
      
      // Projectile collision
      for (let j = this.projectiles.length - 1; j >= 0; j--) {
        const p = this.projectiles[j];
        const pdx = p.pos.x - enemy.pos.x;
        const pdy = p.pos.y - enemy.pos.y;
        const pDist = Math.sqrt(pdx * pdx + pdy * pdy);
        
        if (pDist < enemy.radius + p.radius) {
          enemy.hp -= p.damage;
          // knockback
          enemy.vel.x += (p.vel.x * 0.5);
          enemy.vel.y += (p.vel.y * 0.5);
          
          this.projectiles.splice(j, 1);
          
          if (enemy.hp <= 0) {
            this.enemies.splice(i, 1);
            this.gainXp(50);
            this.enemiesDefeated++;
            
            // Check narrative trigger
            if (this.enemiesDefeated === 3 && !this.dialoguesTriggered.has('first_blood')) {
              this.dialoguesTriggered.add('first_blood');
              this.onTriggerDialogue('first_blood');
            }
            
            // Spawn more
            setTimeout(() => this.spawnEnemy(), 1000);
            setTimeout(() => this.spawnEnemy(), 2500);
            break; // Stop checking this enemy
          }
        }
      }
    }
  }
  
  draw() {
    // Clear background
    this.ctx.fillStyle = '#f8fafc'; // slate-50
    this.ctx.fillRect(0, 0, this.width, this.height);
    
    // Draw Grid (give sense of space)
    this.ctx.strokeStyle = '#e2e8f0';
    this.ctx.lineWidth = 2;
    const gridSize = 40;
    for (let x = 0; x <= this.width; x += gridSize) {
      this.ctx.beginPath();
      this.ctx.moveTo(x, 0);
      this.ctx.lineTo(x, this.height);
      this.ctx.stroke();
    }
    for (let y = 0; y <= this.height; y += gridSize) {
      this.ctx.beginPath();
      this.ctx.moveTo(0, y);
      this.ctx.lineTo(this.width, y);
      this.ctx.stroke();
    }
    
    // Draw Projectiles
    this.ctx.fillStyle = '#3b82f6';
    for (const p of this.projectiles) {
      this.ctx.beginPath();
      this.ctx.arc(p.pos.x, p.pos.y, p.radius, 0, Math.PI * 2);
      this.ctx.fill();
    }
    
    // Draw Enemies
    for (const enemy of this.enemies) {
      this.ctx.fillStyle = enemy.color;
      this.ctx.beginPath();
      this.ctx.arc(enemy.pos.x, enemy.pos.y, enemy.radius, 0, Math.PI * 2);
      this.ctx.fill();
      
      // Health bar
      const hpPercent = enemy.hp / enemy.maxHp;
      this.ctx.fillStyle = '#ef4444';
      this.ctx.fillRect(enemy.pos.x - 15, enemy.pos.y - 25, 30 * hpPercent, 4);
    }
    
    // Draw Player
    this.ctx.fillStyle = this.stats.color;
    this.ctx.beginPath();
    this.ctx.arc(this.playerPos.x, this.playerPos.y, 20, 0, Math.PI * 2);
    this.ctx.fill();
    
    // Player direction indicator
    this.ctx.strokeStyle = '#ffffff';
    this.ctx.lineWidth = 3;
    this.ctx.beginPath();
    this.ctx.moveTo(this.playerPos.x, this.playerPos.y);
    const speed = Math.sqrt(this.playerVel.x ** 2 + this.playerVel.y ** 2);
    if (speed > 10) {
      this.ctx.lineTo(
        this.playerPos.x + (this.playerVel.x / speed) * 20, 
        this.playerPos.y + (this.playerVel.y / speed) * 20
      );
    }
    this.ctx.stroke();
  }
}
