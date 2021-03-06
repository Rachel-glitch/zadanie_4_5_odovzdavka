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
    },
    {
        hash:"addArticle",
        target:"router-view",
        getTemplate: insertNewArticle
    },
    {
        hash:"addComment",
        target:"router-view",
        getTemplate: addComment
    },


];

const urlBase = "https://wt.kpi.fei.tuke.sk/api";
const articlesPerPage = 10;


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


function str(targetElm, current,totalCount, artcs){
    current=parseInt(current);
    totalCount=parseInt(totalCount);
    const data4rendering={
        currPage:current,
        pageCount:totalCount,
        articles: artcs,
    };

    if(current>
        1){
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
    let urlQuery = "";
    let array=[];
    let size;
    let help;

    if (offset && totalCount){
        urlQuery=`?offset=${offset}&max=${articlesPerPage}`;
    }else{
        urlQuery=`?max=${articlesPerPage}`;
    }
    const newUrl= urlBase+"/article"

    fetch(newUrl+urlQuery)
        .then(response =>{
            if(response.ok){
                return response.json();
            }else{ //if we get server error
                return Promise.reject(new Error(`Server answered with ${response.status}: ${response.statusText}.`));
            }
        })
        .then(responseJSON => {
            help = responseJSON;
            addArtDetailLink2ResponseJson(responseJSON);
            array=responseJSON.articles;
            size=responseJSON.meta.totalCount;
            return Promise.resolve();
        })
        .then(() =>{
            let artRequests = array.map(
                article => fetch(`${newUrl}/${article.id}/${urlQuery}`)
            );
            return Promise.all(artRequests);
        })
        .then(responses => {
            let failed = "";
            for (let response of responses) {
                if (!response.ok) failed += response.url + " "
            }
            if (failed === ""){
                return responses;
            }else {
                return  Promise.reject(new Error(`Failed to access the content of the articles with urls ${failed}.`));
            }
        })
        .then(responses => Promise.all(responses.map(resp => resp.json())))
        .then(articles => {
            articles.forEach((article,index) =>{
                array[index].content=article.content;
            });
            return Promise.resolve();
        })
        .then( () => {
            let commRequests = array.map(
                article => fetch(`${newUrl}/${article.id}/comment`)
            );
            return Promise.all(commRequests)
        })
        .then(responses =>{
            let failed="";
            for(let response of responses) {
                if(!response.ok) failed+=response.url+" ";
            }
            if(failed===""){
                return responses;
            }else{
                return Promise.reject(new Error(`Failed to access the comments with urls ${failed}.`));
            }
        })
        .then(responses => Promise.all(responses.map(resp => resp.json())))
        .then(comments => {
            comments.forEach((artComments,index) =>{
                array[index].comments=artComments.comments;
            });
            return Promise.resolve();
        })
        .then( ()=> {
            console.log("cyklus");
            let text=[];
            let i;
            for(i=0; i<array.length; i++) {
                text[i] = {
                    title: array[i].title,
                    content: array[i].content,
                    author: array[i].author,
                    detailLink: array[i].detailLink,
                    comments: array[i].comments,
                }
            }
            console.log(text);
            console.log(help+"ja som help");
            addArtDetailLink2ResponseJson(help);
            str(targetElm,offsetFromHash,size,text);
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

            window.location=`#articles/${offsetFromHash}/${totalCountFromHash}`;
            fetchAndDisplayArticles(targetElm,offsetFromHash,totalCountFromHash);
            // document.getElementById(targetElm).innerHTML =
            //     Mustache.render(
            //         document.getElementById("template-articles").innerHTML,
            //         responseJSON
            //     );
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

            if(forEdit){
                responseJSON.formTitle="Article Edit";
                responseJSON.formSubmitCall =
                    `processArtEditFrmData(event,${artIdFromHash},${offsetFromHash},${totalCountFromHash},'${urlBase}','PUT')`;
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
                responseJSON.addCommentLink=`#addComment/${responseJSON.id}/${offsetFromHash}/${totalCountFromHash}`;
                comment(targetElm, artIdFromHash, responseJSON, offsetFromHash, totalCountFromHash);
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

function insertNewArticle(targetElm, artIdFromHash, offsetFromHash, totalCountFromHash) {
    const url = `${urlBase}/articles`;

    fetch(url)
        .then(response =>{
            if(response.ok){
                return response.json();
            }else{ //if we get server error
                return Promise.reject(new Error(`Server answered with ${response.status}: ${response.statusText}.`));
            }
        })
        .then(responseJSON => {
            const total = responseJSON.meta.totalCount;
            const offset = Math.round(total/articlesPerPage-1)*articlesPerPage+1;
                responseJSON.formTitle="Article Add";
                responseJSON.formSubmitCall =
                    `processArtEditFrmData(event,${artIdFromHash},${offset},${total},'${urlBase}','POST')`;
                responseJSON.submitBtTitle="Save article";
                responseJSON.urlBase=urlBase;
                responseJSON.backLink=`#articles/${offset}/${total}`;
                document.getElementById(targetElm).innerHTML =
                    Mustache.render(
                        document.getElementById("template-article-form").innerHTML,
                        responseJSON
                    );

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

function comment(targetElm, artIdFromHash, resp, offsetFromHash, totalCountFromHash ){
    let urlQuery = `?offset=${offsetFromHash}&max=${articlesPerPage}`;
    let array=[];

    const url= urlBase+"/article"

    fetch(url+urlQuery)
        .then(response =>{
            if(response.ok){
                return response.json();
            }else{ //if we get server error
                return Promise.reject(new Error(`Server answered with ${response.status}: ${response.statusText}.`));
            }
        })
        .then(responseJSON => {
            array=responseJSON.articles;
            return Promise.resolve();
        })
        .then(() =>{
            let artRequests = array.map(
                article => fetch(`${url}/${article.id}`)
            );
            return Promise.all(artRequests);
        })
        .then( () => {
            let commRequests = array.map(
                article => fetch(`${url}/${article.id}/comment`)
            );
            return Promise.all(commRequests)
        })
        .then(responses =>{
            let failed="";
            for(let response of responses) {
                if(!response.ok) failed+=response.url+" ";
            }
            if(failed===""){
                return responses;
            }else{
                return Promise.reject(new Error(`Failed to access the comments with urls ${failed}.`));
            }
        })
        .then(responses => Promise.all(responses.map(resp => resp.json())))
        .then(comments => {
            comments.forEach((artComments,index) =>{
                array[index].comments=artComments.comments;
            });
            return Promise.resolve();
        })
        .then( ()=> {

            let i;
            for(i=0; i<array.length; i++) {
                if (array[i].comments !=null) {
                    if (array[i].id == artIdFromHash) {
                        printArticleAndComments(targetElm, resp, array[i].comments, offsetFromHash, totalCountFromHash);
                    }
                }else{
                    const data={
                        arti:resp,
                        backLink:resp.backLink,
                        editLink:resp.editLink,
                        deleteLink:resp.deleteLink,
                        addCommentLink: resp.addCommentLink,
                    }
                    document.getElementById(targetElm).innerHTML =
                        Mustache.render(
                            document.getElementById("template-article").innerHTML,
                            data);
                }
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

function printArticleAndComments(targetElm,resp, comm, offsetFromHash, totalCountFromHash){

    const data={
        comments:comm,
        arti:resp,
        backLink:resp.backLink,
        editLink:resp.editLink,
        deleteLink:resp.deleteLink,
        addCommentLink: resp.addCommentLink,

    }


    document.getElementById(targetElm).innerHTML = Mustache.render(
        document.getElementById("template-article").innerHTML,
       data
    );
}

function addComment(targetElm, artIdFromHash, offsetFromHash, totalCountFromHash){
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
            responseJSON.formTitle = "Add Comment";
            responseJSON.formSubmitCall =
                `processCommentData(event,${artIdFromHash},${offsetFromHash},${totalCountFromHash},'${urlBase}')`;
            responseJSON.submitBtTitle = "Save comment";
            responseJSON.urlBase = urlBase;
            responseJSON.backLink = `#article/${artIdFromHash}/${offsetFromHash}/${totalCountFromHash}`;

            const data={
                arti:responseJSON,
                backLink:responseJSON.backLink,
                editLink:responseJSON.editLink,
                deleteLink:responseJSON.deleteLink,
                addCommentLink: responseJSON.addCommentLink,
                formSubmitCall:responseJSON.formSubmitCall,
                submitBtTitle:responseJSON.submitBtTitle,

            }

            document.getElementById(targetElm).innerHTML =
                Mustache.render(
                    document.getElementById("template-addComment").innerHTML,
                    data
                );
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




