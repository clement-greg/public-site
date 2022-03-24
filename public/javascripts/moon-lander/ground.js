var ground = function () {
    var groundPoints = [];
    var BUMPY = 0.5;
    var PLATFORM = 31;
    var platform = new point();

    this.generateGround = function () {
        var yMiddle = gameArgs.A_SCREEN_HEIGHT / 2;
        groundPoints = [];

        groundPoints[0] = 0 + gameArgs.A_SCREEN_HEIGHT;
        var slope = -1.0;
        for (var i = 1; i < gameArgs.A_SCREEN_WIDTH; i++) {
            var up =   // can the ground slope up?
                   (groundPoints[i - 1] > yMiddle) &&                    // not too high
                   (groundPoints[i - 1] - gameArgs.A_SCREEN_HEIGHT < gameArgs.A_SCREEN_WIDTH - i) &&   // not near the end
                   (slope > -3.0);                                  // not too steep

            var down =   // can the ground slope down
                   (groundPoints[i - 1] < gameArgs.A_SCREEN_HEIGHT - 20) &&          // not too low
                   (i > 10) &&                                     // not near the beginning
                   (slope < 3.0);                                 // not too steep;

            slope += gameArgs.randomFloat((down ? BUMPY : 0.0), (up ? -BUMPY : 0.0));
            groundPoints[i] = groundPoints[i - 1] + slope;
        }

        var iPlatform = Math.floor(gameArgs.random(gameArgs.A_SCREEN_WIDTH / 4, gameArgs.A_SCREEN_WIDTH * 3 / 4));
        var yMax = groundPoints[Math.floor(iPlatform - PLATFORM / 2)];
        for (var i = Math.floor(iPlatform - PLATFORM / 2 + 1) ; i < Math.ceil(iPlatform + PLATFORM / 2) ; i++)
            if (groundPoints[i] < yMax)
                yMax = groundPoints[i];
        platform.x = iPlatform;
        platform.y = yMax - 10;
        platform.x = Math.floor(platform.x);
        platform.y = Math.floor(platform.y);
    };

    this.getPlatformPosition = function () { return platform; };
    this.getPlatformWidth = function () { return PLATFORM; };
    this.generateGround();

    this.getGroundPoints = function () {
        return groundPoints;
    }

    this.draw = function () {
        var pt1 = new point(platform.x, platform.y);
        var pt2 = new point(platform.x, platform.y);

        // draw the platform
        pt1.x = pt1.x + (-PLATFORM / 2);
        pt2.x = pt2.x + (PLATFORM / 2);


        gameArgs.drawLine(pt1, pt2);

        // draw the platform supports
        pt2.y = gameArgs.A_SCREEN_HEIGHT;
        pt2.x = pt1.x;
        for (var i = 0; i < PLATFORM; i += 5) {
            gameArgs.drawLine(pt1, pt2);
            pt1.x = pt1.x + 5;
            pt2.x = pt1.x + 5;
        }
        var rockImg = document.getElementById('moonRock');
        var pattern = gameArgs.getContext().createPattern(rockImg, 'repeat');

        gameArgs.fillPath(groundPoints, null, null, pattern);
    }
};

ground.prototype.isAboveGround = function (point) {
    return point.x > 0 &&
           point.y < gameArgs.A_SCREEN_HEIGHT &&
           point.x < gameArgs.A_SCREEN_WIDTH &&
           point.y < this.getGroundPoints()[Math.floor(point.x)];
};