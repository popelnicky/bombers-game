import { Application, Assets, Spritesheet } from "pixi.js";
import { SceneNames } from "../constants/SceneNames";
import { BaseScene } from "./BaseScene";
import { ImagesBundleConfig } from "../constants/types";
import { GameTextures } from "../models/GameTextures";
import { Container as IoCContainer, Scope } from "typescript-ioc";

export class PreloaderScene extends BaseScene {
  constructor(gameRef: Application) {
    super(SceneNames.PreloaderScene, gameRef);
  }

  init(): void {}

  async start(): Promise<void> {
    super.start();

    const bundle = await Assets.load<ImagesBundleConfig>("assets/data/images.json");
    const aliases: string[] = [];

    for (let image of bundle.images) {
      const [key, path] = Object.entries(image).pop() as Required<[string, string]>;

      Assets.add(key, path);
      aliases.push(key);
    }

    const textures = await Assets.load(aliases, (progress) => {
      // TODO: The plase where can be implemented dynamics for the loading bar on this scene
    }) as GameTextures;

    textures.explosion = await Assets.load('https://pixijs.com/assets/spritesheet/mc.json') as Spritesheet;

    IoCContainer
      .bind(GameTextures)
      .to(GameTextures)
      .factory(() => textures)
      .scope(Scope.Singleton);

    this.goToNextScene();
  }

  onResize(width: number, height: number, scale: number = 1.0): void {}

  protected goToNextScene(): void {
    this.connector$?.next(SceneNames.GameScene);
  }

  destroy(): void {
    this.connector$?.complete();
  }
}
