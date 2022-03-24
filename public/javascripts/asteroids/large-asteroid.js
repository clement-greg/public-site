var largeAsteroid = function (ctx) {
    asteroid.call(this, ctx);
    this.outline = [
        new point(0, 12), new point(8, 20), new point(16, 14),
        new point(10, 12), new point(20, 0), new point(0, -20),
        new point(-18, -10), new point(-20, -2), new point(-20, 14),
        new point(-10, 20), new point(0, 12),
    ];
    this.rotationSpeed = 2;
    this.collisionRadius = 16;
    this.ctx = ctx;

    var angle = gameArgs.random(0, 360);
    this.rotation = gameArgs.random(0, 360);

    var dy = -(.5 * (-Math.cos(Math.PI / 180.0 * angle)));
    var dx = -(.5 * (Math.sin(Math.PI / 180.0 * angle)));

    this.velocity = new velocity(dx, dy);
    
    this.point = new point(gameArgs.random(0, gameArgs.A_SCREEN_WIDTH), gameArgs.random(0, gameArgs.A_SCREEN_HEIGHT));
    
    this.destroyPoints = 100;
};
largeAsteroid.prototype = Object.create(asteroid.prototype);
largeAsteroid.constructor = largeAsteroid;

largeAsteroid.prototype.breakInPieces = function (asteroids) {
    asteroids.push(new mediumAsteroid(this.ctx, this.velocity, true, this.point));
    asteroids.push(new mediumAsteroid(this.ctx, this.velocity, false, this.point));
    asteroids.push(new smallAsteroid(this.ctx, this.velocity, false, 1, this.point));
};

largeAsteroid.prototype.kill = function () {
    asteroid.prototype.kill.call(this);
    soundFx.playBangLarge();
};