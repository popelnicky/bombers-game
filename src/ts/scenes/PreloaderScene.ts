import { Application } from "pixi.js";
import { SceneNames } from "../constants/SceneNames";
import { BaseScene } from "./BaseScene";

export class PreloaderScene extends BaseScene {
  constructor(gameRef: Application) {
    super(SceneNames.PreloaderScene, gameRef);
  }

  protected init(): void {}

  onResize(width: number, height: number, scale: number = 1.0): void {}

  protected goToNextScene(): void {}

  protected destroy(): void {}
}
