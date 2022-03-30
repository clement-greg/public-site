var pilotableShip = function (ctx, game) {
    var ROTATE_AMOUNT = 3;
    var thisShip = this;
    ship.call(this, ctx);
    this.thrusting = false;
    var invicibleInterval = 0;
    var repairInterval = 0;
    var resetting = false;
    this.collisionRadius = 20;

    this.reset = function () {
        resetting = true;
        repairInterval = 0;
        invicibleInterval = 0;
        this.point = new point(gameArgs.A_SCREEN_WIDTH / 2, gameArgs.A_SCREEN_HEIGHT / 2);
        this.rotation = 180;
        this.velocity = new velocity(0, 0);
    }

    this.hardReset = function () {
        this.reset();
        resetting = false;
        repairInterval = 0;
        this.alive = true;
    }

    this.isResetting = function () {
        return resetting;
    }

    this.incrementRepairInterval = function () {
        repairInterval += 1;

        if (repairInterval >= 100) {
            resetting = false;
            repairInterval = 0;
            this.alive = true;
        }
    };

    this.isInvincible = function () {
        return invicibleInterval <= 200;
    }

    this.incrementInvincibleInterval = function () {
        invicibleInterval += 1;
    }

    this.getInvincibleInterval = function () {
        return invicibleInterval;
    }

    function thrust() {
        var dy = -(.05 * (-Math.cos(Math.PI / 180.0 * thisShip.rotation)));
        var dx = -(.05 * (Math.sin(Math.PI / 180.0 * thisShip.rotation)));

        thisShip.velocity.dx += dx;
        thisShip.velocity.dy += dy;
    }

    function fire() {
        if (!thisShip.alive)
            return;

        var newBullet = new bullet(ctx);

        var dy = -(5 * (-Math.cos(Math.PI / 180.0 * thisShip.rotation)));
        var dx = -(5 * (Math.sin(Math.PI / 180.0 * thisShip.rotation)));
        var v = new velocity(dx + thisShip.velocity.dx, dy + thisShip.velocity.dy);
        newBullet.fire(new point(thisShip.point.x, thisShip.point.y), v);

        game.bullets.push(newBullet);
        soundFx.playFire();
    }

    $.fastKey("39", function () {
        if (thisShip.alive)
            thisShip.rotation += ROTATE_AMOUNT;

    });
    $.fastKey("37", function () {
        if (thisShip.alive)
            thisShip.rotation -= ROTATE_AMOUNT;
    });
    $.fastKey("38", function () {
        if (thisShip.alive) {
            thrust();
            if (!thisShip.thrusting)
                soundFx.startThrust();
            thisShip.thrusting = true;
        }
    });

    $(document).keyup(function (event) {
        switch (event.which) {
            case 32:
            case 32:        //The space-bar
                fire();
                break;
            case 38:
                thisShip.thrusting = false;
                soundFx.endThrust();
                break;
            case 72:
                thisShip.hyperspaceJump();
                break;
        }
    });

    var checkGP = window.setInterval(function () {
        if (navigator.getGamepads()[0]) {
            repGP = window.setInterval(reportOnGamepad, 10);
            window.clearInterval(checkGP);
        }
    }, 500);

    //Joystick controls
    var REPEAT_DELAY = 100;
    prevState = { leftPushed: false, rightPushed: false, upPushed: false, downPushed: false, leftPushedDate: null, rightPushedDate: null, downPushedDate: null, upPushedDate: null };
    function reportOnGamepad() {
        var gp = navigator.getGamepads()[0];

        if (gp.axes[0] == -1) {
            if (thisShip.alive)
                thisShip.rotation -= ROTATE_AMOUNT;
        }

        if (gp.axes[0] == 1) {         //Right stick
            if (thisShip.alive)
                thisShip.rotation += ROTATE_AMOUNT;
        }

        if (gp.axes[1] == -1) {         //Up stick
            if (thisShip.alive) {
                thrust();
                if (!thisShip.thrusting)
                    soundFx.startThrust();
                thisShip.thrusting = true;
            }
        }
        else {
            thisShip.thrusting = false;
            soundFx.endThrust();
        }

        if (gp.buttons[0].pressed && (new Date() - lastFireButtonPushed) > REPEAT_DELAY) {
            fire();
            lastFireButtonPushed = new Date();
        }
        else if (!gp.buttons[0].pressed) {
            lastFireButtonPushed = new Date(2000, 1);
        }

        if (gp.buttons[1].pressed && (new Date() - lastHyperspaceButtonPushed) > 500) {
            thisShip.hyperspaceJump();
            lastHyperspaceButtonPushed = new Date();
        }
        else if (!gp.buttons[1].pressed) {
            lastHyperspaceButtonPushed = new Date(2000, 1);
        }

        if (gp.buttons[2].pressed) {
            document.location.href = '/games/menu?timeout=' + getParameterByName('timeout');
        }
    }
};

var lastHyperspaceButtonPushed = new Date();
var lastFireButtonPushed = new Date();

pilotableShip.prototype = Object.create(ship.prototype);
pilotableShip.constructor = pilotableShip;


pilotableShip.prototype.draw = function () {
    //Make it blink when it is invincible
    if (this.isInvincible() && this.getInvincibleInterval() % 10 == 0)
        return;

    ship.prototype.draw.call(this);
    if (this.thrusting) {
        this.ctx.strokeStyle = "#ff0000";
        this.drawPoints(this.flames);
        this.ctx.strokeStyle = "#ffffff";
    }
};

pilotableShip.prototype.advance = function () {
    ship.prototype.advance.call(this);
    if (this.isInvincible()) {
        this.incrementInvincibleInterval();
    }
    if (this.isResetting()) {
        this.incrementRepairInterval();
    }
}

pilotableShip.prototype.hyperspaceJump = function () {
    this.velocity = new velocity(0, 0);
    this.point.x = gameArgs.random(0, gameArgs.A_SCREEN_WIDTH);
    this.point.y = gameArgs.random(0, gameArgs.A_SCREEN_HEIGHT);
}

pilotableShip.prototype.kill = function () {
    ship.prototype.kill.call(this);
    soundFx.playExplode();
}