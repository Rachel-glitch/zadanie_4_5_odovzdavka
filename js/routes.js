//an array, defining the routes
export default[

    {
        //the part after '#' in the url (so-called fragment):
        hash:"welcome",
        ///id of the target html element:
        target:"router-view",
        //the function that returns content to be rendered to the target html element:
        getTemplate:(targetElm) =>
            document.getElementById(targetElm).innerHTML = document.getElementById("template-welcome").innerHTML
    },

    {
        hash:"articles",
        target:"router-view",
         getTemplate: fetchAndDisplayArticles
        //getTemplate: makeClick
         },

    {
        hash:"opinions",
        target:"router-view",
        getTemplate: createHtml4opinions
    },


    {
        hash:"addOpinion",
        target:"router-view",
        getTemplate: (targetElm) =>
            document.getElementById(targetElm).innerHTML = document.getElementById("template-addOpinion").innerHTML
    },

    {
        hash:"article",
        target:"router-view",
        getTemplate: fetchAndDisplayArticleDetail
    },

    {
        hash:"artEdit",
        target:"router-view",
        getTemplate: editArticle
    },
    {
        hash:"artDelete",
        target:"router-view",
        getTemplate: deleteArticle
    }

];

const urlBase = "https://wt.kpi.fei.tuke.sk/api";
const articlesPerPage = 20;

// function makeClick(targetElm, current, totalCount) {
//     current=parseInt(current);
//     totalCount=20;
//     const data4rendering={
//         currPage:current,
//         pageCount:totalCount
//     };
//
//     if(current>1){
//         data4rendering.prevPage=current-5;
//     }
//
//     if(current<totalCount){
//         data4rendering.nextPage=current+5;
//     }
//
//     document.getElementById(targetElm).innerHTML = Mustache.render(
//         document.getElementById("template-articles").innerHTML,
//         data4rendering
//     );
//     fetchAndDisplayArticles(targetElm, current, data4rendering);
// }

function createHtml4opinions(targetElm){

    const opinionsFromStorage=localStorage.myFlowers;
    let opinions=[];

    if(opinionsFromStorage){
        opinions=JSON.parse(opinionsFromStorage);
        opinions.forEach(opinion => {
            opinion.created = (new Date(opinion.created)).toDateString();
            opinion.theme1 = opinion.theme1?"Zaujima tema kvetov":"";
            opinion.theme2 = opinion.theme2?"Zaujima tema pestovania":"";
            opinion.theme3 = opinion.theme3?"Zaujima tema kytic a ich pestovania":"";
            opinion.rating = opinion.rating.value===1?"Hodnotenie:vyborna":"hodnotenie:priemerna";
        });
    }

    document.getElementById(targetElm).innerHTML = Mustache.render(
        document.getElementById("template-opinions").innerHTML,
        opinions
    );
}


