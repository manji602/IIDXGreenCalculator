Namespace('com.iidx.green')
.use('brook *')
.define(function(ns) {
    /* constants */
    var GREEN_NUMBER_CONSTANTS = 174000;
    var WHITE_NUMBER_CONSTANTS = 1000;
    var HS_DISPLAY_STYLE_AC = [ '4.0', '3.75', '3.5', '3.25', '3.0', '2.75', '2.5', '2.25', '2.0', '1.5', '1.0' ];
    var HS_DISPLAY_STYLE_CS = [ '5.0', '4.5', '4.0', '3.5', '3.0', '2.5', '2.0', '1.5', '1.0', '0.5', '0.0' ];

    var main = function () {
	function calc () {
	    $('.calc').click( function(event){
		event.preventDefault();
		event.stopPropagation();
		var BPM1 = $('#bpm1').val();
		var BPM2 = $('#bpm2').val();
		var BPM3 = $('#bpm3').val();
		var greenNumber = $('#greenNumber').val();
		var whiteNumber = $('#whiteNumber').val();
		$('.HSArray >tr').each( function(index) {
		    var hiSpeed = HS_DISPLAY_STYLE_AC[index];
		    $(this).find('.whiteNum1').html(_calcWhiteNumber(BPM1, hiSpeed, greenNumber));
		    $(this).find('.whiteNum2').html(_calcWhiteNumber(BPM2, hiSpeed, greenNumber));
		    $(this).find('.whiteNum3').html(_calcWhiteNumber(BPM3, hiSpeed, greenNumber));
		    $(this).find('.whiteNum1, .whiteNum2, .whiteNum3').css('color', '');
		});
		_changeCSSOfNearestWhiteNumber();
	    });
	}

	function reset () {
	    var resetButton = $(document).find('.reset');
	    resetButton.click (function(event){
		event.preventDefault();
	        event.stopPropagation();
	        $('#bpm1, #bpm2, #bpm3, #greenNumber, #whiteNumber').val('');
	    });
	}

	function toggleHSFormat () {
	    $('input[name="HSFormat"]:radio').change( function() {
			var selectedFormat = $(this).attr('id');
		    $(document).find('.HSArray >tr >td.speed').each( function(index) {
				if (selectedFormat === 'cs'){
					$(this).html(HS_DISPLAY_STYLE_CS[index]);
				}
		        if (selectedFormat === 'ac'){
					$(this).html(HS_DISPLAY_STYLE_AC[index]);
				}
			});
	    });
	}

	function _calcWhiteNumber (bpm, hiSpeed, greenNum) {
	    if (!bpm.match(/^[0-9]+?$/) || !greenNum.match(/^[0-9]+?$/)) { return '--'; }
	    var whiteNum = WHITE_NUMBER_CONSTANTS - greenNum * bpm * hiSpeed * WHITE_NUMBER_CONSTANTS / GREEN_NUMBER_CONSTANTS;
	    return whiteNum >= 0 ? Math.floor(whiteNum) : '--';
	}

	function _changeCSSOfNearestWhiteNumber () {
	    var whiteNumber = $('#whiteNumber').val();
	    if (!isFinite(whiteNumber)){ return; }
	    var nearestWhiteNumber = [2000, 2000, 2000];
	    var nearestWhiteIndex  = [-1, -1, -1];

	    $('.HSArray >tr').each( function(index) {
		var whiteNum1 = $(this).find('.whiteNum1').html();
		var whiteNum2 = $(this).find('.whiteNum2').html();
		var whiteNum3 = $(this).find('.whiteNum3').html();
		var whiteNums = [whiteNum1, whiteNum2, whiteNum3];
		$.each(whiteNums, function(i){
		    if (isFinite(whiteNums[i])){
			if ( nearestWhiteNumber[i] === 2000 ||
			     Math.abs(whiteNums[i] - whiteNumber) < Math.abs(nearestWhiteNumber[i] - whiteNumber)){
			    nearestWhiteNumber[i] = whiteNums[i];
			    nearestWhiteIndex[i] = index;
			}
		    }
		    });
	    });
	    if (nearestWhiteIndex[0] != -1){
		$('.HSArray >tr >.whiteNum1').eq(nearestWhiteIndex[0]).css('color', 'red');
	    }
	    if (nearestWhiteIndex[1] != -1){
		$('.HSArray >tr >.whiteNum2').eq(nearestWhiteIndex[1]).css('color', 'red');
	    }
	    if (nearestWhiteIndex[2] != -1){
		$('.HSArray >tr >.whiteNum3').eq(nearestWhiteIndex[2]).css('color', 'red');
	    }
	}

	calc();
	reset();
	toggleHSFormat();
    };
    ns.provide({
	    main: main
    });
});