import {
  Application,
  Assets,
  Graphics,
  Sprite,
  Spritesheet,
  Text,
} from "pixi.js";
import { SceneNames } from "../constants/SceneNames";
import { BaseScene } from "./BaseScene";
import { ImagesBundleConfig } from "../constants/types";
import { GameTextures } from "../models/GameTextures";
import { Container as IoCContainer, Scope } from "typescript-ioc";

export class PreloaderScene extends BaseScene {
  private loading!: Sprite;
  private loadingBar!: Graphics;
  private loadingTitle!: Text;

  constructor(gameRef: Application) {
    super(SceneNames.PreloaderScene, gameRef);
  }

  init(): void {
    this.loading = new Sprite();
    this.loading.anchor.set(0.5);

    this.view.addChild(this.loading);

    const loadingBack = new Graphics();

    loadingBack.beginFill(0x000000, 0.25);
    loadingBack.drawRoundedRect(-125, -12.5, 250, 25, 10);
    loadingBack.endFill();

    this.loading.addChild(loadingBack);

    this.loadingBar = new Graphics();

    this.loading.addChild(this.loadingBar);

    this.loadingTitle = new Text("", {
      fontFamily: "Nunito Sans",
      fontSize: 56,
      fill: 0x707070,
    });

    this.loadingTitle.anchor.set(0.5);

    this.view.addChild(this.loadingTitle);
  }

  async start(): Promise<void> {
    super.start();

    const bundle = await Assets.load<ImagesBundleConfig>(
      "assets/data/images.json"
    );
    const aliases: string[] = [];

    for (let image of bundle.images) {
      const [key, path] = Object.entries(image).pop() as Required<
        [string, string]
      >;

      Assets.add(key, path);
      aliases.push(key);
    }

    const textures = (await Assets.load(aliases, (progress) => {
      this.loadingBar.clear();
      this.loadingBar.beginFill(0x0094ff);
      this.loadingBar.drawRoundedRect(-125, -12.5, progress * 250, 25, 10);
      this.loadingBar.endFill();

      this.loadingTitle.text =
        progress < 1 ? `${progress * 100}%...` : "100%";
    })) as GameTextures;

    textures.explosion = (await Assets.load(
      "https://pixijs.com/assets/spritesheet/mc.json",
    )) as Spritesheet;

    IoCContainer.bind(GameTextures)
      .to(GameTextures)
      .factory(() => textures)
      .scope(Scope.Singleton);

    this.goToNextScene();
  }

  onResize(width: number, height: number, scale: number = 1.0): void {
    this.loading.x = width * 0.5;
    this.loading.y = height * 0.5;

    this.loadingTitle.x = width * 0.5;
    this.loadingTitle.y = height * 0.55;
  }

  protected goToNextScene(): void {
    this.connector$?.next(SceneNames.IntroScene);
  }

  destroy(): void {
    this.connector$?.complete();

    this.view.removeChild(this.loading);
    this.loading.destroy(true);

    this.view.removeChild(this.loadingTitle);
    this.loadingTitle.destroy();
  }
}
