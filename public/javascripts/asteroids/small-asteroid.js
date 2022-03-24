var smallAsteroid = function (ctx, parentVelocity, isLeft, additionalVelocity, parentPoint) {
    asteroid.call(this, ctx);
    this.outline = [
        new point(-5, 9), new point(4, 8), new point(8, 4), new point(8, -5), new point(-2, -8),
        new point(-2, -3), new point(-8, -4), new point(-8, 4), new point(-5, 10),
    ];

    this.point = new point(parentPoint.x, parentPoint.y);
    this.velocity = new velocity(parentVelocity.dx + (isLeft ? - additionalVelocity : additionalVelocity), parentVelocity.dy);
    this.rotationSpeed = 10;
    this.collisionRadius = 5;
    this.alive = true;
    this.destroyPoints = 500;
};

smallAsteroid.prototype = Object.create(asteroid.prototype);
smallAsteroid.constructor = smallAsteroid;

smallAsteroid.prototype.kill = function () {
    asteroid.prototype.kill.call(this);
    soundFx.playBangSmall();
};