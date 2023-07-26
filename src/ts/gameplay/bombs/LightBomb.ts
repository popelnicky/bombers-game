import { BaseBomb } from "./BaseBomb";
import { BombType } from "../../constants/BombType";
import { Sprite } from "pixi.js";

export class LightBomb extends BaseBomb {
  constructor() {
    super(BombType.Light);
  }

  init(): void {
    this.sprite = Sprite.from(this.textures.lightBomb);
    this.sprite.anchor.set(0.5);

    super.init();
  }
}