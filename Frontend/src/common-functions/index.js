const hex_to_ascii = (str1) => {
    var hex = str1.toString();
    var str = "";
    for (var n = 0; n < hex.length; n += 2) {
        str += String.fromCharCode(parseInt(hex.substr(n, 2), 16));
    }
    return str;
};
const mimeTypeMapping = {
    jpeg: "image/jpeg",
    jpg: "image/jpeg",
    png: "image/png",
    apng: "image/apng",
    avif: "image/avif",
    webp: "image/webp",
    svg: "image/svg+xml",
};
export { hex_to_ascii, mimeTypeMapping };
