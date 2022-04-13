const yargs = require('yargs')
const path = require('path')
const fs = require('fs')
const validator = require('validator')

let connectionData = {}
let reportData = {}

yargs.command({
    command: 'useEnvFile',
    describe: 'Specify a path of a .env file to get the properties',
    builder: {
        path: {
            describe: '.env file path',
            demandOption: true,
            type: 'string'
        }
    },
    handler(argv) {
        const envPath = path.join(process.cwd(), argv.path)

        if (!fs.existsSync(envPath)) {
            throw new Error('There is no .env file defined in the given path!')
        }

        require('dotenv').config({ path: envPath })

        if (!(process.env.OCTANE_URL
            && process.env.OCTANE_SHARED_SPACE
            && process.env.OCTANE_WORKSPACE
            && process.env.OCTANE_CLIENT_ID
            && process.env.OCTANE_CLIENT_SECRET
            && process.env.DOCUMENT_REPORT_SAVE_LOCATION
            && process.env.DOCUMENT_REPORT_TEMPLATE_NAME)) {
            throw new Error('There are properties missing from the .env file!')
        }

        connectionData = {
            url: process.env.OCTANE_URL,
            sharedSpace: process.env.OCTANE_SHARED_SPACE,
            workspace: process.env.OCTANE_WORKSPACE,
            clientId: process.env.OCTANE_CLIENT_ID,
            clientSecret: process.env.OCTANE_CLIENT_SECRET
        }
        reportData = {
            saveLocation: process.env.DOCUMENT_REPORT_SAVE_LOCATION,
            templateName: process.env.DOCUMENT_REPORT_TEMPLATE_NAME
        }
    }
})

yargs.command({
    command: 'useArgs',
    describe: 'Specify the properties as command line arguments',
    builder: {
        octaneUrl: {
            type: 'string',
            describe: 'ALM Octane URL',
            demandOption: true
        },
        sharedSpace: {
            type: 'number',
            describe: 'ALM Octane Shared Space ID',
            demandOption: true
        },
        workspace: {
            type: 'number',
            describe: 'ALM Octane Workspace ID',
            demandOption: true
        },
        clientId: {
            type: 'string',
            describe: 'ALM Octane Client ID',
            demandOption: true
        },
        clientSecret: {
            type: 'string',
            describe: 'ALM Octane Client Secret',
            demandOption: true
        },
        templateName: {
            type: 'string',
            describe: 'Name of the saved report document template in ALM Octane',
            demandOption: true
        },
        saveLocation: {
            type: 'string',
            describe: 'Path of the destination directory for the downloaded report',
            demandOption: true
        }
    },

    handler(argv) {
        connectionData = {
            url: argv.octaneUrl,
            sharedSpace: argv.sharedSpace,
            workspace: argv.workspace,
            clientId: argv.clientId,
            clientSecret: argv.clientSecret
        }
        reportData = {
            saveLocation: argv.saveLocation,
            templateName: argv.templateName
        }
    }
})

yargs.demandCommand(1)
yargs.parse()

if (!validator.isURL(connectionData.url, { protocols: [ 'http', 'https' ], require_protocol: true, require_tld: false})) {
    throw new Error('A valid url must be provided for the octaneUrl property.')
}

module.exports = { connectionData, reportData }