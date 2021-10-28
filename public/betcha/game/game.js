let session
let game
const gameURL = window.location.pathname.split('/').pop()

document.addEventListener('DOMContentLoaded', async (req, res) => {

    fetch('/session').then((userdata) => {

        return userdata.json()

    }).then(function (resuser) {
        if (resuser.userid == undefined || resuser.userid == null) {

            let baliseUsername = document.querySelector("#usernameID")
            session = resuser
            session.userid = "Spectateur"
            baliseUsername.innerHTML = session.userid
            console.log("Pas connecté")
        } else {
            // console.log(window.location.pathname.split('/').pop())
            session = resuser
            // console.log("url: " + session.url)

            console.log(session.userid)
            let baliseUsername = document.querySelector("#usernameID")
            baliseUsername.innerHTML = session.userid


        }
        fetch("/gameinfo/" + gameURL).then((gamedata) => {

            return gamedata.json()

        }).then(function (resgame) {

            game = resgame
            let baliseTitle = document.querySelector("#title")
            baliseTitle.innerHTML = "Betcha: " + game.name
            console.log(game.name)
            let baliseplayer1 = document.querySelector("#player1")
            let baliseplayer2 = document.querySelector("#player2")
            baliseplayer1.innerHTML = game.author
            baliseplayer2.innerHTML = game.adversary

            if(session.userid == game.author || session.userid == game.adversary){
                if(session.userid == game.author)
                {
                    fetch('/authorConnected/'+ gameURL)
                }
                else{
                    fetch('/adversaryConnected/'+ gameURL)
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

                baliseForm.appendChild(baliseInput)
                baliseForm.appendChild(baliseBtn)

            }

            setInterval(function(){

                fetch('/isAuth/' + gameURL).then((AuthData)=>{

                    return AuthData.json()

                }).then(function (resAuthData){
                    
                    // if()

                })
            },10000)
        })
    })

})