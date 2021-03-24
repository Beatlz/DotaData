// import painter from "table-on-canvas";
const painter = require("table-on-canvas");

const table = async() => {
    //1. create a table
    await painter.createTable();

    //2. add header for your table
    painter.addHeader({'title': 'title', 'detail': 'detail', 'nums': 'nums'}, { color: 'green'});

    //3. add rows for the table
    painter.addRow({'title': 'hero', 'detail': 'am coming', 'nums': 34}, { color: 'yellow'});
    painter.addRow({'title': "what's your name", 'detail': 'you are welcome.', 'nums': '789788999'}, { color: 'green'});

    //4. draw the table on the canvas

    let canvas = await painter.drawTable();
    let base64 = await canvas.toDataURL().split("base64,").pop();

    console.log(base64, typeof base64);

    return base64;
    // console.log(base64);
}

export default table;