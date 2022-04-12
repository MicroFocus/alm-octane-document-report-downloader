require('dotenv').config()

const connectionData = {
    url: process.env.OCTANE_URL,
    sharedSpace: process.env.OCTANE_SHARED_SPACE,
    workspace: process.env.OCTANE_WORKSPACE,
    clientId: process.env.OCTANE_CLIENT_ID,
    clientSecret: process.env.OCTANE_CLIENT_SECRET
}

module.exports = connectionData