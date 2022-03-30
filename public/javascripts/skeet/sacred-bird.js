var elevateBirdImg = new Image();
elevateBirdImg.src = '/images/skeet/elevate-bird.png';
var sacredBird = function (initialPoint) {
    bird.call(this, initialPoint);
    this.radius = 20;
    this.rotation = 0;
    this.drawColor = "#ff0000";     //Draw in red
    this.hitScore = -10;            //Don't hit this bird
    this.missCount = 0;             //Doesn't count as a miss when the player doesn't hit it

    //Create the 'Star' outline
    for (var i = 0; i < 5; i++) {
        var temp = new point();
        var radian = i * (Math.PI * 2.0) * 0.4;
        temp.x = (this.radius * Math.cos(radian));
        temp.y = (this.radius * Math.sin(radian));
        temp = gameArgs.rotate(temp, this.point, this.rotation);
        this.outline.push(temp);
    }
    this.outline.push(new point(this.outline[0].x, this.outline[0].y));

    this.incrementRotation = function () {
        this.rotation += 3
    };
};
sacredBird.prototype = Object.create(bird.prototype);
sacredBird.constructor = sacredBird;
sacredBird.prototype.advance = function () {
    bird.prototype.advance.call(this);
    //Spin this bird 
    this.incrementRotation();
};
sacredBird.prototype.playDestroyedSound = function () {
    soundFx.playBeep();
};

sacredBird.prototype.draw = function () {
    //gameArgs.drawEllipse(this.point, 15);
    var ctx = gameArgs.getContext();
    
    ctx.drawImage(elevateBirdImg, 0, 0, 489, 489, this.point.x - 20, this.point.y - 20, 40, 40);

};