const users = [];

function removeUser(user) {
    const i = users.indexOf(user);
    users.splice(i, 1);
}

function getUserById(id) {
    return users.find((user) => user.id === id);
}

function getUserByName(name) {
    return users.find((user) => user.name === name);
}

function regExp() {
    const regStr = users.map((x) => `\\[@${x.name}\\]`).join("|");
    return RegExp(regStr, "g");
}

module.exports = { users, removeUser, getUserById, getUserByName, regExp };
