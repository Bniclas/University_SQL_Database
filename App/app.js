/**
 * Other Node Modules or self written modules
 */

const express = require("express");
const path = require("path");
const session = require("express-session");
const url = require("url");
const fileupload = require("express-fileupload");

const database = require( path.join(__dirname, '/src/database/database_init.js') );
const { isArray } = require("util");
const SQLDB = database.SQLDB;
const i18n = require("i18n-express");
const cookieParser = require('cookie-parser');
const bodyParser  = require('body-parser');
const compression = require("compression");

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
app.use(session({
	secret: 'secret',
	resave: true,
	saveUninitialized: true
}));
app.use(compression());
app.use(fileupload());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use( express.static( __dirname ) );
app.use( express.static( __dirname + "/public") );
app.use(i18n({
	translationsPath: path.join(__dirname, 'i18n'), // <--- use here. Specify translations files path.
	siteLangs: ["en","es"],
	textsVarName: 'translation',
	browserEnable: false
}));
app.set('views', path.join(__dirname, '/src/views') );
app.set('view engine', 'ejs');

const goHome = async( req, res ) => {
	res.redirect("/home");
}

app.get('/', async function(request, response) {
	goHome(request, response);
});

app.get('/home', async function(request, response) {
	response.render( 'home', {} );
});

app.get('/student_overview', async function(request, response) {
	var page = request.query.page;
	page = page - 1;
	const limit = 25;
	const lowerLimit = page * limit;

	try {
		await SQLDB.execute("SELECT * FROM view_student_information WHERE `Matriculation NUMBER` > ? ORDER BY `Matriculation NUMBER` ASC LIMIT 25;", [lowerLimit])
		.then( async([rows,fields]) => {
			response.render( 'student_overview', { student_data: rows } );
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
			response.render( 'course_overview', { course_data: rows } );
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
			await SQLDB.execute('SELECT * FROM view_course_mark_average WHERE courseid = ?', [courseid])
			.then( async([rows,fields]) => {
				if ( rows.length == 0 ){
					goHome(request, response);
				}
				else {
					response.render( 'course_mark_average', { course_data : rows, chosen: true } );
				}
			});
		}
		else {
			await SQLDB.execute('SELECT * FROM view_course_mark_average;', [])
			.then( async([rows,fields]) => {
				response.render( 'course_mark_average', { course_data : rows, chosen: false } );
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
			JOIN university_locations ON university_locations.location_id = department.fk_uniloc \
			LEFT JOIN job ON job.job_id = employee.fk_job \
			LEFT JOIN degree ON degree.degree_id = person.fk_degree \
			LEFT JOIN salary ON salary.salary_id = employee.fk_salary \
			LEFT JOIN currency ON currency.currency_id = salary.fk_currency ORDER BY employee_id ASC;",
		[lowerLimit])
		.then( async([rows,fields]) => {
			response.render( 'employee_overview', { employee_data: rows, chosen: false } );
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
			SELECT * FROM university_locations \
			INNER JOIN postcode ON postcode.postcode_code = university_locations.fk_postcode", 
		[])
		.then( async([rows,fields]) => {
			response.render( 'location_overview', { location_data: rows } );
		});
	}
	catch (e){
		console.log( e );
		goHome(request, response);
	}
});

console.log( "[App] Application is running ..." )
module.exports = app;
