//This is a 'static' class
function soundFx() { }

soundFx.playFire = function () {
    var v = document.getElementById("fireSound");
    v.currentTime = 0;
    v.play();
};

soundFx.startThrust = function () {
    var v = document.getElementById("thrustSound");
    v.currentTime = 0;
    v.play();
};

soundFx.endThrust = function () {
    var v = document.getElementById("thrustSound");
    v.pause();
};

soundFx.playBangLarge = function () {
    var v = document.getElementById("bangLargeSound");
    v.currentTime = 0;
    v.play();
};

soundFx.playBangMedium = function () {
    var v = document.getElementById("bangMediumSound");
    v.currentTime = 0;
    v.play();
};

soundFx.playBangSmall = function () {
    var v = document.getElementById("bangSmallSound");
    v.currentTime = 0;
    v.play();
};

soundFx.playExplode = function () {
    var v = document.getElementById("explodeSound");
    v.currentTime = 0;
    v.play();
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

