import { Resource, Texture } from "pixi.js";

export type Ctor<T = any> = new (...args: any[]) => T; // Needs for providing constructors into the methods

type ImageConfig = {
    readonly [key: string]: string;
};

export type ImagesBundleConfig = {
    readonly images: ImageConfig[];
};
