'use strict';

var Transactions = require( '../models/transactions.model.js' );
var config = require( '../config' );
var Stripe = require( 'stripe' )( config.stripeApiKey );

exports.index = function( req, res, next ) {
    if ( req.body ) {
        var transaction = new Transactions( {
            name: req.body.name
        } );
        transaction.save( function( err, trans ) {
            if ( err ) {
                return console.log( err );
            }
            res.status( 200 ).end();
        } );
    }
};

exports.createTransaction = function( req, res, next ) {

    Stripe.charges.create( {
        amount: req.body.amount,
        currency: 'eur',
        card: req.body.token,
        description: 'Charge for test@example.com'
    }, 
	'sk_test_dMVctRUZEw9lWchktA0BojW0',
	function( err, charge ) {
        if ( err ) {
            return res.status( 200 ).json( {
						success: false,
                        message: err.message
                    } );;
        }
        var transaction = new Transactions( {
            transactionId: charge.id,
            amount: charge.amount,
            created: charge.created,
            currency: charge.currency,
            description: charge.description,
            paid: charge.paid,
            sourceId: charge.source.id
        } );
        transaction.save( function( err ) {
                if ( err ) {
                    return res.status( 200 ).json( {
						success: false,
                        message: err
                    } );
                }
                else {
                    return res.status( 200 ).json( {
						success: true,
                        message: 'Payment is created.'
                    } );
                }
            } );
            // asynchronously called
    } );
};
