let session

document.addEventListener('DOMContentLoaded', async (req, res) => {

    fetch('/session').then((userdata) => {

        return userdata.json()

    }).then(function (resuser) {
        if (resuser.userid == undefined || resuser.userid == null) {
            console.log("pas d'utilisateur pour cette session")
            window.location.replace("/")
        } else {
            session = resuser
            console.log(session.userid)
            let baliseUsername = document.querySelector("#usernameID")
            baliseUsername.innerHTML = session.userid

            fetch('/users').then((usersdata) => {

                return usersdata.json()

            }).then(function (resusersdata) {
                let baliseSelect = document.querySelector("#adversarySelect")
                for (const [i, user] of resusersdata.entries()) {     //entries permet d'iterer sur tous les éléments du tableau
                    // console.log("users", user);
                    let baliseOption = document.createElement("option");
                    baliseOption.innerText = user.username;
                    baliseOption.value = user.username
                    baliseOption.id = user.username
                    baliseSelect.appendChild(baliseOption)

                }
                let baliseOptionUser = document.querySelector("#" + session.userid)
                baliseOptionUser.remove(session.userid)
            })

            fetch('/games').then((gamesdata) => {

                return gamesdata.json()

            }).then(function (resgamesdata) {

                let baliseList = document.querySelector("#listGame")
                for (const [i, game] of resgamesdata.entries()) {
                    let balisetr = document.createElement("tr")
                    let balisetd1 = document.createElement("td")
                    let balisetd2 = document.createElement("td")
                    let balisetd3 = document.createElement("td")
                    let balisetd4 = document.createElement("td")
                    let balisetd5 = document.createElement('td')
                    let balisea1 = document.createElement("a")
                    let balisea2 = document.createElement("a")
                    let balisea3 = document.createElement("a")
                    let balisea4 = document.createElement("a")
                    let balisea5 = document.createElement("a")
                    let btnjoin = document.createElement("button")


                    baliseList.appendChild(balisetr)

                    balisetr.appendChild(balisetd1)
                    balisetr.appendChild(balisetd2)
                    balisetr.appendChild(balisetd3)
                    balisetr.appendChild(balisetd4)
                    balisetr.appendChild(balisetd5)

                    balisea5.appendChild(btnjoin)

                    balisetd1.appendChild(balisea1)
                    balisetd2.appendChild(balisea2)
                    balisetd3.appendChild(balisea3)
                    balisetd4.appendChild(balisea4)
                    balisetd5.appendChild(balisea5)

                    balisea5.href = game.link

                    btnjoin.className = "btn btn-primary"
                    btnjoin.name = "de10"
                    btnjoin.innerText = "Rejoindre"


                    balisetd1.className = "text-center"
                    balisetd2.className = "text-center"
                    balisetd3.className = "text-center"
                    balisetd4.className = "text-center"
                    balisetd5.className = "text-center"

                    balisea1.id = "nameID"
                    balisea2.id = "authorID"
                    balisea3.id = "adversaryID"
                    balisea4.id = "statutID"

                    balisea1.innerText = game.name
                    balisea2.innerText = game.author
                    balisea3.innerText = game.adversary
                    balisea4.innerText = game.statut

                    balisea1.name = "name"
                    balisea2.name = "author"
                    balisea3.name = "adversary"
                    balisea4.name = "statut"

                    if (game.author == session.userid) {
                        let btndelete = document.createElement("button")
                        balisetd5.appendChild(btndelete)
                        btndelete.className = "btn btn-danger glyphicon glyphicon-remove row-remove"
                        btndelete.name = "de10"
                        btndelete.innerText = "Supprimer"

                        btndelete.addEventListener("click", function () {

                            fetch("/deletegame/" + game.name, { method: "DELETE" })
                            setTimeout(() => { window.location.reload() }, 10);

                        })
                    }
                }
            })
        }
    })
})

$(document).ready(function () {
    $("#add_row").on("click", function () {
        // Dynamic Rows Code

        // Get max row id and set new id
        var newid = 0;
        $.each($("#tab_logic tr"), function () {
            if (parseInt($(this).data("id")) > newid) {
                newid = parseInt($(this).data("id"));
            }
        });
        newid++;

        var tr = $("<tr></tr>", {
            id: "addr" + newid,
            "data-id": newid
        });

        // loop through each td and create new elements with name of newid
        $.each($("#tab_logic tbody tr:nth(0) td"), function () {
            var td;
            var cur_td = $(this);

            var children = cur_td.children();

            // add new td and element if it has a nane
            if ($(this).data("name") !== undefined) {
                td = $("<td></td>", {
                    "data-name": $(cur_td).data("name")
                });

                var c = $(cur_td).find($(children[0]).prop('tagName')).clone().val("");
                c.attr("name", $(cur_td).data("name") + newid);
                c.appendTo($(td));
                td.appendTo($(tr));
            } else {
                td = $("<td></td>", {
                    'text': $('#tab_logic tr').length
                }).appendTo($(tr));
            }
        });

        $(tr).appendTo($('#tab_logic'));

        $(tr).find("td button.row-remove").on("click", function () {
            $(this).closest("tr").remove();
        });
    });

    function gameinfo(){
        
    }

});