
	$(document).ready( function(){
		
		options = {
							wheel: true, // allow scrolling by mousewheel ( true, false ) ( default => true; by require jquery.mousewheel plugin )
							almostRatio: 0.1, // scrolling position percentage before initial or final position ( default => 0.1 )
							stepScrollSize: 100, // jumping scrolling by keyboard, click or mousewheel ( default => 50 )
							scrollbarWidth: 6, // width of the scrollbar ( default => 6 )
							scrollbarMinSize: 100, // Minimum height or the scrollbar ( default => 80 )
							scrollbarBorderWidth: 2, // scollbar container border ( default => 2 )
							scrollbarColor: 'rgba(120, 120, 120, .8)', // personalize scrollbar color ( default => "rgba(120, 120, 120, .8)" )
							scrollbarBackground: 'none' // personalize scrollbar container color ( default => "none" )
						}
		
		/** Apply this scroll to an existant DOM element **/
		$('.myContainer').scroll( options )
										.on( 'scroll:init', function( e, details ){
											/** e => { type: 'x-scroll | y-scroll' } **/
											
											$('.details').html( '<small></strong>Init Event</strong><br><br><span>Type: '+ details.type +'</span></small>' )
											
										} ).on( 'scroll:start', function( e, details ){
											/** e => { 
															type: ( x-scroll | y-scroll )
															trigger: ( mousemove | mousewheel | click | keyboard )
															offset: // scrollbar position
															direction: ( up, down, left, right )
														}
											**/
											
											$('.details').html( '<small><strong>Start Event</strong><br><br><span>Type: '+ details.type +'</span><br><span>Trigger: '+ details.trigger +'</span><br><span>Offset: '+ details.offset +'</span><br><span>Direction: '+ details.direction +'</span></small>' )
											
										} ).on( 'scroll:end', function( e, details ){
											/** e => { 
															type: ( x-scroll | y-scroll )
															trigger: ( mousemove | mousewheel | click | keyboard )
															offset: // scrollbar position
															direction: ( up, down, left, right )
														}
											**/
											
											$('.details').html( '<small><strong>End Event</strong><br><br><span>Type: '+ details.type +'</span><br><span>Trigger: '+ details.trigger +'</span><br><span>Offset: '+ details.offset +'</span><br><span>Direction: '+ details.direction +'</span></small>' )
											
										} ).on( 'scroll:almost', function( e, details ){
											/** e => { 
															type: ( x-scroll | y-scroll )
															trigger: ( mousemove | mousewheel | click | keyboard )
															offset: // scrollbar position
															direction: ( up, down, left, right )
															position: ( initial, final )
														}
											**/
											
											$('.details').html( '<small><strong>Almost Event</strong><br><br><span>Type: '+ details.type +'</span><br><span>Trigger: '+ details.trigger +'</span><br><span>Offset: '+ details.offset +'</span><br><span>Direction: '+ details.direction +'</span><br><span>Position: '+ details.position +'</span></small>' )
											
										} )
									
		/** Take of scroll property form a container scrolled **/
			// $('.myContainer').unscroll() 
		
		/** Apply this scroll on every element that has className attribute .scrollbox ( no track events for this yet ) **/
		// Scroll( '.scrollbox', options )
		
		// setTimeout( function(){
			/** Set className "scrollbox" to $('.myContainer') and Scroll will be apply to it automatically
				* without any extra function call
				* 
				* Note: That works the same way when you append new 
				* 			 element with the className "scrollbox" to the DOM.
				* 			
				* 			 Every scrolling apply to each .scrollbox have the same scroll options defined
			**/
				// $('.myContainer').addClass('scrollbox') 
				// $('.details').html( '<small><strong>Scroll initialized on $(".scrollbox")</strong></small>' )
			
			/*
				setTimeout( function(){
					
						// $('.temporary').hide() 
						// $('.nowrap').hide() 
						// $('.myContainer').css('width', '400px' )
						// $('.myContainer').removeClass('scrollbox')
						
				}, 3000 )
				
				setTimeout( function(){ 
						
						// $('.temporary').show() 
						// $('.nowrap').show()
						// $('.myContainer').css('width', '800px' )
						// $('.myContainer').addClass('scrollbox')
						
				}, 8000 )
				*/
		// }, 1000 )
	} )