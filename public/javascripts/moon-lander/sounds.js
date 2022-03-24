function soundFx() { }

soundFx.playFire = function () {
    var v = document.getElementById("fireSound");
    v.currentTime = 0;
    v.play();
};

soundFx.startThrust = function () {
    var v = document.getElementById("thrustSound");
    if (v.currentTime > 0 && !v.paused) {
        if (v.currentTime > .46)
            v.currentTime = 0;
        return;
    }
    v.currentTime = 0;
    v.play();
}

soundFx.endThrust = function () {
    var v = document.getElementById("thrustSound");
    v.pause();
}

soundFx.playBangLarge = function () {
    var v = document.getElementById("bangLargeSound");
    v.currentTime = 0;
    v.play();
}

soundFx.playBangMedium = function () {
    var v = document.getElementById("bangMediumSound");
    v.currentTime = 0;
    v.play();
}

soundFx.playBangSmall = function () {
    var v = document.getElementById("bangSmallSound");
    v.currentTime = 0;
    v.play();
}

soundFx.playExplode = function () {
    var v = document.getElementById("explodeSound");
    v.currentTime = 0;
    v.play();
}

soundFx.playWarning = function () {
    var v = document.getElementById("warningSound");
    v.currentTime = 0;
    v.loop = false;
    v.volume = .1;
    v.play();
}

soundFx.repeatWarning = function () {
    var v = document.getElementById("warningSound");
    v.loop = true;
    v.currentTime = 0;
    v.volume = .3;
    v.play();
};

soundFx.stopRepeatWarning = function () {
    var v = document.getElementById("warningSound");
    v.currentTime = 0;
    v.pause();
};

soundFx.playWin = function () {
    var v = document.getElementById("winSound");

    v.currentTime = 0;
    //v.volume = .2;

    setTimeout(function () {

        v.play();
    },10);
};

soundFx.startSaucerSound = function () {
    var v = document.getElementById("saucerSound");
    v.volume = .2;
    v.currentTime = 0;
    v.play();
};

soundFx.endSaucerSound = function () {
    var v = document.getElementById("saucerSound");
    v.pause();
};