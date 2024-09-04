import * as discordHelper from "/static/discordapi-helper.js";

function getCookies(params) {
  /*
    {
      cookieName: cookieValue,
    }
  */
  let cookies = {}
  document.cookie.split("; ").forEach(element => {
    cookies[element.split("=")[0]] = element.split("=")[1]
  });
  return cookies
}

function getOauthLink() {
  return `https://discord.com/oauth2/authorize?client_id=988949929328250890&response_type=code&redirect_uri=http%3A%2F%2Flocalhost%3A3000%2Foauth&scope=identify+guilds`
}

window.onload = async () => {
  let cookies = getCookies();
  document.querySelector("#base-button-1").textContent = !cookies[
    "access_token"
  ]
    ? "Login"
    : "Dashboard";

  const user_info_text = document.querySelector("#navbar-user-info");
  if (cookies["access_token"]) {
    let response = await fetch("https://discord.com/api/users/@me", {
      headers: {
        authorization: `${cookies["token_type"]} ${cookies["access_token"]}`,
      },
    });
    let body = await response.json();

    user_info_text.innerText = `@${body.username}`;
    user_info_text.parentElement.style.position = "initial";
    user_info_text.parentElement.style.display = "block";

    (async () => {
      let response = await fetch("https://discord.com/api/users/@me/guilds", {
        headers: {
          authorization: `${cookies["token_type"]} ${cookies["access_token"]}`,
        },
      });
      let body = await response.json();
      body.forEach(guild => {
        if (discordHelper.parsePermissionsInGuild(guild).MANAGE_GUILD)
          console.log(guild.name)
      })
    })();
  } else {
    user_info_text.parentElement.style.display = "none";
    user_info_text.parentElement.style.position = "absolute";
  }
};

document.querySelector("#base-button-1").onclick = () => {
  let cookies = getCookies();
  if (!cookies["access_token"]) {
    window.location.href = getOauthLink();
  }
};

document.querySelector("#expand").addEventListener("click", function () {
  const pages = document.querySelector("#navbar");
  let bool = pages.getAttribute("expanded");
  bool ^= true;
  pages.setAttribute("expanded", bool);
});
