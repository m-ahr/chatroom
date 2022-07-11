let currentTopic = "";

function setTopic(socket, topic) {
    currentTopic = topic;
    socket.broadcast.emit("topic", topic);
}

module.exports = { currentTopic, setTopic };
