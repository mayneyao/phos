const path = require("path")
const fs = require('fs')

let swPath = path.resolve(__dirname, 'src', 'sw.js')
var customSwConfig = fs.readFileSync(swPath, 'utf8');

const CRA_BUILD_SW_PATH = path.resolve(__dirname, 'build', 'service-worker.js')

try {
    fs.appendFileSync(CRA_BUILD_SW_PATH, customSwConfig);
    console.log('sw build ok😀');
} catch (err) {
    /* Handle the error */
    console.log(err)
}