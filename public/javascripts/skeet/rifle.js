var rifle = function (point) {
    var ANGLE_MAX = 89;
    var ANGLE_MIN = 1;
    var ANGLE_START = 45;
    var RIFLE_MOVE_AMOUNT = 1
    var point = point;
    var angle = ANGLE_START;

    this.getAngle = function () { return angle; };

    this.getPoint = function () { return point; };

    this.setAngle = function (newAngle) { angle = newAngle; };

    this.moveRight = function () {
        angle += RIFLE_MOVE_AMOUNT;

        if (angle > ANGLE_MAX) {
            angle = ANGLE_MAX;
        }
    };

    this.moveLeft = function () {
        angle -= RIFLE_MOVE_AMOUNT;

        if (angle < ANGLE_MIN) {
            angle = ANGLE_MIN;
        }
    };
};

rifle.prototype.draw = function () {
    var RIFLE_WIDTH = 5;
    var RIFLE_HEIGHT = 40;

    gameArgs.drawPoints(
        [new point(RIFLE_WIDTH, RIFLE_HEIGHT),
        new point(RIFLE_WIDTH, 0),
        new point(0, 0),
        new point(0, RIFLE_HEIGHT), new point(RIFLE_WIDTH, RIFLE_HEIGHT)
        ],
        new point(this.getPoint().x + RIFLE_WIDTH + 5, this.getPoint().y + RIFLE_HEIGHT),
        180 - this.getAngle());
};

rifle.constructor = rifle;