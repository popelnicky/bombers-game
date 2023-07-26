import { Container } from "pixi.js";

export class GameBoard {
    view: Container;

    constructor() {
        this.view = new Container();
    }

    onResize(width: number, height: number, scale: number): void {
        
    }
}