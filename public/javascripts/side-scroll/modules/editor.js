import { Brick } from "./brick.js";
import { HTTP } from "./http.js";
import { MysteryBlock } from "./mystery-block.js";
import { Ram } from "./ram.js";
import { Snackbar } from "./snackbar.js";
import { SpikeBall } from "./spike-ball.js";

export class Editor {

    constructor(game) {


        document.getElementById('add-brick').addEventListener('click', () => {
            const brick = new Brick();
            brick.y = 0;
            brick.x = 0;
            new DragHelper().dragElement(brick);

            const gameDiv = document.getElementById('game-div');
            const transform = gameDiv.style.transform;

            if (transform) {
                const x = parseInt(transform.replace('translateX(', '').replace(')', ''));
                brick.x = -x;
            }
            game.addSprite(brick);
            this.addDoubleClickHandler(brick, game);
        });

        document.getElementById('add-mystery').addEventListener('click', () => {
            const mystery = new MysteryBlock();
            mystery.y = 0;
            mystery.x = 0;

            new DragHelper().dragElement(mystery);

            const gameDiv = document.getElementById('game-div');
            const transform = gameDiv.style.transform;

            if (transform) {
                const x = parseInt(transform.replace('translateX(', '').replace(')', ''));
                mystery.x = -x;
            }
            game.addSprite(mystery);
            this.addDoubleClickHandler(mystery, game);

        });

        document.getElementById('add-spike-ball').addEventListener('click', ()=> {
            const spikeBall = new SpikeBall();
            spikeBall.y = 0;
            spikeBall.x = 0;
            spikeBall.newlyCreated = true;
            new DragHelper().dragElement(spikeBall);

            const gameDiv = document.getElementById('game-div');
            const transform = gameDiv.style.transform;

            if (transform) {
                const x = parseInt(transform.replace('translateX(', '').replace(')', ''));
                spikeBall.x = -x;
            }
            game.addSprite(spikeBall);
            this.addDoubleClickHandler(spikeBall, game);
        });

        document.getElementById('add-ram').addEventListener('click', ()=> {
            const ram = new Ram();
            ram.y = 0;
            ram.x = 0;
            ram.newlyCreated = true;
            new DragHelper().dragElement(ram);

            const gameDiv = document.getElementById('game-div');
            const transform = gameDiv.style.transform;

            if (transform) {
                const x = parseInt(transform.replace('translateX(', '').replace(')', ''));
                ram.x = -x;
            }
            game.addSprite(ram);
            this.addDoubleClickHandler(ram, game);
        });

        document.getElementById('print-debug').addEventListener('click',()=> {
            console.log(game);
        });

        for (const sprite of game.gameSprites) {
            if (sprite.domObject) {
                new DragHelper().dragElement(sprite);
                this.addDoubleClickHandler(sprite, game);
            }
        }

        document.getElementById('serialize').addEventListener('click', async () => {
            await HTTP.postData('/receive', game.gameSprites);
            Snackbar.show('Level Saved');
        });
    }

    addDoubleClickHandler(sprite, game) {
        sprite.domObject.addEventListener('dblclick', e => {

            const sprite = game.gameSprites.find(i => i.domObject === e.srcElement);

            if (sprite) {

                game.removeSprite(sprite);
            }
        });
    }


}

class DragHelper {

    pos1 = 0;
    pos2 = 0;
    pos3 = 0;
    pos4 = 0;
    elmnt = null;
    sprite = null;
    dragElement(sprite) {
        this.sprite = sprite;
        const elmnt = sprite.domObject;
        this.elmnt = sprite.domObject;
        if (document.getElementById(elmnt.id + "header")) {
            // if present, the header is where you move the DIV from:
            document.getElementById(elmnt.id + "header").onmousedown = this.dragMouseDown;
        } else {
            // otherwise, move the DIV from anywhere inside the DIV:
            elmnt.onmousedown = this.dragMouseDown;
        }
    }

    dragMouseDown = (e) => {
        e = e || window.event;
        e.preventDefault();
        // get the mouse cursor position at startup:
        this.pos3 = e.clientX;
        this.pos4 = e.clientY;
        document.onmouseup = this.closeDragElement;
        // call a function whenever the cursor moves:
        document.onmousemove = this.elementDrag;
    }

    elementDrag = (e) => {
        e = e || window.event;
        e.preventDefault();
        // calculate the new cursor position:
        this.pos1 = this.pos3 - e.clientX;
        this.pos2 = this.pos4 - e.clientY;
        this.pos3 = e.clientX;
        this.pos4 = e.clientY;
        // set the element's new position:
        let top = (this.elmnt.offsetTop - this.pos2);
        let left = (this.elmnt.offsetLeft - this.pos1);

        const factor = 20;
        // top = Math.round(top / factor) * factor;
        // left = Math.round(left / factor) * factor;
        this.elmnt.style.top = top + "px";
        this.elmnt.style.left = left + "px";
        this.sprite.x = left;
        this.sprite.y = top;
    }

    closeDragElement = () => {
        // stop moving when mouse button is released:
        document.onmouseup = null;
        document.onmousemove = null;
    }
}