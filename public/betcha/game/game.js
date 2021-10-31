const gameURL = window.location.pathname.split('/').pop()
let session, game, start, gameScript
let balisecase1, balisecase2, balisecase3, balisecase4, balisecase5, balisecase6, balisecase7, balisecase8, balisecase9, balisecase10, balisecase11, currentLot
let baliseTitle, baliseTitleGame, baliseRound, baliseCountdown, baliseplayer1, baliseplayer2, balisetoken1, balisetoken2, btnleave, baliseStatut, baliseFooter, round = 1
let baliseForm, baliseInput, baliseBtn
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
            baliseTitle = document.querySelector("#title")
            baliseTitleGame = document.querySelector("#titleGame")
            baliseRound = document.querySelector("#round")
            baliseCountdown = document.querySelector("#countdown")
            baliseplayer1 = document.querySelector("#player1")
            baliseplayer2 = document.querySelector("#player2")
            balisetoken1 = document.querySelector("#token1")
            balisetoken2 = document.querySelector("#token2")
            balisecase1 = document.querySelector("#case1")
            balisecase2 = document.querySelector("#case2")
            balisecase3 = document.querySelector("#case3")
            balisecase4 = document.querySelector("#case4")
            balisecase5 = document.querySelector("#case5")
            balisecase6 = document.querySelector("#case6")
            balisecase7 = document.querySelector("#case7")
            balisecase8 = document.querySelector("#case8")
            balisecase9 = document.querySelector("#case9")
            balisecase10 = document.querySelector("#case10")
            balisecase11 = document.querySelector("#case11")
            btnleave = document.querySelector("#leave")
            currentLot = document.querySelector("#case" + game.lot)
            // baliseForm = document.querySelector("#betForm")
            baliseFooter = document.querySelector("#footer")
            baliseStatut = document.querySelector("#statut")


            baliseTitle.innerHTML = "Betcha: " + game.name
            baliseTitleGame.innerHTML = game.name
            baliseStatut.innerHTML = game.statut
            baliseCountdown.innerHTML = game.countdown
            baliseRound.innerHTML = "Round: " + game.round + "/20"
            baliseplayer1.innerHTML = game.author
            baliseplayer2.innerHTML = game.adversary

            currentLot.className = "lot"


            // balisecase1.className = null
            // balisecase2.className = null
            // balisecase3.className = null
            // balisecase4.className = null
            // balisecase5.className = null
            // balisecase6.className = null
            // balisecase7.className = null
            // balisecase8.className = null
            // balisecase9.className = null
            // balisecase10.className = null
            // balisecase11.className = null

            if (session.userid == game.author || session.userid == game.adversary) { //check si ils sont les joueurs
                if (session.userid == game.author) { // check si c'est l'auteur de la partie
                    balisetoken1.innerHTML = game.nbAuthor
                    fetch('/authorConnected/' + gameURL)
                    btnleave.addEventListener("click", function () {

                        console.log("IL s'en va")
                        fetch("/authorleavegame/" + gameURL)
                        setTimeout(() => { window.location.replace("/betcha/list/list.html") }, 100);


                    })
                    start = setInterval(checkisAuth, 1000)

                } else { // Si ce n'est pas l'auteur alors c'est l'adversaire
                    balisetoken2.innerHTML = game.nbAdversary
                    fetch('/adversaryConnected/' + gameURL)
                    btnleave.addEventListener("click", function () {

                        fetch("/adversaryleavegame/" + gameURL)
                        setTimeout(() => { window.location.replace("/betcha/list/list.html") }, 100);
                    })
                    start = setInterval(checkisAuth, 1000)
                }


            } else { // Si ce n'est pas les joueurs alors c'est le spectateur
                btnleave = document.querySelector("#leave")
                btnleave.addEventListener("click", function () {

                    window.location.replace("/betcha/list/list.html")

                })
                balisetoken1.innerHTML = game.nbAuthor
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

                if (session.userid == game.author) { //check si c'est l'auteur de la partie
                    if (game.nbAuthor != 0) { //check si l'auteur lui reste des points
                        baliseForm = document.createElement("form")
                        baliseInput = document.createElement("input")
                        baliseBtn = document.createElement("button")

                        baliseForm.action = "/bet/" + gameURL
                        baliseForm.method = "post"
                        baliseForm.id = "betForm"
                        baliseInput.type = "number"
                        baliseInput.id = "nbtoken"
                        baliseInput.required = true
                        baliseInput.max = game.nbAuthor
                        baliseInput.min = 0
                        baliseBtn.type = "submit"
                        baliseBtn.className = "btn btn-success"
                        baliseBtn.innerText = "Valider"

                        baliseFooter.appendChild(baliseForm)
                        baliseForm.appendChild(baliseInput)
                        baliseForm.appendChild(baliseBtn)
                        baliseForm.submit(function(event){
                            event.preventDefault()
                            // setTimeout(() => {  baliseForm.removeChild(baliseBtn) }, 100);
                        })
                    }

                } else { // Si ce n'est pas l'auteur alors c'est l'adversaire
                    if (game.nbAdversary != 0) { //check si l'adversaire lui reste des points
                        baliseForm = document.createElement("form")
                        baliseInput = document.createElement("input")
                        baliseBtn = document.createElement("button")

                        baliseForm.action = "/bet/" + gameURL
                        baliseForm.method = "post"
                        baliseForm.id = "betForm"
                        baliseInput.type = "number"
                        baliseInput.id = "nbtoken"
                        baliseInput.required = true
                        baliseInput.max = game.nbAdversary
                        baliseInput.min = 0
                        baliseBtn.type = "submit"
                        baliseBtn.className = "btn btn-success"
                        baliseBtn.innerText = "Valider"

                        baliseFooter.appendChild(baliseForm)
                        baliseForm.appendChild(baliseInput)
                        baliseForm.appendChild(baliseBtn)
                        baliseForm.submit(function(event){
                            event.preventDefault()
                            // setTimeout(() => {  baliseForm.removeChild(baliseBtn) }, 100);
                        })
                    }
                }

                console.log("DÉMARRAGE DE LA PARTIE")
                ONGOING = true
                baliseStatut.innerHTML = "En cours"
                game.statut = baliseStatut.innerHTML
                fetch("/sendstatut/" + gameURL + "/" + game.statut)
                gameScript = setInterval(betchaGame, 1000) //lancement ou relancement du jeu

            }
            if (FINISH) { //Si jeu fini
                if(session.userid == game.author || session.userid == game.adversary){
                    baliseForm.removeChild(baliseBtn)
                    baliseForm.removeChild(baliseInput)
                    baliseFooter.removeChild(baliseForm)
                }
                console.log("EXTINCTION DE LA BOUCLE")
                baliseStatut.innerHTML = "Partie terminée"
                game.statut = baliseStatut.innerHTML
                fetch("/sendstatut/" + gameURL + "/" + game.statut)
                clearInterval(start) // éteindre cette boucle
            }

        } else { //Si joueur non présent
            console.log("tout les participant ne sont pas présents")

            if (ONGOING && !FINISH) { // Si jeu démarré et non fini
                if(session.userid == game.author || session.userid == game.adversary){
                    baliseForm.removeChild(baliseBtn)
                    baliseForm.removeChild(baliseInput)
                    baliseFooter.removeChild(baliseForm)
                }
                console.log("MISE EN PAUSE DE LA PARTIE")
                ONGOING = false //définition de la partie sur "en pause"
                baliseStatut.innerHTML = "En pause"
                game.statut = baliseStatut.innerHTML
                fetch("/sendstatut/" + gameURL + "/" + game.statut)
                clearInterval(gameScript) // Mise en pause du jeu
                fetch("/sendcountdown/" + gameURL + "/" + game.countdown)
                fetch("/sendround/" + gameURL + "/" + game.round)
            }
            if (FINISH) { // Si jeu fini
                console.log("EXTINCTION DE LA BOUCLE")
                baliseStatut.innerHTML = "Partie terminée"
                game.statut = baliseStatut.innerHTML
                fetch("/sendstatut/" + gameURL + "/" + game.statut)
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
        baliseCountdown.innerHTML = baliseCountdown.innerHTML - 1
        game.countdown = baliseCountdown.innerHTML
        game.round = round
        // if(session.userid == game.author){
        //     fetch("/sendcountdown/" + gameURL + "/" + game.countdown)
        // }

        if (baliseCountdown.innerHTML == 0) {

            if (baliseRound.innerHTML != "Round: 21/20") {
                round++
                baliseRound.innerHTML = "Round: " + round + "/20"
                game.round = round
                baliseCountdown.innerHTML = 5
            } else {
                // FIN DE PARTIE, QUI A GAGNÉ ?
                baliseRound.innerHTML = "Round: 20/20"
                ONGOING = false
                FINISH = true
                clearInterval(gameScript)
            }
        }

    })
}