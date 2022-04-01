import { MoveableObject } from "./moveable-object.js";

export class Coin extends MoveableObject {
    frames = 13;
    runFrame = 0;
    slower = 1;
    slowerFactor = 5;

    constructor() {
        super();
        this.width = 72;
        this.height = 72;
        const brickDiv = document.createElement('div');
        brickDiv.className = 'coin';
        this.domObject = brickDiv;
        
    }

    advance() {
        if (this.slower % this.slowerFactor !== 0) {
            this.slower++;
            return;
        }
        this.slower = 1;
        this.domObject.style.backgroundPositionX = (this.runFrame * -69.9) + 'px';
        this.runFrame++;
        if (this.runFrame > this.frames) {
            this.runFrame = 0;
        }
        super.advance();
    }
}