# octane-document-report-downloader

## How to install

### Install locally

- Download the project locally
- Navigate inside the project
- run `npm i -g`
- You can now run `npx octane-document-report-downloader` command from anywhere using a terminal

### Run directly from the npm registry

- Directly run `npx octane-document-report-downloader` command so that npm automatically downloads and runs the tool

## How to use

The tool can be run using two types of configuration:
- Command line argument configuration
- Environment file configuration (.env file)

### Running using command line arguments

#### Command to execute: `npx octane-document-report-downloader useArgs`

#### Required command line arguments:
* `--octaneUrl` - ALM Octane URL


* `--sharedSpace` - ALM Octane shared space ID


* `--workspace` - ALM Octane workspace ID


* `--clientId` - ALM Octane Client ID


* `--clientSecret` - ALM Octane Client Secret


* `--templateName` - Name of the saved report document template in ALM Octane


* `--saveLocation` - Path of the destination directory for the downloaded report

#### Example:
``` shell
npx octane-document-report-downloader useArgs --octaneUrl="http://localhost:8080" --sharedSpace=1001 --workspace=1002 --clientId="MyClientId" --clientSecret="MyClientSecret" --templateName="MyCustomTemplate" --saveLocation="reports"
```
A report will be generated using the `MyCustomTemplate` template and it will be downloaded inside the `reports/` directory.
If the directory does not exist then it will be automatically created.

### Running using an environment file

#### Command to execute: `npx octane-document-report-downloader useEnvFile`

Create a file with the `.env` extension (you can also name it just .env).
The file should contain the following properties:

```
OCTANE_URL=
OCTANE_SHARED_SPACE=
OCTANE_WORKSPACE=
OCTANE_CLIENT_ID=
OCTANE_CLIENT_SECRET=
DOCUMENT_REPORT_TEMPLATE_NAME=
DOCUMENT_REPORT_SAVE_LOCATION=
```

#### Required command line arguments:

* `--path` - The relative path to the `.env` config file

#### Example:

Created a subdirectory in the current directory named `config` and inside it a file named `.env` with the following structure:

#### config/.env
```
OCTANE_URL="http://localhost:8080"
OCTANE_SHARED_SPACE=1001
OCTANE_WORKSPACE=1002
OCTANE_CLIENT_ID="MyClientId"
OCTANE_CLIENT_SECRET="MyClientSecret"
DOCUMENT_REPORT_TEMPLATE_NAME="MyCustomTemplate"
DOCUMENT_REPORT_SAVE_LOCATION="reports"
```

Run the command:
```shell
npx octane-document-report-downloader useEnvFile --path="config/.env"
```
A report will be generated using the `MyCustomTemplate` template and it will be downloaded inside the `reports/` directory.
If the directory does not exist then it will be automatically created.

## Limitations

* The tool requires that the Report Document Template name is unique inside ALM Octane
* Widgets are supported in document reports starting with ALM Octane version 16.0.400
* Octane might timeout for reports containing more than 4 widgets (ALM Octane Limitation)