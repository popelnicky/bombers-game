import { Application, Graphics, Sprite, Text } from "pixi.js";
import { BaseScene } from "./BaseScene";
import { SceneNames } from "../constants/SceneNames";
import { Inject } from "typescript-ioc";
import { GameTextures } from "../models/GameTextures";
import { ButtonContainer } from "@pixi/ui";

export class IntroScene extends BaseScene {
  @Inject private declare textures: GameTextures;
  private back!: Sprite;
  private logo!: Sprite;
  private playButton!: ButtonContainer;

  constructor(gameRef: Application) {
    super(SceneNames.IntroScene, gameRef);
  }

  init(): void {
    this.back = Sprite.from(this.textures.introBack);
    this.back.anchor.set(0.5);
    
    this.view.addChild(this.back);

    this.logo = Sprite.from(this.textures.logo);
    this.logo.anchor.set(0.5);

    this.view.addChild(this.logo);

    this.playButton = new ButtonContainer(
      new Graphics()
      .beginFill(0x267F00)
      .drawRoundedRect(0, 0, 175, 50, 10)
      .endFill()
    );
    this.playButton.onPress.connect(() => this.goToNextScene());

    const buttonLabel = new Text("Play", {
      fontFamily: "Nunito Sans",
      fontSize: 28,
      fill: 0xc0c0c0,
    });

    buttonLabel.x = this.playButton.view.width * 0.5 - buttonLabel.width * 0.5;
    buttonLabel.y = this.playButton.view.height * 0.5 - buttonLabel.height * 0.5;

    this.playButton.view.addChild(buttonLabel);
    this.view.addChild(this.playButton.view);
  }

  onResize(width: number, height: number, scale: number = 1.0): void {
    const backTexture = this.textures.introBack;
    const backScale = Math.max(width / backTexture.width, height / backTexture.height);
    
    this.back.x = width * 0.5;
    this.back.y = height * 0.5;
    this.back.scale.set(backScale);

    this.logo.x = width * 0.5;
    this.logo.y = height * 0.35;

    this.playButton.view.x = width * 0.5 - this.playButton.view.width * 0.5;
    this.playButton.view.y = height * 0.85;
  }

  protected goToNextScene(): void {
    this.connector$?.next(SceneNames.GameScene);
  }

  destroy(): void {
    this.view.removeChild(this.back);
    this.view.removeChild(this.logo);
    this.view.removeChild(this.playButton);
  }
}
