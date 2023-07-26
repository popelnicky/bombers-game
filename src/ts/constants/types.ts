import { Container, Rectangle } from "pixi.js";
import { PlayerType } from "./PlayerType";
import { BombType } from "./BombType";

export type Ctor<T = any> = new (...args: any[]) => T; // Needs for providing constructors into the methods

type ImageConfig = {
  readonly [key: string]: string;
};

export type ImagesBundleConfig = {
  readonly images: ImageConfig[];
};

export type Shot = { playerType: PlayerType; bombData: [number, number] };

export interface IDisposable {
  destroy(): void;
}

export interface IInitiable {
  init(): void;
}

export interface IResizable {
  onResize(width: number, height: number, scale?: number): void;
}

export interface IBomb {
  type: BombType;
  view: Container;
  init(): void;
  explose(): Promise<Rectangle>;
}
