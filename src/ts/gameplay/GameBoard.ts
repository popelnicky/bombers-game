import { Container } from "pixi.js";
import { GameLocation } from "./GameLocation";
import { IDisposable, IInitiable, IResizable, Shot } from "../constants/types";
import { BombPanel } from "./BombPanel";
import { PlayerType } from "../constants/PlayerType";
import { GameStatus } from "../constants/GameStatus";
import { Subject } from "rxjs";

export class GameBoard implements IResizable, IDisposable, IInitiable {
  private connector$: Subject<void>;
  private gameLocation!: GameLocation;
  private westBombPanel!: BombPanel;
  private eastBombPanel!: BombPanel;

  private panels: BombPanel[] = [];
  
  view!: Container;

  constructor() {
    this.connector$ = new Subject<void>();
  }

  get connection(): Subject<void> {
    return this.connector$;
  }

  init(): void {
    this.view = new Container();

    this.gameLocation = new GameLocation();
    this.gameLocation.init();

    this.view.addChild(this.gameLocation.view);

    this.westBombPanel = new BombPanel(PlayerType.West);
    this.westBombPanel.init();

    this.view.addChild(this.westBombPanel.view);
    this.panels.push(this.westBombPanel);

    this.eastBombPanel = new BombPanel(PlayerType.East);
    this.eastBombPanel.init();

    this.view.addChild(this.eastBombPanel.view);
    this.panels.push(this.eastBombPanel);

    this.initListeners();
  }

  private initListeners(): void {
    this.gameLocation.connection.subscribe({
        next: (status: GameStatus) => {
          if (status === GameStatus.GameOver) {
            this.connector$.next();

            return;
          }

          this.canPlay();
        },
    });

    for (let panel of this.panels) {
        panel.connection.subscribe({
            next: (value: Shot) => this.makeShot(value),
        });
    }
  }

  canPlay(): void {
    for (let panel of this.panels) {
        panel.enable();
    }
  }

  makeShot(data: Shot): void {
    for (let panel of this.panels) {
        panel.disable();
    }

    this.gameLocation.makeShot(data);
  }

  onUpdate(delta: number): void {
    this.gameLocation.onUpdate(delta);
  }

  onResize(width: number, height: number, scale: number): void {
    this.gameLocation.onResize(width, height, scale);

    this.westBombPanel.view.x = width * 0.05;
    this.westBombPanel.view.y = height * 0.05;

    this.eastBombPanel.view.x = (width - this.eastBombPanel.view.width) * 0.95;
    this.eastBombPanel.view.y = height * 0.05;

    this.westBombPanel.onResize(width, height, scale);
    this.eastBombPanel.onResize(width, height, scale);
  }

  destroy(): void {
    this.view.removeChild(this.gameLocation.view);
    this.gameLocation.destroy();

    this.view.removeChild(this.westBombPanel.view);
    this.view.removeChild(this.eastBombPanel.view);
  }
}
