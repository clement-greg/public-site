var mediumAsteroid = function (ctx, parentVelocity, isUp, parentPoint) {
    asteroid.call(this, ctx);
    this.outline = [
        new point(2, 8), new point(8, 15), new point(12, 8), new point(6, 2), new point(12, -6), new point(2, -15),
        new point(-6, -15), new point(-14, -10), new point(-15, 0), new point(-4, 15), new point(2, 8)
    ];

    this.velocity = new velocity(parentVelocity.dx, parentVelocity.dy + (isUp ? 1 : -1));
    this.point = new point(parentPoint.x, parentPoint.y);
    this.rotationSpeed = 5;
    this.collisionRadius = 8;
    this.alive = true;
    this.destroyPoints = 200;
};
mediumAsteroid.prototype = Object.create(asteroid.prototype);
mediumAsteroid.constructor = mediumAsteroid;
mediumAsteroid.prototype.breakInPieces = function (asteroids) {
    asteroids.push(new smallAsteroid(this.ctx, this.velocity, false, 2, this.point));
    asteroids.push(new smallAsteroid(this.ctx, this.velocity, true, 2, this.point));
};

mediumAsteroid.prototype.kill = function () {
    asteroid.prototype.kill.call(this);
    soundFx.playBangMedium();
};