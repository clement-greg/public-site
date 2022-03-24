var cell = function (vm) {
    var self = this;

    self.letter = ko.observable();

    self.container = vm;
    self.imageUrl = ko.computed(function () {
        if (!self.letter()) {
            return "/images/tic-tac-toe/blank.gif";

        }
        if (self.letter() == "X")
            return "/images/tic-tac-toe/X.png";
        if (self.letter() == "O")
            return "/images/tic-tac-toe/O.png";
    });

    self.imageVisible = ko.computed(function () {
        return self.letter();
    });

    self.select = function () {
        if (self.letter()) {

            //TODO: play an error sound or show a message

            return;
        }
        self.letter(self.container.playersCurrentTurn());
        if (self.container.playersCurrentTurn() == "X") {
            if (self.container.playSounds())
                self.container.beep1.play();
        }
        else {
            if (self.container.playSounds())
                self.container.beep2.play();
        }
        self.container.inspectBoardForWinner();
    };

    self.tdClass = ko.observable("not-highlighted");
};


var vm = function () {
    var self = this;

    self.beep1 = new Audio('/sounds/beep1.mp3');
    self.beep2 = new Audio("/sounds/beep2.mp3");
    self.winSound = new Audio("/sounds/win.mp3");
    self.loseSound = new Audio("/sounds/lose.mp3");
    self.playSounds = ko.observable(true);

    self.xWinCount = ko.observable(0);
    self.yWinCount = ko.observable(0);
    self.catsGamesCount = ko.observable(0);
    self.computerPlays = ko.observable(true);
    self.settingsVisible = ko.observable(false);
    self.difficulty = ko.observable(0);
    self.tieVisible = ko.observable(false);
    self.winVisible = ko.observable(false);

    self.thinkingMessages = ["Don't Rush Me.  I'm thinking...", "I'm planing my move to beat you.", "Ha! I've got the perfect move", "Why did you go there, now I'm totally going to win", "I'm gonna beat you!", "I am the tic-tac-toe master", "You can't win"];

    self.thinkingMessage = ko.observable();


    self.difficultyText = ko.computed(function () {
        var dif = self.difficulty();
        if (dif == 4)
            return "Unbeatable";
        if (dif == 3)
            return "Tough";
        if (dif == 2)
            return "Medium";
        if (dif == 1)
            return "Easy";
    });


    self.gameOver = ko.observable(false);
    self.reportWin = function (value) {
        if (value == "X")
            self.xWinCount(self.xWinCount() + 1);
        else
            self.yWinCount(self.yWinCount() + 1);

        self.winVisible(true);
        if (self.playSounds())
            self.winSound.play();

        self.gameOver(true);
    }

    self.showSettings = function () {
        self.settingsVisible(true);
    };

    self.playersCurrentTurn = ko.observable("X");
    self.showThinking = ko.observable(true);

    self.playersCurrentTurn.subscribe(function (newValue) {
        if (newValue == "O" && self.computerPlays()) {
            if (self.showThinking()) {

                var messageIndex = parseInt(Math.random() * self.thinkingMessages.length);

                self.thinkingMessage(self.thinkingMessages[messageIndex]);
                self.thinking(true);
                setTimeout(function () {
                    self.computersMove();
                }, 2000);
            }
            else
                self.computersMove();
        }
    });

    self.thinking = ko.observable(false);

    $(document).keydown(function (event) {
        switch (event.which) {
            case 39:        //Right key
                self.moveRight();
                break;
            case 37:        //Left Key
                self.moveLeft();
                break;

            case 38:        //Up Key
                self.moveUp();
                break;
            case 40:        //Down key
                self.moveDown();
                break;
            case 32:
                self.selectHighlightedCell();
                if (self.gameOver())
                    try {
                        $(".ui-dialog-content").dialog("close");
                    } catch (e) { }
                break;
            case 72:
                self.cycleDifficulty();
                break;
            case 77:
                document.location.href = '/Games/GameMenu?timeout=' + getParameterByName('timeout');
        }
    });
    //setup an interval for Chrome
    var checkGP = window.setInterval(function () {
        if (navigator.getGamepads()[0]) {
            repGP = window.setInterval(reportOnGamepad, 100);
            window.clearInterval(checkGP);
        }
    }, 500);

    //Joystick controls
    var REPEAT_DELAY = 250;
    prevState = { leftPushed: false, rightPushed: false, upPushed: false, downPushed: false, leftPushedDate: null, rightPushedDate: null, downPushedDate: null, upPushedDate: null, primaryDown: false, secondaryDown: false };
    function reportOnGamepad() {
        var gp = navigator.getGamepads()[0];

        if ((new Date() - prevState.leftPushedDate) < REPEAT_DELAY)
            return;

        if (gp.axes[0] == -1) {          //Left stick
            if (!prevState.leftPushed || (new Date() - prevState.leftPushedDate) > REPEAT_DELAY) {
                self.moveLeft();
                if (!prevState.leftPushed)
                    prevState.leftPushedDate = new Date();
                prevState.leftPushed = true;
            }
            else
                prevState.leftPushed = false;
        }
        else
            prevState.leftPushed = false;

        if (gp.axes[0] == 1) {         //Right stick
            if (!prevState.rightPushed || (new Date() - prevState.rightPushedDate) > REPEAT_DELAY) {
                self.moveRight();
                if (!prevState.rightPushed)
                    prevState.rightPushedDate = new Date();
                prevState.rightPushed = true;
            }
        }
        else
            prevState.rightPushed = false;

        if (gp.axes[1] == -1) {         //Up stick
            if (!prevState.downPushed || (new Date() - prevState.downPushedDate) > REPEAT_DELAY) {
                self.moveUp();
                if (!prevState.downPushed)
                    prevState.downPushedDate = new Date();
                prevState.downPushed = true;
            }
        }
        else
            prevState.downPushed = false;

        if (gp.axes[1] == 1) {         //Down stick
            if (!prevState.upPushed || (new Date() - prevState.upPushedDate) > REPEAT_DELAY) {
                self.moveDown();
                if (!prevState.upPushed)
                    prevState.upPushedDate = new Date();
                prevState.upPushed = true;
            }
        }
        else
            prevState.upPushed = false;

        if (gp.buttons[0] && gp.buttons[0].pressed && !prevState.primaryDown) {
            prevState.primaryDown = true;
            if (self.gameOver())
                try {
                    $(".ui-dialog-content").dialog("close");
                } catch (e) { }
            else {
                self.selectHighlightedCell();
            }
        }
        if (gp.buttons[0] && !gp.buttons[0].pressed)
            prevState.primaryDown = false;
        if (gp.buttons[1] && gp.buttons[1].pressed && !prevState.secondaryDown) {
            prevState.secondaryDown = true;
            self.cycleDifficulty();
        }
        if (gp.buttons[1] && !gp.buttons[1].pressed) {
            prevState.secondaryDown = false;
        }
        if (gp.buttons[2] && gp.buttons[2].pressed) {
            document.location.href = '/Games/GameMenu?timeout=' + getParameterByName('timeout');
        }
    }

    self.highlightedRow = ko.observable(0);
    self.highlightedColumn = ko.observable(0);

    function clearSelectionClasses() {
        for (var i = 0; i < self.rows().length; i++) {
            for (var j = 0; j < self.rows()[i].columns().length; j++) {
                self.rows()[i].columns()[j].tdClass('not-highlighted');
            }
        }
    }


    self.showDifficulty = ko.observable(false);

    var cycleTimeout = null;
    self.cycleDifficulty = function () {
        if (!self.showDifficulty()) {

            self.showDifficulty(true);
            cycleTimeout = setTimeout(function () {
                self.showDifficulty(false);
            }, 2000);
            return;
        }

        if (!self.computerPlays()) {
            self.computerPlays(true);
            self.difficulty(1);
        }
        else {
            self.difficulty(self.difficulty() + 1);
            if (self.difficulty() > 4) {
                self.computerPlays(false);
            }
        }

        self.showDifficulty(true);
        clearTimeout(cycleTimeout);
        cycleTimeout = setTimeout(function () {
            self.showDifficulty(false);
        }, 2000);
    }

    function setHighlighedCell() {
        self.rows()[self.highlightedRow()].columns()[self.highlightedColumn()].tdClass('selected');
    }


    self.selectHighlightedCell = function () {
        self.rows()[self.highlightedRow()].columns()[self.highlightedColumn()].select();
    }

    self.moveRight = function () {
        clearSelectionClasses();
        if (self.highlightedColumn() == 2) {
            self.highlightedColumn(0);
            self.moveDown();

            return;
        }
        self.highlightedColumn(self.highlightedColumn() + 1);
        if (self.rows()[self.highlightedRow()].columns()[self.highlightedColumn()].letter()) {
            self.moveRight();
        }
        else
            setHighlighedCell();
    };

    self.moveLeft = function () {
        clearSelectionClasses();
        if (self.highlightedColumn() == 0) {
            self.highlightedColumn(2);
            self.moveUp();

            return;
        }
        self.highlightedColumn(self.highlightedColumn() - 1);
        if (self.rows()[self.highlightedRow()].columns()[self.highlightedColumn()].letter()) {
            self.moveLeft();
        }
        else
            setHighlighedCell();
    };

    self.moveUp = function () {
        clearSelectionClasses();
        if (self.highlightedRow() == 0) {
            self.highlightedRow(2);
        }
        else
            self.highlightedRow(self.highlightedRow() - 1);
        if (self.rows()[self.highlightedRow()].columns()[self.highlightedColumn()].letter()) {
            self.moveLeft();
        }
        else
            setHighlighedCell();
    }

    self.moveDown = function () {
        clearSelectionClasses();
        if (self.highlightedRow() == 2) {
            self.highlightedRow(0);

        }
        else
            self.highlightedRow(self.highlightedRow() + 1);
        if (self.rows()[self.highlightedRow()].columns()[self.highlightedColumn()].letter()) {
            self.moveRight();
        }
        else
            setHighlighedCell();
    }

    self.computersMove = function () {
        self.thinking(false);
        if (self.difficulty() >= 3) {
            //Make any winning offensive moves
            var oCells = Enumerable.From(self.rows())
                .SelectMany(function (row) { return row.columns() })
                .Where(function (item) { return item.letter() == "O"; }).ToArray();
            for (var i = 0; i < oCells.length; i++) {
                var cellIndex = self.getCellIndex(oCells[i]);
                var adjoiningCells = self.getPossibleWinSequence(cellIndex, "O");

                if (adjoiningCells.length > 0) {

                    var blankCell = Enumerable.From(adjoiningCells[0])
                        .Where(function (item) { return !item.cell.letter() }).FirstOrDefault();

                    blankCell.cell.select();
                    return;
                }
            }
        }




        if (self.difficulty() >= 2) {
            //Make any necessary defensive move
            var xCells = Enumerable.From(self.rows())
                .SelectMany(function (row) { return row.columns() })
                .Where(function (item) { return item.letter() == "X"; }).ToArray();
            for (var i = 0; i < xCells.length; i++) {
                var cellIndex = self.getCellIndex(xCells[i]);
                var adjoiningCells = self.getPossibleWinSequence(cellIndex, "X");

                if (adjoiningCells.length > 0) {

                    blankCell = Enumerable.From(adjoiningCells[0])
                        .Where(function (item) { return !item.cell.letter() }).FirstOrDefault();

                    blankCell.cell.select();
                    return;
                }
            }
        }


        if (self.difficulty() >= 4 || (self.difficulty() >= 3 && Math.random() * 2 > 1)) {
            //Check to see if the middle is available and pay it
            var middleCell = Enumerable.From(self.getCellAndIndex())
                .Where(function (item) { return item.column == 1 && item.row == 1 && !item.cell.letter() })
                .FirstOrDefault();

            if (middleCell) {
                middleCell.cell.select();
                return;
            }

            //This will keep Jacob from winning
            var playCount = Enumerable.From(self.getCellAndIndex())
                .Where(function (item) { return item.cell.letter(); })
                .Count();

            if (playCount == 3) {
                if ((self.rows()[0].columns()[0].letter() == "X" && self.rows()[2].columns()[2].letter() == "X")
                    || (self.rows()[0].columns()[2].letter() == "X" && self.rows()[2].columns()[0].letter() == "X")) {
                    var sideCell = Enumerable.From(self.getCellAndIndex())
                        .Where(function (item) {
                            return !item.cell.letter()
                                && ((item.row == 1 && item.column != 1) || (item.column == 1 && item.row != 1))
                        })
                        .OrderBy(function (item) { return Math.random(); })
                        .First();
                    sideCell.cell.select();
                    return;
                }
            }

            //Find a corner to play
            var cornerCell = Enumerable.From(self.getCellAndIndex())
                .Where(function (item) { return item.column != 1 && item.row != 1 && !item.cell.letter() })
                .OrderBy(function (item) { return Math.random(); })
                .FirstOrDefault();
            if (cornerCell) {
                cornerCell.cell.select();
                return;
            }
        }

        //Randomly select a spot to play
        var randomCell = Enumerable.From(self.getCellAndIndex())
            .Where(function (item) { return !item.cell.letter() })
            .OrderBy(function (item) { return Math.random(); })
            .FirstOrDefault();

        if (randomCell) {
            randomCell.cell.select();
            return;
        }
    };

    self.getCellAndIndex = function () {
        var results = [];
        for (var i = 0; i < self.rows().length; i++) {
            for (var j = 0; j < self.rows()[i].columns().length; j++) {
                results.push({ row: i, column: j, cell: self.rows()[i].columns()[j] });
            }
        }

        return results;
    };

    self.getPossibleWinSequence = function (cellIndex, letterToCheck) {
        var adjoiningCells = [];
        var allCells = self.getCellAndIndex();

        var adjoiningHorizontal = Enumerable.From(allCells)
            .Where(function (i) { return i.row == cellIndex.row && i.column != cellIndex.column; });

        if (adjoiningHorizontal.Where(function (i) { return i.cell.letter() == letterToCheck; }).Count() > 0
            && adjoiningHorizontal.Where(function (i) { return !i.cell.letter(); }).Count() > 0)
            adjoiningCells.push(adjoiningHorizontal.ToArray());


        var adjoiningVertical = Enumerable.From(allCells)
            .Where(function (i) { return i.column == cellIndex.column && i.row != cellIndex.row; });

        if (adjoiningVertical.Where(function (i) { return i.cell.letter() == letterToCheck; }).Count() > 0
            && adjoiningVertical.Where(function (i) { return !i.cell.letter(); }).Count() > 0)
            adjoiningCells.push(adjoiningVertical.ToArray());

        var diagonal1 = Enumerable.From(allCells)
            .Where(function (i) { return (i.row == 0 && i.column == 0) || (i.row == 1 && i.column == 1) || (i.row == 2 && i.column == 2) });
        if (diagonal1.Where(function (i) { return i.cell.letter() == letterToCheck; }).Count() > 1
            && diagonal1.Where(function (i) { return !i.cell.letter(); }).Count() > 0)
            adjoiningCells.push(diagonal1.ToArray());


        var diagonal2 = Enumerable.From(allCells)
            .Where(function (i) { return (i.row == 2 && i.column == 0) || (i.row == 1 && i.column == 1) || (i.row == 0 && i.column == 2) });
        if (diagonal2.Where(function (i) { return i.cell.letter() == letterToCheck; }).Count() > 1
            && diagonal2.Where(function (i) { return !i.cell.letter(); }).Count() > 0)
            adjoiningCells.push(diagonal2.ToArray());

        return adjoiningCells;
    }

    self.getCellIndex = function (cell) {
        for (var i = 0; i < self.rows().length; i++) {
            for (var j = 0; j < self.rows()[i].columns().length; j++) {
                if (self.rows()[i].columns()[j] == cell)
                    return { row: i, column: j };
            }
        }
    }



    self.inspectBoardForWinner = function () {
        for (var i = 0; i < 3; i++) {
            var result = self.checkDown(i);
            if (result) {
                self.reportWin(result);
                return;
            }
        }
        for (var i = 0; i < 3; i++) {
            var result = self.checkAcross(i);
            if (result) {
                self.reportWin(result);
                return;
            }
        }

        var firstResult = self.checkDiagonal(0);
        if (firstResult) {
            self.reportWin(firstResult);
            return;
        }

        firstResult = self.checkDiagonal(2);
        if (firstResult) {
            self.reportWin(firstResult);
            return;
        }

        for (var i = 0; i < 3; i++) {
            for (var j = 0; j < 3; j++) {
                var letter = self.rows()[i].columns()[j].letter();
                if (!letter) {
                    if (self.playersCurrentTurn() == "X")
                        self.playersCurrentTurn("O");
                    else
                        self.playersCurrentTurn("X");
                    return;
                }
            }
        }

        self.tieVisible(true);
        setTimeout(function () { self.gameOver(true) }, 50);
        //self.gameOver(true);
        self.catsGamesCount(self.catsGamesCount() + 1);
        if (self.playSounds())
            self.loseSound.play();
    };

    self.rows = ko.observableArray();

    self.playersTurnUrl = ko.computed(function () {
        return "/images/tic-tac-toe/" + self.playersCurrentTurn() + ".png";
    });

    self.checkDiagonal = function (columnIndex) {
        var cells = [];
        var firstLetter = self.rows()[0].columns()[columnIndex].letter();
        if (firstLetter)
            cells.push(self.rows()[0].columns()[columnIndex]);

        for (var i = 1; i <= 2; i++) {
            var column = i;
            if (columnIndex > 0)
                column = columnIndex - i;

            var letterToCheck = self.rows()[i].columns()[column].letter();
            if (letterToCheck != firstLetter)
                return null;
            if (letterToCheck)
                cells.push(self.rows()[i].columns()[column]);
        }

        self.markWinningCells(cells);
        return firstLetter;
    };

    self.markWinningCells = function (cells) {
        for (var i = 0; i < cells.length; i++) {
            cells[i].tdClass("highlight");
        }
    }

    self.checkDown = function (columnIndex) {
        var cells = [];
        var firstLetter = self.rows()[0].columns()[columnIndex].letter();
        if (firstLetter)
            cells.push(self.rows()[0].columns()[columnIndex]);

        for (var i = 1; i <= 2; i++) {
            var letterToCheck = self.rows()[i].columns()[columnIndex].letter();
            if (letterToCheck != firstLetter)
                return null;
            if (letterToCheck)
                cells.push(self.rows()[i].columns()[columnIndex]);
        }
        self.markWinningCells(cells);
        return firstLetter;
    };

    self.checkAcross = function (rowIndex) {
        var cells = [];
        var firstLetter = self.rows()[rowIndex].columns()[0].letter();
        if (firstLetter)
            cells.push(self.rows()[rowIndex].columns()[0]);
        for (var i = 1; i <= 2; i++) {
            var letterToCheck = self.rows()[rowIndex].columns()[i].letter();
            if (letterToCheck != firstLetter)
                return null;
            if (letterToCheck)
                cells.push(self.rows()[rowIndex].columns()[i]);
        }

        self.markWinningCells(cells);
        return firstLetter;
    };

    self.initialize = function () {
        self.playersCurrentTurn("X");
        self.rows.removeAll();

        for (var i = 0; i < 3; i++) {
            var row = { columns: ko.observableArray() };
            for (var y = 0; y < 3; y++) {
                row.columns.push(new cell(self));
            }
            self.rows.push(row);
        }

        self.highlightedRow(1);
        self.highlightedColumn(1);
        setHighlighedCell();
        self.gameOver(false);
    };

    self.closePopup = function () {
        $("#dialog-modal").dialog("close");
    };

    self.loadStyle = function () {
        loadjscssfile("/Content/ticTacToe.css?v=" + new Date().toString(), "css");
    }
};

