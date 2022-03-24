var game = function () {
    var thisGame = this;

    var bullets = [];
    var birds = [];
    var score = 0;
    var round = 1;
    var missCount = 0;
    var gameOver = true;
    var theRifle = new rifle(new point(gameArgs.A_SCREEN_WIDTH - 5, gameArgs.A_SCREEN_HEIGHT - 40));
    var gameOverInterval = 100;

    document.getElementById('bgMusic').play();
    document.getElementById('bgMusic').volume = .2;

    //Frame-rate of about 30/FPS
    setInterval(function () {
        advance();
        draw();
    }, 1000 / 30);


    function advance() {
        for (var i = 0; i < bullets.length; i++) {
            if (bullets[i].alive)
                bullets[i].advance();
            else
                bullets.removeItem(bullets[i]);
        }
        for (var i = 0; i < birds.length; i++) {
            if (birds[i].alive) {
                birds[i].advance();
                for (var j = 0; j < bullets.length; j++) {
                    if (bullets[j].alive && gameArgs.areObjectsCollided(birds[i], bullets[j])) {
                        score += birds[i].hit();
                        bullets[j].kill();

                    }
                }
                if (!gameArgs.isWithinGameBounds(birds[i])) {
                    birds[i].kill();
                    missCount += birds[i].missCount;
                    if (birds[i].missCount > 0) {
                        parent.postMessage('/quick-red-flash', '*');
                    }
                    else {
                        score += 15;
                        parent.postMessage('/quick-green-flash', '*');
                    }
                    if (missCount >= 10) {
                        gameOver = true;
                        setTimeout(function () {
                            parent.postMessage('/cycle-wave', '*');
                            document.location.href = '/Games/HighScore?game=Skeet&score=' + score;
                        }, 3000);
                    }
                }
            }
            else
                birds.removeItem(birds[i]);
        }
        if (gameOver) {
            for (var i = 0; i < birds.length; i++) {
                birds[i].kill();
            }
            gameOverInterval += 1;
        }

        if (birds.length == 0 && !gameOver) {

            if (gameArgs.random(0, 30) == 0) {
                // create a new bird
                round++;
                var numberOfBirdsToCreate = 1;
                //Create more birds on higher score
                if (score > 300)
                    numberOfBirdsToCreate = gameArgs.random(1, 5);
                else if (score > 100)
                    numberOfBirdsToCreate = gameArgs.random(1, 4);
                else if (score > 40)
                    numberOfBirdsToCreate = gameArgs.random(1, 3);
                else if (score > 20)
                    numberOfBirdsToCreate = gameArgs.random(1, 2);

                for (var i = 0; i < numberOfBirdsToCreate; i++) {
                    birds.push(createBird());
                }
            }
        }
    }

    function createBird() {
        var newBird = null;
        var birdType = gameArgs.random(0, 3);
        var pt = new point(0, 0);
        var y = gameArgs.random(0, gameArgs.A_SCREEN_HEIGHT);

        pt.y = y;
        switch (birdType) {
            case 0:
                newBird = new standardBird(pt);
                break;
            case 1:
                newBird = new toughBird(pt);
                break;
            case 2:
                newBird = new sacredBird(pt);
                break;
            default:
                break;
        }

        return newBird;
    }


    function draw() {
        var ctx = gameArgs.getContext();

        gameArgs.getContext().clearRect(0, 0, gameArgs.A_SCREEN_WIDTH, gameArgs.A_SCREEN_HEIGHT);

        ctx.font = "16px Arial";
        ctx.fillStyle = "#ffffff";
        ctx.fillText("Score: " + score, 10, 20);

        theRifle.draw();

        for (var i = 0; i < bullets.length; i++) {
            bullets[i].draw();
        }
        for (var i = 0; i < birds.length; i++) {
            birds[i].draw();
        }

        ctx.fillText("Misses: " + missCount + " of 10", gameArgs.A_SCREEN_WIDTH - 125, 20);
        if (gameOver) {
            //ctx.fillText("Game Over", gameArgs.A_SCREEN_WIDTH / 2 - 40, gameArgs.A_SCREEN_HEIGHT / 2 - 20);
            //ctx.fillText("Press the space bar to play again.", gameArgs.A_SCREEN_WIDTH / 2 - 120, gameArgs.A_SCREEN_HEIGHT / 2 + 10);
            document.getElementById("gameTitle").className = "";

        }
        else
            document.getElementById("gameTitle").className = "no-display";
    }

    function resetGame() {
        score = 0;
        missCount = 0;
        gameOver = false;
        round = 0;
        gameOverInterval = 0;
    }

    $(document).keydown(function (event) {
        switch (event.which) {
            case 32:                //Space-bar
                handleSpacebar();
                break;
            case 77:
                document.location.href = '/games/menu?timeout=' + getParameterByName('timeout');
        }
    });

    function handleSpacebar() {
        console.log('space handled');
        if (gameOver && gameOverInterval > 100) {
            resetGame();
        }
        else if (!gameOver) {
            var newBullet = new bullet();
            newBullet.fire(theRifle.getPoint(), theRifle.getAngle());

            bullets.push(newBullet);
        }
    }

    $("#gameTitle").click(function () {
        resetGame();
    });

    $.fastKey("39", function () {
        theRifle.moveLeft();

    });
    $.fastKey("37", function () {
        theRifle.moveRight();
    });

    //Joystick controls
    var checkGP = window.setInterval(function () {
        if (navigator.getGamepads()[0]) {
            repGP = window.setInterval(reportOnGamepad, 10);
            window.clearInterval(checkGP);
        }
    }, 500);
    var REPEAT_DELAY = 500;
    prevState = { leftPushed: false, rightPushed: false, upPushed: false, downPushed: false, leftPushedDate: null, rightPushedDate: null, downPushedDate: null, upPushedDate: null };

    var lastHandleTime = new Date();
    function reportOnGamepad() {
        var gp = navigator.getGamepads()[0];

        if (gp.axes[0] == 1) {          //Left stick
            theRifle.moveLeft();
        }

        if (gp.axes[0] == -1) {         //Right stick
            theRifle.moveRight();
        }

        if (gp.buttons[0].pressed && (new Date() - lastHandleTime) > 100) {
            handleSpacebar();
            lastHandleTime = new Date();
        }

        if (gp.buttons[2].pressed) {
            document.location.href = '/games/menu?timeout=' + getParameterByName('timeout');
        }
    }
};

