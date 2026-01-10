//Mine may be a little diffrent than yours so you can change it a bit.
var pageBefore = document.getElementById("page");
document.body.style.backgroundImage = "url('https://img.freepik.com/premium-photo/cracked-wall-background-cracked-dry-ground_553949-249.jpg')";
const Modtitle = document.createElement("h1");
Modtitle.textContent = "BAD BOY";
Modtitle.style.textAlign = "center";
Modtitle.style.fontSize = "50px";
Modtitle.style.fontFamily = "Impact";
Modtitle.style.color = "red";
const ModtitleDes = document.createElement("h1");
ModtitleDes.textContent = "An added Gibberfish mod by Ian";
ModtitleDes.style.textAlign = "center";
ModtitleDes.style.color = "white";
const ModDisableWrap = document.createElement("div"); //Adult
ModDisableWrap.align = "Assets/Badboy_disable.png";
const ModDisable = document.createElement("img");
ModDisable.src = "Assets/Badboy_disable.png";

document.body.appendChild(Modtitle);
document.body.appendChild(ModtitleDes);
document.body.appendChild(ModDisableWrap);
ModDisableWrap.appendChild(ModDisable);

//In Progress
