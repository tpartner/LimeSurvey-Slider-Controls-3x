
/***** 
    JavaScript for the sliderWithControls question theme
    Copyright (C) 2018 - Tony Partner (http://partnersurveys.com)
    Licensed MIT, GPL
    Version - 1.0
    Create date - 24/10/2018
*****/

function initSliderControls(sqID, scrolling, scrollInterval, valuePrefix, valueSuffix) {
	var thisInput = $('input[name="'+sqID+'"]');
	var thisQuestion = $(thisInput).closest('.numeric-multi');
	var thisRow = $(thisInput).closest('li.question-item');
	var thisSGQ = sqID.replace('slid', '');
	
	var thisSliderStep = Number($(thisInput).attr('data-cs-step'));
	var thisSliderMin = Number($(thisInput).attr('data-cs-min'));
	var thisSliderMax = Number($(thisInput).attr('data-cs-max'));
	var csSeparator = $(thisInput).attr('data-cs-separator');
		
	$(thisQuestion).addClass('control-slider-question');
			
	// Function to handle button states
	function csHandleButtonState(slider) {
		var thisSliderVal = $(slider).val();
		$('button.slider-button', thisRow).prop('disabled', false);
		if (thisSliderVal == thisSliderMin) {
			$('button.slider-button.down', thisRow).prop('disabled', true);
		}
		if (thisSliderVal == thisSliderMax) {
			$('button.slider-button.up', thisRow).prop('disabled', true);
		}
	}
			
	// Function to handle button actions
	function csHandleButtons(thisButton) {
		var stepDecimals = 0;
		if(thisSliderStep.toString().indexOf('.') >= 0) {
			stepDecimals = thisSliderStep.toString().split('.')[1].length;
		}
		var thisSliderVal = Number($(thisInput).val().replace(csSeparator, '.')).toFixed(stepDecimals);
		
		if ($(thisButton).hasClass('down') && Number(thisSliderVal) > thisSliderMin) {
			var newValue = Number(thisSliderVal)-thisSliderStep;
			window.activeSliders['s'+thisSGQ].getSlider().setValue(newValue);
			// Re-initiate listener on slider (seems to get unbound when manipulating the slider)
			csSliderListener();
		}
		if ($(thisButton).hasClass('up') && Number(thisSliderVal) < thisSliderMax) {
			var newValue = Number(thisSliderVal)+thisSliderStep;
			window.activeSliders['s'+thisSGQ].getSlider().setValue(newValue);
			// Re-initiate listener on slider
			csSliderListener();
		}
		
		var newValue2 = $(thisInput).val().replace(/\./, csSeparator);
		$('input:text', thisRow).val(newValue2).trigger('change');
		
		csUpdateTooltip();
		
		if($.trim($(thisInput).val()) != '') {
			$('.slider', thisRow).removeClass('slider-untouched').addClass('slider-touched');
		}
	}
	
	// Function to update the slider tooltip
	function csUpdateTooltip() {
		console.log($.trim($(thisInput).val()));	
		if($.trim($(thisInput).val()) != '') {
			$('.tooltip-inner', thisRow).text(valuePrefix+$(thisInput).val()+valueSuffix);
		}
	}
	
	// Listener on slider
	function csSliderListener() {
		$(thisInput).on('slide slideStop', function(e) {
			csHandleButtonState(this);
			csUpdateTooltip();
		});
	}
	
	// Initial states
	csHandleButtonState(thisInput);	
	csUpdateTooltip();

	// Initiate listener on slider
	csSliderListener();
			
	// Listener on the buttons
	$('button.slider-button', thisRow).on('click touchend', function(e) {
		csHandleButtons(this)	;		
		csHandleButtonState($(thisInput));
	});
			
	// Scrolling
	if(scrolling == true && scrollInterval > 0) {
			
		var sliderTimeout;
		var clicker = $('button.slider-button', thisRow);
		var count = 0;

		$('button.slider-button', thisRow).on('mousedown touchstart', function(){
			var thisButton = $(this);
			sliderTimeout = setInterval(function(){
				csHandleButtons(thisButton);
			}, scrollInterval);				
			return false;
		});				
		
		$('button.slider-button', thisRow).on('mouseup touchend', function(){
			clearInterval(sliderTimeout);
			return false;
		});
		$('button.slider-button', thisRow).mouseout(function(){
			//csHandleButtonState($(this).closest('li.question-item').find('.multinum-slider'));
		});
	}
			
	// Listener on reset button
	$('.btn-slider-reset', thisRow).on( "click", function( event, ui ) {
		var thisReset = $(this);
		setTimeout(function() {
			if($('input:text:eq(0)', thisRow).val() == '') {
				// Fix LS bug
				$('input:text:eq(0)', thisRow).val($('input:text:eq(1)', thisRow).val())
			}
			csHandleButtonState($(thisInput));
		}, 150);
	});	
	
	
	
	
	
}
