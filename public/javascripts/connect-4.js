var cell = function (vm, row) {
    var self = this;

    self.marker = ko.observable();
    self.container = vm;
    self.row = row;

    self.imageUrl = ko.computed(function () {
        if (!self.marker())
            return "/images/connect-4/blank.gif";

        if (self.marker() == "1")
            return "/images/connect-4/player1.png";
        if (self.marker() == "2")
            return "/images/connect-4/player2.png";

    });

    self.imageVisible = ko.computed(function () {
        return self.marker();
    });

    self.playColumn = function () {
        var columnIndex = self.row.columns.indexOf(this);

        for (var i = self.container.rows().length - 1; i >= 0; i--) {
            var cellToCheck = self.container.rows()[i].columns()[columnIndex];
            if (!cellToCheck.marker()) {
                cellToCheck.marker(self.container.playersCurrentTurn());
                self.container.inspectBoardForWinner();
                return;
            }
        }

        alert("There are no spaces available to play");

    };
};

var vm = function () {

    var self = this;


    self.player1WinCount = ko.observable(0);
    self.player2WinCount = ko.observable(0);

    self.playersCurrentTurn = ko.observable("1");
    self.inspectBoardForWinner = function () {

        for (var row = 0; row < self.rows().length; row++) {
            for (var column = 0; column < self.rows()[row].columns().length; column++) {
                if (self.rows()[row].columns()[column].marker() == self.playersCurrentTurn()) {
                    if (column >= 3 && self.checkLeft(row, column)) {
                        self.reportWin();
                        return;
                    }
                    if (column >= 3 && row >= 3 && self.checkDiagonalLeft(row,column)) {
                        self.reportWin();
                        return;
                    }
                    if (row >= 3 && self.checkUp(row, column)) {
                        self.reportWin();
                        return;
                    }

                    if (column <= self.rows()[row].columns().length - 4 && self.checkRight(row, column)) {
                        self.reportWin();
                        return;
                    }

                    if (column <= self.rows()[row].columns().length - 4 && row >= 3 && self.checkDiagonalRight(row, column)) {
                        self.reportWin();
                        return;
                    }
                }
            }
        }

        var boardFull = true;
        for (var column = 0; column < self.rows()[0].columns().length; column++) {

            if (!self.rows()[0].columns()[column].marker()) {
                boardFull = false;
                break;
            }
        }

        if (boardFull) {
            alert("Tie game!");
            self.initialize();
            return;
        }

        if (self.playersCurrentTurn() == "1")
            self.playersCurrentTurn("2");
        else
            self.playersCurrentTurn("1");
    };

    self.reportWin = function () {
        alert(self.playersCurrentTurn() + " Wins");
        if (self.playersCurrentTurn() == "1")
            self.player1WinCount(self.player1WinCount() + 1);
        else
            self.player2WinCount(self.player2WinCount() + 1);
      
        self.initialize();
    };

    self.checkMatch = function (row, column, addToRow, addToColumn) {
        for (var i = 0; i < 4; i++) {
            if (self.rows()[row].columns()[column].marker() != self.playersCurrentTurn())
                return false;

            row = row + addToRow;
            column = column + addToColumn;
        }

        return true;
    }

    self.checkLeft = function (row, column) {
        return self.checkMatch(row, column, 0, -1);
    };

    self.checkDiagonalLeft = function (row, column) {
        return self.checkMatch(row, column, -1,-1);
    };

    self.checkRight = function (row, column) {
        return self.checkMatch(row, column, 0, 1);
    }; 

    self.checkDiagonalRight = function (row, column) {
        return self.checkMatch(row, column, -1, 1);
    }

    self.checkUp = function (row, column) {
        return self.checkMatch(row, column, -1, 0);
    }

    self.rows = ko.observableArray();

    self.playersTurnUrl = ko.computed(function () {
        return "/images/connect-4/player" + self.playersCurrentTurn() + ".png";
    });

    self.initialize = function () {
        self.playersCurrentTurn("1");
        self.rows.removeAll();

        for (var y = 0; y < 6; y++) {
            var row = { columns: ko.observableArray() };
            for (var x = 0; x < 7; x++) {
                row.columns.push(new cell(self, row));
            }

            self.rows.push(row);
        }
    };

};

var viewModel = new vm();
$(function () {
    viewModel.initialize();
    ko.applyBindings(viewModel);
});