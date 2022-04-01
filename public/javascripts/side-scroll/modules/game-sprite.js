export class GameSprite {
    domObject;
    x;
    y;
    width;
    height;
    isGround  = false;
    objectType = '';

    constructor() {
        this.objectType = this.constructor.name;
    }

    advance() {
        if(this.domObject) {
            if(this.x || this.y === 0) {
                this.domObject.style.left = this.x + 'px';
            }
            if(this.y || this.y === 0) {
                this.domObject.style.top = this.y + 'px';
            }
        }
    }

    draw() {

    }
}

