const express = require('express');
const app = express();
const path = require('path');
const PORT = 3000;
const bcrypt = require('bcrypt');
const cookieParser = require('cookie-parser');
const jwt = require('jsonwebtoken');

// setup socket io
const http = require('http');
const socketio = require('socket.io');
const server = http.createServer(app);
const io = socketio(server);

app.use(cookieParser());

// models
const userModel = require('./models/user');

// middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// set view engine
app.set('view engine', 'ejs');

// public folder access
app.use(express.static(path.join(__dirname, 'public')));

app.get('/', function (req, res) {
    res.render('index');
})

// register user
app.get('/register-user', function (req, res) {
    res.render('registration');
})

// login-user
app.get('/login-user', function (req, res) {
    res.render('login');
})

// landing page
app.get('/landing-page', isLoggedIn, function (req, res) {
    res.render('landingPage');
})

// chat id 
app.get('/chat-id', isLoggedIn, async function (req, res) {
    let user = await userModel.findOne({ email: req.user.email });
    res.render('chatid', { user });
})


// chatbox page
app.get('/chat-box', isLoggedIn, async function (req, res) {
    let chatid = req.query.chatid;
    let user = await userModel.findOne({ email: req.user.email });
    let username = user.username;
    // console.log(username);
    res.render('chatbox', { chatid, username });
})


// post method
app.post('/register-user-form', async function (req, res) {
    let { username, email, password, repeatpassword } = req.body;
    // console.log(req.body);
    if (!username || !email || !password || !repeatpassword) {
        return res.render('showMessage/notFound');
    }

    let user = await userModel.findOne({ email: email });
    if (user) {
        return res.render('showMessage/emailProblem');
    }

    if (password != repeatpassword) {
        return res.render('showMessage/notFound');
    }

    bcrypt.genSalt(10, function (err, salt) {
        bcrypt.hash(password, salt, async function (err, hash) {

            let createdUser = await userModel.create({
                username,
                email,
                password: hash,
                repeatpassword: hash
            })

            let token = jwt.sign({ email: createdUser.email, userId: createdUser._id }, 'shhhhhhhhhhhhhhhhhh');
            res.cookie('token', token);

            res.redirect('/login-user');
        })
    })

})

app.post('/login-user', async function (req, res) {
    let { email, password } = req.body;

    if (!email || !password) {
        return res.render('showMessage/notFound');
    }

    let user = await userModel.findOne({ email });
    if (!user) {
        return res.render('showMessage/emailProblem');
    }
    bcrypt.compare(password, user.password, function (err, result) {
        if (result) {
            let token = jwt.sign({ email: user.email, userId: user._id }, 'shhhhhhhhhhhhhhhhhh');
            res.cookie('token', token);
            res.redirect('/landing-page');
        }
        else {
            return res.render('showMessage/notFound');
        }
    })
})

app.post('/chat-id-form', isLoggedIn, function (req, res) {
    let { chatid } = req.body;
    if (!chatid) {
        return res.render('showMessage/noChatID');
    }
    res.redirect(`/chat-box?chatid=${chatid}`);
})

// Logout page
app.get('/logout', isLoggedIn, function (req, res) {
    res.cookie('token', "");
    res.redirect('/login-user');
})

function isLoggedIn(req, res, next) {
    let token = req.cookies.token;

    if (req.cookies.token === "") {
        return res.render('showMessage/somethingWrong');
    }
    else {
        try {
            let data = jwt.verify(req.cookies.token, 'shhhhhhhhhhhhhhhhhh');
            req.user = data;
        }
        catch (err) {
            return res.render('showMessage/somethingWrong');
        }
    }
    next();
}

io.on("connection", (socket) => {
    console.log("New user connected");

    socket.on("joinRoom", (chatid) => {
        socket.join(chatid);
        console.log(`User joined chatroom: ${chatid}`);
    });

    socket.on("sendMessage", ({ chatid, message, sender, timestamp }) => {
        // console.log(`Message from ${sender}: ${message}`); // Debugging
        io.to(chatid).emit("receiveMessage", { message, sender, timestamp });
    });


    socket.on("disconnect", () => {
        console.log("User disconnected");
    });
});

server.listen(PORT, function () {
    console.log(`Running the server at port ${PORT}`);
})