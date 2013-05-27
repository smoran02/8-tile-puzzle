$(document).ready(function() {
    
    var board = [0,1,2,3,4,5,6,7,8];
    var gameWon = false;

    function Node(boardArray) {
        this.manDistance = -1;
        this.numbers = boardArray;
        this.fofX = -1;
        this.moves = [];
        this.config = "";

        this.calcHeuristics = function() {
            if (this.config == "A") {
                this.calcHeuristicsA();
            }
            else {
                this.calcHeuristicsB();
            }
        };

        this.calcHeuristicsA = function() {
            this.manDistance = 0;

            for (var i = 0; i < 9; i++) {
                var x = Math.max(i, this.numbers[i] - 1);
                var y = Math.min(i, this.numbers[i] - 1);
                var z = i;
                if (this.numbers[i] == 0) {
                    this.manDistance += 0;
                }
                else if (this.numbers[i] < 4) {
                    while (parseInt(x / 3) != parseInt(y / 3)) {
                        x -= 3;
                        this.manDistance++;
                    }
                    this.manDistance += Math.abs(x - y);
                }
                else if (this.numbers[i] == 4) {
                    while (parseInt(z / 3) != 1) {
                        if (z > 5) {z -= 3;}
                        else {z += 3;}
                        this.manDistance++;
                    }
                    this.manDistance += Math.abs(z - 5);
                }
                else if (this.numbers[i] < 8) {
                    while (parseInt(z / 3) != 2) {
                        z += 3;
                        this.manDistance++;
                    }
                    if (this.numbers[i] == 5) {this.manDistance += Math.abs(z - 8);}
                    else if (this.numbers[i] == 6) {this.manDistance += Math.abs(z - 7);}
                    else {this.manDistance += Math.abs(z - 6);}
                }
                else if (this.numbers[i] == 8) {
                    while (parseInt(z / 3) != 1) {
                        if (z > 5) {z -= 3;}
                        else {z += 3;}
                        this.manDistance++;
                    }
                this.manDistance += Math.abs(z - 3);
                }
            }
            this.fOfX = this.manDistance + this.moves.length;
        };

        this.calcHeuristicsB = function() {
            this.manDistance = 0;

            for (var i = 0; i < 9; i++) {
                var x = Math.max(i, this.numbers[i] - 1);
                var y = Math.min(i, this.numbers[i] - 1);
                if (this.numbers[i] == 0) {
                    x = y;
                }
                while (parseInt(x / 3) != parseInt(y / 3)) {
                    x -= 3;
                    this.manDistance++;
                }
                this.manDistance += Math.abs(x - y);
            }  

            this.fOfX = this.manDistance + this.moves;
        };

        this.getConfig = function() {
            var total = 0;
            for (var i = 0; i < 8; i++) {
                for (var j = i + 1; j < 9; j++) {
                    if (this.numbers[i] == 0 || this.numbers[j] == 0) {
                        total += 0;
                    }
                    else {
                        if (this.numbers[j] < this.numbers[i]) {
                            total += 1;
                        }
                    }
                }
            }

            if (total % 2 == 0) {
                this.config = "B";
            }
            else {
                this.config = "A";
            }
        };

        this.trackOutputs = function() {
            $('.sidebar2').html("Array contents:<br/>" + this.numbers +
                                "<br/><br/>ManHattan Distance:<br/>" + this.manDistance +
                                "<br/><br/>f(x):<br/>" + this.fOfX +
                                "<br/><br/>Moves:<br/>" + this.moves.length +
                                "<br/><br/>Config:<br/>" + this.config);
        };
    }

    function changeColor() {
        $(this).toggleClass('lighttile');
    };

    function makeNewPuzzle() {
        $('.victory').hide();
        gameWon = false;
        for (var i = 0; i < board.length; i++) {
            var index = Math.floor(Math.random() * 8);
            var temp = board[i];
            board[i] = board[index];
            board[index] = temp;
        }

        for (var i = 0; i < 9; i++) {
            var y = document.getElementById("sq" + i);
            if (board[i] == 0) {
                y.className = y.className + " blank";
                y.innerHTML = "";
            }
            else {
                y.innerHTML = board[i];
            }
        }

        var initialState = new Node(board);
        initialState.getConfig();
        initialState.calcHeuristics();
        initialState.trackOutputs();
    };

    makeNewPuzzle();

    $('.tile').on('mouseenter', changeColor).on('mouseleave', changeColor);

    $('.newGame').on('click', function() {
        $('.blank').addClass('tile');
        $('.blank').removeClass('blank');
        makeNewPuzzle();
    });

    $('.tile').on('click', function() {
        var thisid = parseInt($(this).attr('id')[2]);
        var blankid = parseInt($('.blank').attr('id')[2]);

        if (gameWon == false &&
            ((thisid - 3 == blankid) || 
            (thisid + 3 == blankid) || 
            ((parseInt(thisid / 3) == parseInt(blankid / 3)) && (Math.abs(thisid - blankid) == 1)))) {
                var temp = board[thisid];
                board[thisid] = board[blankid];
                board[blankid] = temp;
                $('.blank').addClass('tile');
                $('.blank').html($(this).html());
                $('.blank').removeClass('blank');
                $(this).addClass('blank');
                $(this).removeClass('tile');
                $(this).html("");
                if (manDistance == 0) {
                    $('.victory').html("You win the game in " + moves + " moves!");
                    $('.victory').show();
                    gameWon = true;
                }

        }
    });
});