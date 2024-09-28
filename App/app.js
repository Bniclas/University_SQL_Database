/**
 * Other Node Modules or self written modules
 */

const express = require("express");
const { check } = require('express-validator');
const path = require("path");
const session = require("express-session");
const url = require("url");
const fileupload = require("express-fileupload");
const { isArray } = require("util");

const i18n = require("i18n-express");
const helmet = require('helmet');
const { rateLimit } = require('express-rate-limit');
const cookieParser = require('cookie-parser');
const bodyParser  = require('body-parser');
const compression = require("compression");

const database = require( path.join(__dirname, '/src/database/database_init.js') );
const login = require( path.join(__dirname, '/src/database/login.js') );
const user = require( path.join(__dirname, '/src/database/user.js') );
const message_service = require( path.join(__dirname, '/src/util/service_message.js') );

const SQLDB = database.SQLDB;
database.InitDatabase();
user.createAdminUser();

/**
 * Routes
 */



/**
 * Creating the app
 */
const app = express();

/**
 * Setting up the middleware
 */
app.use( session({
	secret: process.env.SECRET_KEY, // A secret key used to sign the session ID cookie
	resave: false, // Forces the session to be saved back to the session store
	saveUninitialized: false, // Forces a session that is "uninitialized" to be saved to the store
	cookie: {
	  	maxAge: 3600000, // Sets the cookie expiration time in milliseconds (1 hour here)
	  	httpOnly: true, // Reduces client-side script control over the cookie
	  	secure: ( process.env.HTTPS_ONLY_SESSION == "true" || process.env.HTTPS_ONLY == "true"), // Ensures cookies are only sent over HTTPS
	}
}) );
app.use( compression() );
app.use( fileupload() );
app.use( express.json() );
app.use( express.urlencoded({ extended: true }) );
app.use( express.static( __dirname ) );
app.use( express.static( __dirname + "/public") );
app.use(i18n({
	translationsPath: path.join(__dirname, 'i18n'), // <--- use here. Specify translations files path.
	siteLangs: ["en","de"],
	textsVarName: 'translation',
	browserEnable: true
}));
app.use( helmet() );
app.use( rateLimit({
	windowMs: 3 * 60 * 1000, // 3 minutes
	limit: 100, // Limit each IP to 100 requests per `window` (here, per 3 minutes).
	standardHeaders: 'draft-7', // draft-6: `RateLimit-*` headers; draft-7: combined `RateLimit` header
	legacyHeaders: false, // Disable the `X-RateLimit-*` headers.
}) );

const requireAuth = async ( req, res, next ) => {
	if ( req.url === "/login" ) {
		next();
	}
	else {
		if ( !req.session.hasAuth ){
			await message_service.setMessage( req, "alert", "You are not authorized! Please login." );
			res.redirect("/login");
		}
		else {
			next();
		}
	}
}

const requireAdmin = async ( req, res, next ) => {
	if ( !req.session.isAdmin ){
		await message_service.setMessage( req, "alert", "You are not authorized! Only admins." );
		res.redirect("/home");
	}
	else {
		next();
	}
}

const requireManager = async ( req, res, next ) => {
	if ( !req.session.isManager ){
		await message_service.setMessage( req, "alert", "You are not authorized! Only managers." );
		res.redirect("/home");
	}
	else {
		next();
	}
}

app.use( requireAuth );

app.set( 'views', path.join(__dirname, '/src/views') );
app.set( 'view engine', 'ejs' );

const mountData = async( req, res, _others ) => {
	var data = {
		loginstatus: await user.getLoginStatus( req ),
		userid: await user.getUserID( req ),
		message: await message_service.getMessage( req ) || 'undefined',
	};
	await message_service.removeMessage( req );

	//Object.assign( data, _others );
	data = { ...data, ..._others };
	return data;
}

const goHome = async( req, res ) => {
	res.redirect("/home");
}

app.get('/', async function(request, response) {
	goHome(request, response);
});

