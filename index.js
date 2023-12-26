import bodyParser from "body-parser";
import express from "express";
import { dirname } from "path";
import { fileURLToPath } from "url";
import writeFile from "fs";
import { unlink } from "fs";
const __dirname = dirname(fileURLToPath(import.meta.url));
const app = express();
const port = 3000;
const fs = writeFile;
let contents = [];
var d = new Date();
var year = d.getFullYear();
//var read = express.Router()

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));
//app.use('/read', read)
//this is new comment
//-------------------------------------------------------------------
app.get("/", (req, res) => {
  res.render("index.ejs", { contents });
});
//-------------------------------------------------------------------
app.get("/createblog", (req, res) => {
  res.render("form.ejs", {
    change: "Create",
  });
});
//-------------------------------------------------------------------
app.get("/read/:id", (req, res) => {
  res.sendFile(__dirname + `/public/html/index${req.params.id}.html`);
});
//-------------------------------------------------------------------
app.post("/submit", (req, res) => {
  const title = req.body["title"];
  const content = req.body["content"];
  const x = contents.length;
  const val = { title: title, content: content, id: x };
  contents.push(val);
  //console.log(contents);

  var html_con = generateHtml(title, content);

  fs.writeFile(`public/html/index${x}.html`, html_con, function (err) {
    if (err) {
      return console.log(err);
    }

    console.log("The file was saved!");
  });
  res.redirect("/");
});
//-------------------------------------------------------------------
app.get("/edit/:key", (req, res) => {
  const ans = getdetails(contents , req.params.key);
  //console.log(ans)
  res.render("editform.ejs", {ans, });
});

//-------------------------------------------------------------------
app.get("/delete/:key", (req,res)=>{
  
  var x = req.params.key;
  //const val = { title: title, content: content, id: x };
  //console.log("new Title :" + title)
  //console.log(contents);
  x = Number(x);
  console.log(contents);
  // Use filter to create a new array without the object with the specified ID
  contents = contents.filter(obj => obj.id !== x);
  console.log(contents);
  unlink(`public/html/index${x}.html`, (err) => {
    if (err) throw err;
    console.log(`public/html/index${x}.html was deleted`);
  });
  res.redirect("/");
});


//-------------------------------------------------------------------
app.post("/change/:key", (req,res)=>{
  
  const x = req.params.key;
  //const val = { title: title, content: content, id: x };
  //console.log("new Title :" + title)
  //console.log(contents);
  console.log(contents);
  setdetails(contents ,x ,req.body["content"], req.body["title"]);
  console.log(contents);
  var html_con = generateHtml(req.body["title"], req.body["content"]);
  fs.writeFile(`public/html/index${x}.html`, html_con, function (err) {
    if (err) {
      return console.log(err);
    }

    console.log("The file was saved!");
  });
  res.redirect("/");
});



//-------------------------------------------------------------------
app.listen(port, () => {
  console.log(`Server started at http://localhost:${port}`);
});

function getdetails(contents ,key) {
  //console.log(key)
  let ans = null;
  contents.forEach(element=> {
    if (element.id === Number(key)) {
       ans = { t: element.title, c: element.content , id:key};
      //console.log(ans)
    }
  });
  return ans;
}
// function removedetails(contents ,key) {
//   //console.log(key)
//   contents.forEach(element=> {
//     if (element.id === Number(key)) {
//        delete  element.title;
//        delete element.content;
//        delete element.id;
//       //console.log(ans)
//     }
//   });
// }
function setdetails(con ,key ,content, title) {
  //console.log(key)
  con.forEach(element => {
    if (element.id === Number(key)) {
       element.content = content;
       element.title  = title;
       
    }
  });
  
}
function generateHtml(title, content) {
  const m = d.getMonth() + 1;
  const date = "      " + d.getDate() + "/" + m + "/" + d.getFullYear();
  let html = 
  `<!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>My Blog</title>
      <link rel="shortcut icon" href="/images/logo.png" type="image/x-icon">
      
      <style>
      body {
        font-family: 'Arial', sans-serif;
        background-color: #222;
        color: #ddd;
        margin: 0;
        padding: 0;
      }
      h3{
        margin-left:5%;
      }
      header {
        background-color: #333;
        color: #fff;
        padding: 20px;
        text-align: center;
      }
  
      main {
        max-width: 800px;
        margin: 20px auto;
        padding: 20px;
        background-color: #333;
        box-shadow: 0 0 10px rgba(255, 255, 255, 0.1);
        border-radius: 10px;
      }
  
      article {
        margin-bottom: 30px;
      }
  
      h2 {
        color: #4caf50;
      }
  
      p {
        line-height: 1.6;
        font-size:1em;
      }
  
      footer {
        background-color: #333;
        color: #fff;
        text-align: center;
        padding: 10px;
        position: fixed;
        bottom: 0;
        width: 100%;
      }
      </style>
    </head>
    <body>
    
      <header>
        <h1>${title}</h1>
      </header>
      <h3>Date:${date}</h3>
      <main>
        <article>
          <p>${content}</p>
        </article>
        <!-- Add more articles as needed -->
      </main>
    
      <footer>
      
        &copy; ${year} My Blog
      </footer>
    
    </body>
    </html>
    
    `;
  return html;
}
