import db from '../Database/database'

const userService = {
    login,
    logout,
    user,
}

function login(email, password){
    return new Promise ((resolve, reject) =>{
        var loginApiRoute = `${process.env.REACT_APP_API_URL}${process.env.REACT_APP_LOGIN_ROUTE}`;
        fetch(loginApiRoute, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({Email: email, Password: password})
        })
        .then((result) => {
            return result.json();      
        })
        .then((userJsonObj) => {
            if(userJsonObj.success){
                //Successfully logined, so store in user info LocalUser and resolve promise to true
                db.LocalUser.clear().then(
                    db.LocalUser.add(userJsonObj.user).then(() =>{
                        console.log("Auth Login Success");
                        resolve (true)
                    })
                ).catch((e) =>{
                    //failed to save to LocalUser
                    console.log(e);
                    resolve(false);
                });
            }
            else{
                //failed to login, so resolve promise to false
                resolve(false);
            }
        });
    });
}

function logout(){
    return new Promise ((resolve, reject) =>{
        db.LocalUser.clear().then(() => {
            resolve (true)
        }).catch((e) =>{
            console.log(e)
            resolve(false)
        })


    })
}

/**
 * Determines if there is a user logged in. 
 * Returns null if no user; returns the user if logged in.
 */
function user(){
    return new Promise ((resolve, reject) =>{
        db.LocalUser.toArray(arr =>{
            if (arr.length !== 1) resolve(null)
            else{
                let result = arr[0]
                result.userType = "Admin" //hard code for now
                resolve(result)
            }
        })
    })
}   

/**
 * Drop-in authenticated replacement for fetch.
 * Includes required auth tokens.
 * TODO
 */
/*
function fetch(url, args){
    return new Promise ((resolve, reject) =>{

        //Get Auth Token

        //Append auth token to args headers (if we choose to do auth this way)

        //Send fetch request with args provided and auth token
        
        //Resolve fetch request

        resolve(true)
    })
}*/

export default userService;