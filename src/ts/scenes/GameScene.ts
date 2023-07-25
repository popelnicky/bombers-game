import { Application } from "pixi.js";
import { BaseScene } from "./BaseScene";
import { SceneNames } from "../constants/SceneNames";
import { textures } from "../constants/textures";

export class GameScene extends BaseScene {
  constructor(gameRef: Application) {
    super(SceneNames.GameScene, gameRef);
  }

  protected init(): void {
    console.log(textures);
  }

  onResize(width: number, height: number, scale: number = 1.0): void {}

  protected goToNextScene(): void {}

  protected destroy(): void {}
}
