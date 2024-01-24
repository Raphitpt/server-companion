const express = require("express");

const app = express();
const agendaRouter = require("./routes/agenda");
const userRouter = require("./routes/user");
const scolariteRouter = require("./routes/scolarite");

app.use(express.json());
app.use(
  express.urlencoded({
    extended: true,
  })
);

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log("Server Listening on PORT:", PORT);
});

app.get("/", (req, res) => {
  res.json({ message: "ok" });
});

// Agenda routes

app.use("/agenda/", agendaRouter);
app.use("/user/", userRouter);
app.use("/scolarite/", scolariteRouter);


