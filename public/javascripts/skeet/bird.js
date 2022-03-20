var bird = function (initialPoint) {
    flyingObject.call(this);
    this.point = initialPoint;
    this.xVelocityMin = 3;
    this.xVelocityMax = 6;
    this.yVelocityMax = 4;
    this.hitsRemaining = 1;
    this.destroyBonus = 0;
    this.hitScore = 1;
    this.collisionRadius = 15;
    this.missCount = 1;

    this.hit = function()
    {
        var score = this.hitScore;

        this.hitsRemaining--;
        if (this.hitsRemaining == 0)
        {
            score += this.destroyBonus;
            this.kill();
            this.playDestroyedSound();
        }

        return score;
    }
};

bird.prototype = Object.create(flyingObject.prototype);
bird.constructor = bird;

bird.prototype.initializeVelocity = function() {
    var dX = gameArgs.randomFloat(this.xVelocityMin, this.xVelocityMax + 1);
    var dY = 0;

    if (this.point.y > gameArgs.A_SCREEN_HEIGHT / 2)
    {
        //Go generally down
        dY = gameArgs.randomFloat(-this.yVelocityMax, 0.0);

    }
    else
    {
        //Go generally up
        dY = gameArgs.randomFloat(0.0, this.yVelocityMax);
    }

    this.velocity.dx = dX;
    this.velocity.dy = dY;
}

bird.prototype.advance = function () {
    if (this.velocity.dx == 0)
        this.initializeVelocity();

    flyingObject.prototype.advance.call(this);
};

bird.prototype.playDestroyedSound = function () {
    soundFx.playHit();
};