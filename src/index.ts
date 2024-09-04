import e from "express";
import * as path from "path";
import { request } from "undici";

const app = e()

type response = {
    username: string,
    discriminator: string,
    code: number
}

app.set('views', path.join(__dirname, "views"));
app.set('view engine', 'html');
app.engine('html', require('ejs').renderFile);
app.use("/static", e.static(path.join(__dirname, "static")));

app.get("/", (req, res) => {
    res.render("index.html")
})

app.get("/oauth", async ({ query }, res) => {
    const { code } = query as {
        code: string
    };

    try {
        const tokenResponseData = await request('https://discord.com/api/oauth2/token', {
            method: 'POST',
            body: new URLSearchParams({
                client_id: "988949929328250890",
                client_secret: "lwGMrcCpOzp-_KVAe_EBHBVGPKKcGey6",
                code,
                grant_type: 'authorization_code',
                redirect_uri: `http://localhost:3000/oauth`,
                scope: 'identify guilds'
            }).toString(),
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
        });

        const oauthData = await tokenResponseData.body.json() as {
            token_type: string,
            access_token: string,
            expires_in: number,
            refresh_token: string,
            scope: string,
            state?: string,

            error?: string,
            error_description?: string
        };

        console.log(oauthData)
        if (oauthData.error && oauthData.error_description) {
            res.redirect(`/?error=${oauthData.error_description}`);
            return;
        }

        res.cookie("access_token", oauthData.access_token);
        res.cookie("token_type", oauthData.token_type);
        res.cookie("refresh_token", oauthData.refresh_token);
        res.redirect('/')
    } catch (error) {
        // NOTE: An unauthorized token will not throw an error
        // tokenResponseData.statusCode will be 401
        console.error(error);
        res.send("There was an error with your request.")
    }
})

app.get("/test", (req, res) => res.send("test"))

app.listen(3000, () => console.log(`*3000`));
