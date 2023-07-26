import { Application, Container } from "pixi.js";
import { Subject } from "rxjs";
import { IDisposable, IInitiable, IResizable } from "../constants/types";

// A heart of the scene with all needed propeties and methods
export abstract class BaseScene implements IResizable, IDisposable, IInitiable {
  // An arrow-function which binds 'this' context for onUpdate method in game.ticker
  // Also a possibility of subscribe/unsubscribe on game.ticker
  private onUpdateHandler: (delta: number) => void;
  
  protected view: Container;
  protected connector$!: Subject<string> | null; // A possibility of telling scenes manager to which next scene it should be moved

  constructor(public name: string, private game: Application) {
    this.view = new Container();
    this.connector$ = new Subject<string>();
    
    this.onUpdateHandler = (delta: number) => this.onUpdate(delta);
  }

  get connection(): Subject<string> | null {
    return this.connector$;
  }

  // Add scene into the game's stage, init scene, resize it first time, and start listening game's ticker
  start(): void {
    this.game.stage.addChild(this.view);

    this.init();
    this.onResize(this.game.screen.width, this.game.screen.height);

    this.game.ticker.add(this.onUpdateHandler);
  }

  // Close connection with scenes manager, stop listening game's ticker,
  // and take out scene from the game's stage
  stop(): void {
    // this.connector$?.complete();

    this.game.ticker.remove(this.onUpdateHandler);

    this.destroy();

    this.game.stage.removeChild(this.view);
  }

  // Will be executed each time when size of the browser's page is changing
  abstract onResize(width: number, height: number, scale?: number): void;

  // Listens game's ticker
  protected onUpdate(delta: number): void {}

  // According to the scene logic and behaviour will be sent a signal to scenes manager - it should be moved to the next scene
  protected abstract goToNextScene(): void;

  // Add UI on the scene, init needed properties and values
  abstract init(): void;

  // Clear useless resources
  abstract destroy(): void;
}
