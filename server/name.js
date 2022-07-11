function checkValidName(name, socket, users) {
    if (name === "") {
        socket.emit("alert", "Please choose a name.");
    } else if (name.length > 20) {
        socket.emit("alert", "Please limit your name to 20 characters.");
    } else if (!name.match(/^[A-Za-z0-9_-]+$/g)) {
        socket.emit("alert", "Only letters, numbers and the characters _ - are allowed.");
    } else if (users.some((user) => user.name === name)) {
        socket.emit("alert", `The name ${name} is already taken.`);
    } else {
        return true;
    }
}

module.exports = { checkValidName };