const express = require("express");
const app = express();
const path = require("path");
const PORT = process.env.PORT || 3500;
const { logger } = require("./middleware/logger");
const errorHandler = require("./middleware/errorHandler");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const corsOptions = require("./config/corsOptions");

//MIDDLEWARES
//custom middlware
app.use(logger);

//process JSON- Inbuilt middleware
app.use(express.json());

app.use(cors(corsOptions));

//Third-party middleware
app.use(cookieParser());

app.use("/", express.static(path.join(__dirname, "public")));

app.use("/", require("./routes/root"));

app.all("*", (req, res) => {
  res.status(404);
  if (req.accepts("html")) {
    res.sendFile(path.join(__dirname, "views", "404.html"));
  } else if (req.accepts("json")) {
    res.json({ message: "404 Not Found" });
  } else {
    res.type("txt").send("404 Not Found");
  }
});

app.use(errorHandler);

app.listen(PORT, () => console.log(`Server serving on port ${PORT}`));
