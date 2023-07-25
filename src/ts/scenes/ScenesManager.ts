import { Application } from "pixi.js";
import { BaseScene } from "./BaseScene";
import { Ctor } from "../constants/types";

export class ScenesManager {
  private scenes: BaseScene[];
  private currentScene: BaseScene | null | undefined;
  private started: boolean = false;

  constructor(private game: Application) {
    this.scenes = [];
    this.currentScene = null;
  }

  // Put instance of the scene to the manager's store and start listening of moving to the next scene
  register<T extends BaseScene>(sceneCtor: Ctor<T>): void {
    const scene = new sceneCtor(this.game);

    this.scenes.push(scene);

    scene.connection?.subscribe({
      next: (sceneName: string): void => {
        this.goTo(sceneName);
      },
    });
  }

  start(sceneName: string): void {
    // Just a double protection. If the game has started no any starts for this game's session
    if (this.started) {
      return;
    }

    this.currentScene = this.findScene(sceneName);
    this.currentScene?.start();

    this.started = true;
  }

  onResize(width: number, height: number, scale: number): void {
    // DO NOT resize current scene while a manager does not start
    // It needs to be sure that scene has started and initialized
    if (!this.started) {
      return;
    }

    this.currentScene?.onResize(width, height, scale);
  }

  // Just moving between scenes. Take out current scene and put next into game.stage
  private goTo(sceneName: string): void {
    this.currentScene?.stop();
    this.currentScene = this.findScene(sceneName);
    this.currentScene?.start();
  }

  private findScene(sceneName: string): BaseScene | undefined {
    return this.scenes.find((scene) => scene.name === sceneName);
  }
}
