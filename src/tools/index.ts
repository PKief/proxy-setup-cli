import { printInfo } from '../helpers';
import { Tool, UserInformation } from '../models';
import { configureBowerProxy } from './bower';
import { configureGitProxy } from './git';
import { configureGradleProxy } from './gradle';
import { configureMavenProxy } from './maven';
import { configureNPMProxy } from './npm';
import { configureYarnProxy } from './yarn';

/** Suported tools of this CLI that can be used behind a proxy. */
export const supportedtools = ['NPM', 'Yarn', 'Bower', 'Git', 'Maven', 'Gradle'].sort();

/** Toggle the proxy settings for each tool on and off. */
export const toggletoolsProxy = async (tools: Tool[], userInformation: UserInformation) => {
    try {
        for (let p of tools) {
            switch (p.name) {
                case 'NPM':
                    await configureNPMProxy(p.enableProxy, userInformation);
                    break;

                case 'Yarn':
                    await configureYarnProxy(p.enableProxy, userInformation);
                    break;

                case 'Git':
                    await configureGitProxy(p.enableProxy, userInformation);
                    break;

                case 'Bower':
                    await configureBowerProxy(p.enableProxy, userInformation);
                    break;

                case 'Maven':
                    await configureMavenProxy(p.enableProxy, userInformation);
                    break;

                case 'Gradle':
                    await configureGradleProxy(p.enableProxy, userInformation);
                    break;

                default:
                    console.warn(`Proxy settings for tool '${p.name}' not yet implemented!`);
                    break;
            }

            printInfo(p);
        }
    } catch {
        console.error('Error: Something went wrong while configuring the proxy configurations!');
    }
};