// function fetchAndDisplayArticles(targetElm, offsetFromHash, totalCountFromHash) {
//
//     const offset=Number(offsetFromHash);
//     const totalCount=Number(totalCountFromHash);
//
//     let urlQuery = "";
//
//     if (offset && totalCount){
//         urlQuery=`?offset=${offset}&max=${articlesPerPage}`;
//     }else{
//         urlQuery=`?max=${articlesPerPage}`;
//     }
//
//     const url = `${urlBase}/article${urlQuery}`;
//
//     //const url = "https://wt.kpi.fei.tuke.sk/api/article";
//     //const url = "https://wt.kpi.fei.tuke.sk/api/article/?max=5";
//     // let cislo = curr;
//     // const count = "?max=5&offset=" + cislo;
//
//     const articlesElm = document.getElementById("template-articles");
//     const errorElm = document.getElementById("template-articles-error");
//     const clickElm = document.getElementById("template-click");
//     //makeClick(targetElm, cislo, 8);
//     let articleList = [];
//
//     fetch(url)  //there may be a second parameter, an object wih options, but we do not need it now.
//         .then(response => {
//             if (response.ok) {
//                 return response.json();
//             } else {
//                 return Promise.reject(new Error(`Failed to access the list of articles. Server answered with ${response.status}: ${response.statusText}.`)); //we return a rejected promise to be catched later
//             }
//         })
//         .then(responseJSON => {
//             addArtDetailLink2ResponseJson(responseJSON);
//             articleList = responseJSON.articles;
//             return Promise.resolve();
//         })
//
//         .then(() => {
//             let prrt;
//             let cntRequests = articleList.map(
//                 article => fetch(`${url}/${article.id}/${count}`)
//             );
//             return Promise.all(cntRequests);
//         })
//         .then(responses => {
//             let failed = "";
//             for (let response of responses) {
//                 if (!response.ok) failed += response.url + " ";
//             }
//             if (failed === "") {
//                 return responses;
//             } else {
//                 return Promise.reject(new Error(`Failed to access the content of the articles with urls ${failed}.`));
//             }
//         })
//         .then(responses => Promise.all(responses.map(resp => resp.json())))
//         .then(articles => {
//             articles.forEach((article, index) => {
//                 articleList[index].content = article.content;
//             });
//             return Promise.resolve();
//         })
//         .then( () =>{
//             renderArticles(articleList);
//             })
//         .catch(error => errorHandler && errorHandler(error));
//
//
//
//     function errorHandler(error) {
//         errorElm.innerHTML=`Error reading data from the server. ${error}`; //write an error message to the page
//     }
//
//     function renderArticles(articles) {
//         //articlesElm.innerHTML=Mustache.render(document.getElementById("mtemplate").innerHTML, articles);
//         let text = articles[0].content;
//
//         console.log(text);
//         articles.forEach((article,index) => {
//            articles[index].content = article.content;
//            text = {content: text};
//            //console.log(article.content);
//            console.log(article);
//              document.getElementById(targetElm).innerHTML = Mustache.render(
//                  document.getElementById("template-articles").innerHTML,
//                  articles);
//          })
//
//         }
//
// }

function str(targetElm, current,totalCount, artcs){

    current=parseInt(current);
    totalCount=parseInt(totalCount);
    const data4rendering={
        currPage:current,
        pageCount:totalCount,
        articles: artcs
    };

    if(current>1){
        data4rendering.prevPage=current-articlesPerPage;
    }

    if(current+articlesPerPage<totalCount){
        data4rendering.nextPage=current+articlesPerPage;
    }

    document.getElementById(targetElm).innerHTML = Mustache.render(
        document.getElementById("template-articles").innerHTML,
        data4rendering
    );
}

function fetchAndDisplayArticles(targetElm, offsetFromHash, totalCountFromHash){

    const offset=Number(offsetFromHash);
    const totalCount=Number(totalCountFromHash);
    //const articlesPerPage=10;
    let urlQuery = "";


    if (offset && totalCount){
        urlQuery=`?offset=${offset}&max=${articlesPerPage}`;
    }else{
        urlQuery=`?max=${articlesPerPage}`;
    }

    const url = `${urlBase}/article${urlQuery}`;

    fetch(url)
        .then(response =>{
            if(response.ok){
                return response.json();
            }else{ //if we get server error
                return Promise.reject(new Error(`Server answered with ${response.status}: ${response.statusText}.`));
            }
        })
        .then(responseJSON => {
            addArtDetailLink2ResponseJson(responseJSON);
            // document.getElementById(targetElm).innerHTML =
            //     Mustache.render(
            //         document.getElementById("template-articles").innerHTML,
            //         responseJSON
            //     );
            str(targetElm, offsetFromHash-1,totalCount, responseJSON.articles);
        })
        .catch (error => { ////here we process all the failed promises
            const errMsgObj = {errMessage:error};
            document.getElementById(targetElm).innerHTML =
                Mustache.render(
                    document.getElementById("template-articles-error").innerHTML,
                    errMsgObj
                );
        });
}

function addArtDetailLink2ResponseJson(responseJSON){
    responseJSON.articles =
        responseJSON.articles.map(
            article =>(
                {
                    ...article,
                    detailLink:`#article/${article.id}/${responseJSON.meta.offset}/${responseJSON.meta.totalCount}`
                }
            )
        );
}

