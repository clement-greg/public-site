var elevateShip = new Image();
elevateShip.src = '/images/asteroids/elevate-ship.png';
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
ship.prototype.draw = function() {
    var ctx = gameArgs.getContext();
    
    ctx.save();
    // ctx.translate(this.point.x,this.point.y);
    // ctx.rotate(this.rotation * Math.PI / 180);
    const width = 110;
    const frameCount = 36;
    let rotation = this.rotation - 180;
    while(rotation >= 360) {
        rotation -= 360;
    }
    while(rotation < 0) {
        rotation += 360;
    }
    let increment = (Math.ceil((rotation) / 10) * 10) / 10;
    increment = frameCount - increment;
    // const increment = 10;
    console.log(increment, rotation);
    if(increment >= 37) {
        increment = 36;
    }

    ctx.drawImage(elevateShip, increment * width, 0, width , 108, this.point.x - 20, this.point.y - 20, 40, 40);
    ctx.restore();
}
