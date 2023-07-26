import {
  Container,
  Geometry,
  Graphics,
  Point,
  Rectangle,
  Resource,
  SimplePlane,
  Sprite,
  Texture,
} from "pixi.js";
import { GameTextures } from "../models/GameTextures";
import { Inject } from "typescript-ioc";
import {
  IBomb,
  IDisposable,
  IInitiable,
  IResizable,
  Shot,
} from "../constants/types";
import { Player } from "./Player";
import { PlayerType } from "../constants/PlayerType";
import { Subject } from "rxjs";
import { GasBomb } from "./bombs/GasBomb";
import { LightBomb } from "./bombs/LightBomb";
import { FireBomb } from "./bombs/FireBomb";

export class GameLocation implements IResizable, IDisposable, IInitiable {
  @Inject private declare textures: GameTextures;

  private connector$: Subject<void>;
  private readonly SCALE_Y: number = 0.5;
  private ground!: Graphics;
  private westWall!: Sprite;
  private eastWall!: Sprite;

  private westPlayer!: Player;
  private eastPlayer!: Player;
  private shootingPlayer!: Player;
  private enemyPlayer!: Player;

  private gasBomb!: IBomb;
  private lightBomb!: IBomb;
  private fireBomb!: IBomb;
  private throwingBomb!: IBomb;

  private target!: Sprite;

  private startTargetPoint!: Point;
  private endTargetPoint!: Point;

  private throwingBombStep: number = 9999;

  private players: Player[] = [];
  private bombs: IBomb[] = [];

  view!: Container;

  constructor() {
    this.connector$ = new Subject<void>();
  }

  get connection(): Subject<void> {
    return this.connector$;
  }

  private getIsometricObject(texture: Texture<Resource>): SimplePlane {
    const textureRect: Rectangle = texture.orig;
    const vertexBuffer = [
      0,
      0,
      textureRect.width,
      0,
      0,
      textureRect.height,
      textureRect.width,
      textureRect.height,
    ];
    const coordsBuffer = vertexBuffer.map((val) => (val ? val / val : val));
    const plane = new SimplePlane(texture);

    plane.geometry = new Geometry()
      .addAttribute("aVertexPosition", vertexBuffer, 2)
      .addAttribute("aTextureCoord", coordsBuffer, 2)
      .addIndex([0, 1, 2, 1, 2, 3]);

    return plane;
  }

  init(): void {
    // Add isometric ground into the view
    this.view = new Container();

    this.view.scale.y = this.SCALE_Y;

    this.ground = new Graphics();
    this.ground.rotation = Math.PI * 0.25;

    let plane = this.getIsometricObject(this.textures.ground);

    this.ground.addChild(plane);
    this.view.addChild(this.ground);

    // Add walls
    this.westWall = Sprite.from(this.textures.wall);
    this.westWall.anchor.set(0.5);

    this.view.addChild(this.westWall);

    this.eastWall = Sprite.from(this.textures.wall);
    this.eastWall.anchor.set(0.5);

    this.view.addChild(this.eastWall);

    // Add players
    this.westPlayer = new Player(PlayerType.West);
    this.westPlayer.init();

    this.view.addChildAt(this.westPlayer.veiw, 1);
    this.players.push(this.westPlayer);

    this.eastPlayer = new Player(PlayerType.East);
    this.eastPlayer.init();

    this.view.addChild(this.eastPlayer.veiw);
    this.players.push(this.eastPlayer);

    // Add bombs
    this.gasBomb = new GasBomb();
    this.gasBomb.init();

    this.bombs.push(this.gasBomb);

    this.lightBomb = new LightBomb();
    this.lightBomb.init();

    this.bombs.push(this.lightBomb);

    this.fireBomb = new FireBomb();
    this.fireBomb.init();

    this.bombs.push(this.fireBomb);

    // Add target but not to the game location for now
    this.target = new Sprite();
    this.target.anchor.set(0.5);
    this.target.rotation = Math.PI * 0.25;

    plane = this.getIsometricObject(this.textures.target);

    this.target.addChild(plane);
  }

