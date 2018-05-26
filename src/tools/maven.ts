import * as fs from 'fs';
import * as _set from 'lodash.set';
import * as path from 'path';
import * as xml2js from 'xml2js';
import { checkIfFileExists, getHomeDirectory } from '../helpers';
import { UserInformation } from '../models';

export const configureMavenProxy = (enableProxy: boolean, u: UserInformation) => {
    return new Promise(async (resolve, reject) => {
        const filePath = path.join(getHomeDirectory(), '.m2', 'settings.xml');
        const configfileExists = await checkIfFileExists(filePath);

        // new proxy object
        const newProxy = enableProxy ? {
            id: [u.host],
            active: ['true'],
            protocol: ['http'],
            host: [u.host],
            port: [u.port],
            username: [u.username],
            password: [u.password],
        } : {};

        if (configfileExists === true) {
            const mavenXML = fs.readFileSync(filePath, 'utf8');

            // parse xml file to js object
            xml2js.parseString(mavenXML, (err, result) => {
                if (err) console.log(err);

                if (enableProxy) {
                    _set(result, 'settings.proxies', [{ proxy: [newProxy] }]);
                } else {
                    _set(result, 'settings.proxies', [{ proxy: [{}] }]);
                }

                // build new xml object
                const builder = new xml2js.Builder();
                const xml = builder.buildObject(result);
                fs.writeFileSync(filePath, xml);
            });
            resolve();
        } else {
            if (enableProxy) {
                // create complete new config
                const newConfig = {
                    settings: { proxies: [{ proxy: [newProxy] }] }
                };

                // build new xml object
                const builder = new xml2js.Builder();
                const xml = builder.buildObject(newConfig);
                try {
                    fs.writeFileSync(filePath, xml);
                } catch {
                    console.error('Error: Something went wrong while configuring the proxy for Maven! \nPlease check if the \'.m2\'-folder exists in your home-directory!');
                }
            }
            resolve();
        }
    });
};
