let session
let game
const gameURL = window.location.pathname.split('/').pop()

document.addEventListener('DOMContentLoaded', async (req, res) => {

    if(gameURL == "game.html"){
        window.location.replace("/")
    }

    fetch('/session').then((userdata) => {

        return userdata.json()

    }).then(function (resuser) {
        if (resuser.userid == undefined || resuser.userid == null) {

            let baliseUsername = document.querySelector("#usernameID")
            session = resuser
            session.userid = "Spectateur"
            baliseUsername.innerHTML = session.userid
        } else {

            session = resuser

            console.log(session.userid)
            let baliseUsername = document.querySelector("#usernameID")
            baliseUsername.innerHTML = session.userid


        }
        fetch("/gameinfo/" + gameURL).then((gamedata) => {

            return gamedata.json()

        }).then(function (resgame) {
            game = resgame
            // console.log(game.name)
            let baliseTitle = document.querySelector("#title")
            let baliseTitleGame = document.querySelector("#titleGame")
            let baliseRound = document.querySelector("#round")
            let baliseCountdown = document.querySelector("#countdown")
            let baliseplayer1 = document.querySelector("#player1")
            let baliseplayer2 = document.querySelector("#player2")
            let balisetoken1 = document.querySelector("#token1")
            let balisetoken2 = document.querySelector("#token2")
            baliseTitle.innerHTML = "Betcha: " + game.name
            baliseTitleGame.innerHTML = "Betcha: " + game.name
            baliseCountdown.innerHTML = game.countdown
            baliseRound.innerHTML = "Round: " + game.round
            baliseplayer1.innerHTML = game.author
            baliseplayer2.innerHTML = game.adversary



            if (session.userid == game.author || session.userid == game.adversary) {
                if (session.userid == game.author) {
                    fetch('/authorConnected/' + gameURL)
                }
                else {
                    fetch('/adversaryConnected/' + gameURL)
                }
                console.log("Vous êtes un joueur")
                let baliseForm = document.querySelector("#betForm")
                let baliseInput = document.createElement("input")
                let baliseBtn = document.createElement("button")

                baliseInput.type = "number"
                baliseInput.required = true
                baliseBtn.type = "submit"
                baliseBtn.className = "btn btn-success"
                baliseBtn.innerText = "Valider"
                baliseInput.max = 100
                baliseInput.min = 0

                baliseForm.appendChild(baliseInput)
                baliseForm.appendChild(baliseBtn)

            }else{
                balisetoken1.innerHTML = "\n"+ game.nbAuthor
                balisetoken2.innerHTML = game.nbAdversary
            }



        })
    })

})

function checkisAuth(){
    setInterval(function () {

        fetch('/isAuth/' + gameURL).then((AuthData) => {
    
            return AuthData.json()
    
        }).then(function (resAuthData) {
    
            if (resAuthData.authorisAuth == true && resAuthData.adversaryisAuth == true) {
    
                console.log("tout les participants sont présents")
    
            } else {
                console.log("Aucun participant n'est présent")
            }
    
        })
    }, 2000)
}
