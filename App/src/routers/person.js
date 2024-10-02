const express = require("express");
const { check } = require('express-validator');
const router = express.Router();
const path = require("path");

const {SQLDB} = require( path.join(__dirname, '../database/database_init.js') );
const { requireAuth, requireAdmin, requireManager } = require( path.join(__dirname, '../util/permission_handler.js') );
const message_service = require( path.join(__dirname, '../util/service_message.js') );
const mountData = require( path.join(__dirname, '../util/data_mounter.js') );

router.get("/manage", requireAdmin, async function( request, response ) {
	response.render( 'manage_persons', await mountData( request, response, { found_results: {} } ) );
})

router.post("/manage", requireAdmin, [
        check('search').escape(),
    ], async function( request, response ) {
    const sSearchParam = "%" + request.body.search + "%";
    try {
        let [rows, fields] = await SQLDB.execute("SELECT * FROM view_person_essential WHERE person_id LIKE ? OR firstname LIKE ? OR surname LIKE ? OR email_private LIKE ? OR email_service LIKE ? LIMIT 100", [ sSearchParam, sSearchParam, sSearchParam, sSearchParam, sSearchParam ]);

        if ( rows.length >90 ){
            await message_service.setMessage( request, "warn", "Many results found. Limit was set at 100 rows." );
        }
        response.render( 'manage_persons', await mountData( request, response, { found_results: rows } ) );	
    }
    catch( e ){
        console.log( e );
        response.redirect("/home");
    }
})

router.get("/manage/:personid", requireAdmin, async ( request, response ) => {
	const nPersonID = request.params.personid;
	try {
		let [oPerson, _] = await SQLDB.execute("SELECT * FROM view_person_essential WHERE person_id = ?", [ nPersonID ]);

		let [oAdmin, __] = await SQLDB.execute("SELECT * FROM admin WHERE fk_person = ?", [ nPersonID ]);

		let [oManager, ___] = await SQLDB.execute("SELECT * FROM manager WHERE fk_person = ?", [ nPersonID ]);

		let [oStudent, ____] = await SQLDB.execute("SELECT * FROM student WHERE fk_person = ?", [ nPersonID ]);

		var bManager, bAdmin, bStudent;

		bAdmin = ( oAdmin[0] != null ) ? true : false;
		bManager = ( oManager[0] != null ) ? true : false;
		bStudent = ( oStudent[0] != null ) ? true : false;

		response.render( 'manage_single_user', await mountData( request, response, { person: oPerson[0], admin: bAdmin, manager: bManager, student: bStudent } ) );
	}
	catch( e ){
		console.log( e );
		response.redirect("/home");
	}
})

router.post("/edit/:personid", requireAdmin, async ( request, response ) => {
	const nPersonID = request.query.personid;
	const oBody = request.body;
	try {
		var bCheckAdmin, bCheckManager, bCheckStudent; 
		bCheckAdmin = oBody.ch_admin;
		bCheckManager = oBody.ch_manager;
		bCheckStudent = oBody.ch_student;

		if ( bCheckStudent ) {
			await SQLDB.execute("INSERT IGNORE INTO student (fk_person) VALUES ( ? )", [ nPersonID ]);
		}
		else {
			await SQLDB.execute("DELETE FROM student WHERE fk_person = ?", [ nPersonID ]);
		}

		if ( bCheckManager ) {
			await SQLDB.execute("INSERT IGNORE INTO manager (fk_person) VALUES ( ? )", [ nPersonID ]);
		}
		else {
			await SQLDB.execute("DELETE FROM manager WHERE fk_person = ?", [ nPersonID ]);
		}

		if ( bCheckAdmin ) {
			await SQLDB.execute("INSERT IGNORE INTO admin (fk_person) VALUES ( ? )", [ nPersonID ]);
		}
		else {
			await SQLDB.execute("DELETE FROM admin WHERE fk_person = ?", [ nPersonID ]);
		}

		response.redirect("/person/manage");
	}
	catch( e ){
		console.log( e );
		response.redirect("/home");
	}
})

router.get("/create", requireAdmin, async function( request, response ) {
	response.render( 'create_person_form', await mountData( request, response, {  } ) );
})

router.post("/create", requireAdmin, [
	check('form_input_firstname').escape(),
	check('form_input_surname').escape(),
	check('form_input_private_mail').isEmail().escape(),
	check('form_input_service_mail').isEmail().escape(),
	check('form_input_country').escape(),
	check('form_input_postcode').escape(),
	check('form_input_street').escape(),
	check('form_input_birthdate').escape()
  ], async function( request, response ) {
	const sFirstname = request.body.form_input_firstname;
	const sSurname = request.body.form_input_surname;
	const sPrivateEmail = request.body.form_input_private_mail;
	const sServiceEmail = request.body.form_input_service_mail;
	const sCountry = request.body.form_input_country;
	const sPostcode = request.body.form_input_postcode;
	const sStreet = request.body.form_input_street;
	const dBirthdate = request.body.form_input_birthdate;
	const sPassword = sFirstname + sSurname;

	try {
		const val = await user.createUser(
			sPrivateEmail, 
			sServiceEmail, 
			sPassword, 
			sFirstname, 
			sSurname, 
			dBirthdate, 
			sPostcode, 
			sCountry, 
			sStreet
		);
	
		let sMessageType = ( val === undefined || val === false ) ? "alert" : "success";
		let sMessageText = ( val === undefined || val === false ) ? "Error: Test user could not be created!" : "Success: Created new Person!";
		
		await message_service.setMessage( request, sMessageType, sMessageText );
		response.redirect("/home");
	}
	catch( e ) {
		console.log( e );
		response.redirect("/home");
	}
})

module.exports = router;