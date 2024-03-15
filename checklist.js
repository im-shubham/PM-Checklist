const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const session = require('express-session');
const app = express();

// Express session middleware
app.use(session({
    secret: 'your_secret_key', // Change this to a random string
    resave: false,
    saveUninitialized: false
}));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

// Connect to MongoDB using Mongoose
mongoose.connect("mongodb+srv://shubhamuploaddocuments:Shubham09@clustershubham.rmls33c.mongodb.net/pmChecklist", {
    useNewUrlParser: true,
    useUnifiedTopology: true
});

const db = mongoose.connection;

db.on("error", console.error.bind(console, "MongoDB connection error:"));
db.once("open", () => {
    console.log("Connected to MongoDB!");
});

// Define a Mongoose schema for your data
const Schema = mongoose.Schema;
const userSchema = new Schema({
    employeeID: String,
    name: String,
    department: String,
    team: String,
    accessID: String
});

// Create a Mongoose model based on the schema
const UserModel = mongoose.model("User", userSchema);

// Route to serve index.html
app.get("/", (req, res) => {
    res.sendFile(__dirname + "/public/index.html");
});

// Route to insert user data
app.post("/insert_user", (req, res) => {
    var { employeeID, name, department, team, accessID } = req.body;

    var data = {
        employeeID: employeeID,
        name: name,
        department: department,
        team: team,
        accessID: accessID
    };

    db.collection("teplempdetails").insertOne(data, (err, collection) => {
        if (err) {
            console.error(err);
            return res.status(500).send("Internal Server Error");
        }
        console.log("Record inserted successfully");
        res.redirect("record_added.html");
    });
});


// Route for user login
app.post("/login_user", (req, res) => {
    var { employeeID, accessID } = req.body;

    db.collection("teplempdetails").findOne({ employeeID, accessID })
        .then(user => {
            if (!user) {
                return res.status(401).send("Invalid employeeID or accessID");
            }

            req.session.userId = user._id;
            // Redirect to the login success page
            res.redirect("/home");
        })
        .catch(err => {
            console.error(err);
            res.status(500).send("Internal Server Error");
        });
});
// Route to render home page
app.get("/home", (req, res) => {
    if (!req.session.userId) {
        return res.redirect("/login");
    }
    res.sendFile(__dirname + "/public/home.html");
});




// Route to logout
app.get("/logout", (req, res) => {
    req.session.destroy((err) => {
        if (err) {
            console.error(err);
            return res.status(500).send("Internal Server Error");
        }
        res.redirect("/login");
    });
});

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
