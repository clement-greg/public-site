var asteroid = function (ctx) {
    flyingObject.call(this, ctx);
    this.rotationSpeed = 0;
    var rockImg = document.getElementById('moonRock');
    var pattern = ctx.createPattern(rockImg, 'repeat');
    this.fill = pattern;
};
asteroid.prototype = Object.create(flyingObject.prototype);
asteroid.constructor = asteroid;
asteroid.prototype.advance = function () {
    flyingObject.prototype.advance.call(this);
    this.rotation += this.rotationSpeed;
};

asteroid.prototype.breakInPieces = function (asteroids) {
    //Intentionally left blank.  Inherited classes will provide implementation
};