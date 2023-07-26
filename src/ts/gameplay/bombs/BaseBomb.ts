import { AnimatedSprite, Container, Rectangle, Resource, Sprite, Texture } from "pixi.js";
import { IBomb, IInitiable } from "../../constants/types";
import { BombType } from "../../constants/BombType";
import { Subject } from "rxjs";
import { GameTextures } from "../../models/GameTextures";
import { Inject } from "typescript-ioc";

export abstract class BaseBomb implements IInitiable, IBomb {
  @Inject protected declare textures: GameTextures;

  private connector$: Subject<[number, number]>;
  private timestamp: number = 0;
  protected sprite!: Sprite;
  protected explosion!: AnimatedSprite;

  view!: Container;

  constructor(public type: BombType) {
    this.connector$ = new Subject<[number, number]>();
  }

  get connection(): Subject<[number, number]> {
    return this.connector$;
  }

  init(): void {
    this.view = new Container();

    if (this.sprite) {
      this.view.addChild(this.sprite);

      this.initListeners();
    }

    const textures: Texture<Resource>[] = [];
    const explosion = this.textures.explosion;

    for (let key of Object.keys(explosion.textures)) {
      textures.push(explosion.textures[key]);
    }

    this.explosion = new AnimatedSprite(textures);
    this.explosion.anchor.set(0.5);
    this.explosion.rotation = Math.random() * Math.PI;
    this.explosion.loop = false;
  }

  enable(): void {
    this.sprite.eventMode = "static";
    this.sprite.cursor = "pointer";
  }

  disable(): void {
    this.sprite.eventMode = "none";
    this.sprite.cursor = "none";
  }

  async explose(): Promise<Rectangle> {
    if (!this.explosion) {
      return new Rectangle(0, 0);
    }

    return new Promise((resolve, reject) => {
      this.explosion.x = this.sprite.x;
    this.explosion.y = this.sprite.y;

    this.view.removeChild(this.sprite);
    this.view.addChild(this.explosion);

    this.explosion.onComplete = () => {
      this.view.removeChild(this.explosion);
      this.view.addChild(this.sprite);
      this.explosion.gotoAndStop(0);
      
      resolve(this.explosion.getBounds());
    };
    this.explosion.play();
    });
  }

  private initListeners(): void {
    this.enable();

    this.sprite.on("pointerdown", () => {
      this.sprite.scale.set(0.9);

      this.timestamp = Date.now();
    });

    this.sprite.on("pointerup", () => {
      this.sprite.scale.set(1.0);

      this.connector$.next([this.type, Date.now() - this.timestamp]);

      this.timestamp = 0;
    });

    this.sprite.on("pointerover", () => {
      this.sprite.scale.set(1.1);
    });

    this.sprite.on("pointerout", () => {
      this.sprite.scale.set(1.0);
    });
  }
}
