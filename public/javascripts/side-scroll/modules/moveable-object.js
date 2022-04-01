import { GameSprite } from './game-sprite.js';

export class MoveableObject extends GameSprite {
    speedX;
    speedY;
    applyGravity = false;
    isGrounded = false;
    groundedSprite;
    moveSprite = true;

    advance() {
        if (this.domObject) {
            // this.domObject.style.x += this.domObject.style.x + this.speedX;
            let top = this.y;
            if (isNaN(top)) {
                top = 0;
            }
            if (this.speedY && !this.isGrounded) {
                top += this.speedY;
                super.y = top;
            }
            this.domObject.style.top = top + 'px';

            let left = this.x;
            if (isNaN(left)) {
                left = 0;
            }

            if (this.speedX) {
                left += this.speedX;
                super.x = left;
            }
            if (this.moveSprite) {
                this.domObject.style.left = left + 'px';
            }
        }
    }
}