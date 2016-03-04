'use strict';

/*global Stripe:true*/
/*global $form:true*/

//set Public key for Stripe payments
Stripe.setPublishableKey( 'pk_test_6pRNASCoBOKtIshFeQd4XMUh' );
var isSubmit = false;
$( document ).ready( function() {
    $( '#submittransaction' ).click( function() {
        var create_transaction = $(this);
		create_transaction.attr('disabled','disabled');
		create_transaction.val("Sending data . . .");
		$( '.alert' ).hide();
        if ( !isSubmit ) {
            Stripe.card.createToken( {
                number: $( '.card-number' ).val(),
                cvc: $( '.card-cvc' ).val(),
                exp_month: $( '.card-expiry-month' ).val(),
                exp_year: $( '.card-expiry-year' ).val()
            }, function( status, response ) {
                if ( response.error ) {
                    // Show the errors on the form
					$( '.payment-errors' ).show();
                    $( '.payment-errors' ).text( response.error.message );
					create_transaction.removeAttr('disabled');
					create_transaction.val("Submit");
                }
                else {
                    // response contains id and card, which contains additional card details
                    var token = response.id;
                    // Insert the token into the form so it gets submitted to the server
                    $('form').append( $( '<input type="hidden" name="stripeToken" />' ).val( token ) );
                    // and submit
                    $.ajax( {
                        url: '/createtransaction',
                        type: 'POST',
                        headers: {
                            'x-access-token': $( '#token' ).html()
                        },
                        data: {
                            amount: $( '#amount' ).val(),
                            currency: $( '#currency' ).val(),
                            token: token
                        }
                    } ).done( function( response ) {
						var data = response;
                        if ( response.success == true ) {
							$( '.payment-success' ).show();
                            $( '.payment-success' ).text( "Transaction token ID : " + response.message );
							$('form').find(':input').each(function() {
								 switch(this.type) {
										case 'text':
											$(this).val('');
											break;
										case 'number':
											$(this).val('');
											break;
									 }
							});
                        }else{
							$( '.payment-errors' ).show();
                            $( '.payment-errors' ).text( "Transaction token ID : " + response.message );
							$('form').find(':input').each(function() {
								 switch(this.type) {
										case 'text':
											$(this).val('');
											break;
										case 'number':
											$(this).val('');
											break;
									 }
							});
						}
						create_transaction.removeAttr('disabled');
						create_transaction.val("Submit");
                    } );
                }

            } );
        }

    } );
} );
