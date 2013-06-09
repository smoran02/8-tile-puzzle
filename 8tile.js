$(document).ready(function() {
   
    var board = [0,1,2,3,4,5,6,7,8];
    var gameWon = false;
    var open = [];
    var closed = [];
    var moves = 0;
    var showAnswers = false;

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
                                "<br/><br/>Moves:<br/>" + moves);
        };
    }

    function changeColor() {
        $(this).toggleClass('lighttile');
    };

    function makeNewPuzzle() {
        $('.victory').hide();
        gameWon = false;
        moves = 0;
        if (showAnswers) {
            $('.sidebar2').text("Next Move: " + open[0].moves[0]);
        }
        $('.blank').removeClass('blank');
        $('.sidebar2').text("Next Move: ");
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

        if (open.length != 0) {
            open.splice(0, open.length);
        }
        if (closed.length != 0) {
            closed.splice(0, closed.length);
        }

        var initialState = new Node(board);
        initialState.calcHeuristics();
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
        if (showAnswers) {
        $('.sidebar2').text("Next Move: " + open[0].moves[0]);
        }
    };

    function calculateMD(boardArray) {
        var mDistance = 0;

            for (var i = 0; i < 9; i++) {
                var x = Math.max(i, boardArray[i] - 1);
                var y = Math.min(i, boardArray[i] - 1);
                if (boardArray[i] == 0) {
                    x = y;
                }
                while (parseInt(x / 3) != parseInt(y / 3)) {
                    x -= 3;
                    mDistance++;
                }
                mDistance += Math.abs(x - y);
            }  

            return mDistance;
    };

    makeNewPuzzle();
    solvePuzzle();

    $('#hint').on('click', function() {
        if (gameWon == false) {
            $('.sidebar2').text("Next Move: " + open[0].moves[0]);
        }
    });

    $('#answers').on('click', function() {
        $(this).toggleClass('darkanswer');
        if (showAnswers) {
            showAnswers = false;
            if (!gameWon) {
                $('.sidebar2').text("Next Move: ");
            }
        }
        else {
            showAnswers = true;
            if (!gameWon) {
                $('.sidebar2').text("Next Move: " + open[0].moves[0]);
            }
        } 
    });

    $('.tile').on('mouseenter', changeColor).on('mouseleave', changeColor);

    $('#newGame').on('click', function() {
        $('.blank').addClass('tile');
        $('.blank').removeClass('blank');
        makeNewPuzzle();
        solvePuzzle();
    });

    function makeSwap(thisid) {
        $('.blank').addClass('tile');
        $('.blank').html($(thisid).html());
        $('.blank').removeClass('blank');
        $(thisid).addClass('blank');
        $(thisid).removeClass('tile');
        $(thisid).html("");
    };

    $('#autosolve').on('click', function() {
        var counter = 0;
        while (calculateMD(board) != 0) {
            var blankid = parseInt($('.blank').attr('id')[2]);
            var thisid = -1;
            var x = -1;
            var nextMove = open[0].moves[counter];
            for (var i = 0; i < 9; i++) {
                if (board[i] == nextMove) {
                    thisid = document.getElementById('sq' + i);
                    x = i;
                }
            }
            var temp = board[x];
            board[x] = board[blankid];
            board[blankid] = temp;
            alert('hi');
            setTimeout(makeSwap(thisid), 500);
            counter++;
            moves++;
        }
        gameWon = true;
        $('.victory').html("I guess you won the game in " + moves + " moves??");
        $('.victory').show();
        $('.sidebar2').text("Next Move: ");
    });

    $('.tile').on('click', function() {
        var thisid = parseInt($(this).attr('id')[2]);
        var blankid = parseInt($('.blank').attr('id')[2]);

        if (gameWon == false &&
            ((thisid - 3 == blankid) || 
            (thisid + 3 == blankid) || 
            ((parseInt(thisid / 3) == parseInt(blankid / 3)) && (Math.abs(thisid - blankid) == 1)))) {
                moves++;
                $('.sidebar2').text("Next Move: ");
                var temp = board[thisid];
                board[thisid] = board[blankid];
                board[blankid] = temp;
                solvePuzzle();
                $('.blank').addClass('tile');
                $('.blank').html($(this).html());
                $('.blank').removeClass('blank');
                $(this).addClass('blank');
                $(this).removeClass('tile');
                $(this).html("");
                if (calculateMD(board) == 0) {
                    $('.victory').html("You won the game in " + moves + " moves!");
                    $('.victory').show();
                    $('.sidebar2').text("Next Move: ");
                    gameWon = true;
                }
        }
    });
});