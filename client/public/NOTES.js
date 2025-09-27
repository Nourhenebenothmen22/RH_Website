

function  cookieslist(){


    const lis = document.cookie.split(";");

    for (let i = 0 ;  i< lis.length ; i++) {
        const cook = lis[i];
        const epPos  = cook.indexOf("=");
        const name= epPos > -1 ? cook.substring(0,epPos): cook;
        document.cookie = name + "=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/";
        
    }
}

