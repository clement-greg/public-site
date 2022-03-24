///<reference path="/knockout-2.0.0.js" />
///<reference path="/knockout.mapping-latest.js" />
///<reference path="/jquery-1.7.2.min.js" />


var bubble = function (gameBoard, initialRow, initialColumn) {
    var self = this;

    var POSSIBLE_BALL_TYPES = 5;

    self.gameBoard = ko.observable(gameBoard);

    self.selected = ko.observable(false);
    self.row = ko.observable(initialRow);
    self.column = ko.observable(initialColumn);

    self.bubbleClicked = function () {
        var selectedItems = [];
        selectedItems.push(self);

        self.getMyNeigbors(selectedItems);
        if (self.selected()) {
            for (var i = 0; i < selectedItems.length; i++) {
                selectedItems[i].column().bubble(null);
            }
            self.gameBoard().fillInBoard();

            gameBoard.score(gameBoard.score() + gameBoard.potentialPoints());
            gameBoard.selectedCells.removeAll();
            document.getElementById("popMediaPlayer").play();

            if (gameBoard.gameOver()) {
                alert("Game Over");
                gameBoard.newGame();
            }
        }
        else {
            self.gameBoard().resetBoard();

            if (selectedItems.length > 1) {
                for (var i = 0; i < selectedItems.length; i++) {
                    selectedItems[i].selected(!selectedItems[i].selected());
                }
                gameBoard.selectedCells(selectedItems);
            }
        }
    };

    self.charactor = ko.observable();

    self.imageUrl = ko.computed(function () {
        if (self.charactor() == 0)
            return "/images/bubbles/blue.png";
        if (self.charactor() == 1)
            return "/images/bubbles/cyan.png";
        if (self.charactor() == 2)
            return "/images/bubbles/green.png";
        if (self.charactor() == 3)
            return "/images/bubbles/red.png";
        if (self.charactor() == 4)
            return "/images/bubbles/yellow.png";
    });


    self.charactor(Math.floor(Math.random() * POSSIBLE_BALL_TYPES));

    self.selectedClass = ko.computed(function () {
        if (self.selected())
            return "selectedCell";
        return "unselectedCell"
    });

    self.getMyNeigbors = function (selectedItems) {
        var neighbors = [];

        var columnIndex = self.row().columns().indexOf(self.column());
        var rowIndex = self.gameBoard().rows().indexOf(self.row());

        if (rowIndex > 0) {
            //Check up
            var neighbor = self.gameBoard().rows()[rowIndex - 1].columns()[columnIndex];
            if (neighbor.bubble() && selectedItems.indexOf(neighbor.bubble()) == -1) {
                if (neighbor.bubble() != null && neighbor.bubble().charactor() == self.charactor()) {
                    selectedItems.push(neighbor.bubble());
                    neighbor.bubble().getMyNeigbors(selectedItems);
                }
            }
        }
        if (rowIndex < self.gameBoard().rowCount() - 1) {
            //Check down
            var neighbor = self.gameBoard().rows()[rowIndex + 1].columns()[columnIndex];
            if (neighbor.bubble() && selectedItems.indexOf(neighbor.bubble()) == -1) {
                if (neighbor.bubble() != null && neighbor.bubble().charactor() == self.charactor()) {
                    selectedItems.push(neighbor.bubble());
                    neighbor.bubble().getMyNeigbors(selectedItems);
                }
            }
        }
        if (columnIndex > 0) {
            //Check left

            var neighbor = self.gameBoard().rows()[rowIndex].columns()[columnIndex - 1];
            if (neighbor.bubble() && selectedItems.indexOf(neighbor.bubble()) == -1) {
                if (neighbor.bubble() != null && neighbor.bubble().charactor() == self.charactor()) {
                    selectedItems.push(neighbor.bubble());
                    neighbor.bubble().getMyNeigbors(selectedItems);
                }
            }
        }
        if (columnIndex < self.gameBoard().colCount() - 1) {
            //Check right

            var neighbor = self.gameBoard().rows()[rowIndex].columns()[columnIndex + 1];
            if (neighbor.bubble() && selectedItems.indexOf(neighbor.bubble()) == -1) {
                if (neighbor.bubble() != null && neighbor.bubble().charactor() == self.charactor()) {
                    selectedItems.push(neighbor.bubble());
                    neighbor.bubble().getMyNeigbors(selectedItems);
                }
            }
        }
    };
};

