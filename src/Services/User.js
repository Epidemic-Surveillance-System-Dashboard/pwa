import db from '../Database/database'

const userService = {
    login,
    logout,
    user,
}

function login(username, password){
    return new Promise ((resolve, reject) =>{
        //Fake for now while backend is being developed

        let userDetails = {
            Id: "40",
            Email:"Testing 123",
            FirstName : "test_fName",
            LastName : "test_LName",
            LocationId : "133",
            LocationType : "Facility"
        }

        db.LocalUser.clear().then(
            db.LocalUser.add(userDetails).then(() =>{
                console.log("Auth Login Success")
                resolve (userDetails)
            })
        ).catch((e) =>{
            console.log(e)
            resolve(userDetails)
        })
    })

}

function logout(){
    return new Promise ((resolve, reject) =>{
        db.LocalUser.clear().then(
            resolve (true)
        ).catch((e) =>{
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
function fetch(url, args){
    return new Promise ((resolve, reject) =>{

        //Get Auth Token

        //Append auth token to args headers (if we choose to do auth this way)

        //Send fetch request with args provided and auth token
        
        //Resolve fetch request

        resolve(true)
    })
}

export default userService