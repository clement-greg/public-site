var bullet = function (ctx) {
    flyingObject.call(this, ctx);
    this.outline = [
        new point(0, 0), new point(0, 3), new point(3, 2), new point(3, 0), new point(0, 0),
    ];
    this.BULLET_LIFE = 40;
    this.frameLife = 0;
    this.collisionRadius = 2;

    var isRed = false;
    this.setIsRed = function (red) {
        isRed = red;
    }
    this.fill = '#fff';
};

bullet.prototype = Object.create(flyingObject.prototype);
bullet.constructor = bullet;
bullet.prototype.advance = function () {
    flyingObject.prototype.advance.call(this);
    
    this.frameLife += 1;
    if (this.frameLife >= this.BULLET_LIFE) {
        this.kill();
    }
};
bullet.prototype.fire = function (point, velocity) {
    this.point = point;
    this.velocity = velocity;
};