var viewModel = new vm();
$(function () {
    viewModel.initialize();
    ko.applyBindings(viewModel);

    $("#slider-range-max").slider({
        range: "max",
        min: 1,
        max: 4,
        value: 3,
        slide: function (event, ui) {
            //$("#amount").val(ui.value);
            viewModel.difficulty(ui.value);
        }
    });

    viewModel.difficulty($("#slider-range-max").slider("option", "value"));

    $("button").button();

    viewModel.settingsVisible.subscribe(function (newValue) {
        if (newValue) {
            $("#dialog-modal").dialog({
                width: 350,
                modal: true,
            }).show();

            viewModel.settingsVisible(false);
        }
    });

    viewModel.winVisible.subscribe(function (newValue) {
        if (newValue) {
            viewModel.winVisible(false);
            $("#win-dialog").dialog({
                height: 200,
                width: 350,
                modal: true,
                buttons: {
                    Okay: function () {
                        $(this).dialog("close");
                    }
                },
                close: function (event, ui) {
                    viewModel.initialize();
                }
            }).show();

        }
    });

    viewModel.tieVisible.subscribe(function (newValue) {
        if (newValue) {

            viewModel.tieVisible(false);
            $("#tie-dialog").dialog({
                height: 200,
                width: 350,
                modal: true,
                buttons: {
                    Okay: function () {
                        $(this).dialog("close");
                    }
                },
                close: function (event, ui) {
                    viewModel.initialize();
                }
            }).show();
        }
    });
});

(function (i, s, o, g, r, a, m) {
    i['GoogleAnalyticsObject'] = r; i[r] = i[r] || function () {
        (i[r].q = i[r].q || []).push(arguments)
    }, i[r].l = 1 * new Date(); a = s.createElement(o),
        m = s.getElementsByTagName(o)[0]; a.async = 1; a.src = g; m.parentNode.insertBefore(a, m)
})(window, document, 'script', '//www.google-analytics.com/analytics.js', 'ga');

ga('create', 'UA-44334208-1', 'gregbclement.com');
ga('send', 'pageview');

function loadjscssfile(filename, filetype) {
    if (filetype == "js") { //if filename is a external JavaScript file
        var fileref = document.createElement('script')
        fileref.setAttribute("type", "text/javascript")
        fileref.setAttribute("src", filename)
    }
    else if (filetype == "css") { //if filename is an external CSS file
        var fileref = document.createElement("link")
        fileref.setAttribute("rel", "stylesheet")
        fileref.setAttribute("type", "text/css")
        fileref.setAttribute("href", filename)
    }
    if (typeof fileref != "undefined")
        document.getElementsByTagName("head")[0].appendChild(fileref)
}