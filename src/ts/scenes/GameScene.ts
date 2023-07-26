import { Application, Container, Graphics, Text } from "pixi.js";
import { BaseScene } from "./BaseScene";
import { SceneNames } from "../constants/SceneNames";
import { GameBoard } from "../gameplay/GameBoard";
import { interval, take } from "rxjs";

export class GameScene extends BaseScene {
  private gameBoard!: GameBoard;
  private gameOver!: Container;
  private gameOverMessage!: Text;
  private gameOverCountdown!: Text;

  constructor(gameRef: Application) {
    super(SceneNames.GameScene, gameRef);
  }

  init(): void {
    this.gameBoard = new GameBoard();
    this.gameBoard.init();
    this.gameBoard.connection.subscribe({
      next: () => this.showGameOver(),
    });

    this.view.addChild(this.gameBoard.view);
  }

  private showGameOver(): void {
    this.gameOver = new Container();

    const gameOverBack = new Graphics();

    gameOverBack.beginFill(0x000000, 0.5);
    gameOverBack.drawRect(0, 0, this.view.width, this.view.height);
    gameOverBack.endFill();
    gameOverBack.scale.set(3);

    this.gameOver.addChild(gameOverBack);

    this.gameOverMessage = new Text("Game over", {
      fontFamily: "Nunito Sans",
      fontSize: 56,
      fill: 0xc0c0c0,
    });

    this.gameOverMessage.anchor.set(0.5);
    this.gameOverMessage.x = this.view.width * 0.57;
    this.gameOverMessage.y = this.view.height * 0.3;
    
    this.gameOver.addChild(this.gameOverMessage);

    this.gameOverCountdown = new Text("", {
      fontFamily: "Nunito Sans",
      fontSize: 72,
      fill: 0xc0c0c0,
    });

    this.gameOverCountdown.anchor.set(0.5);
    this.gameOverCountdown.x = this.view.width * 0.57;
    this.gameOverCountdown.y = this.view.height * 0.5;

    this.gameOver.addChild(this.gameOverCountdown);
    this.view.addChild(this.gameOver);

    const stream$ = interval(1000).pipe(
      take(3)
    );

    this.gameOverCountdown.text = "3";

    stream$.subscribe({
      next: (value: number) => {
        this.gameOverCountdown.text = `${3 - (value + 1)}`;
      },
      complete: () => this.goToNextScene(),
    });
  }

  protected onUpdate(delta: number): void {
    this.gameBoard.onUpdate(delta);
  }

  onResize(width: number, height: number, scale: number = 1.0): void {
    this.gameBoard.onResize(width, height, scale);

    if (!this.gameOver) {
      return;
    }

    this.gameOver.width = this.view.width;
    this.gameOver.height = this.view.height;

    this.gameOverMessage.x = width * 0.5;
    this.gameOverMessage.y = height * 0.2;

    this.gameOverCountdown.x = width * 0.5;
    this.gameOverCountdown.y = height * 0.25;
  }

  protected goToNextScene(): void {
    this.connector$?.next(SceneNames.IntroScene);
  }

  destroy(): void {
    this.view.removeChild(this.gameBoard.view);
    this.gameBoard.destroy();

    this.view.removeChild(this.gameOver);
  }
}
