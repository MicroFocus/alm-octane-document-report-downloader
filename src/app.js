#!/usr/bin/env node

const { generateDocumentReport, downloadGeneratedReport } = require('./reports')
const { reportData } = require('./config/config')

const main = () => {
    generateDocumentReport().then(async (documentReport) => {
        await downloadGeneratedReport(documentReport.attachment_id, documentReport.file_name)
        console.log(`Report file ${documentReport.file_name} downloaded in ${reportData.saveLocation} directory.`)
    }).catch((e) => {
        console.log('Error', e)
    })
}

if (require.main === module) {
    main()
}



