#!/usr/bin/env node

/*!
* (c) Copyright 2022 Micro Focus or one of its affiliates.
*
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
*
* http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
*/

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



