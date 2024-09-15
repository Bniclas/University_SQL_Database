const db = require("./database_config").SQLDB;
const hashSaltRounds = require("./database_config").hashSaltRounds;
const bcrypt = require("bcrypt");
const message_service = require( "../util/service_message" );

const getLoginStatus = async ( req ) => {
    return ( req.session.hasAuth || false );
}

const getUserID = async( req ) => {
    if ( await getLoginStatus( req ) != null ){
        return req.session.userid;
    }
    else {
        return null;
    }
}

const userExistsByID = async( personid ) => {
    let [rows, fields] = await db.execute("SELECT person_id FROM person WHERE person_id = ?", [personid]);

    if ( rows.length == 0 ){
        return false;
    }
    else {
        return true; 
    }
}

const userExistsByEmail = async( givenEmail ) => {
    let [rows, fields] = await db.execute("SELECT person_id FROM person WHERE email_private = ? OR email_service = ?", [givenEmail,givenEmail]);

    if ( rows.length == 0 ){
        return false;
    }
    else {
        return rows[0].person_id; 
    }
}


const checkPassword = async( request, response, personid, givenPassword ) => {
    if ( personid == null || givenPassword == null ){
        return false;
    }

    const [rows, fields] = await db.execute("SELECT password FROM person WHERE person_id = ?", [ personid ]);
    if (rows.length == 0) {
        await message_service.setMessage( request, "warn", "User not found. Please check your input." );
        response.redirect("/login");
        return;
    }

    bcrypt.compare(givenPassword, rows[0]["password"], async function(error, result){
        if ( result == true ){
            request.session.userid = personid;
            request.session.hasAuth = true;
            await message_service.setMessage( request, "success", "Login successful!" );
            response.redirect("/home");
        }
        else {
            await message_service.setMessage( request, "warn", "Wrong credentials!" );
            response.redirect("/login");
        }
    });
}

const createUser = async( 
    email_private, 
    email_service, 
    password, 
    firstname, 
    surname, 
    birthdate, 
    postcode, 
    location, 
    street ) => {
    const passwordHash = await bcrypt.hash( password, hashSaltRounds);

    if ( passwordHash ) {
        try {
            const [rows, fields] = await db.execute( "insert into person \
            (email_private, email_service, password, firstname, surname, birthdate, postcode, location, street) \
            values( ?, ?, ?, ?, ?, ?, ?, ?, ? )", 
            [
                email_private, email_service, passwordHash, firstname, surname, birthdate, postcode, location, street
            ]);
            
            return true;
        }
        catch (error){
            console.log( error );
            return false;
        }
    }
    else {
        return false;
    }
}

const createAdminUser = async() => {
    try {
        if( process.env.TEST_ACTIVE == "true" ) {
            const privatemail = "admin@me.de";
            const [rows, fields] = await db.execute("SELECT password FROM person WHERE email_private = ?", [ privatemail ]);
            if ( rows.length > 0 ){
                return;
            }
            await createUser(
                "admin@me.de", 
                "admin@service.de", 
                "123", 
                "Admin", 
                "Nistrator", 
                "1000-01-01", 
                "01234", 
                "Admintown", 
                "Adminstreet"
            )
        }
    }
    catch( e ) {
        console.log( e );
    }
}

module.exports = { getLoginStatus, getUserID, userExistsByID, userExistsByEmail, checkPassword, createUser, createAdminUser };