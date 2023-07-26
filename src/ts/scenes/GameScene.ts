import { Application } from "pixi.js";
import { BaseScene } from "./BaseScene";
import { SceneNames } from "../constants/SceneNames";
import { GameBoard } from "../gameplay/GameBoard";
import { GameTextures } from "../models/GameTextures";
import { Inject } from "typescript-ioc";

export class GameScene extends BaseScene {
  @Inject declare private textures: GameTextures;
  private gameBoard!: GameBoard;

  constructor(gameRef: Application) {
    super(SceneNames.GameScene, gameRef);
  }

  protected init(): void {
    this.gameBoard = new GameBoard();

    console.log(this.textures);
  }

  onResize(width: number, height: number, scale: number = 1.0): void {}

  protected goToNextScene(): void {
    this.connector$?.next(SceneNames.IntroScene);
  }

  protected destroy(): void {}
}
