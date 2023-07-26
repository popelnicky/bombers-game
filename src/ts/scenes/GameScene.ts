import { Application } from "pixi.js";
import { BaseScene } from "./BaseScene";
import { SceneNames } from "../constants/SceneNames";
import { GameBoard } from "../gameplay/GameBoard";

export class GameScene extends BaseScene {
  private gameBoard!: GameBoard;

  constructor(gameRef: Application) {
    super(SceneNames.GameScene, gameRef);
  }

  init(): void {
    this.gameBoard = new GameBoard();
    this.gameBoard.init();

    this.view.addChild(this.gameBoard.view);
  }

  protected onUpdate(delta: number): void {
    this.gameBoard.onUpdate(delta);
  }

  onResize(width: number, height: number, scale: number = 1.0): void {
    this.gameBoard.onResize(width, height, scale);
  }

  protected goToNextScene(): void {
    this.connector$?.next(SceneNames.IntroScene);
  }

  destroy(): void {
    this.view.removeChild(this.gameBoard.view);
    this.gameBoard.destroy();
  }
}
