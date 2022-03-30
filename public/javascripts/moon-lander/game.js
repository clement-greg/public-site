var game = function () {
    var thisGame = this;
    var gravityAmount = .01;
    var playingGame = false;

    var moonLander = new lander();
    var theGround = new ground();
    var message = "Press the space-bar to start";
    var winCount = 0;
    var lostCount = 0;

    var ctx = gameArgs.getContext();
    ctx.strokeStyle = "#ffffff";
    document.getElementById('bgMusic').volume = .2;
    document.getElementById('bgMusic').play();

    //Frame-rate of about 30/FPS
    setInterval(function () {
        advance();
        draw();
    }, 1000 / 30);

    var firstRound = true;
    function resetGame() {
        playingGame = true;
        message = "";
        moonLander.reset();
        if (!firstRound)
            theGround.generateGround();
        firstRound = false;
        resetResult();
        setGravity();
    }

    $(document).keydown(function (event) {
        switch (event.which) {
            case 39:        //Right key
                doRightThrust();
                break;
            case 37:        //Left Key
                doLeftThrust();
                break;

            case 40:        //Up or down. I don't judge
            case 38:
                doUpThrust();
                break;
            case 77:
                document.location.href = '/games/menu?timeout=' + getParameterByName('timeout');
        }
    });

    function doRightThrust() {
        if (playingGame)
            moonLander.applyThrustRight();
    }

    function doLeftThrust() {
        if (playingGame)
            moonLander.applyThrustLeft();
    }

    function doUpThrust() {
        if (moonLander.point.y <= 10) {
            moonLander.velocity.dy = 0;
            return;
        }

        if (playingGame)
            moonLander.applyThrustBottom();
    }



    $(document).keyup(function (event) {
        switch (event.which) {
            case 32:        //The space-bar
                if (!playingGame) {
                    resetGame();
                }
                break;
        }
    });

    var checkGP = window.setInterval(function () {
        if (navigator.getGamepads()[0]) {
            repGP = window.setInterval(reportOnGamepad, 100);
            window.clearInterval(checkGP);
        }
    }, 500);

    //Joystick controls
    var REPEAT_DELAY = 500;
    prevState = { leftPushed: false, rightPushed: false, upPushed: false, downPushed: false, leftPushedDate: null, rightPushedDate: null, downPushedDate: null, upPushedDate: null };
    function reportOnGamepad() {
        var gp = navigator.getGamepads()[0];

        if (gp.axes[0] == -1) {          //Left stick
            if (!prevState.leftPushed || (new Date() - prevState.leftPushedDate) > REPEAT_DELAY) {
                doLeftThrust();
                if (!prevState.leftPushed)
                    prevState.leftPushedDate = new Date();
                prevState.leftPushed = true;
            }
        }
        else
            prevState.leftPushed = false;

        if (gp.axes[0] == 1) {         //Right stick
            if (!prevState.rightPushed || (new Date() - prevState.rightPushedDate) > REPEAT_DELAY) {
                doRightThrust();
                if (!prevState.rightPushed)
                    prevState.rightPushedDate = new Date();
                prevState.rightPushed = true;
            }
        }
        else
            prevState.rightPushed = false;

        if (gp.axes[1] == -1) {         //Down stick
            if (!prevState.downPushed || (new Date() - prevState.downPushedDate) > REPEAT_DELAY) {
                doUpThrust();
                if (!prevState.downPushed)
                    prevState.downPushedDate = new Date();
                prevState.downPushed = true;
            }
        }
        else
            prevState.downPushed = false;

        if (gp.axes[1] == 1) {         //Up stick
            if (!prevState.upPushed || (new Date() - prevState.upPushedDate) > REPEAT_DELAY) {
                doUpThrust();
                if (!prevState.upPushed)
                    prevState.upPushedDate = new Date();
                prevState.upPushed = true;
            }
        }
        else
            prevState.upPushed = false;

        if (gp.buttons[0].pressed) {
            if (!playingGame) {
                resetGame();
            }
        }

        if (gp.buttons[2].pressed) {
            document.location.href = '/games/menu?timeout=' + getParameterByName('timeout');
        }
    }

    function setGravity() {
        const gravityCircle = document.getElementById('innerCircleId');
        const radius = 50;
        const minGravity = .01;
        const maxGravity = .1;

        const percent = ((gravityAmount) / maxGravity) * 100;
        const dashArray = 2 * Math.PI * radius;
        const archCircumferenceBound = dashArray - (dashArray * (percent / 100));

        gravityCircle.style.strokeDasharray = dashArray;
        gravityCircle.style.strokeDashoffset = archCircumferenceBound;
    
    }

    setGravity();

    var gageNeedle;
    function setSpeedGage() {
        // -90deg to 90deg
        // 0 - 5 dy speed
        const maxSpeed = 3;
        let speedY = moonLander.velocity.dy;
        if(speedY > maxSpeed) {
            speedY = maxSpeed;
        } else if(speedY < 0) {
            speedY = 0;
        }

        let pct = (((speedY / maxSpeed) * 100) * 1.8) - 90;
        
        if(!gageNeedle) {
            gageNeedle = document.getElementById('gage-needle');
        }

        gageNeedle.style.transform = `rotate(${pct}deg)`;

    }

    function advance() {
        if (moonLander.alive && !moonLander.isLanded && playingGame) {
            moonLander.applyGravity(gravityAmount);
            moonLander.advance();
            //document.getElementById('velocity').innerText = moonLander.velocity.dy;

            if (!theGround.isAboveGround(moonLander.point)) {
                playingGame = false;
                message = "Sorry, you lose, Press the space-bar to play again.";
                showGameResult(false);
                moonLander.kill();
                lostCount++;
                updateScore();
                soundFx.playBangLarge();
                soundFx.stopRepeatWarning();
                parent.postMessage('/quick-red-flash', '*');
                if (lostCount == 5) {

                    setTimeout(function () {
                        parent.postMessage('/cycle-wave', '*');
                        document.location.href = '/games/menu';
                    }, 3000);
                }
            }

            if (justLanded()) {
                playingGame = false;
                message = "You Win, Press the space-bar to play again.";
                moonLander.isLanded = true;
                showGameResult(true);
                gravityAmount += .005;
                score += Math.round(1000 + gravityAmount * 10000 + moonLander.fuel);
                winCount++;
                updateScore();
                soundFx.playWin();
                soundFx.stopRepeatWarning();
                parent.postMessage('/quick-green-flash', '*');
            }
        }
        setSpeedGage();
    }

    function showGameResult(won) {
        const result = document.getElementById('round-result');
        result.style.display = 'initial';
        if(won) {
            result.classList.add('won');
        } else {
            result.classList.add('lost');
        }

    }

    function resetResult() {

        const result = document.getElementById('round-result');
        result.style.display = 'none';
        result.classList.remove('won');
        result.classList.remove('lost');
    }

    var score = 0;
    function updateScore() {
        document.getElementById('wins').innerText = winCount;
        document.getElementById('lost').innerText = lostCount;
        document.getElementById('score').innerHTML = score.toLocaleString("en-US");

    }

    updateScore();

    var fuelReserve = document.getElementById('fuel-reserve');

    function draw() {
        if(!fuelReserve) {
            fuelReserve = document.getElementById('fuel-reserve');
        }
        ctx.clearRect(0, 0, gameArgs.A_SCREEN_WIDTH, gameArgs.A_SCREEN_HEIGHT);
        theGround.draw();

        ctx.font = "16px Arial";
        moonLander.draw();

        ctx.fillStyle = "#ffffff";
        // ctx.fillText("Fuel: " + moonLander.fuel, 20, 20);

        const pct = (moonLander.fuel / 500) * 100;
        if(pct > 50) {
            fuelReserve.style.background = 'linear-gradient(360deg, rgba(3,121,3,1) 0%, rgba(0,73,31,1) 100%)';

        } else if(pct > 20) {
            fuelReserve.style.background = 'linear-gradient(360deg, rgba(227,177,49,1) 0%, rgba(205,143,16,1) 100%)';

        } else {
            fuelReserve.style.background = 'linear-gradient(360deg, rgba(247,61,61,1) 0%, rgba(162,5,5,1) 100%)';
        }
        fuelReserve.style.width = pct + '%';

        // ctx.fillText("Wins: " + winCount + " Loses: " + lostCount + " Score: " + score, gameArgs.A_SCREEN_WIDTH - 250, 20);
        // if (message)
        //     ctx.fillText(message, gameArgs.A_SCREEN_WIDTH / 2 - (message.length / 2 * 6), gameArgs.A_SCREEN_HEIGHT / 2 - 70);
    }

    function justLanded() {
        var landed = false;

        var platformCenter = theGround.getPlatformPosition();
        var width = theGround.getPlatformWidth();

        var xDiff = moonLander.point.x - platformCenter.x;
        var yDiff = moonLander.point.y - platformCenter.y;

        var margin = width / 2.0;

        if (Math.abs(xDiff) < margin) {
            if (yDiff < 4 && yDiff >= 0) {
                if (Math.abs(moonLander.velocity.dx) < 3 && Math.abs(moonLander.velocity.dy) < 3) {
                    landed = true;
                }
            }
        }

        return landed;
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