import { Container, Graphics } from "pixi.js";
import { IInitiable, IResizable, Shot } from "../constants/types";
import { PlayerType } from "../constants/PlayerType";
import { GasBomb } from "./bombs/GasBomb";
import { LightBomb } from "./bombs/LightBomb";
import { FireBomb } from "./bombs/FireBomb";
import { Subject } from "rxjs";
import { BaseBomb } from "./bombs/BaseBomb";

export class BombPanel implements IInitiable, IResizable {
  private connector$: Subject<Shot>;
  private back!: Graphics;
  private gasBomb!: BaseBomb;
  private lightBomb!: BaseBomb;
  private fireBomb!: BaseBomb;

  private backColor: number;
  private bombs: BaseBomb[] = [];

  view!: Container;

  constructor(private type: PlayerType) {
    this.backColor = type === PlayerType.West ? 0xff0000 : 0x0026ff;

    this.connector$ = new Subject<Shot>();
  }

  get connection(): Subject<Shot> {
    return this.connector$;
  }

  init(): void {
    this.view = new Container();

    this.back = new Graphics();

    this.back.beginFill(this.backColor, 0.25);
    this.back.drawRoundedRect(0, 0, 200, 75, 16);
    this.back.endFill();

    this.view.addChild(this.back);

    this.gasBomb = new GasBomb();
    this.gasBomb.init();

    this.view.addChild(this.gasBomb.view);
    this.bombs.push(this.gasBomb);

    this.lightBomb = new LightBomb();
    this.lightBomb.init();

    this.view.addChild(this.lightBomb.view);
    this.bombs.push(this.lightBomb);

    this.fireBomb = new FireBomb();
    this.fireBomb.init();

    this.view.addChild(this.fireBomb.view);
    this.bombs.push(this.fireBomb);

    this.initListeners();
  }

  private initListeners(): void {
    for (let bomb of this.bombs) {
      bomb.connection.subscribe({
        next: (value: [number, number]) => this.makeShot(value),
      });
    }
  }

  enable(): void {
    for (let bomb of this.bombs) {
        bomb.enable();
    }
  }

  disable(): void {
    for (let bomb of this.bombs) {
        bomb.disable();
    }
  }

  makeShot(data: [number, number]): void {
    this.connector$.next({ playerType: this.type, bombData: data });
  }

  onResize(width: number, height: number, scale?: number | undefined): void {
    this.gasBomb.view.x =
      this.gasBomb.view.width + this.gasBomb.view.width * 0.25;
    this.gasBomb.view.y = this.gasBomb.view.height * 0.6;

    this.lightBomb.view.x =
      this.lightBomb.view.width +
      this.gasBomb.view.x +
      this.gasBomb.view.width * 0.75;
    this.lightBomb.view.y = this.lightBomb.view.height * 0.6;

    this.fireBomb.view.x =
      this.fireBomb.view.width +
      this.lightBomb.view.x +
      this.lightBomb.view.width * 0.75;
    this.fireBomb.view.y = this.fireBomb.view.height * 0.6;
  }
}
