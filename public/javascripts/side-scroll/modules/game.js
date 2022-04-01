import { Player } from './player.js';
import { World } from './world.js';
import { Ground } from './ground.js';
import { Brick } from './brick.js';
import { HTTP } from './http.js';
import { Editor } from './editor.js';
import { MysteryBlock } from './mystery-block.js';
import { Coin } from './coin.js';
import { SpikeBall } from './spike-ball.js';
import { PubSub } from './pub-sub.js';
import { CollisionDetection } from './collision-detection.js';
import { Ram } from './ram.js';


export class Game {
    static gameInstance;
    world;
    internval;
    static gravity = 1;
    player;

    gameSprites = [];
    pubSub = PubSub.getInstance();
    collisionDetection;

    constructor() {
        const player = new Player();
        this.player = player;
        this.addSprite(player);
        this.world = World.getInstance();
        const ground = new Ground();
        ground.width = this.world.width;
        ground.x = 0;
        ground.y = this.world.height - ground.height;

        this.collisionDetection = new CollisionDetection();

        this.addSprite(ground);

        HTTP.getData('./assets/levels/level1.json').then(json => {

            this.setupGame(json);
            new Editor(this);
        });

        this.pubSub.subscribe('collision', data => {
            if (data.collidingSprite && data.collidingSprite.objectType !== 'Ground') {
            }
        });
    }

    setupGame(json) {
        const sprites = JSON.parse(json);
        for (const sprite of sprites) {
            if (sprite.objectType === 'Brick') {
                const brick = new Brick();
                brick.x = sprite.x;
                brick.y = sprite.y;
                this.addSprite(brick);
            } else if (sprite.objectType === 'MysteryBlock') {
                const mystery = new MysteryBlock();
                mystery.x = sprite.x;
                mystery.y = sprite.y;
                this.addSprite(mystery);

            } else if (sprite.objectType === 'SpikeBall') {
                const spikeBall = new SpikeBall();
                spikeBall.x = sprite.x;
                spikeBall.y = sprite.y;
                spikeBall.initialX = spikeBall.x;
                spikeBall.initialY = spikeBall.y;
                spikeBall.moveSpeed = spikeBall.moveSpeed;
                spikeBall.moveDistance = spikeBall.moveDistance;
                this.addSprite(spikeBall);
            } else if (sprite.objectType === 'Ram') {
                const ram = new Ram();
                ram.x = sprite.x;
                ram.y = sprite.y;
                ram.initialX = ram.x;
                ram.initialY = ram.y;
                ram.moveSpeed = ram.moveSpeed;
                ram.moveDistance = ram.moveDistance;
                this.addSprite(ram);
            }
        }
    }

