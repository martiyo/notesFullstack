require("dotenv").config();
const express = require("express");
const app = express();
const cors = require("cors");
const Note = require("./models/note");

app.use(express.json());
app.use(cors());
app.use(express.static("build"));

const requestLogger = (request, response, next) => {
  console.log("Method:", request.method);
  console.log("Path:  ", request.path);
  console.log("Body:  ", request.body);
  console.log("---");
  next();
};

app.use(requestLogger);

app.get("/", (request, response) => {
  response.send("<h1>Hello World!</h1>");
});

app.get("/api/notes", (request, response) => {
  Note.find({}).then((notes) => {
    response.json(notes);
  });
});

app.get("/api/notes/:id", (request, response) => {
  Note.findById(request.params.id).then((note) => {
    response.json(note);
  });
});

app.delete("/api/notes/:id", (request, response) => {
  Note.findByIdAndDelete(request.params.id, (err) => {
    if (err) console.log(err);
    console.log("Deleted");
  });

  response.status(204).end();
});

app.post("/api/notes", (request, response) => {
  const body = request.body;

  if (body.content === undefined) {
    return response.status(400).json({
      error: "content missing",
    });
  }

  const note = new Note({
    content: body.content,
    important: body.important || false,
    date: new Date(),
  });

  note.save().then((savedNote) => {
    response.json(savedNote);
  });
});

const unknowEndpoint = (request, response) => {
  response.status(404).send({ error: "unknow endpoint" });
};

const PORT = process.env.PORT;
app.listen(PORT);
console.log(`Server running on port ${PORT}`);
