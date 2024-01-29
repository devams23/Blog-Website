import bodyParser from "body-parser";
import express from "express";
import { dirname } from "path";
import { fileURLToPath } from "url";
import pg from "pg";

const __dirname = dirname(fileURLToPath(import.meta.url));
const app = express();
const port = 3000;
const fs = writeFile;
let contents = [];
var d = new Date();
var year = d.getFullYear();
//var read = express.Router()

// ----------------------- MAKING A DATABASE OBJECT ----------------------------
const db = new pg.Client({
  user: "postgres",
  host: "localhost",
  database: "blogs",
  password: "devam",
  port: 5432,
});
db.connect(); // ----------------------   CONNNECTING TO DATABASE ---------------
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));
//app.use('/read', read)
//this is new comment
//-------------------------------------------------------------------
app.get("/", async (req, res) => {
  const contents = await getitems();
  res.render("index.ejs", { contents: contents });
});
//-----------------------CREATE BLOG--------------------------------------
app.get("/createblog", (req, res) => {
  res.render("form.ejs", {
    change: "Create",
  });
});
//---------------------VIEW BLOG-----------------------------------
app.get("/read/:id", (req, res) => {
  const id = req.params.id;
  db.query("SELECT * FROM blogdata WHERE id = ($1)", [id], (error, result) => {
    if (error) {
      console.log(error.message);
    } else {
      //console.log(result.rows[0]);
      res.render("view.ejs", {
        content: result.rows[0],
        year: d.getFullYear(),
      });
    }
  });
  //res.send("okay");
});
//----------------------SUBMIT BLOG-----------------------------------
app.post("/submit", async (req, res) => {
  const title = req.body["title"];
  const content = req.body["content"];
  const dateres = await db.query(
    "SELECT TO_CHAR(NOW():: DATE, 'Mon dd, yyyy')"
  );
  const date = dateres.rows[0].to_char;
  await db.query(
    "INSERT INTO blogdata (title,content ,date) VALUES ($1,$2,$3)",
    [title, content, date]
  );
  res.redirect("/");
});
//------------------------FORM FOR EDIT BLOG ------------------------------------
app.get("/edit/:key", (req, res) => {
  const id = req.params.key;
  db.query("SELECT * FROM blogdata WHERE id = ($1)", [id], (error, result) => {
    if (error) {
      console.log(error.message);
    } else {
      //console.log(result.rows);
      res.render("editform.ejs", {
        ans: result.rows[0],
      });
    }
  });
});

//--------------------------EDIT BLOG CONTENT----------------------------------
app.post("/change/:key", async (req, res) => {
  const id = req.params.key;
  const {title , content} = req.body ;
  const dateres = await db.query(
    "SELECT TO_CHAR(NOW():: DATE, 'Mon dd, yyyy')"
  );
  const date = dateres.rows[0].to_char;
  console.log("new Title :" + title);
  console.log("new content :" + content);
  //console.log(contents);
  db.query("UPDATE blogdata SET title = ($1) , content = ($2),date = ($3) WHERE id = ($4) ",
   [title , content  , date ,id], (error, result) => {
    if (error) {
      console.log(error.message);
    } else {
      res.redirect("/");
    }
  });
});

//---------------------------DELETE BLOG---------------------------------
app.get("/delete/:key", (req, res) => {
  var id = req.params.key;
  //const val = { title: title, content: content, id: x };
  //console.log("new Title :" + title)
  //console.log(contents);
  db.query("DELETE FROM blogdata  WHERE id = ($1) ",
  [id], (error, result) => {
   if (error) {
     console.log(error.message);
   } else {
     res.redirect("/");
   }
 });
});
//-------------------------------------------------------------------
app.listen(port, () => {
  console.log(`Server started at http://localhost:${port}`);
});
////----------------------/-------------------------------------------------------
async function getitems() {
  let items = [];
  const resp = await db.query("SELECT * FROM blogdata");
  resp.rows.forEach((element) => {
    items.push(element);
  });
  return items;
}

///////----------------------------------------
