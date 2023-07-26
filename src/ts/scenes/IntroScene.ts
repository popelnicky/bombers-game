import { Application } from "pixi.js";
import { BaseScene } from "./BaseScene";
import { SceneNames } from "../constants/SceneNames";

export class IntroScene extends BaseScene {
  constructor(gameRef: Application) {
    super(SceneNames.IntroScene, gameRef);
  }

  init(): void {
    this.goToNextScene();
  }

  onResize(width: number, height: number, scale: number = 1.0): void {}

  protected goToNextScene(): void {
    this.connector$?.next(SceneNames.GameScene);
  }

  destroy(): void {}
}