function getParameterByName(name) {
    name = name.replace(/[\[]/, "\\\[").replace(/[\]]/, "\\\]");
    var regexS = "[\\?&]" + name + "=([^&#]*)";
    var regex = new RegExp(regexS);
    var results = regex.exec(window.location.search);
    if (results == null)
        return "";
    else
        return decodeURIComponent(results[1].replace(/\+/g, " "));
}

var startGameDate = new Date();
if (getParameterByName('timeout')) {
    setTimeout(function () {
        document.location.href = '/games/menu?timeout=' + getParameterByName('timeout')

    }, getParameterByName('timeout'));

    setInterval(function () {
        var elapsedMiliseconds = new Date() - startGameDate;

        var timeLeft = getParameterByName('timeout') - elapsedMiliseconds;

        var minutes = parseInt(timeLeft / 60000);
        if (minutes > 0)
            timeLeft = timeLeft - (minutes * 60000);
        var seconds = parseInt((timeLeft / 1000));

        if (seconds < 0)
            seconds = 0;

        var secondsString = seconds.toString();
        if (secondsString.length == 1)
            secondsString = '0' + secondsString;

        if (document.getElementById('time-counter')) {
            document.getElementById('time-counter').innerHTML = minutes + ':' + secondsString;
        }
    }, 200);
}