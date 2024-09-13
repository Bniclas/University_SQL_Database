document.addEventListener("DOMContentLoaded", () => {
    const oGoBackButton = document.getElementById("go-back");

    if ( oGoBackButton ){
        document.getElementById("go-back").addEventListener("click", (e) => {
            history.back();
        });
    }
});