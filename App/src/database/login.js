const user = require("./user");

async function checkLogin( request, response, input_mail, input_pw ){
    const userExists = await user.userExistsByEmail( input_mail );
    const passwordCorrect = await user.checkPassword( request, response, userExists, input_pw );
}

async function doLogout( request, response ){
    request.session.destroy((err) => {
        if (err) {
            console.log(err);
        } else {
            response.redirect("/login");
        }
    });
}

module.exports = { checkLogin, doLogout }