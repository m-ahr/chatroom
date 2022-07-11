// Server
// console.log("Hi... from Server");
const express = require("express");     //import-Statement
const app = express();
const PORT = process.env.PORT || 3000;

const server = app.listen(PORT, () => 
    console.log(`Der Server läuft auf: http://localhost:3000/`));

app.use(express.static("client"));      // Ordner client / index.html wird geladen

// Socket.io
const socket = require("socket.io");    //import-Statement
const io = socket(server);
const botName = "Chatbot";

module.exports = { io, botName };
require('./spam.js');
// Module
const { users, removeUser, getUserById, getUserByName, regExp } = require('./users.js');
const {checkValidName} = require('./name.js');      // Import der folgenden Variablen aus den jeweiligen Dateien
const { getRandomColor } = require("./color.js");
const { currentTopic, setTopic} = require('./topic.js');
//////////////////////////////////////////////////////////////
// hier wird gesagt was mit einer einzelnen verbindung passieren soll
io.on("connect", (socket) => {                              // console.log(socket.id);
    io.emit("userNumber", users.length);                    // Userzahl sichtbar
    socket.on('loginAttempt', (name) => {
        if (checkValidName(name, socket, users)) {
            addUser(socket, name);  // wenn der Name gecheckt wurde will ich den User hinzufügen
        }
    });

    socket.on('clientMessage', (text) => sendMessage(socket,text)); // Registrierung von der client.js
    socket.on('topic', topic => setTopic(socket,topic));
    socket.on('disconnect', () => removeSocket(socket));
});

// User hinzufügen
function addUser(socket,name) {
    socket.join('users');                     // Gruppe wird erstellt ansonsten tritt der Socket der Gruppe bei
    socket.emit('login');
    io.to('users').emit('serverMessage', {      //alle werden informiert, wer beigetreten ist
        name: botName,
        text: `${name} hat den Raum betreten!`,
        color: "#13a837",
        style: "italic",
    });
    for (const otherUser of users) {
        socket.emit('user', otherUser);
    }
    const user = {id: socket.id, name: name, color: getRandomColor() };
    users.push(user);
    io.emit("userNumber", users.length);            // Update der Userzahl  
    io.to("users").emit("user", user);
    socket.emit('topic', currentTopic);
}

// User entfernen
function removeSocket(socket) {
    const user = getUserById(socket.id);
    if (!user) return;
    io.to('users').emit('serverMessage', {
        name: botName,
        text: `${user.name} hat den Raum verlassen!`,
        color: "#af1000",
        style: "italic",
    });
    socket.leave("users");
    removeUser(user);
    io.emit("userNumber", users.length);            // Update der Userzahl  
    io.to("users").emit("removeUser", user);
}

//////////////////////////////////////////////

function sendMessage(socket,text) {
    if(text.length === 0) return;               // wenn der Text leer ist wird nix gemacht
    if(text.length > 300 ) {                    // wenn es mehr als 280 Zeichen sind emitten wir eine Severmessage
        socket.emit('serverMessage',{
            name: botName,
            text: "Du musst deine Nachricht auf 300 Zeichen beschränken!",
            color: "white",
            style: "italic",
        });
        return;
    }
    const user = getUserById(socket.id);
    if (!user) return;
    let recipients, sender;
    const matches = text.match(regExp());
    if (matches) {
        recipients = [socket.id];
        sender = `${user.name} (PM)`;
        for (const match of matches) {
            const privateName = match.substring(2, match.length - 1);
            const privateUser = getUserByName(privateName);
            if (privateUser && privateUser.id !== socket.id) {
                recipients.push(privateUser.id);
            }
        }
    } else {
        recipients = ["users"];
        sender = user.name;
    }
    for (const recipient of recipients) {
        io.to(recipient).emit("serverMessage", {
            name: sender,
            text: text,
            color: user.color,
            style: "normal",
        });
    }
}

