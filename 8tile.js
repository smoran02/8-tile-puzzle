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
        config = getConfig();
        calcHeuristics();
        trackOutputs();
    };

    function trackOutputs(){
        $('.sidebar2').html("Array contents:<br/>" + numbers +
                            "<br/><br/>ManHattan Distance:<br/>" + manDistance +
                            "<br/><br/>f(x):<br/>" + fOfX +
                            "<br/><br/>Moves:<br/>" + moves +
                            "<br/><br/>Config:<br/>" + config);
    };

    function calcHeuristics() {
        if (config == "A") {
            calcHeuristicsA();
        }
        else {
            calcHeuristicsB();
        }
    };

    function calcHeuristicsA() {
        manDistance = 0;

        for (var i = 0; i < 9; i++) {
            var x = Math.max(i, numbers[i] - 1);
            var y = Math.min(i, numbers[i] - 1);
            var z = i;
            alert(i + 'i,' + x + 'x,' + y + 'y,' + z + 'z,' + manDistance);
            if (numbers[i] == 0) {
                manDistance += 0;
            }
            else if (numbers[i] < 4) {
                while (parseInt(x / 3) != parseInt(y / 3)) {
                    x -= 3;
                    manDistance++;
                }
                manDistance += Math.abs(x - y);
            }
            else if (numbers[i] == 4) {
                while (parseInt(z / 3) != 1) {
                    if (z > 5) {z -= 3;}
                    else {z += 3;}
                    manDistance++;
                }
                manDistance += Math.abs(z - 5);
            }
            else if (numbers[i] < 8) {
                while (parseInt(z / 3) != 2) {
                    z += 3;
                    manDistance++;
                }
                if (numbers[i] == 5) { manDistance += Math.abs(z - 8); }
                else if (numbers[i] == 6) { manDistance += Math.abs(z - 7); }
                else { manDistance += Math.abs(z - 6);}
            }
            else if (numbers[i] == 8) {
                while (parseInt(z / 3) != 1) {
                    if (z > 5) {z -= 3;}
                    else {z += 3;}
                    manDistance++;
                }
                manDistance += Math.abs(z - 3);
            }
        }
        fOfX = manDistance + moves;
    };

    function calcHeuristicsB() {
        manDistance = 0;

        for (var i = 0; i < 9; i++) {
            var x = Math.max(i, numbers[i] - 1);
            var y = Math.min(i, numbers[i] - 1);
            if (numbers[i] == 0) {
                x = y;
            }
            while (parseInt(x / 3) != parseInt(y / 3)) {
                x -= 3;
                manDistance++;
            }
            manDistance += Math.abs(x - y);
        }

        fOfX = manDistance + moves;
    };

    function getConfig() {
        var total = 0;
        for (var i = 0; i < 8; i++) {
            for (var j = i + 1; j < 9; j++) {
                if (numbers[i] == 0 || numbers[j] == 0) {
                    total += 0;
                }
                else {
                    if (numbers[j] < numbers[i]) {
                        total += 1;
                    }
                }
            }
        }
        if (total % 2 == 0) {
            return "B";
        }
        return "A";
    };

    var numbers = [0,1,2,3,4,5,6,7,8];
    var manDistance = -1;
    var fOfX = -1;
    var moves = 0;
    var gameWon = false;
    var config = "";

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
                calcHeuristics();
                trackOutputs();
                if (manDistance == 0) {
                    $('.victory').html("You win the game in " + moves + " moves!");
                    $('.victory').show();
                    gameWon = true;
                }

        }
    });
});