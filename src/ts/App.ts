import { Application } from "pixi.js";
import { ScenesManager } from "./scenes/ScenesManager";
import { GameScene } from "./scenes/GameScene";
import { SceneNames } from "./constants/SceneNames";
import { IntroScene } from "./scenes/IntroScene";
import { PreloaderScene } from "./scenes/PreloaderScene";

// The game's entry point
export class App {
  private game: Application<HTMLCanvasElement>;
  private scenesManager: ScenesManager;

  constructor() {
    this.game = new Application<HTMLCanvasElement>({
      backgroundColor: 0xffffff,
      resolution: Math.max(window.devicePixelRatio, 2),
      resizeTo: window,
    });

    // Register needed scenes for the game
    this.scenesManager = new ScenesManager(this.game);
    this.scenesManager.register(PreloaderScene);
    this.scenesManager.register(IntroScene);
    this.scenesManager.register(GameScene);

    // Resize game's canvas on this step only
    this.onResize();
  }

  run(): void {
    window.addEventListener("resize", () => {
      this.onResize();
    });

    document.body.appendChild(this.game.view);

    // Start the game working
    this.scenesManager.start(SceneNames.PreloaderScene);
  }

  // According to the resolution property resize the game for desktop and mobile representations
  private onResize(): void {
    const [minWidth, minHeight] = [640, 480];
    const { innerWidth: windowWidth, innerHeight: windowHeight } = window;
    const scaleX = windowWidth < minWidth ? minWidth / windowWidth : 1;
    const scaleY = windowHeight < minHeight ? minHeight / windowHeight : 1;
    const scale = Math.min(scaleX, scaleY);
    const width = windowWidth * scale;
    const height = windowHeight * scale;
    const renderer = this.game.renderer;

    renderer.view.style.width = `${windowWidth}px`;
    renderer.view.style.height = `${windowHeight}px`;
    renderer.resize(width, height);

    this.scenesManager.onResize(width, height, scale);
  }
}
