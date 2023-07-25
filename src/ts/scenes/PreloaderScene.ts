import { Application, Assets } from "pixi.js";
import { SceneNames } from "../constants/SceneNames";
import { BaseScene } from "./BaseScene";
import { GameTextures, ImagesBundleConfig } from "../constants/types";
import { textures } from "../constants/textures";

export class PreloaderScene extends BaseScene {
  constructor(gameRef: Application) {
    super(SceneNames.PreloaderScene, gameRef);
  }

  protected init(): void {}

  async start(): Promise<void> {
    super.start();

    const bundle = await Assets.load<ImagesBundleConfig>("assets/data/images.json");
    const aliases: string[] = [];

    for (let image of bundle.images) {
      const [key, path] = Object.entries(image).pop() as Required<[string, string]>;

      Assets.add(key, path);
      aliases.push(key);
    }

    // TODO: It would be much better to move it on decorators and DI
    // TODO: Implement Loading UI
    const data = await Assets.load(aliases, (progress) => {
      console.log(progress);
    }) as GameTextures;

    for(let key of Object.keys(data)) {
      (textures as any)[key] = data[key];
    }

    this.goToNextScene();
  }

  onResize(width: number, height: number, scale: number = 1.0): void {}

  protected goToNextScene(): void {
    this.connector$?.next(SceneNames.GameScene);
  }

  protected destroy(): void {}
}
