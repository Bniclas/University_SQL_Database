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

	try {
		await SQLDB.execute('SELECT * FROM view_student_information;', [])
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
			response.render( 'course_overview', { student_data: rows } );
		});
	}
	catch (e){
		console.log( e );
		goHome(request, response);
	}
});


console.log( "[App] Application is running ..." )
module.exports = app;
