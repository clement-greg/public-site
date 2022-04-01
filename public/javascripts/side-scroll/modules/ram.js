import { MoveableObject } from "./moveable-object.js";

export class Ram extends MoveableObject {
    moveDirection;
    initialX;
    initialY;
    moveDistance = 300;
    moveSpeed = 5;
    stationaryWait = .5;
    newlyCreated = false;
    frame = 0;
    frameCount = 5;
    delayCount = 0;

    constructor() {
        super();
        this.width = 100;
        this.height = 100;
        const brickDiv = document.createElement('div');
        brickDiv.className = 'ram';
        this.domObject = brickDiv;
    }

    advance() {
        super.advance();

        this.frame++;
        if (this.frame === this.frameCount) {
            this.frame = 0;
        }
        if (this.moveDirection === 'Stationary' || this.newlyCreated) {

            return;
        }
        if (this.delayCount === 5) {
            this.domObject.style.backgroundPositionX = `-${this.frame * 100}px`;
            this.delayCount = 0;
        } else {
            this.delayCount = this.delayCount + 1;
        }
        if (this.moveDirection === 'Left') {
            this.x = this.x - this.moveSpeed;
            if (this.x < this.initialX - this.moveDistance) {
                this.x = this.initialX - this.moveDistance;
                this.moveDirection = 'Stationary';
                this.speedX = 0;
                setTimeout(() => {
                    this.moveDirection = 'Right';
                    this.speedX = 1;
                    this.domObject.classList.remove('invert');
                }, this.stationaryWait * 1000);
            }
        } else {
            this.x = this.x + this.moveSpeed;
            if (this.x > this.initialX + this.moveDistance) {
                this.x = this.initialX + this.moveDistance;
                this.moveDirection = 'Stationary';
                setTimeout(() => {
                    this.moveDirection = 'Left';
                    this.speedX = -1;
                    this.domObject.classList.add('invert');
                }, this.stationaryWait * 1000);
            }
        }
    }
}