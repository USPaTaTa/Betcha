const gameURL = window.location.pathname.split('/').pop()
let session,game,start,gameScript
let ONGOING = false
let FINISH = false


document.addEventListener('DOMContentLoaded', async (req, res) => {

    if (gameURL == "game.html") {
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
                let btnleave = document.querySelector("#leave")
                if (session.userid == game.author) {
                    fetch('/authorConnected/' + gameURL)
                    btnleave.addEventListener("click", function () {

                        console.log("IL s'en va")
                        fetch("/authorleavegame/" + gameURL)
                        setTimeout(() => { window.location.replace("/betcha/list/list.html") }, 10);


                    })
                } else {
                    fetch('/adversaryConnected/' + gameURL)
                    btnleave.addEventListener("click", function () {

                        fetch("/adversaryleavegame/" + gameURL)
                        setTimeout(() => { window.location.replace("/betcha/list/list.html") }, 100);

                    })
                }
                console.log("Vous êtes un joueur")
                let baliseForm = document.querySelector("#betForm")
                let baliseInput = document.createElement("input")
                let baliseBtn = document.createElement("button")

                baliseInput.type = "number"
                baliseInput.id = "nbtoken"
                baliseInput.required = true
                baliseInput.max = 100
                baliseInput.min = 0
                baliseBtn.type = "submit"
                baliseBtn.className = "btn btn-success"
                baliseBtn.innerText = "Valider"


                baliseForm.appendChild(baliseInput)
                baliseForm.appendChild(baliseBtn)

                start = setInterval(checkisAuth, 1000)

            } else {
                let btnleave = document.querySelector("#leave")
                btnleave.addEventListener("click", function () {

                    window.location.replace("/betcha/list/list.html")

                })
                balisetoken1.innerHTML = "\n" + game.nbAuthor
                balisetoken2.innerHTML = game.nbAdversary

                start = setInterval(checkisAuth, 1000)
            }



        })
    })

})

function checkisAuth() {

    fetch('/isAuth/' + gameURL).then((AuthData) => {

        return AuthData.json()

    }).then(function (resAuthData) {

        if (resAuthData.authorisAuth == true && resAuthData.adversaryisAuth == true) { // Si joueur présent

            console.log("tout les participants sont présents")

            if (!ONGOING && !FINISH) { //Si jeu non démarré et non fini

                console.log("DÉMARRAGE DE LA PARTIE")
                ONGOING = true
                gameScript = setInterval(betchaGame, 1000) //lancement ou relancement du jeu

            }
            if (FINISH) { //Si jeu fini
                console.log("EXTINCTION DE LA BOUCLE")
                clearInterval(start) // éteindre cette boucle
            }

        } else { //Si joueur non présent
            console.log("tout les participant ne sont pas présents")

            if (ONGOING && !FINISH) { // Si jeu démarré et non fini
                console.log("MISE EN PAUSE DE LA PARTIE")
                ONGOING = false //définition de la partie sur "en pause"
                clearInterval(gameScript) // Mise en pause du jeu
            }
            if (FINISH) { // Si jeu fini
                console.log("EXTINCTION DE LA BOUCLE")
                clearInterval(start) // éteindre cette boucle
            }
        }
    })
}

function betchaGame() {


    fetch("/gameinfo/" + gameURL).then((gamedata) => { //récupération des informations de la partie

        return gamedata.json()

    }).then(function (resgame) {

        game = resgame
        console.log("ON JOUE")
        let baliseCountdown = document.querySelector("#countdown")
        baliseCountdown.innerHTML = game.countdown - 1
        game.countdown = game.countdown - 1
        fetch("/sendgamecountdown/" + gameURL+"/"+game.countdown)




        if (baliseCountdown.innerHTML == 0) {
            if (game.round == 21) {
                // FIN DE PARTIE, QUI A GAGNÉ ?
                ONGOING = false
                FINISH = true
            }
            baliseCountdown.innerHTML = 30
        }

    })
}