function fetchAndDisplayArticleDetail(targetElm, artIdFromHash, offsetFromHash, totalCountFromHash) {
    fetchAndProcessArticle(...arguments,false);
}

function editArticle(targetElm, artIdFromHash, offsetFromHash, totalCountFromHash) {
    fetchAndProcessArticle(...arguments,true);
}
function deleteArticle(targetElm, artIdFromHash, offsetFromHash, totalCountFromHash){
    console.log("tu som");
    const url = `${urlBase}/article/${artIdFromHash}`;
    fetch(url)
        .then(response =>{
            if(response.ok){
                return response.json();
            }else{ //if we get server error
                return Promise.reject(new Error(`Server answered with ${response.status}: ${response.statusText}.`));
            }
        })
        .then(responseJSON => {
            deleteData(event,artIdFromHash,offsetFromHash,totalCountFromHash,urlBase);
            document.getElementById(targetElm).innerHTML =
                Mustache.render(
                    document.getElementById("template-articles").innerHTML,
                    responseJSON
                );
            //fetchAndDisplayArticles(targetElm,offsetFromHash,totalCountFromHash);
        })
        .catch (error => { ////here we process all the failed promises
            const errMsgObj = {errMessage:error};
            document.getElementById(targetElm).innerHTML =
                Mustache.render(
                    document.getElementById("template-articles-error").innerHTML,
                    errMsgObj
                );
        });
}
/**
 * Gets an article record from a server and processes it to html according to the value of the forEdit parameter.
 * Assumes existence of the urlBase global variable with the base of the server url (e.g. "https://wt.kpi.fei.tuke.sk/api"),
 * availability of the Mustache.render() function and Mustache templates with id="template-article" (if forEdit=false)
 * and id="template-article-form" (if forEdit=true).
 * @param targetElm - element to which the acquired article record will be rendered using the corresponding template
 * @param artIdFromHash - id of the article to be acquired
 * @param offsetFromHash - current offset of the article list display to which the user should return
 * @param totalCountFromHash - total number of articles on the server
 * @param forEdit - if false, the function renders the article to HTML using the template-article for display.
 *                  If true, it renders using template-article-form for editing.
 */
function fetchAndProcessArticle(targetElm, artIdFromHash, offsetFromHash, totalCountFromHash,forEdit) {
    const url = `${urlBase}/article/${artIdFromHash}`;
    //const url = "https://wt.kpi.fei.tuke.sk/api/article";
    fetch(url)
        .then(response =>{
            if(response.ok){
                return response.json();
            }else{ //if we get server error
                return Promise.reject(new Error(`Server answered with ${response.status}: ${response.statusText}.`));
            }
        })
        .then(responseJSON => {


            // if(forEdit){
            // }else{
            if(forEdit){
                responseJSON.formTitle="Article Edit";
                responseJSON.formSubmitCall =
                    `processArtEditFrmData(event,${artIdFromHash},${offsetFromHash},${totalCountFromHash},'${urlBase}')`;
                responseJSON.submitBtTitle="Save article";
                responseJSON.urlBase=urlBase;

                responseJSON.backLink=`#article/${artIdFromHash}/${offsetFromHash}/${totalCountFromHash}`;

                document.getElementById(targetElm).innerHTML =
                    Mustache.render(
                        document.getElementById("template-article-form").innerHTML,
                        responseJSON
                    );
            }else{
                responseJSON.backLink=`#articles/${offsetFromHash}/${totalCountFromHash}`;
                responseJSON.editLink=`#artEdit/${responseJSON.id}/${offsetFromHash}/${totalCountFromHash}`;
                responseJSON.deleteLink=`#artDelete/${responseJSON.id}/${offsetFromHash}/${totalCountFromHash}`;

                document.getElementById(targetElm).innerHTML =
                    Mustache.render(
                        document.getElementById("template-article").innerHTML,
                        responseJSON
                    );
            }

        })
        .catch (error => { ////here we process all the failed promises
            const errMsgObj = {errMessage:error};
            document.getElementById(targetElm).innerHTML =
                Mustache.render(
                    document.getElementById("template-articles-error").innerHTML,
                    errMsgObj
                );
        });

}



