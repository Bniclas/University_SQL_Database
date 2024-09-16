document.addEventListener("DOMContentLoaded", (e) => {

    const body = document.body;
    const oDarkModeButton = document.getElementById("dark-mode-btn");

    function switchDarkmode(){
        const aCategoryButtons = document.querySelectorAll(".CategoryButton");
        var mode = localStorage.getItem("darkmode");
        if ( mode == "true" ){
            body.classList.toggle("dark-mode");
        }
        else {
            body.classList.remove("dark-mode");
        }

        for (let i=0; i<aCategoryButtons.length; i++ ) {
            let oButton = aCategoryButtons[i];
            console.log( oButton );

            if ( mode == "true" ){
                oButton.className = "CategoryButton-dark-mode";
            }
            else {
                oButton.className = "CategoryButton";
            }
        }
    }

    switchDarkmode();

    if ( oDarkModeButton ){
        oDarkModeButton.addEventListener("click", (e) => {
            var mode = localStorage.getItem("darkmode");
            
            if ( mode == "true" ){
                mode = "false";
            }
            else {
                mode = "true";
            }

            localStorage.setItem("darkmode", mode);
            switchDarkmode();
            location.reload();
        })
    }

});