app.get('/home', async function(request, response) {
	response.render( 'home', await mountData( request, response, {} ) );
});

app.get('/login', async function(request, response) {
	response.render( 'login_form', await mountData( request, response, {} ) );
});

app.get('/logout', async function(request, response) {
	login.doLogout( request, response );
});

app.post('/login', [
	check('form_input_email').escape(),
	check('form_input_password').escape(),
  ], async function( request, response ) {
	const sEmail = request.body.form_input_email;
	const sPassword = request.body.form_input_password;

	await login.checkLogin( request, response, sEmail, sPassword );
});

app.get('/student_overview', requireManager, async function(request, response) {
	var page = request.query.page;
	page = page - 1;
	const limit = 25;
	const lowerLimit = page * limit;

	try {
		await SQLDB.execute("SELECT * FROM view_student_information WHERE matric_number > ? ORDER BY matric_number ASC LIMIT 25;", [lowerLimit])
		.then( async([rows,fields]) => {
			response.render( 'student_overview', await mountData( request, response, {student_data: rows} ) );
		});
	}
	catch (e){
		console.log( e );
		goHome(request, response);
	}
});

app.post('/student_overview', requireManager, [
		check('search').escape(),
	], async function( request, response ) {
	const sSearchParam = "%" + request.body.search + "%";
	try {
		console.log( sSearchParam );
		await SQLDB.execute("SELECT * FROM view_student_information WHERE private_email LIKE ? OR service_email LIKE ? OR name LIKE ? OR address LIKE ? OR birthdate LIKE ? LIMIT 100;", [ sSearchParam, sSearchParam, sSearchParam, sSearchParam, sSearchParam])
		.then( async([rows,fields]) => {
			response.render( 'student_overview', await mountData( request, response, {student_data: rows} ) );
		});
	}
	catch( e ){
		console.log( e );
		response.redirect("/student_overview");
	}
});

app.get('/course_overview', async function(request, response) {
	try {
		await SQLDB.execute('SELECT * FROM view_course_student_amount;', [])
		.then( async([rows,fields]) => {
			response.render( 'course_overview', await mountData( request, response, { course_data: rows } ) );
		});
	}
	catch (e){
		console.log( e );
		goHome(request, response);
	}
});

app.get('/course_mark_average', async function(request, response) {
	const courseid = request.query.courseid;
	try {
		if ( courseid ) {
			const [course_data, _fields] = await SQLDB.execute('SELECT * FROM view_course_mark_average WHERE course = ?', [courseid]);


			if ( course_data.length == 0 ){	
				await message_service.setMessage( request, "info", "Sorry, no data found." );
				goHome(request, response);
				return;
			}

			const [marks_data, __fields] = await SQLDB.execute(" \
				SELECT exam.exam_nr, reached_mark, COUNT(*) as count FROM exam_result \
				JOIN exam ON exam.exam_nr = exam_result.fk_exam \
				WHERE fk_course = ? \
				GROUP BY exam.exam_nr, reached_mark \
				ORDER BY exam.exam_nr"
			,[courseid]);

			response.render( 'course_mark_average', await mountData( request, response, { course_data : course_data[0], mark_data: marks_data, chosen: true } ) );
		}
		else {
			await SQLDB.execute('SELECT * FROM view_course_mark_average;', [])
			.then( async([rows,fields]) => {
				response.render( 'course_mark_average', await mountData( request, response, { course_data : rows, chosen: false } ) );
			});
		}
	}
	catch (e){
		console.log( e );
		goHome(request, response);
	}
});

