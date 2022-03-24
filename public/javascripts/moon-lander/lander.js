var lander = function (ctx) {
    flyingObject.call(this, ctx);
    this.rotation = 180;
    this.point = new point(gameArgs.A_SCREEN_WIDTH / 2, 20);
    this.velocity = new velocity(0, 0);
    this.fuel = 500;

    this.outline = [
      new point(-6, 0), new point(-10, 0), new point(-8, 0), new point(-8, 3),  // left foot
      new point(-5, 4), new point(-5, 7), new point(-8, 3), new point(-5, 4),  // left leg
      new point(-1, 4), new point(-3, 2), new point(3, 2), new point(1, 4), new point(-1, 4), // bottom
      new point(5, 4), new point(5, 7), new point(-5, 7), new point(-3, 7),  // engine square
      new point(-6, 10), new point(-6, 13), new point(-3, 16), new point(3, 16),   // left of habitat
      new point(6, 13), new point(6, 10), new point(3, 7), new point(5, 7),   // right of habitat
      new point(5, 4), new point(8, 3), new point(5, 7), new point(5, 4),  // right leg
      new point(8, 3), new point(8, 0), new point(10, 0), new point(6, 0)   // right foot
    ];
};

lander.prototype = Object.create(flyingObject.prototype);

lander.constructor = lander;

lander.prototype.draw = function () {
    flyingObject.prototype.draw.call(this);
};

lander.prototype.advance = function () {
    flyingObject.prototype.advance.call(this);
    if (point.y < 10)
        velocity.dy = 0;

    this.point.resetToBounds();
};

lander.prototype.applyThrustLeft = function () {
    if (this.fuel < 1)
        return;
    this.velocity.dx -= .1;
    if (this.fuel == 100)
        soundFx.playWarning();
    if (this.fuel == 50)
        soundFx.repeatWarning();

    this.fuel -= 1;
    gameArgs.drawLanderFlames(this.point, false, true, false);
    soundFx.startThrust();
};

lander.prototype.applyThrustRight = function () {
    if (this.fuel < 1)
        return;

    this.velocity.dx += .1;
    if (this.fuel == 100)
        soundFx.playWarning();
    if (this.fuel == 50)
        soundFx.repeatWarning();

    this.fuel -= 1;
    gameArgs.drawLanderFlames(this.point, false, false, true);
    soundFx.startThrust();
};

lander.prototype.applyThrustBottom = function () {
    if (this.fuel < 3)
        return;

    if ((this.fuel >= 100 && this.fuel - 3 < 100))
        soundFx.playWarning();
    if (this.fuel >= 50 && this.fuel - 3 < 50)
        soundFx.repeatWarning();

    this.velocity.dy -= .3;
    this.fuel -= 3;
    gameArgs.drawLanderFlames(this.point, true, false, false);
    soundFx.startThrust();
};

lander.prototype.applyGravity = function (gravity) {
    this.velocity.dy += gravity;
};

lander.prototype.reset = function () {
    this.fuel = 500;
    this.point = new point(gameArgs.A_SCREEN_WIDTH / 2, 20);
    this.velocity = new velocity(0, 0);
    this.alive = true;
    this.isLanded = false;
};
