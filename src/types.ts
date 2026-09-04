export interface PlayerStats {
  hp: number;
  maxHp: number;
  xp: number;
  level: number;
  color: string;
  speed: number;
  damage: number;
}

export interface Vector2 {
  x: number;
  y: number;
}

export interface Entity {
  id: string;
  pos: Vector2;
  vel: Vector2;
  radius: number;
  color: string;
  hp: number;
  maxHp: number;
}

export interface Enemy extends Entity {
  damage: number;
  speed: number;
}

export interface Projectile {
  pos: Vector2;
  vel: Vector2;
  radius: number;
  damage: number;
  life: number;
}
