import { GameSprite } from "./game-sprite.js";

export class Ground extends GameSprite {

    constructor() {
        super();
        super.isGround = true;
        super.height = 30;
    }
}