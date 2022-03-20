var toughBird = function (initialPoint) {
    bird.call(this, initialPoint);
    
    this.hitsRemaining = 3;
    this.getHitsRemaining = function () { return hitsRemaining; };
    this.destroyBonus = 5;

    this.xVelocityMax = 4;
    this.xVelocityMin = 2;
    this.yVelocityMax = 3;
};
toughBird.prototype = Object.create(bird.prototype);
toughBird.constructor = toughBird;
toughBird.prototype.draw = function () {
    gameArgs.drawEllipse(this.point, 15);
    var ctx = gameArgs.getContext();

    ctx.font = "16px Arial";
    ctx.fillStyle = "#ffffff";
    ctx.fillText(this.hitsRemaining, this.point.x - 5, this.point.y + 5);
};