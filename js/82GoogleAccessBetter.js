
let auth2 = {};



function renderUserInfo(googleUser, htmlElmId) {

    const profile = googleUser.getBasicProfile();

    const htmlStringEn=

        `

            <p>User logged in.</p>

            <ul>

                <li> ID: ${profile.getId()}

                <li>  Full name: ${profile.getName()}

                <li>  Given name: ${profile.getGivenName()}

                <li>  Family name: ${profile.getFamilyName()}

                <li>  Image URL: ${profile.getImageUrl()}

                <li>  Email: ${profile.getEmail()}

            </ul>

        `;

    //Id z profile.getId() sa nema pouzivat na komunikaciu s vlastnym serverom (you should not use the id from profile.getId() for communication with your server)

    document.getElementById("userStatus").innerHTML = htmlStringEn;

}



function renderLogOutInfo(htmlElmId) {

    const htmlString=

        `

                <p>User not signed in</p>

                `;

    document.getElementById(htmlElmId).innerHTML=htmlString;

}



function signOut() {

    if(auth2.signOut) auth2.signOut();

    if(auth2.disconnect) auth2.disconnect();

    console.log("odhlasil som ta");
    document.getElementById("userName").innerHTML=" ";



}



function userChanged(user){

    document.getElementById("userName").innerHTML=user.getBasicProfile().getName();



    const userInfoElm = document.getElementById("userStatus");

    const userNameInputElm = document.getElementById("author");

    const userNameInputElm2 = document.getElementById("authorComment");

    const userNameInputElm3 = document.getElementById("nameElm");

    const userNameInputElm4 = document.getElementById("authors");



    if(userInfoElm ) {

        renderUserInfo(user, "userStatus");

    }

    if (userNameInputElm) {

        userNameInputElm.value = user.getBasicProfile().getName();

    }

    if (userNameInputElm2) {

        userNameInputElm2.value = user.getBasicProfile.getName();

    }

    if (userNameInputElm3) {

        userNameInputElm3.value = user.getBasicProfile.getName();

    }

    if (userNameInputElm4) {

        userNameInputElm4.value = user.getBasicProfile.getName();

    }



}





function updateSignIn() {



    const sgnd = auth2.isSignedIn && auth2.isSignedIn.get();

    if (sgnd) {

        document.getElementById("SignInButton").classList.add("hiddenElm");

        document.getElementById("SignedIn").classList.remove("hiddenElm");

        document.getElementById("userName").innerHTML = auth2.currentUser.get().getBasicProfile().getName();

    } else {

        document.getElementById("SignInButton").classList.remove("hiddenElm");

        document.getElementById("SignedIn").classList.add("hiddenElm");

    }



    const userInfoElm = document.getElementById("userStatus");

    const userNameInputElm = document.getElementById("author");

    const userNameInputElm2 = document.getElementById("authorComment");

    const userNameInputElm3 = document.getElementById("nameElm");

    const userNameInputElm4 = document.getElementById("authors");



    if(userInfoElm ){// pre 82GoogleAccessBetter.html

        if (sgnd) {
            renderUserInfo(auth2.currentUser.get(),"userStatus");
        }else{
            renderLogOutInfo("userStatus");
        }
    }else if (userNameInputElm){// pre/for 82GoogleAccessBetterAddArt.html
        if (sgnd) {
            userNameInputElm.value=auth2.currentUser.get().getBasicProfile().getName();
        }else{
            userNameInputElm.value="";
        }
    }

    else if (userNameInputElm2){// pre/for 82GoogleAccessBetterAddArt.html

        if (sgnd) {

            userNameInputElm2.value=auth2.currentUser.get().getBasicProfile().getName();

        }else{

            userNameInputElm2.value="";

        }

    }

    else if (userNameInputElm3){// pre/for 82GoogleAccessBetterAddArt.html

        if (sgnd) {

            userNameInputElm3.value=auth2.currentUser.get().getBasicProfile().getName();

        }else{

            userNameInputElm3.value="";

        }

    }

    else if (userNameInputElm4){// pre/for 82GoogleAccessBetterAddArt.html

        if (sgnd) {

            userNameInputElm4.value=auth2.currentUser.get().getBasicProfile().getName();

        }else{

            userNameInputElm4.value="";

        }

    }

}



function startGSingIn() {

    gapi.load('auth2', function() {

        gapi.signin2.render('SignInButton', {

            'width': 240,

            'height': 50,

            'longtitle': true,

            'theme': 'dark',

            'onsuccess': onSuccess,

            'onfailure': onFailure

        });

        gapi.auth2.init().then( //(called after OAuth 2.0 initialisation)

            function (){

                console.log('init');

                auth2 = gapi.auth2.getAuthInstance();

                auth2.currentUser.listen(userChanged);

                auth2.isSignedIn.listen(updateSignIn);

                auth2.then(updateSignIn); //(later after initialisation)

            });

    });



}



function onSuccess(googleUser) {

    console.log('Logged in as: ' + googleUser.getBasicProfile().getName());

}

function onFailure(error) {

    console.log(error);

}