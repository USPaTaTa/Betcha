const mongoose = require('mongoose')
const express = require('express')
const sessions = require('express-session');
const mongoDBsession = require('connect-mongodb-session')(sessions);
const bcrypt = require('bcrypt')
const fs = require('fs');

const expressApp = express()
expressApp.use(express.static("public"))
expressApp.use(express.urlencoded({ extended: true }))

const saltRounds = 10;
const mongoURI = "mongodb://localhost:27017/betcha"


mongoose.connect(mongoURI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => console.log("à faire: Multiple session //" + " Connecté au serveur Mongo: " + mongoURI))
    .catch((error) => console.log(error.message))

const usersSchema = new mongoose.Schema({
    username: String,
    password: String,
});

const sessionSchema = new mongoose.Schema({
    session: {
        userid: String,
    }
})

const gameSchema = new mongoose.Schema({
    name: String,
    author: String,
    adversary: String,
    link: String,
    statut: String,
    nbAuthor: Number,
    nbAdversary: Number,
    authorisAuth: Boolean,
    adversaryisAuth: Boolean,
    round:{
        round1: Number,
        round2: Number,
        round3: Number,
        round4: Number,
        round5: Number,
        round6: Number,
        round7: Number,
        round8: Number,
        round9: Number,
        round10: Number,
        round11: Number,
        round12: Number,
        round13: Number,
        round14: Number,
        round15: Number,
        round16: Number,
        round17: Number,
        round18: Number,
        round19: Number,
        round20: Number,
    }
})

const store = new mongoDBsession({
    uri: mongoURI,
    collection: 'sessions'
})

const Session = mongoose.model("Session", sessionSchema)
const User = mongoose.model("User", usersSchema)
const Game = mongoose.model("Game", gameSchema)


const oneDay = 1000 * 60 * 60 * 24;
expressApp.use(sessions({
    secret: "thisismysecrctekeyfhrgfgrfrty84fwir767",
    saveUninitialized: false,
    cookie: { maxAge: oneDay },
    resave: false,
    store: store
}));

expressApp.post("/signup", (req, res) => {
    // console.log("inscription: " + req.body.username + " | " + req.body.password)

    User.findOne({ 'username': req.body.username }, function (err, userbdd) {
        if (err) {
            console.log(err)
        } else if (userbdd === null || !userbdd) {
            console.log('Utilisateur libre')
            bcrypt.genSalt(saltRounds, function (err, salt) {
                bcrypt.hash(req.body.password, salt, function (err, hash) {

                    const hashed = hash

                    bcrypt.compare(req.body.password, hashed, function (err, result) {
                        if (result) {
                            req.body.password = hashed

                            // On crée une instance du Model
                            let monUtilisateur = new User(req.body);
                            // On le sauvegarde dans MongoDB
                            monUtilisateur.save(function (err) {
                                if (err) { throw err; }
                                req.session.userid = req.body.username
                                console.log('Utilisateur ajouté à la bdd');

                                res.redirect("/betcha/list/list.html")
                            });
                        }
                    });
                });
            });
        } else {
            console.log("Cet utilisateur existe déjà")
            res.redirect("/")
        }

    });
})

expressApp.post("/signin", (req, res) => {
    // console.log(req.session)
    User.findOne({ 'username': req.body.username }, function (err, userbdd) {
        if (err) {
            console.log(err)
        } else if (userbdd === null || !userbdd) { //Verification si utilisateur existant
            console.log("Cet utilisateur n'existe pas")
            res.redirect("/")
        } else {
            Session.findOne({ 'userid': req.body.username }, 'userid', function (err, sessionbdd) { //Verification si session ouverte
                if (err) {
                    console.log(err)
                } else if (sessionbdd === null || !userbdd) {
                    User.findOne({ 'username': req.body.username }, 'username password', function (err, userbdd) {
                        if (err) return handleError(err);
                        bcrypt.compare(req.body.password, userbdd.password, function (err, result) { //Vérification mot de passe
                            if (result) {
                                console.log("Connexion validé")
                                req.session.userid = req.body.username

                                res.redirect("/betcha/list/list.html")
                            } if (!result) {
                                console.log("Mot de passe incorrect")
                                res.redirect("/")
                            }
                        });
                    });
                } else {
                    console.log("Une session est déjà ouverte")
                    req.session.userid = req.body.username
                    res.redirect("/betcha/list/list.html")
                }
            })

        }

    });
})

expressApp.post("/logout", (req, res) => {

    req.session.destroy((err) => {
        if (err) throw err;

        res.redirect('/')

    });

})

expressApp.post("/creategame", (req, res) => {

    const randomLink = makeid(5)

    req.body.author = req.session.userid
    req.body.link = "/betcha/game/" + randomLink + ".html"
    req.body.statut = "En attente des joueurs"
    req.body.nbAuthor = 100
    req.body.nbAdversary = 100
    req.body.authorisAuth = false
    req.body.adversaryisAuth = false
    // req.round = 0
    fs.copyFile("./public/betcha/game/game.html", "./public/betcha/game/" + randomLink + ".html", (err) => {
        if (err) {
            console.log(err)
        }
    })

    // On crée une instance du Model
    let maPartie = new Game(req.body);
    // On le sauvegarde dans MongoDB
    maPartie.save()
})

expressApp.delete("/deletegame/:id", (req, res) => {

    Game.findOne({ 'name': req.params.id }, 'name link', async function (err, gamebdd) {

        await Game.deleteOne({ 'name': req.params.id })

        fs.unlink("./public" + gamebdd.link, function (err) {
            if (err) {
                // console.log(err)
            }
        });


    })
})

expressApp.get('/authorConnected/:id',(req,res)=>{

    Game.findOneAndUpdate({"link": "/betcha/game/" + req.params.id},{"authorisAuth": true},function (err){
        if(err){
            console.log(err)
        }
    })
})

expressApp.get('/adversaryConnected/:id',(req,res)=>{

    Game.findOneAndUpdate({"link": "/betcha/game/" + req.params.id},{"adversaryisAuth": true},function (err){
        if(err){
            console.log(err)
        }
    })
})

expressApp.get('/session', (req, res) => {

    res.json(req.session)

})

expressApp.get('/users', (req, res) => {

    User.find({}, 'username', function (err, userbdd) {

        res.json(userbdd)

    })

})

expressApp.get('/games', (req, res) => {
    Game.find({}, 'name author adversary link statut nbAuthor nbAdversary', function (err, gamebdd) {
        res.json(gamebdd)
    })
})

expressApp.get('/gameinfo/:id', (req, res) => {

    // console.log("GAME INFO URL: " + req.params.id)
    Game.findOne({ 'link': "/betcha/game/" + req.params.id }, 'name author adversary link statut nbAuthor nbAdversary authorisAuth adversaryisAuth', function (err, gamebdd) {

        res.json(gamebdd)

    })

})

function makeid(length) {
    var result = '';
    var characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    var charactersLength = characters.length;
    for (var i = 0; i < length; i++) {
        result += characters.charAt(Math.floor(Math.random() *
            charactersLength));
    }
    return result;
}

expressApp.listen(3000)