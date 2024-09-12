/**
 * Other Node Modules or self written modules
 */

const express = require("express");
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

const database = require( path.join(__dirname, '/src/dataservice/database_init.js') );
const login = require( path.join(__dirname, '/src/dataservice/login.js') );
const user = require( path.join(__dirname, '/src/dataservice/user.js') );

const SQLDB = database.SQLDB;
database.InitDatabase();

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
	browserEnable: false
}));
app.use( helmet() );
app.use( rateLimit({
	windowMs: 15 * 60 * 1000, // 15 minutes
	limit: 100, // Limit each IP to 100 requests per `window` (here, per 15 minutes).
	standardHeaders: 'draft-7', // draft-6: `RateLimit-*` headers; draft-7: combined `RateLimit` header
	legacyHeaders: false, // Disable the `X-RateLimit-*` headers.
}) );

const requireAuth = ( req, res, next ) => {
	if ( req.url === "/login" ) {
		next();
	}
	else {
		if ( !req.session.hasAuth ){
			res.redirect("/login");
		}
		else {
			next();
		}
	}
}

app.use( requireAuth );

app.set( 'views', path.join(__dirname, '/src/views') );
app.set( 'view engine', 'ejs' );

const createMessage = async( type, text ) => {
	const _message = {
		type: type,
		text: text
	}

	return _message;
}

const mountData = async( req, res, _others ) => {
	var data = {
		loginstatus: await user.getLoginStatus( req ),
		userid: await user.getUserID( req ),
		message: _others.message || 'undefined',
	};

	Object.assign( data, _others );
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

app.post('/login', async function( request, response ) {
	const input_email = request.body.form_input_email;
	const input_password = request.body.form_input_password;

	await login.checkLogin( request, response, input_email, input_password );
});

app.get('/student_overview', async function(request, response) {
	var page = request.query.page;
	page = page - 1;
	const limit = 25;
	const lowerLimit = page * limit;

	try {
		await SQLDB.execute("SELECT * FROM view_student_information WHERE `Matriculation NUMBER` > ? ORDER BY `Matriculation NUMBER` ASC LIMIT 25;", [lowerLimit])
		.then( async([rows,fields]) => {
			response.render( 'student_overview', await mountData( request, response, {student_data: rows} ) );
		});
	}
	catch (e){
		console.log( e );
		goHome(request, response);
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
			const [course_data, _fields] = await SQLDB.execute('SELECT * FROM view_course_mark_average WHERE courseid = ?', [courseid]);

			if ( course_data.length == 0 ){
				goHome(request, response);
			}

			const [marks_data, __fields] = await SQLDB.execute(" \
				SELECT reached_mark, COUNT(*) as count FROM exam_result \
				JOIN exam ON exam.exam_nr = exam_result.fk_exam \
				WHERE fk_course = ? \
				GROUP BY reached_mark"
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

app.get('/employee_overview', async function(request, response) {
	var page = request.query.page;
	page = page - 1;
	const limit = 25;
	const lowerLimit = page * limit;

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
	const personid = await user.getUserID( request );

	if ( personid == null ){
		goHome( request, response );
		return;
	}

	var [mydata, fields] = await SQLDB.execute("SELECT * FROM view_person_essential WHERE person_id = ?", [ personid ]);
	var [mycourses, fields] = await SQLDB.execute("SELECT * FROM view_person_course_essential WHERE person_id = ?", [ personid ]);

	response.render( 'my_profile', await mountData( request, response, { mydata: mydata[0], mycourses: mycourses } ) );
})

app.get("/create_person", async function( request, response ) {
/*	const val = await user.createUser(
		"m", 
		"admin@me.de", 
		"admin@service.de", 
		"123", 
		"Amara", 
		"Amstrand", 
		"26.02.2004", 
		"01231", 
		"Himalaya", 
		"Gebirgsstrasse"
	)

	var messageType = "success";
	var messageText = "Created Test User!";

	if ( val === undefined || val === false ){
		messageType = "alert";
		messageText = "Error: Test user could not be created!";
	}

	response.render( 'home', await mountData( request, response, { message: await createMessage(messageType, messageText) } ) );*/

	response.render( 'create_person_form', await mountData( request, response, {  } ) );
})

app.post("/create_person", async function( request, response ) {
	const sFirstname = request.body.form_input_firstname;
	const sSurname = request.body.form_input_surname;
	const sPrivateEmail = request.body.form_input_private_mail;
	const sServiceEmail = request.body.form_input_service_mail;
	const sCountry = request.body.form_input_country;
	const sPostcode = request.body.form_input_postcode;
	const sStreet = request.body.form_input_street;
	const dBirthdate = request.body.form_input_birthdate;

	const val = await user.createUser(
		"d", 
		sPrivateEmail, 
		sServiceEmail, 
		"123", 
		sFirstname, 
		sSurname, 
		dBirthdate, 
		sPostcode, 
		sCountry, 
		sStreet
	)

	var messageType = "success";
	var messageText = "Created Test User!";

	if ( val === undefined || val === false ){
		messageType = "alert";
		messageText = "Error: Test user could not be created!";
	}

	response.render( 'home', await mountData( request, response, { message: await createMessage(messageType, messageText) } ) );
})
	

console.log( "[App] Application is running ..." )
module.exports = app;
