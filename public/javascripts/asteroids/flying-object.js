var flyingObject = function (ctx) {
    this.outline = [];
    this.point = new point();
    this.rotation = 0;
    this.ctx = ctx;
    this.velocity = new velocity(0, 0);
    this.alive = true;
    this.collisionRadius = 0;
    this.destroyPoints = 0;
    this.wrap = true;
    this.fill = null;
};

flyingObject.prototype.draw = function () {
    if (!this.alive)
        return;

    this.drawPoints(this.outline);
};

flyingObject.prototype.drawPoints = function (points) {
    gameArgs.drawPoints(this.ctx, points, this.point, this.rotation, this.fill);
};

flyingObject.prototype.kill = function () {
    this.alive = false;
};

flyingObject.prototype.advance = function () {
    this.point.x = this.point.x + this.velocity.dx;
    this.point.y = this.point.y + this.velocity.dy;
    if (this.wrap)
        this.point.wrap();
};
