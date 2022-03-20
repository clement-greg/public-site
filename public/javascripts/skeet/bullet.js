var bullet = function () {
    flyingObject.call(this);
    this.outline = [
        new point(0, 0), new point(0, 1), new point(1, 1), new point(1, 0), new point(0, 0),
    ];

    this.collisionRadius = 2;    
};

bullet.prototype = Object.create(flyingObject.prototype);
bullet.constructor = bullet;
bullet.prototype.advance = function () {
    flyingObject.prototype.advance.call(this);
    if (!gameArgs.isWithinGameBounds(this)) {
        this.kill();
    }
};

bullet.prototype.fire = function (startPoint, angle) {
    var BULLET_SPEED = 10;
    //angle = 180 - angle;
    angle = 90 - angle;
    var dx = BULLET_SPEED * (-Math.cos(Math.PI / 180.0 * angle));
    var dy = -BULLET_SPEED * (Math.sin(Math.PI / 180.0 * angle));

    var correctY = (Math.sin(Math.PI / 180.0 * angle));
    var correctX = (-Math.cos(Math.PI / 180.0 * angle));

    var v = new velocity(dx, dy);
    
    this.point = new point(startPoint.x - (correctX - 5), startPoint.y - (correctY - 40));
    this.velocity = v;
    soundFx.playGun();
};