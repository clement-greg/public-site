angular.module("App", [])
    .controller("BaseCtrl", ["$scope", function ($scope) {
        $scope.message = 'worksss';

        $scope.selectedIndex = 1;

        $scope.next = function () {
            if ($scope.selectedIndex <= 3)
                $scope.selectedIndex++;
            //else
            //    $scope.selectedIndex = 0;
        }

        $scope.prev = function () {
            if ($scope.selectedIndex > 0)
                $scope.selectedIndex--;
            //else
            //    $scope.selectedIndex = 2;
        }

        function playBeep() {
            var v = document.getElementById("beepSound");
            v.currentTime = 0;
            v.play();
        }

        function playBeat() {
            var v = document.getElementById("beatSound");
            v.currentTime = 0;
            v.play();
        }

        $scope.handleKeys = function (event) {
            if (event.which == 37) {
                $scope.prev();
                playBeep();
            }
            else if (event.which == 39) {
                $scope.next();
                playBeep();
            }
            else if (event.key == ' ') {
                doNav();
            }
        }

        $scope.testFlash = function () {
            parent.postMessage('/flash', '*');
        }

        $scope.testGreenFlash = function () {
            parent.postMessage('/quick-green-flash', '*');
        }

        $scope.testRedFlash = function () {
            parent.postMessage('/quick-red-flash', '*');
        }

        window.addEventListener('beforeunload', function () {
            parent.postMessage('/turn-off', '*');
        });

        var flashAnnimations = [
            '/flash',
            //'/quick-green-flash',
            //'/quick-red-flash',
            //'/slow-green-flash',
            //'/slow-red-flash',
            '/slow-flash',
            '/cycle-forward',
            '/cycle-backward',
            '/cycle-wave',
        ];

        var flashAnnimationIndex = 0;

        function doFlashAnnimation() {
            var annimationIndex = Math.floor(Math.random() * flashAnnimations.length);
            parent.postMessage(flashAnnimations[annimationIndex], '*');
            flashAnnimationIndex++;
            if (flashAnnimationIndex === flashAnnimations.length) {
                flashAnnimationIndex = 0;
            }
        }
        setInterval(function () {
            doFlashAnnimation();
        }, 6000);

        doFlashAnnimation();

        function doNav() {
            var url = '';
            if ($scope.selectedIndex == 0)
                url = '/games/skeet?auto-start=true&timeout=' + getParameterByName('timeout');
            else if ($scope.selectedIndex == 1)
                url = '/games/asteroids?auto-start=true&timeout=' + getParameterByName('timeout');
            else if ($scope.selectedIndex == 2)
                url = '/games/moon-landing?timeout=' + getParameterByName('timeout');
            else if ($scope.selectedIndex == 3)
                url = '/games/pac-man?timeout=' + getParameterByName('timeout');
            else if ($scope.selectedIndex == 4)
                url = '/games/tic-tac-toe?timeout=' + getParameterByName('timeout');
            playBeat();
            document.location.href = url;
        }

        var hammertime = new Hammer(document.getElementById('body'));

        hammertime.on('swipeleft', function (evt) {
            $scope.$apply(function () {
                $scope.next();
                playBeep();
            });
        });
        hammertime.on('swiperight', function (evt) {
            $scope.$apply(function () {
                $scope.prev();
                playBeep();
            });
        });


        hammertime.on('tap', function (evt) {
            // doNav();
        });

        //var hasGP = false;
        //var repGP;
        
        //window.addEventListener("gamepadconnected", function (e) {
        //    console.log("Gamepad connected at index %d: %s. %d buttons, %d axes.",
        //        e.gamepad.index, e.gamepad.id,
        //        e.gamepad.buttons.length, e.gamepad.axes.length);
        //});

        //setup an interval for Chrome
        var checkGP = window.setInterval(function () {
            if (navigator.getGamepads()[0]) {
                repGP = window.setInterval(reportOnGamepad, 100);
                window.clearInterval(checkGP);
            }
        }, 500);

        var REPEAT_DELAY = 500;
        prevState = { leftPushed: false, rightPushed: false, upPushed: false, downPushed: false, leftPushedDate: null, rightPushedDate: null, downPushedDate: null, upPushedDate: null };
        function reportOnGamepad() {
            var gp = navigator.getGamepads()[0];

            if (gp.axes[0] == -1) {          //Left stick
                if (!prevState.leftPushed || (new Date() - prevState.leftPushedDate) > REPEAT_DELAY) {
                    $scope.$apply(function () {
                        $scope.prev();
                        playBeep();
                    });
                    if (!prevState.leftPushed)
                        prevState.leftPushedDate = new Date();
                    prevState.leftPushed = true;
                }
            }
            else
                prevState.leftPushed = false;

            if (gp.axes[0] == 1) {         //Right stick
                if (!prevState.rightPushed || (new Date() - prevState.rightPushedDate) > REPEAT_DELAY) {
                    $scope.$apply(function () {
                        $scope.next();
                        playBeep();
                    });
                    if (!prevState.rightPushed)
                        prevState.rightPushedDate = new Date();
                    prevState.rightPushed = true;
                }
            }
            else
                prevState.rightPushed = false;


            if (gp.buttons[0].pressed) {
                var url = '';
                if ($scope.selectedIndex == 0)
                    url = '/Games/Skeet?auto-start=true&timeout=' + getParameterByName('timeout');
                else if ($scope.selectedIndex == 1)
                    url = '/Games/Asteroids?auto-start=true&timeout=' + getParameterByName('timeout');
                else if ($scope.selectedIndex == 2)
                    url = '/Games/MoonLanding?timeout=' + getParameterByName('timeout');
                else if ($scope.selectedIndex == 3)
                    url = '/Games/PacMan?timeout=' + getParameterByName('timeout');
                else if ($scope.selectedIndex == 4)
                    url = '/Games/TicTacToe?timeout=' + getParameterByName('timeout');
                playBeat();
                setTimeout(function () { document.location.href = url; }, 500);

            }
        }

        document.getElementById('bg-music').volume = .2;

    }]);

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