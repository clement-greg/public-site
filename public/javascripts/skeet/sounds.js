function soundFx() { }

soundFx.playFire = function () {
    var v = document.getElementById("fireSound");
    v.currentTime = 0;
    v.play();
};

soundFx.playGun = function () {
    var v = document.getElementById("shootGunSound");
    v.volume = .2;
    v.currentTime = 0;
    v.play();
}

soundFx.playHit = function () {
    var v = document.getElementById("hitSound");

    v.currentTime = 0;
    v.play();
}

soundFx.playBeep = function () {
    var v = document.getElementById("beepSound");

    v.currentTime = 0;
    v.play();
}