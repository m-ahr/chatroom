//const { setTopic } = require("../server/topic");

// Client
const socket = io();    // Socket objekt wird eingebracht

 socket.on("connect", () => {
    console.log("hi, ich bin verbunden");
}); // damit der Server verbunden ist

socket.on("userNumber", (number) => {
    $("#userNumberSpan").text(number);  // User verlässt den Raum und die Anzeige soll aktualisiert werden
});

// Login Button
$('#loginButton').click(loginAttempt);
$('#nameInput')
    .focus()
    .keydown((e) => {
        if (e.key === "Enter") loginAttempt();
    });

function loginAttempt() {
    const name = $("#nameInput").val();     // Wert von NameInput
    socket.emit('loginAttempt', name);      // an den Server geht ein Paket mit dem Inhalt Name
    console.log('Versuch dich einzuloggen!');
}

socket.on("alert", (txt) => {
    $('#loginAlert').text(txt).addClass('alert');
    setTimeout(() => {
        $('#loginAlert').removeClass('alert');
    },1500);
});

socket.on('login', () => {
    $('#loginForm').hide();             // ohne JQuery würde das ganze so aussehen:  document.getElementById("loginForm").style.display= "none";
    $('#room').show();
    $('#messageSubmit').click(submitMessage);
    $('#messageInput')
    .focus()
    .keydown((e) => {
        if (e.key === "Enter") submitMessage();
    });
    $('#logoutButton').show().click(logout);        //Logout Button wird gezeigt
    $('#topicInput').keyup(changeTopic);
   
    socket.on('serverMessage', displayMessage); 
    socket.on('user', showUser);
    socket.on('removeUser', removeUser);
    socket.on('topic', setTopic);
    socket.on('kick', kick);
});

function logout() {         // LOGOUT
    location.reload();
}
// User wird wegen Spam gekickt
function kick() {
    setTimeout(() => {
        logout();
    }, 4000);
}
// Nachricht schreiben
function submitMessage(){
    let text = $('#messageInput').val();
    socket.emit('clientMessage', text);     // schickt an den Server
    $('#messageInput').val('').focus();     // nachricht wird gelöscht und wir können eine neue Nachricht schreiben
}

////////////////////////////////
// aktuelle User anzeigen lassen
function showUser(user) {
    const userSpan = $("<span></span>")
        .text(user.name)
        .css("color", user.color)
        .addClass("userSpan")
        .attr("title", `Sende ${user.name} eine private Nachricht!`)
        .attr("name", user.name)
        .click(() => {
            $("#messageInput")
                .val($("#messageInput").val() + ` [@${user.name}] `)
                .focus();
        });
    $("#userList").append(userSpan);
}
// User entfernen
function removeUser(user) {
    $(`[name = ${user.name}]`).remove();
}

// Zeit anzeigen lassen
function getTime(){
    const currentDate = new Date();
     const timeOption = {hour: "2-digit", minute: "2-digit"};
    return currentDate.toLocaleTimeString([], timeOption);
}

////////////////////////////////////////
// Nachricht -- // in JS: timeStamp = document.createElement('span')

const messages = document.getElementById("messages");

function displayMessage(serverMessage) {
    const timeStamp = $("<span></span>").text(getTime()).addClass("timeStamp");
    const userInfo = $("<span></span>")
        .text(`${serverMessage.name}: `)
        .css("color", serverMessage.color);
    const messageText = $("<span></span>")
        .text(serverMessage.text)
        .css("color", serverMessage.color)
        .css("font-style", serverMessage.style);
    const message = $("<div></div>")
        .addClass("message")
        .append(timeStamp)
        .append(userInfo)
        .append(messageText);
    $("#messages")
        .append(message)
        .scrollTop(function () {
            return this.scrollHeight;
        });
}

function changeTopic() {
    socket.emit('topic', $("#topicInput").val());
}

function setTopic(topic) {
    $('#topicInput').val(topic);
}