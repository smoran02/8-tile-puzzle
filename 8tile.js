$(document).ready(function() {
   
    var board = [0,1,2,3,4,5,6,7,8];
    var gameWon = false;
    var open = [];
    var closed = [];

    function Node(boardArray) {
        this.manDistance = -1;
        this.numbers = boardArray;
        this.fOfx = -1;
        this.moves = [];

        this.calcHeuristics = function() {
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

            this.fOfx = parseInt(this.manDistance) + parseInt(this.moves.length);
        };

        this.trackOutputs = function() {
            $('.sidebar2').html("Array contents:<br/>" + this.numbers +
                                "<br/><br/>ManHattan Distance:<br/>" + this.manDistance +
                                "<br/><br/>f(x):<br/>" + this.fOfx +
                                "<br/><br/>Moves:<br/>" + this.moves.length);
        };
    }

    function changeColor() {
        $(this).toggleClass('lighttile');
    };

    function makeNewPuzzle() {
        $('.victory').hide();
        gameWon = false;
        $('.blank').removeClass('blank');
        for (var i = 0; i < board.length; i++) {
            var index = Math.floor(Math.random() * 8);
            var temp = board[i];
            board[i] = board[index];
            board[index] = temp;
        }

        ensureSolvability();
    };

    function ensureSolvability() {
            var total = 0;
            var zeroIndex = -1;
            for (var i = 0; i < 8; i++) {
                for (var j = i + 1; j < 9; j++) {
                    if (board[i] == 0 || board[j] == 0) {
                        if (board[i] == 0) {
                            zeroIndex = i;
                        }
                        else {
                            zeroIndex = j;
                        }
                        total += 0;
                    }
                    else {
                        if (board[j] < board[i]) {
                            total += 1;
                        }
                    }
                }
            }

            if (total % 2 != 0) {
                if (zeroIndex < 7) {
                    var temp = board[8];
                    board[8] = board[7];
                    board[7] = temp;
                }
                else if (zeroIndex == 7) {
                    var temp = board[8];
                    board[8] = board[6];
                    board[6] = temp;
                }
                else {
                    var temp = board[6];
                    board[6] = board[7];
                    board[7] = temp;
                }
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

        };

    function addStateToQueue(addToQueue) {
        var added = false;
        for (var i = 0; i < open.length; i++) {
            if (addToQueue.numbers == open[i].numbers) {
                added = true;
                if (addToQueue.fOfx < open[i].fOfx) {
                    open.splice(i, 1);
                    open.push(addToQueue);
                }
            }
        }

        for (var i = 0; i < closed.length; i++) {
            if (addToQueue.numbers == closed[i].numbers) {
                added = true;
                if (addToQueue.fOfx < closed[i].fOfx) {
                    closed.splice(i, 1);
                    open.push(addToQueue);
                }
            }
        }

        if (added == false) {
            open.push(addToQueue);
        }
    };

    function solvePuzzle() {

        var initialState = new Node(board);
        initialState.calcHeuristics();
        initialState.trackOutputs();
        open.push(initialState);

        while (open[0].manDistance != 0) {

            for (var i = 0; i < 9; i++) {
                if (open[0].numbers[i] == 0) {
                    blankid = i;
                }
            }

            for (var i = 0; i < 9; i++) {
                if ((i - 3 == blankid) || (i + 3 == blankid) ||
                    (parseInt(i / 3) == parseInt(blankid / 3) && (Math.abs(i - blankid) == 1))) {
                        var nextMove = open[0].numbers[i];
                        var nextBoard = open[0].numbers.slice();
                        var temp = nextBoard[i];
                        nextBoard[i] = nextBoard[blankid];
                        nextBoard[blankid] = temp;
                        var addToQueue = new Node(nextBoard);
                        addToQueue.moves = open[0].moves.slice();
                        addToQueue.moves.push(nextMove);
                        addToQueue.calcHeuristics();
                        if (nextMove != open[0].moves[open[0].moves.length - 1]) {
                            addStateToQueue(addToQueue);    
                        }
                }
            }
            closed.push(open[0]);
            open.shift();
            open.sort(function(c, d) {
                return c.fOfx - d.fOfx;
            });
        }
    $('.sidebar2').append('<br><br>Solution found in ' + open[0].moves.length + ' moves:<br>' + open[0].moves);
        
    };

    makeNewPuzzle();
    solvePuzzle();

    $('.tile').on('mouseenter', changeColor).on('mouseleave', changeColor);

    $('.newGame').on('click', function() {
        $('.blank').addClass('tile');
        $('.blank').removeClass('blank');
        makeNewPuzzle();
        solvePuzzle();
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