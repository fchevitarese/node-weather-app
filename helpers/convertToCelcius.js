const convertToCelcius = (temperature) => {
    let temp = temperature - 32;
    return Math.round(temp * 5 / 9);
}

module.exports = {
    convertToCelcius
}