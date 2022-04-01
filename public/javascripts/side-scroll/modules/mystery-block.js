import { GameSprite } from "./game-sprite.js";

export class MysteryBlock extends GameSprite {
    empty = false;
    constructor() {
        super();
        this.isGround = true;

        const brickDiv = document.createElement('div');
        brickDiv.className = 'mystery-block';
        super.x = 0;
        super.y = 0;
        super.width = 72.8;
        super.height = 72.8;

        this.domObject = brickDiv;
    }

    emptyIt() {
        this.empty = true;
        this.domObject.style.backgroundPositionX = '-72px';
        this.domObject.classList.add('bounce');
        setTimeout(()=> {
            this.domObject.classList.remove('bounce');
        }, 200);
    }
}