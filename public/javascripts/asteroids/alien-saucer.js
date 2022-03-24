var alienSaucer = function (ctx, alienBullets) {
    flyingObject.call(this, ctx);
    this.ctx = ctx;

    this.outline = [
        new point(-12, 0), new point(-3, 7), new point(3, 7), new point(12, 0), new point(4, -2),
        new point(3, -2), new point(0, -4), new point(-3, -2), new point(-4, -2), new point(-12, 0),
    ];

    this.collisionRadius = 12;
    this.alive = false;
    this.destroyPoints = 1000;
    this.point = new point(50, 50);
    this.rotation = 0;
    this.wrap = false;
    this.gameStopped = false;

    var rotateWaxing = false;
    var deadCounter = 0;
    var fireInterval = 0;
    var lastFireInterval = 0;

    this.killInternal = function () {
        deadCounter = 0;
    };

    this.incrementDeadCounter = function () {
        deadCounter += 1;
    };

    this.getDeadCounter = function () {
        return deadCounter;
    };

    this.resetDeadCounter = function () {
        deadCounter = 0;
    };

    this.setFireInterval = function (interval) {
        fireInterval = interval;
    };

    this.getFireInterval = function () {
        return fireInterval;
    };

    this.getLastFireInterval = function () {
        return lastFireInterval;
    };

    this.setLastFireInterval = function (interval) {
        lastFireInterval = interval;
    };

    this.getRotateWaxing = function () {
        return rotateWaxing;
    };

    this.getRotation = function () {
        return this.rotation;
    };

    this.setRotation = function (rotation) {
        this.rotation = rotation;
    };

    this.setRotationWaxing = function (isWaxing) {
        rotateWaxing = isWaxing;
    };

    this.addAlienBullet = function (bullet) {
        alienBullets.push(bullet);
    };

};

alienSaucer.prototype = Object.create(flyingObject.prototype);
alienSaucer.constructor = alienSaucer;
alienSaucer.prototype.advance = function () {
    flyingObject.prototype.advance.call(this);

    if (!this.alive) {
        this.incrementDeadCounter();
        if (this.getDeadCounter() >= 600 && !this.gameStopped) {
            this.alive = true;
            soundFx.startSaucerSound();

            var y = gameArgs.random(0, 400);
            var dy = 0;
            if (y < 1)
                dy = gameArgs.random(0, 2);
            else
                dy = -gameArgs.random(0, 2);
            this.resetDeadCounter();
            this.point = new point(0, y);
            this.velocity = new velocity(2, dy);
            this.setFireInterval(gameArgs.random(5, 15));
        }
    }
    else {

        if (this.getRotateWaxing()) {
            this.setRotation(this.getRotation() + 1);
        }
        else {
            this.setRotation(this.getRotation() - 1);
        }

        if (this.getRotation() > 20) {
            this.setRotationWaxing(false);
        }
        else if (this.getRotation() < -20) {
            this.setRotationWaxing(true);
        }

        this.setLastFireInterval(this.getLastFireInterval() + 1);

        if (this.getLastFireInterval() > this.getFireInterval()) {
            this.fire();
            this.setLastFireInterval(0);
        }


        if (this.point.x > 400 || this.point.y > 400 || this.point.y < 0) {
            //Alien is off the screen
            this.alive = false;
            soundFx.endSaucerSound();
        }
    }
};

alienSaucer.prototype.kill = function (dontPlaySound) {
    flyingObject.prototype.kill.call(this);
    if (!dontPlaySound)
        soundFx.playExplode();
    this.killInternal();
    soundFx.endSaucerSound();
};

alienSaucer.prototype.fire = function () {
    var b = new bullet(this.ctx);
    
    var dy = gameArgs.random(0, 14) - 7;
    var dx = gameArgs.random(0, 14) - 7;
    b.velocity = new velocity(dx, dy);
    b.point = new point(this.point.x, this.point.y);
    b.fire(b.point, b.velocity);
    b.setIsRed(true);

    this.addAlienBullet(b);
};