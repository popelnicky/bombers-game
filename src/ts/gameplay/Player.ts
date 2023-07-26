import { Graphics, Sprite } from "pixi.js";
import { PlayerType } from "../constants/PlayerType";
import { GameTextures } from "../models/GameTextures";
import { Inject } from "typescript-ioc";
import { IInitiable } from "../constants/types";

export class Player implements IInitiable {
  @Inject private declare textures: GameTextures;
  private readonly health = 100;
  private hp: number;
  private healthBar!: Graphics;
  private hpColor: number;

  veiw!: Sprite;

  constructor(public type: PlayerType) {
    this.hp = this.health;
    this.hpColor = type === PlayerType.West ? 0xff0000 : 0x0026ff;
  }

  init(): void {
    this.veiw = Sprite.from(this.textures[this.type]);
    this.veiw.anchor.set(0.5);

    this.healthBar = new Graphics();
    
    this.drawHealthBar(this.veiw.width);

    this.veiw.addChild(this.healthBar);
  }

  loseHealth(explosionPower: number): number {
    let rest = this.hp - explosionPower;

    if (rest < 0) {
      rest = 0;
    }

    this.hp = rest;

    const width = this.veiw.width * (rest / this.health);
    
    this.drawHealthBar(width);
    
    return this.hp;
  }

  private drawHealthBar(width: number): void {
    this.healthBar.clear();
    this.healthBar.beginFill(this.hpColor);
    this.healthBar.drawRect(
      -this.veiw.width * 0.5,
      -this.veiw.height * 0.6,
      width,
      10
    );
    this.healthBar.endFill();
  }
}
