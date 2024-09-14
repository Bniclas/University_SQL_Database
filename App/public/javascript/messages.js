document.addEventListener("DOMContentLoaded", (e) => {

    const oPageContent = document.getElementsByClassName("PageContent");

    if ( oPageContent ){
        setTimeout( ()=>{
            const messageBoxes = document.getElementsByTagName("MessageBox");
        
            for( let i=0; i<messageBoxes.length; i++ ){
                let msgBox = messageBoxes[i];
                msgBox.style.display = 'none';
            }
        }, 3000)
    }

});