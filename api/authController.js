'use strict';

var User = require( '../models/user.model.js' );
var jwt = require( 'jsonwebtoken' );
var config = require( '../config' );

exports.index = function( req, res ) {

    // find the user
    User.findOne( {
        name: req.body.name
    }, function( err, user ) {

        if ( err ) {
            throw err;
        }

        if ( !user ) {
            res.json( {
                success: false,
                message: 'Authentication failed. User not found.'
            } );
        }
        else if ( user ) {
            user.comparePassword( req.body.password, function( err, isMatch ) {
                if ( err ) {
                    throw err;
                }

                if(!isMatch) {
                    return res.status( 200 ).json( {
                        success: false,
                        message: 'Authentication failed. Wrong password.'
                    } );
                }else{
					 var token = jwt.sign( user, config.secret, {
						expiresIn: 1440 // expires in 24 hours
					} );
					return res.status( 200 ).json( {
                        success: true,
                        message: 'Welcome',
						token : token
                    } );
				}

                

            } );
        }

    } );
};

exports.transaction = function( req, res ){
	// create a token
	var token = req.query.token;
	console.log(req.query.token);
	// return the information including token as JSON
	res.render( 'transactions', {
		token: token,
		title: 'Transactions Page'
	} );
}

exports.register = function( req, res ) {

    // find the user
    User.findOne( {
        name: req.body.name
    }, function( err, user ) {

        if ( err ) {
            throw err;
        }

        if ( user ) {
            res.json( {
                success: false,
                message: 'Register failed. Username is not free'
            } );
        }
        else {
            user = new User( {
                name: req.body.name,
                password: req.body.password
            } );
            user.save( function( err ) {
                if ( err ) {
                    return res.status( 200 ).json( {
                        success: false,
                        message: 'Registration failed'
                    } );
                }else{
					
					var token = jwt.sign( user, config.secret, {
						expiresIn: 1440 // expires in 24 hours
					} );
					return res.status( 200 ).json( {
                        success: true,
                        message: 'Thanks for registration',
						token: token
                    } );
					
				}

            } );
        }

    } );
};
