'use strict'

//Checks if the user is logged in
async function checkUser(cookie) {
    return new Promise((resolve, reject) => {
        if (cookie === undefined) {
            resolve(false)
        }
        else {
            const username = getFromCookie("username", cookie)
            if (username === "") {
                // createFakeUser()
                resolve(false)
            }
            else {
                $.post('/get/user', {
                    user: username
                }).done(
                    function (responseText) {
                        // Checks if the user in the cookie exists
                        if (responseText.recordset.length !== 1) {
                            resolve(false)
                        }
                        else {
                            resolve(true)
                        }
                    }).fail(
                        function (serverResponse) {
                            reject(serverResponse)
                        })
            }
        }
    })
}


//Gets an attribute in the cookie
function getFromCookie(cname, cookie) {
    let name = cname + "="
    let decodedCookie = decodeURIComponent(cookie)
    let ca = decodedCookie.split(';')
    for (let i = 0; i < ca.length; i++) {
        let c = ca[i]
        while (c.charAt(0) == ' ') {
            c = c.substring(1)
        }
        if (c.indexOf(name) == 0) {
            return c.substring(name.length, c.length)
        }
    }
    return ""
}

function createFakeUser() {
    // Used to check if a fake user is added to the cookie
    console.log("Creating FakeUser")
    let fakeUser = "FakerUser"
    fakeUser = 'username=' + "FakerUser"
    console.log(fakeUser) // User for testing so the console.log stays
    return fakeUser
}

