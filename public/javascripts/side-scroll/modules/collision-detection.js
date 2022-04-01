import { PubSub } from "./pub-sub.js";

export class CollisionEvent {
    sprite;
    collidingSprite;
    collidesLeft = false;
    collidesRight = false;
    collidesTop = false;
    collidesBottom = false;
    bottomOverlap = 0;

}

export class CollisionDetection {
    pubSub = PubSub.getInstance();


    detectIndividualCollision(sprite, other) {
        const collisionEvent = new CollisionEvent();
        collisionEvent.sprite = sprite;
        collisionEvent.collidingSprite = other;

        const spriteBottom = sprite.y + sprite.height;
        const spriteRight = sprite.x + sprite.width;

        if (sprite !== other) {

            const otherSpriteBottom = other.y + other.height;
            const otherSpriteRight = other.x + other.width;

            // Check for bottom collision
            if (sprite.y < otherSpriteBottom && spriteBottom > other.y && sprite.speedY > 0) {
                if (spriteRight > other.x && sprite.x < otherSpriteRight) {
                    collisionEvent.collidesBottom = true;
                    // collisions.bottomOverlap = other.y - spriteBottom;
                }
            }

            // Check for top collision
            if (spriteBottom > other.y && sprite.y > otherSpriteBottom && sprite.speedY < 0) {
                if (spriteRight > other.x && sprite.x < otherSpriteRight) {
                    collisionEvent.collidesTop = true;
                }
            }

            // Check for left collision
            if (spriteRight > other.x && sprite.x < otherSpriteRight && (sprite.speedX > 0 || other.speedX < 0)) {
                if (sprite.y < otherSpriteBottom && spriteBottom > other.y) {
                    collisionEvent.collidesLeft = true;
                }
            }

            // Check for right collection
            if (sprite.x < otherSpriteRight && spriteRight > other.x && (sprite.speedX < 0 || other.speedX > 0 )) {
                if (sprite.y < otherSpriteBottom && spriteBottom > other.y) {
                    //console.log('right collision')
                    collisionEvent.collidesRight = true;
                }
            }

            if (collisionEvent.collidesLeft || collisionEvent.collidesRight || collisionEvent.collidesTop || collisionEvent.collidesBottom) {
                if (collisionEvent.collidesRight && collisionEvent.collidesLeft) {
                    if (collisionEvent.sprite.x < collisionEvent.collidingSprite.x) {
                        collisionEvent.collidesRight = false;
                    } else {
                        collisionEvent.collidesLeft = false;
                    }
                }
                if (collisionEvent.collidesTop && collisionEvent.collidesBottom) {
                    if (collisionEvent.sprite.y < collisionEvent.collidingSprite.y) {
                        collisionEvent.collidesBottom = false;
                    } else {
                        collisionEvent.collidesTop = false;
                    }
                }
            }


        }
        return collisionEvent;
    }

    detectCollisions(game) {
        const collisions = [];
        for (const sprite of game.gameSprites) {
            for (const other of game.gameSprites) {
                const collisionEvent = this.detectIndividualCollision(sprite, other);

                if (collisionEvent.collidesLeft || collisionEvent.collidesRight || collisionEvent.collidesTop || collisionEvent.collidesBottom) {
                    this.pubSub.publish('collision', collisionEvent);
                    collisions.push(collisionEvent);
                }

            }
        }
        return collisions;
    }
}