$(document).ready(function() {
    
    function changeColor() {
        $(this).toggleClass('lighttile');
    };

    function makeNewPuzzle() {
        $('.victory').hide();
        moves = 0;
        gameWon = false;
        for (var i = 0; i < numbers.length; i++) {
            var index = Math.floor(Math.random() * 8);
            var temp = numbers[i];
            numbers[i] = numbers[index];
            numbers[index] = temp;
        }

        for (var i = 0; i < 9; i++) {
            var y = document.getElementById("sq" + i);
            if (numbers[i] == 0) {
                y.className = y.className + " blank";
                y.innerHTML = "";
            }
            else {
                y.innerHTML = numbers[i];
            }
        }
        trackOutputs();
    };

    function trackOutputs(){
        $('.sidebar2').html("Array contents:<br/>" + numbers +
                            "<br/><br/>ManHattan Distance:<br/>" + ManDistance +
                            "<br/><br/>f(x):<br/>" + fOfX +
                            "<br/><br/>Moves:<br/>" + moves);
    };

    function goalState() {
        for (var i = 0; i < 8; i++) {
            var y = document.getElementById("sq" + i);
            if (y.innerHTML != i + 1) {
                return false;
            }            
        }
        return true;
    };

    function calcHeuristics() {

    };

    var numbers = [0,1,2,3,4,5,6,7,8];
    var ManDistance = -1;
    var fOfX = -1;
    var moves = 0;
    var gameWon = false;

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
                moves++;   
                var temp = numbers[thisid];
                numbers[thisid] = numbers[blankid];
                numbers[blankid] = temp;
                $('.blank').addClass('tile');
                $('.blank').html($(this).html());
                $('.blank').removeClass('blank');
                $(this).addClass('blank');
                $(this).removeClass('tile');
                $(this).html("");
                trackOutputs();
                if (goalState()) {
                    $('.victory').html("You win the game in " + moves + " moves!");
                    $('.victory').show();
                    gameWon = true;
                }

        }
    });
});