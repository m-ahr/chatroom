const { io, botName } = require("./server.js");
const { getUserById } = require("./users.js");

const SocketAntiSpam = require("socket-io-anti-spam");

const socketAntiSpam = new SocketAntiSpam({
    banTime: 10,
    kickThreshold: 10,
    kickTimesBeforeBan: 3,
    banning: true,
    io: io,
});

socketAntiSpam.event.on("kick", (socket, data) => {
    io.to("users").emit("serverMessage", {
        name: botName,
        text: `${getUserById(socket.id).name} wird wegen Spam gekickt`,
        color: "yellow",
        style: "italic",
    });
    socket.emit("kick");
});