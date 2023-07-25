import { Application } from "pixi.js";
import { BaseScene } from "./BaseScene";
import { SceneNames } from "../constants/SceneNames";

export class IntroScene extends BaseScene {
  constructor(gameRef: Application) {
    super(SceneNames.IntroScene, gameRef);
  }

  protected init(): void {}

  onResize(width: number, height: number, scale: number = 1.0): void {}

  protected goToNextScene(): void {}

  protected destroy(): void {}
}
