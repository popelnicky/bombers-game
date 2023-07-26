import { BaseBomb } from "./BaseBomb";
import { BombType } from "../../constants/BombType";
import { Sprite } from "pixi.js";

export class FireBomb extends BaseBomb {
  constructor() {
    super(BombType.Fire);
  }

  init(): void {
    this.sprite = Sprite.from(this.textures.fireBomb);
    this.sprite.anchor.set(0.5);

    super.init();
  }
}