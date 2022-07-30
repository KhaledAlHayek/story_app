const path = require("path");
const express = require("express");
const connectDb = require("./config/db");
const morgan = require("morgan");
const expressHandlebars = require("express-handlebars").engine;
const passport = require("passport");
const session = require("express-session");
const MongoStore = require("connect-mongo");
const methodOverride = require("method-override");

// import Routes
const IndexRouter = require("./routes/index");
const AuthRouter = require("./routes/auth");
const StoryRouter = require("./routes/story");

// load config 
require("dotenv").config({ path: "./config/config.env" });

// passport config
require("./config/passport")(passport);

connectDb();

// init app
const app = express();

// body parser to accept form data
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// method override
app.use(methodOverride(function (req, res) {
  if (req.body && typeof req.body === 'object' && '_method' in req.body) {
    let method = req.body._method
    delete req.body._method
    return method
  }
}))

// logging
if(process.env.NODE_ENV === "development"){
  app.use(morgan("dev"));
}

// handlebars helpers
const { formatDate, stripTags, editIcon, select } = require("./helpers/hbs");

// Handlebars
app.engine(".hbs", expressHandlebars({ helpers: { formatDate, stripTags, editIcon, select }, defaultLayout: "main", extname: ".hbs" }));
app.set("view engine", ".hbs");
app.set("views", "./views");

// session
app.use(session({
  secret: 'keyboard cat',
  resave: false,
  saveUninitialized: false,
  store: MongoStore.create({ mongoUrl: process.env.MONGO_URI })
}));

// passport middleware
app.use(passport.initialize());
app.use(passport.session());

// set global variable
app.use((req, res, next) => {
  res.locals.user = req.user || null;
  next();
});

// static folder
app.use(express.static(path.join(__dirname, "public")));

// routes
app.use("/", IndexRouter);
app.use("/auth", AuthRouter);
app.use("/stories", StoryRouter);

// connect to server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`);
});