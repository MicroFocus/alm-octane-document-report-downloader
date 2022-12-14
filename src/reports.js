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

const fs = require('fs')
const Octane = require("@microfocus/alm-octane-js-rest-sdk").Octane
const Query = require('@microfocus/alm-octane-js-rest-sdk/lib/query')
const poll = require('./utils/requestUtils')
const { connectionData, reportData } = require('./config/config')

const octane = new Octane({ ...connectionData, headers: { 'ALM-OCTANE-PRIVATE': true } })

const documentReportTemplateFields = [
    'header',
    'show_author',
    'print_title_page',
    'print_toc',
    'file_name',
    'ignore_default_footer',
    'report_entries',
    'ignore_default_logo',
    'show_date',
    'title',
    'description',
    'document_type',
    'ignore_default_header',
    'footer',
    'document_orientation',
    'logo'
]

const getDocumentReportTemplate = async (templateName) => {
    const templates = await octane
        .get('report_configurations')
        .fields(documentReportTemplateFields)
        .query(
            Query.field('name')
                .equal(templateName)
                .build()
        )
        .execute()

    if (templates.data.length === 0) {
        throw new Error('A template file with the name \'' + templateName + '\' does not exist.')
    }

    if (templates.data.length > 1) {
        throw new Error('There are more than one template with the name \'' + templateName + '\'.')
    }

    return templates.data[0]
}

const getTaskResult = async (taskId) => {
    const tasks = await octane.get('background_tasks').fields('status', 'result').query(Query.field('id').equal(taskId).build()).execute()

    const task = tasks.data[0]

    if (!task) {
        throw new Error('No task was found with the id of ' + taskId)
    }

    if (task.status === 'Finished') {
        return task.result
    } else if (task.status === 'Error') {
        throw new Error(task.result.description)
    } else {
        return undefined
    }
}

const prepareTemplateForGenerating = (template) => {
    const date = new Date()
    template.file_name = `${template.file_name}_${date.getDate()}_${date.getMonth() + 1}_${date.getFullYear()}_${date.getHours()}_${date.getMinutes()}_${date.getSeconds()}`
    delete template.type
    delete template.id
    delete template.workspace_id
    return template
}

const generateDocumentReport = async () => {
    const template = await getDocumentReportTemplate(reportData.templateName)
    const documentReport = prepareTemplateForGenerating(template)

    const req = await octane.create('reports', documentReport)
    req._requestBody = documentReport

    const { background_task_id: taskId } = await req.execute()

    return await poll(getTaskResult, [taskId], 120000, 3000)
}

const downloadGeneratedReport = async (attachmentId, fileName) => {
    const attachmentContent = await octane.getAttachmentContent(Octane.entityTypes.attachments).at(attachmentId).execute()
    const saveLocation = reportData.saveLocation

    if (!fs.existsSync(saveLocation)) {
        fs.mkdirSync(saveLocation, { recursive: true })
    }

    fs.writeFileSync(saveLocation + '/' + fileName, attachmentContent)
}

module.exports = { generateDocumentReport, downloadGeneratedReport }