import * as fs from 'fs';
import * as path from 'path';
import * as properties from 'properties';
import { checkIfFileExists, getHomeDirectory } from '../helpers';
import { UserInformation } from '../models';

export const configureGradleProxy = (enableProxy: boolean, u: UserInformation) => {
    return new Promise(async (resolve, reject) => {
        const filePath = path.join(getHomeDirectory(), '.gradle', 'gradle.properties');
        const configfileExists = await checkIfFileExists(filePath);

        const newSettings = {
            'systemProp.http.proxyHost': u ? u.host : '',
            'systemProp.http.proxyPort': u ? u.port : '',
            'systemProp.http.proxyUser': u ? u.username : '',
            'systemProp.http.proxyPassword': u ? u.password : '',
            'systemProp.https.proxyHost': u ? u.host : '',
            'systemProp.https.proxyPort': u ? u.port : '',
            'systemProp.https.proxyUser': u ? u.username : '',
            'systemProp.https.proxyPassword': u ? u.password : '',
        };

        if (configfileExists === true) {
            properties.parse(filePath, { path: true }, (error, obj) => {
                if (error) return console.error(error);

                if (enableProxy) {
                    fs.writeFileSync(filePath, properties.stringify({ ...obj, ...newSettings }));
                } else {
                    Object.keys(newSettings).forEach(k => {
                        delete obj[k];
                    });
                    fs.writeFileSync(filePath, properties.stringify(obj));
                }
                resolve();
            });
        } else {
            if (enableProxy) {
                // create complete new config
                try {
                    fs.writeFileSync(filePath, properties.stringify(newSettings));
                } catch {
                    console.error('Error: Something went wrong while configuring the proxy for Gradle! \nPlease check if the \'.gradle\'-folder exists in your home-directory!');
                }
            }
            resolve();
        }
    });
};
