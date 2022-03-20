var standardBird = function (initialPoint) {
    bird.call(this, initialPoint);
};
standardBird.prototype = Object.create(bird.prototype);
standardBird.constructor = standardBird;

standardBird.prototype.draw = function () {
    gameArgs.drawEllipse(this.point, 15);
};