import { Singleton } from "typescript-ioc";
import { Resource, Spritesheet, Texture } from "pixi.js";

@Singleton
export class GameTextures {
    readonly introBack!: Texture<Resource>;
    readonly ground!: Texture<Resource>;
    readonly wall!: Texture<Resource>;
    readonly westPlayer!: Texture<Resource>;
    readonly eastPlayer!: Texture<Resource>;
    readonly gasBomb!: Texture<Resource>;
    readonly lightBomb!: Texture<Resource>;
    readonly fireBomb!: Texture<Resource>;
    readonly target!: Texture<Resource>;
    
    explosion!: Spritesheet
}
