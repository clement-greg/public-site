
var ROCK = 0;
var PAPER = 1;
var SCISSORS = 2;

var vm = function () {
    var self = this;
    self.playersChoice = ko.observable();
    self.computersChoice = ko.observable();
    self.winner = ko.observable();
    self.playerWinCount = ko.observable(0);
    self.computerWinCount = ko.observable(0);
    self.tieCount = ko.observable(0);
    self.winnerUrl = ko.observable();


    self.getChoiceDisplay = function (choice) {
        if (choice == 0)
            return "Rock";
        else if (choice == 1)
            return "Paper";
        else if (choice == 2)
            return "Scissors";
    };

    self.computersChoiceDisplay = ko.computed(function () {
        return self.getChoiceDisplay(self.computersChoice());
    });

    self.playersChoiceDisplay = ko.computed(function () {
        return self.getChoiceDisplay(self.playersChoice());
    });

    self.playersChoiceUrl = ko.computed(function () {
        return "/images/rock-paper-scissors/" + self.getChoiceDisplay(self.playersChoice()) + "-icon.png";
    });

    self.computersChoiceUrl = ko.computed(function () {
        return "/images/rock-paper-scissors/" + self.getChoiceDisplay(self.computersChoice()) + "-icon.png";
    });

    self.playRock = function () {
        self.computersChoice(null);
        self.playersChoice(null);
        self.playersChoice(ROCK);
    };

    self.playPaper = function () {
        self.computersChoice(null);
        self.playersChoice(null);
        self.playersChoice(PAPER);
    };

    self.playScissors = function () {
        self.computersChoice(null);
        self.playersChoice(null);
        self.playersChoice(SCISSORS);
    };

    self.playersChoice.subscribe(function (newValue) {
        if (newValue != null) {
            var computerPlay = parseInt(Math.random() * 3);
            self.computersChoice(computerPlay);
            var personPlay = self.playersChoice();

            if (computerPlay == personPlay) {
                self.winner("Tie Game");
                self.winnerUrl("/images/rock-paper-scissors/Tie.png");
                self.tieCount(self.tieCount() + 1);
            }
            else if (computerPlay == ROCK && personPlay == PAPER) {
                self.winner("You Win!");
                self.playerWinCount(self.playerWinCount() + 1);
                self.winnerUrl("/images/rock-paper-scissors/youwin.png");
            }
            else if (computerPlay == ROCK && personPlay == SCISSORS) {
                self.winner("Sorry, You Lose!");
                self.computerWinCount(self.computerWinCount() + 1);
                self.winnerUrl("/images/rock-paper-scissors/youlose.png");
            }
            else if (computerPlay == PAPER && personPlay == ROCK) {
                self.winner("Sorry, You Lose!");
                self.computerWinCount(self.computerWinCount() + 1);
                self.winnerUrl("/images/rock-paper-scissors/youlose.png");
            }
            else if (computerPlay == PAPER && personPlay == SCISSORS) {
                self.winner("You Win");
                self.winnerUrl("/images/rock-paper-scissors/youwin.png");
                self.playerWinCount(self.playerWinCount() + 1);
            }
            else if (computerPlay == SCISSORS && personPlay == ROCK) {
                self.winner("You Win");
                self.winnerUrl("/images/rock-paper-scissors/youwin.png");
                self.playerWinCount(self.playerWinCount() + 1);
            }
            else if (computerPlay == SCISSORS && personPlay == PAPER) {
                self.winner("Sorry, You Lose!");
                self.computerWinCount(self.computerWinCount() + 1);
                self.winnerUrl("/images/rock-paper-scissors/youlose.png");
            }
        }
        else {
            self.computersChoice(null);
            self.winner(null);
        }
    });


};

var viewModel;

$(function () {
    viewModel = new vm();
    ko.applyBindings(viewModel);

    $("button").button();
});