var express = require("express");
var path = require("path");
var fs = require("fs");

var app = express();
var PORT = process.env.PORT || 3000;

//=========================================================
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
//=========================================================
app.get("/", function (req, res) {
  res.sendFile(path.join(__dirname, "/public/index.html"));
});
app.get("/notes", function (req, res) {
  res.sendFile(path.join(__dirname, "/public/notes.html"));
});
//===========================================================

app.use(express.static("public"));
//===========================================================
app.get("/api/notes", function(req, res) {
      fs.readFile("./db/db.json", function(err, data) {
        
        res.json(JSON.parse(data));
       });
    });
//=========================================================
app.post("/api/notes", function (req, res) {
  console.log(req.body);
  const newNotes = req.body;

fs.readFile("./db/db.json", "utf8", function (error, data) {
  if (error) {
    return console.log(error);
  }
  
  const notes = JSON.parse(data);
  newNotes.id = notes[notes.length - 1].id + 1;
  console.log("it works");
  notes.push(newNotes);
  console.log(notes);
  fs.writeFile("./db/db.json", JSON.stringify(notes), function (err) {
    if (err) {
      return console.log(err);
    }
    
    console.log("Success!");
    res.json(notes);
  });
});
});

//============================================================
app.delete("/api/notes/:id", function (req, res) {
  const note = req.params.id;
  fs.readFile("./db/db.json", "utf8", function (error, data){
    
    const notes= JSON.parse(data);
   
    for(const currentNote of notes)
        if(currentNote.id == note)
            notes.splice(notes.indexOf(currentNote),1);
  
    for(let i = 0; i < notes.length; i++)
        notes[i].id = i + 1;
    
    fs.writeFile("./db/db.json", JSON.stringify(notes), function (err) {
        if(err) throw err;
        console.log("File Updated");
    });
   
    return res.json(notes);
});

});




app.listen(PORT, function () {
  console.log("Server 3000");
});

