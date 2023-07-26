import { Singleton } from "typescript-ioc";
import { Resource, Texture } from "pixi.js";

@Singleton
export class GameTextures {
    readonly introBack!: Texture<Resource>;
    readonly gameBack!: Texture<Resource>;
}