  makeShot(data: Shot): void {
    const {
      playerType,
      bombData: [bombType, bombDistance],
    } = data;
    const direction = playerType === PlayerType.East ? -1 : 1;

    this.shootingPlayer = this.players.find(
      (player) => player.type === playerType
    ) as Player;
    this.enemyPlayer = this.players.find(
      (player) => player.type !== playerType
    ) as Player;
    this.throwingBomb = this.bombs.find(
      (bomb) => bomb.type === bombType
    ) as IBomb;

    this.throwingBomb.view.scale.set(0.75, 1.15);
    this.throwingBomb.view.x = this.shootingPlayer.veiw.x;
    this.throwingBomb.view.y = this.target.y =
      this.shootingPlayer.veiw.y - this.shootingPlayer.veiw.height * 0.8;

    this.view.addChild(this.throwingBomb.view);

    this.startTargetPoint = new Point(
      this.throwingBomb.view.x,
      this.throwingBomb.view.y
    );
    this.endTargetPoint = new Point(
      this.shootingPlayer.veiw.x + direction * bombDistance * 0.25,
      this.shootingPlayer.veiw.y + direction * bombDistance * 0.25
    );

    this.target.x = this.endTargetPoint.x;
    this.target.y = this.endTargetPoint.y;

    this.view.addChild(this.target);

    this.throwingBombStep = 0;
  }

  onUpdate(delta: number): void {
    if (this.throwingBombStep >= 1 && this.throwingBombStep < 1.1) {
      this.throwingBombStep = 9999;
      this.exploseBomb();

      return;
    }

    if (this.throwingBombStep >= 1) {
      return;
    }

    this.moveOnBezierCurve();
  }

  private async exploseBomb(): Promise<void> {
    this.view.removeChild(this.target);

    const exploseArea = await this.throwingBomb.explose();
    const enemyArea = this.enemyPlayer.veiw.getBounds();
    const isIntesect = this.isIntersect(exploseArea, enemyArea);
    
    if (isIntesect) {
      console.log(this.enemyPlayer.loseHealth(this.throwingBomb.type));
    }

    this.view.removeChild(this.throwingBomb.view);
    this.throwingBomb.view.x = this.throwingBomb.view.y = 0;

    this.connector$.next();
  }

  private isIntersect(exploseArea: Rectangle, enemyArea: Rectangle) {
    return (exploseArea.x + exploseArea.width) > enemyArea.x &&
            exploseArea.x < (enemyArea.x + enemyArea.width) &&
           (exploseArea.y + exploseArea.height) > enemyArea.y &&
            exploseArea.y < (enemyArea.y + enemyArea.height);
  }

  private moveOnBezierCurve(): void {
    this.throwingBomb.view.x = this.calcCoord(
      this.throwingBombStep,
      this.startTargetPoint.x,
      0,
      this.endTargetPoint.x
    );
    this.throwingBomb.view.y = this.calcCoord(
      this.throwingBombStep,
      this.startTargetPoint.y,
      0,
      this.endTargetPoint.y
    );

    this.throwingBombStep += 0.025;
  }

  // calc next coord relying on Bezier curve
  private calcCoord(step: number, p1: number, p2: number, p3: number): number {
    return (1 - step) ** 2 * p1 + 2 * (1 - step) * step * p2 + step ** 2 * p3;
  }

  private getBombPath(): void {}

  onResize(width: number, height: number, scale: number): void {
    this.view.x = width * 0.5;
    this.view.y = height * 0.5 * this.SCALE_Y;

    this.westWall.x = this.view.width * -0.1;
    this.westWall.y = this.view.height * 0.6;

    this.eastWall.x = this.view.width * 0.1;
    this.eastWall.y = this.view.height * 0.95;

    this.westPlayer.veiw.x = this.view.width * -0.15;
    this.westPlayer.veiw.y = this.view.height * 0.55;

    this.eastPlayer.veiw.x = this.view.width * 0.15;
    this.eastPlayer.veiw.y = this.view.height * 1.05;
  }

  destroy(): void {
    this.view.removeChild(this.ground);
    this.view.removeChild(this.westWall);
    this.view.removeChild(this.westPlayer.veiw);
    this.view.removeChild(this.eastWall);
    this.view.removeChild(this.eastPlayer.veiw);
  }
}
