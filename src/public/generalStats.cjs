'use strict'

$(function () {
    checkUser(document.cookie).then(
        (result) => {
            if (result === false) {
                window.location.href = "/login"
            }
            else {
                console.log("GETTING STATS")
                let username = getFromCookie('username', document.cookie)
                $.get('/user/get/stats', {user:username}).done(
                    // Recieves the user's stats
                    function (response) {
                        console.log("GOT STATS")
                        let guesses = [0, 0, 0, 0, 0, 0]
                        for (let i = 0; i < response.recordset.length; i++) {
                            guesses[response.recordset[i].CountGuesses - 1] += 1
                        } // Use a graph instead of the text!!!!
                        let statistics
                        if(response.recordset.length !== 0){
                            statistics = `Number of wins: ${response.recordset.length} <br> Guess distribution in wins: <br> 1: ${guesses[0]} <br> 2: ${guesses[1]} <br> 3: ${guesses[2]} <br> 4: ${guesses[3]} <br> 5: ${guesses[4]} <br> 6: ${guesses[5]}`
                        }
                        else{
                            statistics = `You have not won a game yet... I believe you will soon!`
                        }
                        $("#displayedStats").text(statistics)
                    }).fail(
                        function (serverResponse) {
                            alert(serverResponse)
                        })
            }
        }
    ).catch()
})


