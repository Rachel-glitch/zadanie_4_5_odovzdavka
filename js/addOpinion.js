// /*
//  * Created by Stefan Korecko, 2020
//  * Form processing functionality
//  */
//
//
// function processOpnFrmData(event){
//     //1.prevent normal event (form sending) processing
//     event.preventDefault();
//
//     //2. Read and adjust data from the form (here we remove white spaces before and after the strings)
//     const nopName = document.getElementById("nameElm").value.trim();
//     const nopOpn = document.getElementById("opnElm").value.trim();
//     const nopWillReturn = document.getElementById("willReturnElm").checked;
//
//     //3. Verify the data
//     if(nopName=="" || nopOpn==""){
//         window.alert("Please, enter both your name and opinion");
//         return;
//     }
//
//     //3. Add the data to the array opinions and local storage
//     const newOpinion =
//         {
//             name: nopName,
//             comment: nopOpn,
//             willReturn: nopWillReturn,
//             created: new Date()
//
//         };
//
//
//     let opinions = [];
//
//     if(localStorage.myTreesComments){
//         opinions=JSON.parse(localStorage.myTreesComments);
//     }
//
//     opinions.push(newOpinion);
//     localStorage.myTreesComments = JSON.stringify(opinions);
//
//
//     //5. Go to the opinions
//     window.location.hash="#opinions";
//
// }


// function opinionToHtml(opinion) {
//
//     opinion.createdDate=(new Date(opinion.created)).toDateString();
//     //opinion.willReturnMessage=opinion.willReturn?"I will return to this page":"Sorry, one visit was enough";
//
//     const template = document.getElementById("myTemplate").innerHTML;
//     const htmlWOp = Mustache.render(template,opinion);
//
//     delete(opinion.createdDate);
//     //delete(opinion.willReturnMessage);
//
//     return htmlWOp;
//
// }
//
// function opinionArrayToHtml(sourceData) {
//     return sourceData.reduce((htmlWithOpinions,opn) => htmlWithOpinions+opinionToHtml(opn), "");
// }
//
// let opinions=[];
// const opinionsElm=document.getElementById("opinionsContainer");
//
// if(localStorage.myFlowers){
//     opinions=JSON.parse(localStorage.myFlowers)
// }
//
// opinionsElm.innerHTML=opinionArrayToHtml(opinions);
//
// let comFrmElm = document.getElementById("kvetyForm");
//
// comFrmElm.addEventListener("submit", processOpnFrmData);
//
// function clearData(){
//
//     let oneDay = 1000*60*60*24;
//
//     for(let i=0; i<opinions.length; i++){
//         if(Date.now()-new Date(opinions[i].created) > oneDay){
//             opinions.splice(i,1);
//         }
//     }
//
//     opinionsElm.innerHTML=opinionArrayToHtml(opinions);
//     localStorage.myFlowers = JSON.stringify(opinions);
//
// }



function processOpnFrmData(event) {
    event.preventDefault();

    const name = document.getElementById("nameElm").value.trim();
    const email = document.getElementById("emailElm").value.trim();
    const url = document.getElementById("urlElm").value.trim();
    const opn = document.getElementById("opnElm").value.trim();
    const theme1 = document.getElementById("interestedIn").checked;
    const theme2 = document.getElementById("interestedIn2").checked;
    const theme3 = document.getElementById("interestedIn3").checked;
    const rating = document.getElementById("opnFrm").elements["hodnotenie"];

    if (name === "" || opn === "" || email === "") {
        window.alert("Please, enter your name, email and opinion");
        return;
    }



    const newOpinion =
        {
            name: name,
            email: email,
            url: url,
            comment: opn,
            // the1: theme1?"Zaujima tema kvetov":"",
            // the2: theme2?"Zaujima tema pestovania":"",
            // the3: theme3?"Zaujima tema kytic a ich pestovania":"",
            // rating: rating.value===1?"Hodnotenie:vyborna":"hodnotenie:priemerna",

            the1: theme1,
            the2: theme2,
            the3: theme3,
            rating: rating,
            created: new Date()
        };

    let opinions = [];

    if(localStorage.myFlowers){
        opinions=JSON.parse(localStorage.myFlowers);
    }

    opinions.push(newOpinion);
    localStorage.myFlowers = JSON.stringify(opinions);


    //opinionsElm.innerHTML+=opinionToHtml(newOpinion);

    window.location.hash="#opinions";
    //comFrmElm.reset();
}