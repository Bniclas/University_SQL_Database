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
const user = require( path.join(__dirname, '/src/util/user.js') );
const message_service = require( path.join(__dirname, '/src/util/service_message.js') );
const { requireAuth, requireAdmin, requireManager } = require( path.join(__dirname, '/src/util/permission_handler.js') );

const mountData = require( path.join(__dirname, '/src/util/data_mounter.js') );

const SQLDB = database.SQLDB;
database.InitDatabase();
user.createAdminUser();

/**
 * Routes
 */

	const personRouter = require( path.join(__dirname, '/src/routers/person.js') );
	const studentRouter = require( path.join(__dirname, '/src/routers/student.js') );
	const courseRouter = require( path.join(__dirname, '/src/routers/course.js') );
	const myprofileRouter = require( path.join(__dirname, '/src/routers/myprofile.js') );
	const employeeRouter = require( path.join(__dirname, '/src/routers/employee.js') );
	const locationRouter = require( path.join(__dirname, '/src/routers/location.js') );
	const scheduleRouter = require( path.join(__dirname, '/src/routers/schedule.js') );
	const imprintRouter = require( path.join(__dirname, '/src/routers/imprint.js') );

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



app.use( requireAuth );

app.use( "/person", personRouter );
app.use( "/student", studentRouter );
app.use( "/course", courseRouter );
app.use( "/myprofile", myprofileRouter );
app.use( "/employee", employeeRouter );
app.use( "/imprint", imprintRouter );

app.set( 'views', path.join(__dirname, '/src/views') );
app.set( 'view engine', 'ejs' );


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
	

console.log( "[App] Application is running ..." )
module.exports = app;