app.get('/employee_overview', requireManager, async function(request, response) {
	var iPage = request.query.page;
	iPage = iPage - 1;
	const limit = 25;
	const lowerLimit = iPage * limit;

	try {
		await SQLDB.execute(" \
			SELECT employee_id, degree_name, firstname, surname, email_service, department_name, location_name, salary_amount, currency_symbol FROM employee \
			JOIN person ON person.person_id = employee.fk_person \
			JOIN department_staff ON department_staff.fk_employee = employee.employee_id \
			JOIN department ON department.department_id = department_staff.fk_department \
			JOIN university_location ON university_location.location_id = department.fk_uniloc \
			LEFT JOIN job ON job.job_id = employee.fk_job \
			LEFT JOIN degree ON degree.degree_id = person.fk_degree \
			LEFT JOIN salary ON salary.salary_id = employee.fk_salary \
			LEFT JOIN currency ON currency.currency_id = salary.fk_currency ORDER BY employee_id ASC;",
		[lowerLimit])
		.then( async([rows,fields]) => {
			response.render( 'employee_overview', await mountData( request, response, { employee_data: rows, chosen: false } ) );
		});
	}
	catch (e){
		console.log( e );
		goHome(request, response);
	}
});

app.get('/location_overview', async function(request, response) {
	try {
		await SQLDB.execute(" \
			SELECT * FROM university_location \
			INNER JOIN postcode ON postcode.postcode_code = university_location.fk_postcode", 
		[])
		.then( async([rows,fields]) => {
			response.render( 'location_overview', await mountData( request, response, { location_data: rows } ) );
		});
	}
	catch (e){
		console.log( e );
		goHome(request, response);
	}
});

app.get('/schedule_overview', async function(request, response) {
	try {
		await SQLDB.execute(" \
			SELECT module_name, room_number, floor, SUBSTRING( start_at, 1, 16 ) as start_at, SUBSTRING( end_at, 1, 16 ) as end_at, location_name, location_id FROM course_session \
			JOIN course ON course.course_id = course_session.fk_course \
			JOIN timeslot ON timeslot.slot_id = course_session.fk_timeslot \
			JOIN room ON room.room_id = course_session.fk_room \
			JOIN semester ON semester.semester_id = course.fk_semester \
			JOIN module ON module.module_id = course.fk_module \
			JOIN employee ON employee.employee_id = course.fk_prof \
			JOIN person ON person.person_id = employee.fk_person \
			JOIN university_location ON university_location.location_id = room.fk_uniloc \
			WHERE start_at > NOW();",
		[])
		.then( async([rows,fields]) => {
			response.render( 'schedule_overview', await mountData( request, response, { schedule_data: rows } ) );
		});
	}
	catch (e){
		console.log( e );
		goHome(request, response);
	}
});

app.get("/myprofile", async function( request, response ) {
	const nPersonID = await user.getUserID( request );

	if ( nPersonID == null ){
		goHome( request, response );
		return;
	}

	try {
		var [mydata, fields] = await SQLDB.execute("SELECT * FROM view_person_essential WHERE person_id = ?", [ nPersonID ]);
		var [mycourses, fields] = await SQLDB.execute("SELECT * FROM view_person_course_essential WHERE person_id = ?", [ nPersonID ]);
	
		response.render( 'my_profile', await mountData( request, response, { mydata: mydata[0], mycourses: mycourses } ) );
	}
	catch( e ){
		console.log( e );
		response.redirect("/home");
	}
})

app.get("/create_person", requireAdmin, async function( request, response ) {
	response.render( 'create_person_form', await mountData( request, response, {  } ) );
})

app.post("/create_person", requireAdmin, [
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


app.get("/manage_persons", requireAdmin, async function( request, response ) {
	response.render( 'manage_persons', await mountData( request, response, { found_results: {} } ) );
})

app.post("/manage_persons", requireAdmin, [
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

app.get("/manage_specific_user", requireAdmin, async ( request, response ) => {
	const nPersonID = request.query.personid;
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

app.post("/editperson", requireAdmin, async ( request, response ) => {
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

		response.redirect("/manage_persons");
	}
	catch( e ){
		console.log( e );
		response.redirect("/home");
	}
})
	

console.log( "[App] Application is running ..." )
module.exports = app;
