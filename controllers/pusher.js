const pusher = require('pusher');
require('dotenv').config()

const severpusher = new pusher({
    appId: process.env.appId,
    key: process.env.key,
    secret:process.env.secret,
    cluster: "ap1",
    useTLS: true
})

module.exports = { severpusher }