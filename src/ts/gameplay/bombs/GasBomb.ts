import { BaseBomb } from "./BaseBomb";
import { BombType } from "../../constants/BombType";
import { Sprite } from "pixi.js";

export class GasBomb extends BaseBomb {
  constructor() {
    super(BombType.Gas);
  }

  init(): void {
    this.sprite = Sprite.from(this.textures.gasBomb);
    this.sprite.anchor.set(0.5);

    super.init();
  }
}