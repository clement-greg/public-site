import { GameSprite } from "./game-sprite.js";

export class Brick extends GameSprite {
    constructor() {
        super();
        this.isGround = true;

        const brickDiv = document.createElement('div');
        brickDiv.className = 'brick';
        super.x = 0;
        super.y = 0;
        super.width = 72;
        super.height = 72;

        this.domObject = brickDiv;
    }

    bounceIt() {
        this.domObject.classList.add('bounce');
        setTimeout(() => this.domObject.classList.remove('bounce'), 200);
    }
}