function randInt(a, b) {
    return a + Math.floor(Math.random() * (b - a));
}

function getRandomColor() {
    const focusColor = randInt(200, 255);
    const otherColor1 = randInt(100, 255);
    const otherColor2 = randInt(100, 255);
    const index = randInt(0, 3);
    const colors = [otherColor1, otherColor2];
    colors.splice(index, 0, focusColor);
    return `rgb(${colors.join(",")})`;
}

module.exports = { getRandomColor };