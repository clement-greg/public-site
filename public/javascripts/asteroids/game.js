var game = function () {

    var NUM_STARTING_ASTEROIDS = 5;
    var totalLives = 4;
    var livesSpent = 0;
    var lifeIndicators = [];

    var thisGame = this;
    var c = document.getElementById("gameCanvas");
    var gameOver = false;

    c.width = gameArgs.A_SCREEN_WIDTH;
    c.height = gameArgs.A_SCREEN_HEIGHT;
    var ctx = c.getContext("2d");
    ctx.strokeStyle = "#ffffff";
    var bgNumber = 0;

    this.score = 0;

    for (var i = 0; i < totalLives; i++) {
        lifeIndicators.push(new ship(ctx));
    }

    setInterval(function () {
        ctx.clearRect(0, 0, gameArgs.A_SCREEN_WIDTH, gameArgs.A_SCREEN_HEIGHT);
        advance();
        draw();
    }, 33);

    var asteroids = [];

    this.bullets = [];
    this.alienBullets = [];

    function resetGame() {
        initializeAsteroids();
        myShip.hardReset();
        gameOver = false;
        saucer.gameStopped = false;
        livesSpent = 0;
        $("#gameCanvas").addClass("space1");
        bgNumber = 1;
    }

    function clearGameClasses() {
        for (var i = 1; i <= 6; i++) {
            $("#gameCanvas").removeClass("space" + i);
        }
    }

    function initializeAsteroids() {
        asteroids = [];
        for (var i = 0; i < NUM_STARTING_ASTEROIDS; i++) {
            asteroids.push(new largeAsteroid(ctx));
        }
    }

    var myShip = new pilotableShip(ctx, this);

    function resetPlay() {
        if (livesSpent < totalLives) {
            myShip.reset();
        }
        else {
            gameOver = true;
            saucer.gameStopped = true;

            setTimeout(function () {
                document.location.href = '/Games/HighScore?game=Asteriods&score=' + thisGame.score;
                parent.postMessage('/cycle-wave', '*');
            }, 3000);

        }
    }

    function advance() {
        myShip.advance();
        for (var i = 0; i < asteroids.length; i++) {
            var asteroid = asteroids[i];
            asteroid.advance();
            if (myShip.alive && !myShip.isInvincible() && gameArgs.areObjectsCollided(asteroid, myShip)) {
                livesSpent += 1;
                myShip.kill();
                asteroid.kill();
                parent.postMessage('/quick-red-flash', '*');
                asteroids.removeItem(asteroid);
                asteroid.breakInPieces(asteroids);
                resetPlay();
            }
            if (saucer.alive && asteroid.alive && gameArgs.areObjectsCollided(asteroid, saucer)) {
                saucer.kill();
                asteroid.kill();
                asteroids.removeItem(asteroid);
                asteroid.breakInPieces(asteroids);
            }
        }
        for (var i = 0; i < thisGame.bullets.length; i++) {
            var bullet = thisGame.bullets[i];
            if (bullet.alive) {
                bullet.advance();
                for (var j = 0; j < asteroids.length; j++) {
                    var asteroid = asteroids[j];
                    if (gameArgs.areObjectsCollided(asteroid, bullet)) {
                        bullet.kill();
                        asteroid.kill();
                        asteroids.removeItem(asteroid);
                        asteroid.breakInPieces(asteroids);
                        thisGame.score += asteroid.destroyPoints;
                        break;
                    }
                }
                if (saucer.alive && gameArgs.areObjectsCollided(saucer, bullet) && bullet.alive) {
                    saucer.kill();
                    bullet.kill();
                    thisGame.score += saucer.destroyPoints;
                }
            }
            else {
                thisGame.bullets.removeItem(thisGame.bullets[i]);
            }
        }

        for (var i = 0; i < thisGame.alienBullets.length; i++) {
            var bullet = thisGame.alienBullets[i];
            if (bullet.alive) {
                bullet.advance();
                for (var j = 0; j < asteroids.length; j++) {
                    var asteroid = asteroids[j];
                    if (gameArgs.areObjectsCollided(asteroid, bullet)) {
                        bullet.kill();
                        asteroid.kill();
                        asteroids.removeItem(asteroid);
                        asteroid.breakInPieces(asteroids);
                        break;
                    }
                }
                if (bullet.alive && myShip.alive && !myShip.isInvincible() && gameArgs.areObjectsCollided(bullet, myShip)) {
                    bullet.kill();

                    myShip.kill();
                    livesSpent += 1;
                    resetPlay();

                }
            }
            else {
                thisGame.alienBullets.removeItem(bullet);
            }
        }
        if (myShip.alive && !myShip.isInvincible() && saucer.alive && gameArgs.areObjectsCollided(myShip, saucer)) {
            livesSpent += 1;
            myShip.kill();
            resetPlay();
            saucer.kill();
        }
        if (asteroids.length == 0) {
            //Level Completed
            initializeAsteroids();
            myShip.hardReset();
            clearGameClasses();
            parent.postMessage('/quick-green-flash', '*');
            bgNumber++;
            if (bgNumber > 6)
                bgNumber = 1;
            $("#gameCanvas").addClass("space" + bgNumber);
        }

        saucer.advance();


    }

    $(document).keyup(function (event) {
        switch (event.which) {
            case 32:        //The space-bar
                if (gameOver) {
                    resetGame();
                }
                break;
        }
    });

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
            if (gameOver) {
                resetGame();
            }
        }
    }

    var saucer = new alienSaucer(ctx, this.alienBullets);
    function draw() {
        ctx.font = "16px Arial";
        myShip.draw();
        for (var i = 0; i < asteroids.length; i++) {
            asteroids[i].draw();
        }
        for (var i = 0; i < thisGame.bullets.length; i++) {
            thisGame.bullets[i].draw();
        }
        for (var i = 0; i < thisGame.alienBullets.length; i++) {
            thisGame.alienBullets[i].draw();
        }
        ctx.fillStyle = "#ffffff";
        ctx.fillText("Score: " + thisGame.score, gameArgs.A_SCREEN_WIDTH - 120, 15);
        for (var i = 0; i < lifeIndicators.length; i++) {
            lifeIndicators[i].point = new point(10 + i * 20, 10);
            lifeIndicators[i].draw();
        }
        for (var i = 0; i < livesSpent; i++) {
            gameArgs.drawCrossCircle(ctx, new point(10 + i * 20, 10), 8);
        }

        if (myShip.isResetting()) {
            ctx.fillStyle = "#ffffff";
            ctx.fillText("Repairing Ship", gameArgs.A_SCREEN_WIDTH / 2 - 20, gameArgs.A_SCREEN_HEIGHT / 2);
        }
        if (gameOver) {
            ctx.font = "32px Arial";
            ctx.fillText("Game Over!!!", gameArgs.A_SCREEN_WIDTH / 2 - 60, gameArgs.A_SCREEN_HEIGHT / 2);
            ctx.font = "16px Arial";
            ctx.fillText("Press the space-bar to play again.", gameArgs.A_SCREEN_WIDTH / 2 - 90, gameArgs.A_SCREEN_HEIGHT / 2 + 30);
        }

        saucer.draw();
    }
}


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
        document.location.href = '/Games/GameMenu?timeout=' + getParameterByName('timeout')

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