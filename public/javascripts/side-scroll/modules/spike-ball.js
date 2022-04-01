import { MoveableObject } from "./moveable-object.js";

export class SpikeBall extends MoveableObject {
    moveDirection;
    initialX;
    initialY;
    moveDistance = 300;
    moveSpeed = 5;
    stationaryWait = 2;
    newlyCreated = false;
    frame = 0;
    frameCount = 4;
    delayCount = 0;

    constructor() {
        super();
        this.width = 140;
        this.height = 140;
        const brickDiv = document.createElement('div');
        brickDiv.className = 'spike-ball';
        this.domObject = brickDiv;

    }

    advance() {
        super.advance();
        if (this.delayCount === 20) {
            this.domObject.style.backgroundPositionX = `-${this.frame * 211 + 16}px`;
            this.delayCount = 0;
        } else {
            this.delayCount = this.delayCount + 1;
        }
        this.frame++;
        if (this.frame === this.frameCount) {
            this.frame = 0;
        }
        if (this.moveDirection === 'Stationary' || this.newlyCreated) {

            return;
        }
        if (this.moveDirection === 'Left') {
            this.x = this.x - this.moveSpeed;
            if (this.x < this.initialX - this.moveDistance) {
                this.x = this.initialX - this.moveDistance;
                this.moveDirection = 'Stationary';
                setTimeout(() => this.moveDirection = 'Right', this.stationaryWait * 1000);
            }
        } else {
            this.x = this.x + this.moveSpeed;
            if (this.x > this.initialX + this.moveDistance) {
                this.x = this.initialX + this.moveDistance;
                this.moveDirection = 'Stationary';
                setTimeout(() => this.moveDirection = 'Left', this.stationaryWait * 1000);
            }
        }
    }
}