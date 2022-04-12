const { generateDocumentReport, downloadGeneratedReport } = require('./reports')

generateDocumentReport().then(async (documentReport) => {
    await downloadGeneratedReport(documentReport.attachment_id, documentReport.file_name)
    console.log(`Report file ${documentReport.file_name} downloaded in ${process.env.DOCUMENT_REPORT_SAVE_LOCATION} directory.`)
}).catch((e) => {
    console.log('Error', e)
})

