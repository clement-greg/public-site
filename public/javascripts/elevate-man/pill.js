var pill = function (ctx, point, powerUp) {
    flyingObject.call(this, ctx);
    this.point = point;
    this.outline = [
        { x: -7, y: -7 },
        { x: 7, y: -7 },
        { x: 7, y: 7 },
        { x: -7, y: 7 },
        { x: -7, y: -7 },
    ];
    this.powerUp = powerUp;
};

pill.prototype = Object.create(flyingObject.prototype);

pill.constructor = pill;

pill.prototype.pillDrawn = false;
var coinImg = new Image();
coinImg.src = '/images/elevate-man/coin.png';


pill.prototype.draw = function () {
    var ctx = gameArgs.getContext();
    //flyingObject.prototype.draw.call(this);
    // if(!this.frameIndex && this.frameIndex != 0) {
    //     this.frameIndex = 0;
    // }


    if (this.powerUp) {

        // console.log(gameArgs.currentFrame);
        // if(gameArgs.currentFrame === this.lastDrawnFrame) {
        //     console.log('breaking out')
        //     return;
        // }
        this.lastDrawnFrame = gameArgs.currentFrame;

        if (this.frameIndex == undefined) {
            this.frameIndex = 0;
        }
        if (this.frameThrottle == undefined) {
            this.frameThrottle = 0;
        }

        var x = this.point.x;
        var y = this.point.y;
        var width = 216.1428571428571;
        var height = 222;
        // console.log({frameIndex: this.frameIndex, width, height});
        ctx.drawImage(coinImg, this.frameIndex * width, 0, width, height, x - 18, y - 22.5, 36, 45);
        // ctx.drawImage(coinImg, 0 , 0);
        if (this.frameThrottle === 5) {
            this.frameIndex++;
            if (this.frameIndex >= 14) {
                this.frameIndex = 0;
            }
            this.frameThrottle = 0;
        } else {
            this.frameThrottle++;
        }
        return;
    }


    ctx.fillStyle = 'yellow';
    ctx.beginPath();
    ctx.moveTo(this.point.x, this.point.y);

    var turnAngle = .3;
    if (this.direction == 'left')
        turnAngle = 180;
    else if (this.direction == 'up')
        turnAngle = -1.2;
    else if (this.direction == 'down')
        turnAngle = 90;

    ctx.arc(this.point.x, this.point.y, this.powerUp ? 10 : 5, 0, Math.PI * 2);
    ctx.closePath();
    ctx.fill();

}