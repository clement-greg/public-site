var ship = function (ctx, game) {
    flyingObject.call(this, ctx);

    this.outline = [new point(0, 6), new point(6, -6), new point(2, -3), new point(-2, -3), new point(-6, -6), new point(0, 6)];
    this.flames = [
        new point(-2, -3), new point(-2, -13), new point(0, -6), new point(2, -13), new point(2, -3),
        new point(-2, -3), new point(-4, -9), new point(-1, -7), new point(1, -14), new point(2, -3),
        new point(-2, -3), new point(-1, -14), new point(1, -7), new point(4, -9), new point(2, -3),
    ];

    this.point = new point(gameArgs.A_SCREEN_WIDTH / 2, gameArgs.A_SCREEN_HEIGHT / 2);
    this.rotation = 180;
};

ship.prototype = Object.create(flyingObject.prototype);
ship.constructor = ship;