    advance() {


        for (const sprite of this.gameSprites) {
            if (sprite.applyGravity) {
                if (!sprite.speedY) {
                    sprite.speedY = 0;
                }

                sprite.speedY += this.world.gravity;
            }
        }

        const collisions = this.collisionDetection.detectCollisions(this);
        const playerCollisions = collisions.filter(i => i.sprite.objectType === 'Player');
        for (const sprite of this.gameSprites.filter(i => i.applyGravity && i.groundedSprite)) {

            const otherSprite = sprite.groundedSprite;
            const spriteRight = sprite.x + sprite.width;
            const otherSpriteRight = otherSprite.x + otherSprite.width;
            let isOverSprite = false;
            if (spriteRight >= otherSprite.x && sprite.x <= otherSpriteRight) {
                isOverSprite = true;
            }
            else if (sprite.x <= otherSpriteRight && spriteRight >= otherSprite.x) {
                isOverSprite = true;
            }
            if (!isOverSprite) {
                const newSprite = this.gameSprites.find(i => i.y === otherSprite.y && spriteRight > i.x && (sprite.x < i.x + i.width));
                if (newSprite) {
                    sprite.isGrounded = true;
                    sprite.groundedSprite - newSprite;
                } else {
                    sprite.isGrounded = false;
                    sprite.groundedSprite = null;
                }
            }

        }
        for (let collision of playerCollisions) {
            const sprite = collision.sprite;
            const otherSprite = collision.collidingSprite;

            if (!sprite.isGrounded && sprite.speedY < 0 && collision.collidesTop) {
                sprite.y = otherSprite.y + otherSprite.height + 1;

                sprite.speedY = 0;
                if (otherSprite.objectType === 'MysteryBlock' && !otherSprite.empty) {
                    const coin = new Coin();
                    coin.y = otherSprite.y - coin.height;
                    coin.x = otherSprite.x;
                    this.addSprite(coin);

                    setTimeout(() => {
                        this.removeSprite(coin);
                    }, 1200);
                    otherSprite.emptyIt();
                } else if (otherSprite.objectType === 'Brick') {
                    otherSprite.bounceIt();
                }
            } else if (collision.collidesLeft && collision.collidingSprite.objectType !== 'Ground') {
                //console.log('pushing left');
                sprite.speedX = 0;
                sprite.x = otherSprite.x - sprite.width - 1;
                // collision = this.collisionDetection.detectIndividualCollision(collision.sprite, collision.collidingSprite);
            } else if (collision.collidesRight && collision.collidingSprite.objectType !== 'Ground') {
                //console.log('pushing right');
                sprite.speedX = 0;
                sprite.x = otherSprite.x + otherSprite.width + 1;
                // collision = this.collisionDetection.detectIndividualCollision(collision.sprite, collision.collidingSprite);
            }

            const leftRightCollision = collisions.find(i => i.sprite === sprite && i.collidingSprite !== otherSprite && (i.collidesRight || i.collidesLeft))
            if (!sprite.isGrounded && collision.collidingSprite.isGround && collision.collidesBottom && !leftRightCollision) {
                sprite.y = collision.collidingSprite.y - sprite.height;
                sprite.speedY = 0;
                sprite.isGrounded = true;
                sprite.groundedSprite = collision.collidingSprite;
            }


        }

        this.centerPlayer();
    }

    addSprite(sprite) {
        this.gameSprites.push(sprite);
        if (sprite.domObject) {
            const div = document.getElementById('game-div');
            div.appendChild(sprite.domObject);
            sprite.domObject.style.left = `${sprite.x}px`;
            sprite.domObject.style.top = `${sprite.y}px`;
            sprite.domObject.classList.add('sprite');
        }
    }

    centerPlayer() {
        const windowWidth = window.innerWidth;
        const worldWidth = this.world.width;
        const playerWidth = this.player.width;
        const playerLeft = this.player.x + (this.player.width / 2);

        if (playerLeft > windowWidth / 2 && playerLeft < (worldWidth - (windowWidth / 2))) {

            const x = windowWidth - playerLeft;
            const offset = windowWidth / 2 - x;
            document.getElementById('game-div').style.transform = 'translateX(-' + offset + 'px)';
            document.getElementById('bg-buildings').style.transform = 'translateX(-' + (offset * .1) + 'px)';
            document.getElementById('bg-plants').style.transform = 'translateX(-' + (offset * .5) + 'px)';
            document.getElementById('bg-sky').style.transform = 'translateX(-' + (offset * .01) + 'px)';
        }
    }

    static getInstance() {
        if (!Game.gameInstance) {
            Game.gameInstance = new Game();
        }

        return Game.gameInstance;
    }

    removeSprite(sprite) {
        if (sprite.domObject) {
            sprite.domObject.parentNode.removeChild(sprite.domObject);

        }
        this.gameSprites.splice(this.gameSprites.indexOf(sprite), 1);
    }

    start() {
        this.internval = setInterval(() => this.doGameLoop(), 10);
    }

    stop() {
        clearInterval(this.internval);
    }

    doGameLoop() {
        this.advance();
        for (const sprite of this.gameSprites) {
            sprite.advance();
        }

    }
}