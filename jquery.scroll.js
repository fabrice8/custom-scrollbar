	
	/* ---------------------------------------------------------------------------*/
	/*								Scroll Plugin for jQuery
	/* ---------------------------------------------------------------------------*/
	// Version: 1.0.0
	// Author: Fabrice K. Ekpetse
	// Created: 22/06/2018
	// Website: https://befagh.com/scroll/
	// Description: Apply personalized scrollbar to HTML elements in the DOM
	//						Handle X and Y scroll, moving, wheeling, keyboard( up, down, left, right ),
	//						by clicking on the scrollbar container, 
	//						Your can personalize the scrollbar and other intersting options ( read the doc )

	( function( factory ){
		
		if( typeof define === 'function' && define.amd )
			define( [ 'jquery' ], factory ) // AMD. Register as an anonymous module.
			
		else if( typeof module === 'object' && module.exports )
			module.exports = factory( require('jquery') ) // Node/CommonJS
			
		else factory( jQuery ) // Browser globals
		
	}( function( $ ){
		'use strict'
			var
			
			SCROLLING = {},
			SCROLL = new scrollEngine(),
			SCROLLBAR_CHANGE_RATIO = 3,
			SCROLLBARS_DATA = {}, // keep collective scroll options and single scroll initialize data for auto-update process
			SCROLLBARS_COUNT = 0
			
			function scrollVertical( $this, OPTIONS, update ){
				// Vertical scrollbar with container height overflow
					
					if( update ){
						// Update vertical scrollbar
						if( typeof $this.data('scroll-details') !== 'object' ) return
						
						var DETAILS = $this.data('scroll-details')
						
						// Update Vertical scrollbar
						if( DETAILS.fullHeight < ( $this[0].scrollHeight - $this[0].scrollTop ) )
							$this.data('y-scroll', true )
									.find('.scroll-v').removeClass('disable')
						
						// disable scrollbar when content no overflow
						else if( $this.data('y-scroll') )
							$this.data('y-scroll', false ) // signal that this container doesn't have Vertical scrollbar anymore
										.scrollTop(0) // set the container to his initial top position
										.find('.scroll-v').addClass('disable') // disable scrollbar
										.parent().find('.scroll-h').css( 'top', DETAILS.fullHeight - OPTIONS.scrollbarContainerSize )
					}
					else // Apply scrollbox configuration to this container
						$this.prepend( '<div class="scrollbarContainer scroll-v"><div class="scrollbar init"></div></div>' )
								.attr( 'data-y-scroll', true )
					
					setTimeout( function(){
						// one millisecond to execute process
						
						var SCROLL_DETAILS = {},
								$_ScrollbarContainerV = $this.find('.scrollbarContainer.scroll-v'),
								$_ScrollbarV = $_ScrollbarContainerV.find('.scrollbar')
						
						SCROLL_DETAILS.paddingX = parseInt( $this.css('paddingTop') ) + parseInt( $this.css('paddingBottom') )
						SCROLL_DETAILS.paddingY = parseInt( $this.css('paddingLeft') ) + parseInt( $this.css('paddingRight') )
						
						SCROLL_DETAILS.height = $this.height()
						SCROLL_DETAILS.fullHeight = $this.height() + SCROLL_DETAILS.paddingY
						SCROLL_DETAILS.scrollHeight = $this[0].scrollHeight
						SCROLL_DETAILS.scrollbarHeight = OPTIONS.scrollbarMinSize
						
						SCROLL_DETAILS.LimitY = SCROLL_DETAILS.fullHeight - OPTIONS.scrollbarMinSize
						SCROLL_DETAILS.ratioY = SCROLL_DETAILS.LimitY / ( SCROLL_DETAILS.scrollHeight - SCROLL_DETAILS.fullHeight )

						SCROLL_DETAILS.positionTop = 0
						SCROLL_DETAILS.almostPositionTop = 0
						
						if( SCROLL_DETAILS.ratioY > SCROLLBAR_CHANGE_RATIO ){
							
							SCROLL_DETAILS.scrollbarHeight = SCROLL_DETAILS.fullHeight - ( SCROLL_DETAILS.fullHeight * SCROLL_DETAILS.scrollbarHeight / SCROLL_DETAILS.scrollHeight )
							SCROLL_DETAILS.LimitY = SCROLL_DETAILS.fullHeight - SCROLL_DETAILS.scrollbarHeight
							SCROLL_DETAILS.ratioY = SCROLL_DETAILS.LimitY / ( SCROLL_DETAILS.scrollHeight - SCROLL_DETAILS.fullHeight )
						}
					
						$this.data('scroll-details', $.extend( $this.data('scroll-details'), SCROLL_DETAILS ) )
						
						$_ScrollbarContainerV.css({ 
																		width: OPTIONS.scrollbarWidth,
																		height: SCROLL_DETAILS.fullHeight, 
																		top: $this[0].scrollTop, 
																		left: $this[0].scrollLeft + $this.width() + SCROLL_DETAILS.paddingY - OPTIONS.scrollbarContainerSize,
																		backgroundColor: OPTIONS.scrollbarBackground,
																		padding: '0 '+ OPTIONS.scrollbarBorderWidth +'px'
																	})
						
						$_ScrollbarV.css({ 
														width: OPTIONS.scrollbarWidth, 
														height: SCROLL_DETAILS.scrollbarHeight +"px", 
														top: $this[0].scrollTop * SCROLL_DETAILS.ratioY, 
														backgroundColor: OPTIONS.scrollbarColor 
													})
						
						setTimeout( function(){ 
									
								// trigger INIT scroll event defined
								$this.trigger( 'scroll:init', [{ type: 'y-scroll' }] )
								
								// Delete animation attribute
								$_ScrollbarV.removeClass('init').children().removeClass('init')
						}, 400 )
						
						// update's value is TRUE means this container Events are already declared
						if( update ) return
						
						function scrollingY( posTop, callback, animated ){
							// Apply the scrolling step to the scrollbar
								var CONTENT_POSTOP = Math.ceil( posTop / $this.data('scroll-details').ratioY )
								
								$('.details').html( '<small><strong>Axe Y</strong> = [0, '+ $this.data('scroll-details').LimitY +'] >> '+ posTop +'</small>' )
								
								animated ? $_ScrollbarV.addClass('init') : null
								
								// update scrollbarContainer vertival position left in function
								$this.find('.scroll-h').css( 'top', ( CONTENT_POSTOP + $this.height() + $this.data('scroll-details').paddingY - OPTIONS.scrollbarContainerSize )+'px' )
								
								$_ScrollbarV.css("top", parseInt( posTop ) + 'px')
								$_ScrollbarContainerV.css("top", CONTENT_POSTOP + 'px');
								$this.scrollTop( CONTENT_POSTOP )
								
								$_ScrollbarV.hasClass('init') ? setTimeout( function(){ $_ScrollbarV.removeClass('init') }, 400 ) : null
								typeof callback === 'function' ? callback() : null
						}
						
						$_ScrollbarV.mousedown( function(e){
							// init scrolling by moving the scrollbar
						
							SCROLLING.t = $(this)
							SCROLLING.oy = e.clientY - $(this).position().top
							
							// trigger START scrolling event defined
							$this.trigger( 'scroll:start', [{ type: 'y-scroll', trigger: 'mousemove', offset: SCROLLING.oy }] )
							
						} ).parent().click( function(e){
							// scrolling by clicking on the scrollbar container
								
								if( $(e.target).hasClass('scrollbar') ) return
								
								var POSTop = $_ScrollbarV.position().top,
										DETAILS = $this.data('scroll-details'),
										LAST_POSTop = DETAILS.positionTop,
										directY
								
								if( POSTop >= 0 && POSTop <= DETAILS.LimitY ){
									
									if( ( e.clientY - $(this).offset().top ) > POSTop ){
										
										directY = 'down'
										DETAILS.positionTop = ( DETAILS.LimitY - POSTop ) < OPTIONS.stepScrollSize ? DETAILS.LimitY : POSTop + OPTIONS.stepScrollSize // défilement vers le bas
									} else {
										
										directY = 'up'
										DETAILS.positionTop = POSTop < OPTIONS.stepScrollSize ? 0 : POSTop - OPTIONS.stepScrollSize // défilement vers le haut
									}
									
									// trigger START scrolling event defined
									$this.trigger( 'scroll:start', [{ type: 'y-scroll', trigger: 'click', offset: LAST_POSTop, direction: directY }] )
									
									scrollingY( DETAILS.positionTop, function(){
																					// trigger END scrolling event defined
																					$this.trigger( 'scroll:end', [{ type: 'y-scroll', trigger: 'click', offset: DETAILS.positionTop, direction: directY }] )
																					
																					// trigger ALMOST ( initial or final position ) scrolling event defined
																					if( DETAILS.almostPositionTop = almostPosition( $_ScrollbarV.position().top, DETAILS.LimitY, OPTIONS.almostRatio ) )
																						$this.trigger( 'scroll:almost', [{ type: 'y-scroll', trigger: 'click', offset: DETAILS.positionTop, direction: directY, position: DETAILS.almostPositionTop }] )
																				}, true )
								}
						} )
						
						$this.mousemove( function(e){
							// moving scrollbar position
							
								if( $this.data('y-scroll') && SCROLLING.t.length && SCROLLING.oy ){
									
									var DETAILS = $this.data('scroll-details')
									
									DETAILS.positionTop = e.clientY - SCROLLING.oy
									
									if( DETAILS.positionTop > 0 && DETAILS.positionTop < DETAILS.LimitY )
										scrollingY( DETAILS.positionTop )
								}
						} )
						
						OPTIONS.wheel ?
									$this.mousewheel( function( event ){
										// scrolling by the mousewheel
											
											if( !$this.data('y-scroll') ) return
											
											var POSTop = $_ScrollbarV.position().top,
													DETAILS = $this.data('scroll-details'),
													LAST_POSTop = DETAILS.positionTop,
													directY
											
											if( POSTop >= 0 && parseInt( POSTop ) <= parseInt( DETAILS.LimitY ) ){
												// Activate the signal of verticalMousewheel ( important to disable the scroll horizontal the time scrolling verticaly )
												SCROLLING.verticalMousewheel = true
												
												if( event.deltaY == 1 ){
													
													directY = 'up'
													DETAILS.positionTop = POSTop < OPTIONS.stepScrollSize ? 0 : POSTop - OPTIONS.stepScrollSize
												} else {
													
													directY = 'down'
													DETAILS.positionTop = ( DETAILS.LimitY - POSTop ) < OPTIONS.stepScrollSize ? DETAILS.LimitY : POSTop + OPTIONS.stepScrollSize
												}
												
												// trigger START scrolling event defined
												$this.trigger( 'scroll:start', [{ type: 'y-scroll', trigger: 'mousewheel', offset: LAST_POSTop, direction: directY }] )
												
												scrollingY( DETAILS.positionTop, function(){
																								// trigger END scrolling event defined
																								$this.trigger( 'scroll:end', [{ type: 'y-scroll', trigger: 'mousewheel', offset: DETAILS.positionTop, direction: directY }] )
																								
																								// trigger ALMOST ( initial or final position ) scrolling event defined
																								if( DETAILS.almostPositionTop = almostPosition( $_ScrollbarV.position().top, DETAILS.LimitY, OPTIONS.almostRatio ) )
																									$this.trigger( 'scroll:almost', [{ type: 'y-scroll', trigger: 'mousewheel', offset: DETAILS.positionTop, direction: directY, position: DETAILS.almostPositionTop }] )
																							}, true )
											}
											
											if( POSTop == 0 || POSTop >= ( DETAILS.LimitY - 0.1 ) ) SCROLLING.verticalMousewheel = false // verticalMousewheel inactive
									} ) : null
						
						$(document).mouseup(function(e){
							// End scrolling
							
							if( !SCROLLING.t ) return
							
							// trigger END scrolling event defined
							$this.trigger( 'scroll:end', [{ type: 'y-scroll', trigger: 'mousemove', offset: SCROLLING.oy }] )
							
							var DETAILS = $this.data('scroll-details')
							
							// trigger ALMOST ( initial or final position ) scrolling event defined
							if( DETAILS.almostPositionTop = almostPosition( $_ScrollbarV.position().top, DETAILS.LimitY, OPTIONS.almostRatio ) )
								$this.trigger( 'scroll:almost', [{ type: 'y-scroll', trigger: 'mousemove', offset: SCROLLING.oy, position: DETAILS.almostPositionTop }] )
							
							SCROLLING = {}

						}).keydown( function(e){
							// Scrolling by UP and  DOWN keyboards
							
								if( $this.data('scroll') == 'disable' || ( e.keyCode != 38 && e.keyCode != 40 ) ) return
							
								var POSTop = $this.find('.scroll-v .scrollbar').position().top,
										DETAILS = $this.data('scroll-details'),
										LAST_POSTop = DETAILS.positionTop,
										directY
								
								if( POSTop >= 0 && POSTop <= DETAILS.LimitY + 1 ){
									e.preventDefault()
									
									if( e.keyCode == 38 ){
										
										directY = 'up'
										DETAILS.positionTop = POSTop < OPTIONS.stepScrollSize ? 0 : POSTop - OPTIONS.stepScrollSize // défilement vers le haut
									}
									
									else if ( e.keyCode == 40 ){
										
										directY = 'down'
										DETAILS.positionTop = ( DETAILS.LimitY - POSTop ) < OPTIONS.stepScrollSize ? DETAILS.LimitY : POSTop + OPTIONS.stepScrollSize // défilement vers le bas
									}
									
									// trigger START scrolling event defined
									$this.trigger( 'scroll:start', [{ type: 'y-scroll', trigger: 'keyboard', offset: LAST_POSTop, direction: directY, keycode: e.keyCode }] )
								
									scrollingY( DETAILS.positionTop, function(){
																					// trigger END scrolling event defined
																					$this.trigger( 'scroll:end', [{ type: 'y-scroll', trigger: 'keyboard', offset: DETAILS.positionTop, direction: directY, keycode: e.keyCode }] )
																					
																					// trigger ALMOST ( initial or final position ) scrolling event defined
																					if( DETAILS.almostPositionTop = almostPosition( $_ScrollbarV.position().top, DETAILS.LimitY, OPTIONS.almostRatio ) )
																						$this.trigger( 'scroll:almost', [{ type: 'y-scroll', trigger: 'keyboard', offset: DETAILS.positionTop, direction: directY, position: DETAILS.almostPositionTop, keycode: e.keyCode }] )
																				}, true )
								}
						} )
					}, 1 )
			}
			
			function scrollHorizontal( $this, OPTIONS, update ){
				// Horizontal scrollbar with container width overflow
				
					if( update ){
						// Update Horizontal scrollbar
						if( typeof $this.data('scroll-details') !== 'object' ) return
						
						var DETAILS = $this.data('scroll-details')
						
						// Update Horizontal scrollbar
						if( DETAILS.fullWidth < ( $this[0].scrollWidth - $this[0].scrollLeft - ( $this.find('.scroll-v').length ? OPTIONS.scrollbarContainerSize : 0 ) ) )
							$this.data('x-scroll', true )
									.find('.scroll-h').removeClass('disable')
						
						// disable scrollbar when content no overflow
						else if( $this.data('x-scroll') )
							$this.data('x-scroll', false ) // signal that this container doesn't have Horizontal scrollbar anymore
										.scrollLeft(0) // set the container to his initial left position
										.find('.scroll-h').addClass('disable') // disable scrollbar
										.parent().find('.scroll-v').css( 'left', DETAILS.fullWidth - OPTIONS.scrollbarContainerSize )
					}
					else // Apply scrollbox configuration to this container
						$this.prepend( '<div class="scrollbarContainer scroll-h"><div class="scrollbar init"></div></div>' )
								.attr( 'data-x-scroll', true )
					
					setTimeout( function(){
						// one millisecond to apply execute DOM elements dimensionment process
						
						var SCROLL_DETAILS = {},
								$_ScrollbarContainerH = $this.find('.scrollbarContainer.scroll-h'),
								$_ScrollbarH = $_ScrollbarContainerH.find('.scrollbar')
						
						SCROLL_DETAILS.paddingX = parseInt( $this.css('paddingTop') ) + parseInt( $this.css('paddingBottom') )
						SCROLL_DETAILS.paddingY = parseInt( $this.css('paddingLeft') ) + parseInt( $this.css('paddingRight') )
						
						SCROLL_DETAILS.width = $this.width()
						SCROLL_DETAILS.fullWidth = $this.width() + SCROLL_DETAILS.paddingX - ( $this.data('y-scroll') ? OPTIONS.scrollbarContainerSize : 0 )
						SCROLL_DETAILS.scrollWidth = $this[0].scrollWidth
						SCROLL_DETAILS.scrollbarWidth = OPTIONS.scrollbarMinSize
						
						SCROLL_DETAILS.LimitX = SCROLL_DETAILS.fullWidth - OPTIONS.scrollbarMinSize
						SCROLL_DETAILS.ratioX = SCROLL_DETAILS.LimitX / ( SCROLL_DETAILS.scrollWidth - SCROLL_DETAILS.paddingX - SCROLL_DETAILS.width )

						SCROLL_DETAILS.positionLeft = 0
						SCROLL_DETAILS.almostPositionLeft = 0
						
						if( SCROLL_DETAILS.ratioX > SCROLLBAR_CHANGE_RATIO ){
							
							SCROLL_DETAILS.scrollbarWidth = SCROLL_DETAILS.fullWidth - ( SCROLL_DETAILS.fullWidth * SCROLL_DETAILS.scrollbarWidth / SCROLL_DETAILS.scrollWidth )
							SCROLL_DETAILS.LimitX = SCROLL_DETAILS.fullWidth - SCROLL_DETAILS.scrollbarWidth
							SCROLL_DETAILS.ratioX = SCROLL_DETAILS.LimitX / ( SCROLL_DETAILS.scrollWidth - SCROLL_DETAILS.paddingX - SCROLL_DETAILS.width )
						}
						
						$this.data('scroll-details', $.extend( $this.data('scroll-details'), SCROLL_DETAILS ) )
						
						$_ScrollbarContainerH.css({ 
																		width: SCROLL_DETAILS.fullWidth, 
																		height: OPTIONS.scrollbarWidth,
																		left: $this[0].scrollLeft, 
																		top: $this[0].scrollTop + $this.height() + SCROLL_DETAILS.paddingY - OPTIONS.scrollbarContainerSize, 
																		backgroundColor: OPTIONS.scrollbarBackground,
																		padding: OPTIONS.scrollbarBorderWidth +'px 0'
																	})
						
						$_ScrollbarH.css({ 
														width: SCROLL_DETAILS.scrollbarWidth +"px", 
														height: OPTIONS.scrollbarWidth, 
														left: $this[0].scrollLeft * SCROLL_DETAILS.ratioX, 
														backgroundColor: OPTIONS.scrollbarColor 
													})
						
						setTimeout( function(){
									
								// trigger INIT scroll event defined
								$this.trigger( 'scroll:init', [{ type: 'x-scroll' }] )
								
								// Delete animation attribute
								$_ScrollbarH.removeClass('init')
						}, 400 )
					
						// update's value is TRUE means this container Events are already declared
						if( update ) return
						
						function scrollingX( posLeft, callback, animated ){
							// Apply the scrolling step to the scrollbar
								var CONTENT_POSLEFT = Math.ceil( posLeft / $this.data('scroll-details').ratioX )
							
								// if( CONTENT_POSLEFT < ( $this[0].scrollWidth - $this.data('scroll-details').fullWidth - OPTIONS.scrollbarContainerSize ) ){
										
									$('.details').html( '<small><strong>Axe X</strong> = [0, '+ $this.data('scroll-details').LimitX +'] >> '+ posLeft +'</small>' )
									
									animated ? $_ScrollbarH.addClass('init') : null
									
									// update scrollbarContainer vertival position left in function
									$this.find('.scroll-v').css( 'left', ( CONTENT_POSLEFT + $this.data('scroll-details').fullWidth )+'px' )
									
									$_ScrollbarH.css( "left", posLeft + 'px')
									$_ScrollbarContainerH.css( "left", CONTENT_POSLEFT + 'px');
									$this.scrollLeft( CONTENT_POSLEFT )
								
									$_ScrollbarH.hasClass('init') ? setTimeout( function(){ $_ScrollbarH.removeClass('init') }, 400 ) : null
									typeof callback === 'function' ? callback() : null
								// }
						}
						
						$_ScrollbarH.mousedown( function(e){
							// init scrolling by moving the scrollbar
							
							SCROLLING.t = $(this)
							SCROLLING.ox = e.clientX - $(this).position().left
							
							// trigger START scrolling event defined
							$this.trigger( 'scroll:start', [{ type: 'x-scroll', trigger: 'mousemove', offset: SCROLLING.ox }] )
							
						} ).parent().click( function(e){
								// scrolling by clicking on the scrollbar container
								
								if( $(e.target).hasClass('scrollbar') ) return
								
								var POSLeft = $_ScrollbarH.position().left,
										DETAILS = $this.data('scroll-details'),
										LAST_POSLeft = DETAILS.positionLeft,
										directX
								
								if( POSLeft >= 0 && POSLeft <= DETAILS.LimitX ){
									
									if( ( e.clientX - $(this).offset().left ) > POSLeft ){
										
										directX = 'right'
										DETAILS.positionLeft = ( DETAILS.LimitX - POSLeft ) < OPTIONS.stepScrollSize ? DETAILS.LimitX : POSLeft + OPTIONS.stepScrollSize// scroll to right
									} else {
										
										directX = 'left'
										DETAILS.positionLeft = POSLeft < OPTIONS.stepScrollSize ? 0 : POSLeft - OPTIONS.stepScrollSize // scroll to left
									}
									
									// trigger START scrolling event defined
									$this.trigger( 'scroll:start', [{ type: 'x-scroll', trigger: 'click', offset: LAST_POSLeft, direction: directX }] )
									
									scrollingX( DETAILS.positionLeft, function(){
																					// trigger END scrolling event defined
																					$this.trigger( 'scroll:end', [{ type: 'x-scroll', trigger: 'click', offset: DETAILS.positionLeft, direction: directX }] )
																					
																					// trigger ALMOST ( initial or final position ) scrolling event defined
																					if( DETAILS.almostPositionLeft = almostPosition( $_ScrollbarH.position().left, DETAILS.LimitX, OPTIONS.almostRatio ) )
																						$this.trigger( 'scroll:almost', [{ type: 'x-scroll', trigger: 'click', offset: DETAILS.positionLeft, direction: directX, position: DETAILS.almostPositionLeft }] )
																				}, true )
								}
						} )
						
						$this.mousemove( function(e){
							// moving scrollbar position
							
								if( $this.data('x-scroll') && SCROLLING.t.length && SCROLLING.ox ){
									
									var DETAILS = $this.data('scroll-details')
									
									DETAILS.positionLeft = e.clientX - SCROLLING.ox
									
									if( DETAILS.positionLeft > 0 && DETAILS.positionLeft < DETAILS.LimitX )
										scrollingX( DETAILS.positionLeft )
								}
						} )
						
						OPTIONS.wheel ?
									$this.mousewheel( function( event ){
										// scrolling by the mousewheel
										
											if( !$this.data('x-scroll') ) return
											
											// when scrolling by mousewheel is not allow or Vertical mousewheel scrolling is actif
											if( SCROLLING.verticalMousewheel ) return
										
											var POSLeft = $_ScrollbarH.position().left,
													DETAILS = $this.data('scroll-details'),
													LAST_POSLeft = DETAILS.positionLeft,
													directX
											
											if( POSLeft >= 0 && parseInt( POSLeft ) <= parseInt( DETAILS.LimitX ) ){
												
												if( event.deltaY == 1 ){
													
													directX = 'right'
													DETAILS.positionLeft = ( DETAILS.LimitX - POSLeft ) < OPTIONS.stepScrollSize ? DETAILS.LimitX : POSLeft + OPTIONS.stepScrollSize
												} else {
													
													directX = 'left'
													DETAILS.positionLeft = POSLeft < OPTIONS.stepScrollSize ? 0 : POSLeft - OPTIONS.stepScrollSize
												}
												
												// trigger START scrolling event defined
												$this.trigger( 'scroll:start', [{ type: 'x-scroll', trigger: 'mousewheel', offset: LAST_POSLeft, direction: directX }] )
												
												scrollingX( DETAILS.positionLeft, function(){
																								// trigger END scrolling event defined
																								$this.trigger( 'scroll:end', [{ type: 'x-scroll', trigger: 'mousewheel', offset: DETAILS.positionLeft, direction: directX }] )
																								
																								// trigger ALMOST ( initial or final position ) scrolling event defined
																								if( DETAILS.almostPositionLeft = almostPosition( $_ScrollbarH.position().left, DETAILS.LimitX, OPTIONS.almostRatio ) )
																									$this.trigger( 'scroll:almost', [{ type: 'x-scroll', trigger: 'mousewheel', offset: DETAILS.positionLeft, direction: directX, position: DETAILS.almostPositionLeft }] )
																							}, true )
											}
									} ) : null
						
						$(document).mouseup( function(e){
							// End scrolling
							
							if( !SCROLLING.t ) return
							
							var DETAILS = $this.data('scroll-details')
							
							// trigger END scrolling event defined
							$this.trigger( 'scroll:end', [{ type: 'x-scroll', trigger: 'mousemove', offset: SCROLLING.ox }] )
							
							// trigger ALMOST ( initial or final position ) scrolling event defined
							if( DETAILS.almostPositionLeft = almostPosition( $_ScrollbarH.position().left, DETAILS.LimitX, OPTIONS.almostRatio ) )
								$this.trigger( 'scroll:almost', [{ type: 'x-scroll', trigger: 'mousemove', offset: SCROLLING.ox, position: DETAILS.almostPositionLeft }] )
							
							SCROLLING = {}

						} ).keydown( function(e){
							// Scrolling by LEFT and RIGHT keyboards
							
								if( $this.data('scroll') == 'disable' || ( e.keyCode != 37 && e.keyCode != 39 ) ) return
							
								var POSLeft = $this.find('.scroll-h .scrollbar').position().left,
										DETAILS = $this.data('scroll-details'),
										LAST_POSLeft = DETAILS.positionLeft,
										directX
								
								if( POSLeft >= 0 && POSLeft <= DETAILS.LimitX ){
									e.preventDefault()
									
									if( e.keyCode == 37 ){
										
										directX = 'left'
										DETAILS.positionLeft = POSLeft < OPTIONS.stepScrollSize ? 0 : POSLeft - OPTIONS.stepScrollSize
									}
									
									else if ( e.keyCode == 39 ){
										
										directX = 'right'
										DETAILS.positionLeft = ( DETAILS.LimitX - POSLeft ) < OPTIONS.stepScrollSize ? DETAILS.LimitX : POSLeft + OPTIONS.stepScrollSize // défilement vers le bas
									}
									
									// trigger START scrolling event defined
									$this.trigger( 'scroll:start', [{ type: 'x-scroll', trigger: 'keyboard', offset: LAST_POSLeft, direction: directX, keycode: e.keyCode }] )
								
									scrollingX( DETAILS.positionLeft, function(){
																					// trigger END scrolling event defined
																					$this.trigger( 'scroll:end', [{ type: 'x-scroll', trigger: 'keyboard', offset: DETAILS.positionLeft, direction: directX, keycode: e.keyCode }] )
																					
																					// trigger ALMOST ( initial or final position ) scrolling event defined
																					if( DETAILS.almostPositionLeft = almostPosition( $this.find('.scroll-h .scrollbar').position().left, DETAILS.LimitX, OPTIONS.almostRatio ) )
																						$this.trigger( 'scroll:almost', [{ type: 'x-scroll', trigger: 'keyboard', offset: DETAILS.positionLeft, direction: directX, position: DETAILS.almostPositionLeft, keycode: e.keyCode }] )
																				}, true )
								}
						} )
					}, 1 )
			}
			
			function almostPosition( position, finalLimit, almostRatio ){
				
				if( !position ) return false
				
				if( position / finalLimit < almostRatio )
					return 'initial'
				
				else if( ( finalLimit - position ) / finalLimit < almostRatio )
					return 'final'
				
				return false
			}
			
			function scrollEngine(){
				// core methods for scroll process
				var THIS = this
				
				this.init = function( options ){
					// Analyse entrance data
					
					// Defaults scroll for small media screen devices ( small tablette, mobile ...)
					if( $(window).width() <= 992 ){
						
						this.css( 'overflow', 'auto' )
						return
					}
					
					// Test if scroll has been already applied to this container ( continue otherwise )
					if( this.data('scroll') && SCROLLBARS_DATA.hasOwnProperty( this.data('scroll-ID') ) ) return
					
					// Defauts options
					THIS.options = $.extend( {
																	wheel: true,
																	almostRatio: 0.1, // 10% of the scroll way
																	stepScrollSize: 50,
																	scrollbarWidth: 6,
																	scrollbarMinSize: 80,
																	scrollbarBorderWidth: 2,
																	scrollbarColor: 'rgba(120, 120, 120, .8)',
																	scrollbarBackground: 'none'
																}, options )
					
					// Calculate the scrollbar Container Size ( sillouette )
					THIS.options.scrollbarContainerSize = THIS.options.scrollbarWidth + ( THIS.options.scrollbarBorderWidth * 2 )
					
					// wheel scrolling on when jQuery mousewheel plugin is loaded
					if( !$.fn.hasOwnProperty('mousewheel') ) THIS.options.wheel = false
					
					// Applying the scroll plugins to the DOM elements assigned
					return this.each( function(){ THIS.apply( $(this) ) } )
				}
				
				this.apply = function( $this ){
					// test and apply scrollbars to this container
					
					THIS.options.width = $this.width() + parseInt( $this.css('paddingLeft') ) + parseInt( $this.css('paddingRight') ),
					THIS.options.height = $this.height() + parseInt( $this.css('paddingTop') ) + parseInt( $this.css('paddingBottom') )
					
					
					// Vertical scrollbar with container height overflow
					if( THIS.options.height < $this[0].scrollHeight ){
						
						$this.attr('data-scroll-details', {} )
						scrollVertical( $this, THIS.options ) // Create new scrollbar
					}
					
					// Horizontal scrollbar with container width overflow
					if( THIS.options.width < $this[0].scrollWidth ){
						
						!$this.data('scroll-details') ? $this.attr('data-scroll-details', {} ) : null
						scrollHorizontal( $this, THIS.options ) // Create new scrollbar
					}
					
					
					// Declarer ce scroll comme active
					if( !$this.data('scroll') && ( $this.data('x-scroll') || $this.data('y-scroll') ) ){
						
						// Create new ID for this scoll container
						THIS.id = 'scroll-container-'+( ++SCROLLBARS_COUNT )
						
						// Set fundamental scroll plugin attributes
						$this.attr({ 'data-scroll-ID': THIS.id , 'data-scroll': 'disable' })
						
						// keep record on the initial sizes of this container ( for auto-updating when it changed )
						SCROLLBARS_DATA[ THIS.id ] = $this
					}
				}
				
				this.update = function( DATA ){
					// Update a specific scroll container
					
					for( var item in SCROLLBARS_DATA )
						if( SCROLLBARS_DATA[ item ].length ){
							// single scrollbars
							
							if( item === SCROLLBARS_DATA[ item ].attr('data-scroll-ID') ){
								// check all scroll containers still valid
								var $_THIS = SCROLLBARS_DATA[ item ],
										DATA = $_THIS.data('scroll-details')
								
								if( ( DATA.height && DATA.height != $_THIS.height() ) || ( DATA.scrollHeight && DATA.scrollHeight != $_THIS[0].scrollHeight ) )
									scrollVertical( $_THIS, THIS.options, true )
								
								if( ( DATA.width && DATA.width != $_THIS.width() ) || ( DATA.scrollWidth && DATA.scrollWidth != $_THIS[0].scrollWidth ) )
									scrollHorizontal( $_THIS, THIS.options, true )
							}
						}
						else
							/** init scroll function to new DOM elements that have
								* the className specified but hasn't been created when init 
								* the global scroll on this className 
							**/
								$( item +':not([data-scroll])').scroll( SCROLLBARS_DATA[ item ] )
				}
				
				this.remove = function(){
					
					return this.each( function(){
						
						if( !$(this).data('scroll') ) return
						
						// Delete for auto-update containers list
						delete SCROLLBARS_DATA[ $(this).data('scroll-ID') ]
						
						// remove scroll attributes
						$(this).removeAttr( 'data-scroll' )
									.removeAttr( 'data-scroll-ID' )
									.removeAttr( 'data-x-scroll' )
									.removeAttr( 'data-y-scroll' )
									.find('.scrollbarContainer').remove() // remove scrollbars setted
					} )
				}
			}
			
			if( typeof $ !== 'undefined' && $.hasOwnProperty( 'fn' ) ){
				
				$.fn.scroll = SCROLL.init // test and add new scrollbars
				$.fn.unscroll = SCROLL.remove // remove scroll from container
				setInterval( SCROLL.update, 50 ) // scrollbar containers will be auto-update every 50
			}
			else throw new Error( 'Scroll\'s Javascript require jQuery' )
			
			$(document).on( 'click', '[data-scroll]', function(e){
				// Active the scroll box targeted
				
				$('[data-scroll]').data('scroll', 'disable' )
				$(this).data('scroll', 'active')
			} )
			
			window.Scroll = function( className, options ){
				/** Allow scroll to handle every container tha have
					* this className even if it has been in 
					* the DOM created later 
				**/
					if( $(className).length )
						$(className).scroll( options ) // init scroll on the existant containers
					
					SCROLLBARS_DATA[ className ] = ( options || false ) // storage as collective scroll options for update process
					
					return $(className)
			}
	} ) )