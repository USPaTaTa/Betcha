document.addEventListener('DOMContentLoaded', async (req, res) => {

  fetch('/session').then((userdata) => {

      return userdata.json()

  }).then(function(resuser){
      if(resuser.userid == undefined || resuser.userid == null){
          console.log("Pas connecté")
      }else{
        window.location.replace("/betcha/list/list.html")
      }
  })
})

function signup() {
  document.querySelector(".login-form-container").style.cssText = "display: none;";
  document.querySelector(".signup-form-container").style.cssText = "display: block;";
  document.querySelector(".container").style.cssText = "background: linear-gradient(to bottom, rgb(156, 108, 26) rgb(255, 161, 0));";
  document.querySelector(".button-1").style.cssText = "display: none";
  document.querySelector(".button-2").style.cssText = "display: block";

};

function login() {
  document.querySelector(".signup-form-container").style.cssText = "display: none;";
  document.querySelector(".login-form-container").style.cssText = "display: block;";
  document.querySelector(".container").style.cssText = "background: linear-gradient(to bottom, rgb(46, 0, 0),  rgba(36, 0, 0));";
  document.querySelector(".button-2").style.cssText = "display: none";
  document.querySelector(".button-1").style.cssText = "display: block";

}