var row = function (gameBoard) {
    var self = this;

    self.columns = ko.observableArray();

    for (var i = 0; i < gameBoard.colCount() ; i++) {
        self.columns.push(new column(gameBoard, self));
    }
};

var column = function (gameBoard, row) {
    var self = this;

    self.bubble = ko.observable();

    self.bubble(new bubble(gameBoard, row, self));
};

var gameBoard = function () {
    var self = this;

    var windowWidth = $(window).width() - 20;
    var windowHeight = $(window).height() - 150;

    var rows = Math.floor(windowHeight / 35);
    var cols = Math.floor(windowWidth / 35);
    self.rowCount = ko.observable(rows);
    self.colCount = ko.observable(cols);

    self.rows = ko.observableArray();
    self.superShift = ko.observable(false);

    self.selectedCells = ko.observableArray();
    self.hasSelectedCells = ko.computed(function () {
        return self.selectedCells().length > 0;
    });

    self.potentialPoints = ko.computed(function () {
        return Math.pow(self.selectedCells().length, 2);
    });

    self.score = ko.observable(0);

    self.openSettingsDialog = function () {
        $("#settings").fadeIn();
    };

    self.newGame = function () {
        self.gameOver(false);
        self.rows.removeAll();
        self.score(0);
        for (var i = 0; i < self.rowCount() ; i++) {
            self.rows.push(new row(self));
        }
    }

    self.resetBoard = function () {
        for (var rowNumber = 0; rowNumber < self.rows().length; rowNumber++) {
            for (var columnNumber = 0; columnNumber < self.colCount() ; columnNumber++) {
                var column = self.rows()[rowNumber].columns()[columnNumber];
                if (column.bubble() != null)
                    column.bubble().selected(false);
            }
        }
    };

    self.fillInBoard = function () {

        //Shift left empty columns
        for (var i = 0; i < self.colCount() ; i++) {
            for (var columnNumber = 0; columnNumber < self.colCount() - 1; columnNumber++) {
                var columnHasBubble = false;
                for (var rowNumber = 0; rowNumber < self.rowCount() ; rowNumber++) {
                    var cell = self.rows()[rowNumber].columns()[columnNumber];
                    if (cell.bubble()) {
                        columnHasBubble = true;
                        break;
                    }
                }

                if (!columnHasBubble) {

                    for (var rowNumber = 0; rowNumber < self.rowCount() ; rowNumber++) {
                        var cell = self.rows()[rowNumber].columns()[columnNumber];
                        var cellToRight = self.rows()[rowNumber].columns()[columnNumber + 1];
                        var bubbleToMoveLeft = cellToRight.bubble();

                        if (bubbleToMoveLeft) {
                            cellToRight.bubble(null);
                            bubbleToMoveLeft.column(cell);
                            cell.bubble(bubbleToMoveLeft);
                        }
                    }
                }
            }
        }

        //Add new columns to replace the empty columns
        for (var columnNumber = 0; columnNumber < self.colCount() ; columnNumber++) {
            var rowHasBubble = false;
            for (var rowNumber = 0; rowNumber < self.rowCount() ; rowNumber++) {
                var cell = self.rows()[rowNumber].columns()[columnNumber];
                if (cell.bubble()) {
                    rowHasBubble = true;
                    break;
                }
            }

            if (!rowHasBubble) {

                for (var rowNumber = 0; rowNumber < self.rowCount() ; rowNumber++) {
                    var cell = self.rows()[rowNumber].columns()[columnNumber];

                    cell.bubble(new bubble(self, self.rows()[rowNumber], cell));
                }
            }
        }

        //Shift down empty cells
        for (var rowNumber = self.rows().length - 1; rowNumber >= 0; rowNumber--) {
            for (var columnNumber = 0; columnNumber < self.colCount() ; columnNumber++) {
                var column = self.rows()[rowNumber].columns()[columnNumber];
                if (!column.bubble()) {
                    for (var rowToCheck = rowNumber - 1; rowToCheck >= 0; rowToCheck--) {
                        var columnAbove = self.rows()[rowToCheck].columns()[columnNumber];
                        if (columnAbove.bubble()) {
                            var bubbleToMove = columnAbove.bubble();

                            columnAbove.bubble(null);
                            bubbleToMove.row(self.rows()[rowNumber]);
                            bubbleToMove.column(column);
                            column.bubble(bubbleToMove);
                            break;
                        }
                    }
                }
            }
        }

        if (self.superShift()) {
            for (var i = 0; i < self.colCount() ; i++) {
                for (var columnNumber = self.colCount() - 1; columnNumber > 0; columnNumber--) {
                    for (var rowNumber = 0; rowNumber < self.rowCount() ; rowNumber++) {
                        var column = self.rows()[rowNumber].columns()[columnNumber];
                        if (column.bubble()) {
                            var columnToLeft = self.rows()[rowNumber].columns()[columnNumber - 1];
                            if (!columnToLeft.bubble()) {
                                var bubbleToMove = column.bubble();
                                column.bubble(null);
                                bubbleToMove.row(self.rows()[rowNumber]);
                                bubbleToMove.column(columnToLeft);
                                columnToLeft.bubble(bubbleToMove);
                            }
                        }
                    }
                }
            }
        }

        var hasAnotherMove = false;
        //check to see if another move is possible
        for (var rowNumber = 0; rowNumber < self.rows().length; rowNumber++) {
            var row = self.rows()[rowNumber];
            for (var columnNumber = 0; columnNumber < row.columns().length; columnNumber++) {
                var cell = row.columns()[columnNumber];
                if (cell.bubble()) {
                    if (rowNumber > 0) {
                        //Check up
                        var neighbor = self.rows()[rowNumber - 1].columns()[columnNumber];
                        if (neighbor.bubble() && neighbor.bubble().charactor() == cell.bubble().charactor()) {
                            hasAnotherMove = true;
                            break;
                        }
                    }
                    if (rowNumber < self.rowCount() - 1) {
                        //Check down
                        var neighbor = self.rows()[rowNumber + 1].columns()[columnNumber];
                        if (neighbor.bubble() && neighbor.bubble().charactor() == cell.bubble().charactor()) {
                            hasAnotherMove = true;
                            break;
                        }
                    }
                    if (columnNumber > 0) {
                        //Check left
                        var neighbor = self.rows()[rowNumber].columns()[columnNumber - 1];
                        if (neighbor.bubble() && neighbor.bubble().charactor() == cell.bubble().charactor()) {
                            hasAnotherMove = true;
                            break;
                        }
                    }
                    if (columnNumber < self.colCount() - 1) {
                        //Check right
                        var neighbor = self.rows()[rowNumber].columns()[columnNumber + 1];
                        if (neighbor.bubble() && neighbor.bubble().charactor() == cell.bubble().charactor()) {
                            hasAnotherMove = true;
                            break;
                        }
                    }
                }
            }
            if (hasAnotherMove)
                break;
        }
        if (!hasAnotherMove) {
            self.gameOver(true);
        }
    }

    self.gameOver = ko.observable(false);
    self.newGame();
}

var board = null;
$(function () {
    board = new gameBoard();

    ko.applyBindings(board);

    setTimeout(function () {
        $("#gameLoading").hide();
        $("#gameSurface").fadeIn();

    }, 3000);

    $("input[type='checkbox']").checkboxradio("refresh");
    $("a[title='Close']").click(function () {
        $("#settings").fadeOut();
    });
});

