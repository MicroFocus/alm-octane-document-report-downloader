const Octane = require('@microfocus/alm-octane-js-rest-sdk').Octane
const OctaneVanilla = require('@microfocus/alm-octane-js-rest-sdk').OctaneVanilla

class OctaneUtils {

    static octane = undefined
    static octaneVanilla = undefined

    static getOctaneVanilla = ({ url, sharedSpace, workspace, clientId, clientSecret }) => {
        if (OctaneUtils.octaneVanilla) {
            return OctaneUtils.octaneVanilla
        }

        const urlData = url.split('://')

        const protocol = urlData[0]
        const splitByPort = urlData[1].split(':')
        const host = splitByPort[0]

        const portAndPath = splitByPort.length === 2 ? splitByPort[1] : undefined
        const port = portAndPath ? portAndPath.split('/')[0] : (protocol === 'https' ? 443 : 80)

        let pathPrefix = ''

        if (portAndPath) {
            const pathSegments = portAndPath.split('/')
            for (let i = 1; i < pathSegments.length; i++) {
                pathPrefix += '/' + pathSegments[i]
            }
        }

        OctaneUtils.octaneVanilla = new OctaneVanilla({
            protocol,
            host,
            pathPrefix,
            port,
            shared_space_id: sharedSpace,
            workspace_id: workspace
        })

        OctaneUtils.octaneVanilla.authenticate({
            client_id: clientId,
            client_secret: clientSecret
        }, (err) => {
            if (err) {
                console.log('Error - %s', err.message)
                return
            }
        })

        return OctaneUtils.octaneVanilla
    }

    static getOctane = ({ url, sharedSpace, workspace, clientId, clientSecret }) => {
        if (OctaneUtils.octane) {
            return OctaneUtils.octane
        }

        OctaneUtils.octane = new Octane({
            server: url,
            sharedSpace: sharedSpace,
            workspace: workspace,
            user: clientId,
            password: clientSecret
        })

        return OctaneUtils.octane
    }

}

module.exports = OctaneUtils

