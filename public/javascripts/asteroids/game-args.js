Math.radians = function (degrees) {
    return degrees * Math.PI / 180;
};

Array.prototype.removeItem = function (item) {
    this.splice(this.indexOf(item), 1);
};

//Going to be a 'Static' javascript class
var gameArgs = function () { };

gameArgs.A_SCREEN_WIDTH = 600;
gameArgs.A_SCREEN_HEIGHT = 600;
gameArgs.rotate = function (point, origin, rotation) {
    // because sine and cosine are expensive, we want to call them only once
    var cosA = Math.cos(Math.radians(rotation));
    var sinA = Math.sin(Math.radians(rotation));

    // remember our original point
    var tmp = { x: point.x - origin.x, y: point.y - origin.y };

    return { x: (tmp.x * cosA - tmp.y * sinA) + origin.x, y: (tmp.x * sinA + tmp.y * cosA) + origin.y };

    return point;
};

//Very simple collision detection based on a c++ algorithm presented in cs165
gameArgs.checkForCollision = function (obj1, obj2) {
    // find the maximum distance traveled
    var dMax = Math.max(Math.abs(obj1.velocity.dx), Math.abs(obj1.velocity.dy));
    dMax = Math.max(dMax, Math.abs(obj2.velocity.dx));
    dMax = Math.max(dMax, Math.abs(obj2.velocity.dy));
    dMax = Math.max(dMax, 0.1); // when dx and dy are 0.0. Go through the loop once.

    var distMin = 100000000;
    for (var i = 0.0; i <= dMax; i++) {
        var point1 = new point(obj1.point.x + (obj1.velocity.dx * i / dMax), obj1.point.y + (obj1.velocity.dy * i / dMax));
        var point2 = new point(obj2.point.x + (obj2.velocity.dx * i / dMax), obj2.point.y + (obj2.velocity.dy * i / dMax));


        var xDiff = point1.x - point2.x;
        var yDiff = point1.y - point2.y;

        var distSquared = (xDiff * xDiff) + (yDiff * yDiff);

        distMin = Math.min(distMin, distSquared);
    }

    return Math.sqrt(distMin);
};

gameArgs.areObjectsCollided = function (flyingObject1, flyingObject2) {
    var distance = gameArgs.checkForCollision(flyingObject1, flyingObject2);

    return distance < flyingObject1.collisionRadius + flyingObject2.collisionRadius;
};

gameArgs.random = function (min, max) {
    return Math.floor(Math.random() * max) + min;
};

gameArgs.drawPolygon = function drawPolygon(ctx, center, radius, points, rotation, color) {
    // begin drawing
    ctx.beginPath();
    if (!color)
        color = "#ffffff";

    ctx.strokeStyle = color;

    //loop around a circle the given number of times drawing a line from
    //one point to the next
    var firstPoint = null;
    for (var i = 0; i < 2 * Math.PI; i += (2 * Math.PI) / points) {
        var temp = new point(center.x + (radius * Math.cos(i)), center.y + (radius * Math.sin(i)));

        var rotatedPoint = gameArgs.rotate(temp, center, rotation);
        if (i == 0) {
            ctx.moveTo(rotatedPoint.x, rotatedPoint.y);
            firstPoint = rotatedPoint;
        }
        ctx.lineTo(rotatedPoint.x, rotatedPoint.y);
    }
    ctx.lineTo(firstPoint.x, firstPoint.y);
    ctx.stroke();
    ctx.strokeStyle = "#ffffff";
};

gameArgs.drawEllipse = function (ctx, center, radius, color) {
    gameArgs.drawPolygon(ctx, center, radius, 20, 0, color);
};

gameArgs.drawCrossCircle = function (ctx, center, radius) {
    gameArgs.drawEllipse(ctx, center, radius, "#ff0000");
    var temp = new point(center.x, center.y + radius);
    temp = gameArgs.rotate(temp, center, 45);

    var temp2 = new point(center.x, center.y - radius);
    temp2 = gameArgs.rotate(temp2, center, 45);

    ctx.beginPath();

    ctx.strokeStyle = "#ff0000";
    ctx.moveTo(temp.x, temp.y);

    ctx.lineTo(temp2.x, temp2.y);
    ctx.stroke();
    ctx.strokeStyle = "#ffffff";
};

//The workhorse of the game that takes an array of points and renders
//them to the supplied canvas
gameArgs.drawPoints = function (ctx, points, center, rotation, fill) {
    ctx.beginPath();
    if (fill)
        ctx.fillStyle = fill;
    var firstPoint = gameArgs.rotate({ x: center.x + points[0].x, y: center.y + points[0].y }, center, rotation);
    ctx.moveTo(firstPoint.x, firstPoint.y);

    for (var i = 1; i < points.length; i++) {
        var rotatedPoint = { x: points[i].x + center.x, y: points[i].y + center.y };
        rotatedPoint = gameArgs.rotate(rotatedPoint, center, rotation);
        ctx.lineTo(rotatedPoint.x, rotatedPoint.y);
    }
    ctx.stroke();
    if (fill)
        ctx.fill();
};

var g = null;
gameArgs.startGame = function () {
    gameArgs.A_SCREEN_WIDTH = 600;
    gameArgs.A_SCREEN_HEIGHT = 600;
    if (!g)
        g = new game();
};

$(function () {
    $("#launchGameButton").click(function () {
        $("#splash").addClass("display-none");
        $("#gameCanvas").removeClass("display-none");
        gameArgs.startGame();
    });

    setTimeout(function () {
        $("#splash").addClass("display-none");
        $("#gameCanvas").removeClass("display-none");
        gameArgs.startGame();

    }, 9000);
    $(document).keyup(function (e) {
        if (e.key == ' ') {
            $("#splash").addClass("display-none");
            $("#gameCanvas").removeClass("display-none");
            gameArgs.startGame();
        }
        else if (e.key == 'm' || e.key == 'M')
            document.location = '/games/menu?timeout=' + getParameterByName('timeout');
    });
    document.getElementById('aboutButton').onclick = function () {
        document.getElementById('about').className = 'tab tab-show';
        document.getElementById('splash').className = 'tab tab-no-show';
        aboutDemoLoop.startGameLoop();
    };

    var repGP = null;
    var checkGP1 = window.setInterval(function () {
        if (navigator.getGamepads()[0]) {

            repGP = window.setInterval(reportOnGamepad, 10);
            window.clearInterval(checkGP1);
        }
    }, 500);

    //Joystick controls
    var REPEAT_DELAY = 100;
    function reportOnGamepad() {
        var gp = navigator.getGamepads()[0];

        if (gp.buttons[0].pressed) {
            $("#splash").addClass("display-none");
            $("#gameCanvas").removeClass("display-none");
            gameArgs.startGame();
        }
    }

    document.getElementById('backButton').onclick = function () {
        document.getElementById('splash').className = 'tab tab-show';
        document.getElementById('about').className = 'tab tab-no-show';

        aboutDemoLoop.endGameLoop();
    };
});