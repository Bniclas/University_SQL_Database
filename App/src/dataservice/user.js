const db = require("./database_config").SQLDB;
const hashSaltRounds = require("./database_config").hashSaltRounds;
const bcrypt = require("bcrypt");


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
    var [rows, fields] = await db.execute("SELECT person_id FROM person WHERE person_id = ?", [personid]);

    if ( rows.length == 0 ){
        return false;
    }
    else {
        return true; 
    }
}

const userExistsByEmail = async( givenEmail ) => {
    var [rows, fields] = await db.execute("SELECT person_id FROM person WHERE email_private = ? OR email_service = ?", [givenEmail,givenEmail]);

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
    if (rows.length > 0) {
        await bcrypt.compare(givenPassword, rows[0]["password"], async function(error, result){
            if ( result == true ){
                request.session.userid = personid;
                request.session.hasAuth = true;
                response.redirect("/home");
            }
            else {
                response.redirect("/home");
            }
        });
    }	
}

const createUser = async( 
    gender, 
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
            (gender, email_private, email_service, password, firstname, surname, birthdate, postcode, location, street) \
            values( ?, ?, ?, ?, ?, ?, ?, ?, ?, ? )", 
            [
                gender, email_private, email_service, passwordHash, firstname, surname, birthdate, postcode, location, street
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

module.exports = { getLoginStatus, getUserID, userExistsByID, userExistsByEmail, checkPassword, createUser };