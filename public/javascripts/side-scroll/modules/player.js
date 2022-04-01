import { MoveableObject } from './moveable-object.js';
import { KeyboardHandler } from './keyboard-handler.js';
import { PubSub } from './pub-sub.js';
import { World } from './world.js';

export class Player extends MoveableObject {
    keyboardHandler;
    acceleration = 8;
    runFrame = 0;
    pubsub;

    constructor() {
        super();
        this.pubsub = PubSub.getInstance();

        const playerDiv = document.createElement('div');
        playerDiv.className = 'player';
        playerDiv.style.left = '0px';

        playerDiv.style.top = '0px';
        super.x = 0;
        super.y = 0;
        //super.width = 166;
        super.width = 71;
        super.height = 95.06;

        this.domObject = playerDiv;

        this.keyboardHandler = KeyboardHandler.getInstance();
        super.applyGravity = true;

        this.pubsub.subscribe('keydown', key => {
            if (key.code === 'Space' && this.isGrounded) {
                this.speedY = -15;
                this.isGrounded = false;
            }
        });
    }

    advance() {
        //super.speedY = 0;
        super.speedX = 0;
        if (this.keyboardHandler.isKeyDown('ArrowLeft')) {
            super.speedX = -1 * this.acceleration;
            this.runFrame += 1;
            if (this.runFrame >= 12) {
                this.runFrame = 0;
            }
            this.domObject.style.transform = 'scaleX(-1)';
        }
        if (this.keyboardHandler.isKeyDown('ArrowRight')) {
            super.speedX = 1 * this.acceleration;
            this.runFrame += 1;
            if (this.runFrame >= 12) {
                this.runFrame = 0;
            }
            this.domObject.style.transform = 'scaleX(1)';
        }
        if (this.x < 0) {
            this.x = 0;
            this.speedX = 0;
        }
        if (this.x + this.width > World.getInstance().width) {
            this.x = World.getInstance().width - this.width;
            this.speedX = 0;
        }


        this.domObject.style.backgroundPositionX = (this.runFrame * -this.width) + 'px';
        super.advance();
    }
}