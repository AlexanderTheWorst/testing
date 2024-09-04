import e from "express";
import * as path from "path";

const app = e()

app.set('views', path.join(__dirname, "views"));
app.set('view engine', 'html');
app.engine('html', require('ejs').renderFile);
app.use("/static", e.static(path.join(__dirname, "static")));

app.get("/", (req, res) => {
    res.render("index.html")
})

app.get("/hey", (req, res) => {
    res.json({
        thing: true
    })
})

app.listen(3000, () => console.log(`*3000`));
