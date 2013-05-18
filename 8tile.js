$(document).ready(function() {
    
    function changeColor() {
        $(this).toggleClass('lighttile');
    };

    function makeNewPuzzle() {
        for (var i = 0; i < numbers.length; i++) {
            var index = Math.floor(Math.random() * 8);
            var temp = numbers[i];
            numbers[i] = numbers[index];
            numbers[index] = temp;
        }

        for (var i = 0; i < 9; i++) {
            var x = "sq" + i;
            var y = document.getElementById(x);
            if (numbers[i] == 0) {
                y.className = y.className + " blank";
                y.innerHTML = "";
            }
            else {
                y.innerHTML = numbers[i];
            }
        }
    };

    var numbers = [0,1,2,3,4,5,6,7,8];

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
        if ((thisid - 3 == blankid) || 
            (thisid + 3 == blankid) || 
            ((parseInt(thisid / 3) == parseInt(blankid / 3)) && (Math.abs(thisid - blankid) == 1))) {
            $('.blank').addClass('tile');
            $('.blank').text($(this).text());
            $('.blank').removeClass('blank');
            $(this).addClass('blank');
            $(this).removeClass('tile');
            $(this).text("");    
        }
    });
});