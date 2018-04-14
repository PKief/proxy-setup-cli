import * as inquirer from 'inquirer';
import { execSync } from 'child_process';
import { UserInformation, Platform } from './models';
import * as os from 'os';
import * as path from 'path';
import * as fs from 'fs';

console.log('\n---------------------------\n- DEVELOPMENT PROXY SETUP -\n---------------------------\n');

const supportedplatforms = ['NPM', 'Yarn', 'Bower', 'Git', 'Maven', 'Gradle'];
const homeDirectory = os.homedir();

const selectplatforms = () => {
    inquirer.prompt([{
        type: 'checkbox',
        name: 'platforms',
        message: 'Mark platform to enable / unmark to disable proxy settings',
        choices: supportedplatforms,
    }]).then(async (answers: { platforms: string[] }) => {
        let platforms: Platform[] = answers.platforms.map(p => ({ name: p, enabled: true }));
        const disabled: Platform[] = supportedplatforms.filter(p => answers.platforms.indexOf(p) === -1).map(p => ({ name: p, enabled: false }));
        platforms = [...platforms, ...disabled];

        let userInformation: UserInformation;

        if (answers.platforms.length > 0) {
            userInformation = <UserInformation>await getUserInformation();
        }

        try {
            toggleplatformsProxy(platforms, userInformation);
        } catch (err) {
            console.error(err);
        }
    });
};

const toggleplatformsProxy = (platforms: Platform[], userInformation: UserInformation) => {
    platforms.forEach(p => {
        switch (p.name) {
            case 'NPM':
                configureNPMProxy(p.enabled, userInformation);
                break;

            case 'Yarn':
                configureYarnProxy(p.enabled, userInformation);
                break;

            case 'Git':
                configureGitProxy(p.enabled, userInformation);
                break;

            case 'Bower':
                configureBowerProxy(p.enabled, userInformation);
                break;

            default:
                console.warn(`Proxy settings for platform '${p.name}' not yet implemented!`);
                break;
        }
    });
};

const getUserInformation = () => {
    const questions: inquirer.Questions = [{
        type: 'input',
        name: 'host',
        message: 'Proxy host:',
        validate: inputValidation
    },
    {
        type: 'input',
        name: 'port',
        message: 'Proxy port:',
        validate: inputValidation
    },
    {
        type: 'input',
        name: 'username',
        message: 'Username:',
    },
    {
        type: 'password',
        message: 'Password:',
        name: 'password',
    }];
    return inquirer.prompt(questions);
};

const inputValidation = (value: string) => {
    if (value.trim().length > 0) {
        return true;
    }

    return 'This field must not be empty!';
};

const configureNPMProxy = (enableProxy: boolean, u: UserInformation) => {
    if (enableProxy) {
        execSync(`npm config set proxy http://${u.username}:${u.password}@${u.host}:${u.port}`);
        execSync(`npm config set https-proxy http://${u.username}:${u.password}@${u.host}:${u.port}`);
        console.info('✅  NPM proxy enabled!');
    } else {
        execSync(`npm config rm proxy`);
        execSync(`npm config rm https-proxy`);
        console.info('❌  NPM proxy disabled!');
    }
};

const configureYarnProxy = (enableProxy: boolean, u: UserInformation) => {
    if (enableProxy) {
        execSync(`yarn config set proxy http://${u.username}:${u.password}@${u.host}:${u.port}`);
        execSync(`yarn config set https-proxy http://${u.username}:${u.password}@${u.host}:${u.port}`);
        console.info('✅  Yarn proxy enabled!');
    } else {
        execSync(`yarn config delete proxy`);
        execSync(`yarn config delete https-proxy`);
        console.info('❌  Yarn proxy disabled!');
    }
};

const configureGitProxy = (enableProxy: boolean, u: UserInformation) => {
    if (enableProxy) {
        execSync(`git config --global http.proxy http://${u.username}:${u.password}@${u.host}:${u.port}`);
        execSync(`git config --global https.proxy http://${u.username}:${u.password}@${u.host}:${u.port}`);
        console.info('✅  Git proxy enabled!');
    } else {
        try {
            execSync(`git config --global --unset http.proxy`);
            execSync(`git config --global --unset https.proxy`);
        } catch { } finally {
            console.info('❌  Git proxy disabled!');
        }
    }
};

const configureBowerProxy = async (enableProxy: boolean, u: UserInformation) => {
    const filePath = path.join(homeDirectory, '.bowerrc');
    const configfileExists = await checkIfFileExists(filePath);

    const proxySettings = enableProxy ? {
        'proxy': `http://${u.username}:${u.password}@${u.host}:${u.port}`,
        'https-proxy': `http://${u.username}:${u.password}@${u.host}:${u.port}`
    } : {};

    if (configfileExists === true) {
        const config = JSON.parse(fs.readFileSync(filePath, 'utf8'));
        if (enableProxy) {
            config['proxy'] = proxySettings['proxy'];
            config['https-proxy'] = proxySettings['https-proxy'];
            fs.writeFileSync(filePath, JSON.stringify(config, undefined, 2));
            console.info('✅  Bower proxy enabled!');
        } else {
            delete config['proxy'];
            delete config['https-proxy'];
            fs.writeFileSync(filePath, JSON.stringify(config, undefined, 2));
            console.info('❌  Bower proxy disabled!');
        }
    } else {
        if (enableProxy) {
            fs.writeFileSync(filePath, JSON.stringify(proxySettings, undefined, 2));
        }
    }

    // if (enableProxy) {
    //     if (configfileExists) {

    //     } else {

    //     }
    // } else {

    // }
};

selectplatforms();

const checkIfFileExists = (path: string): Promise<boolean> => {
    return new Promise((resolve, reject) => {
        fs.stat(path, (err, stat) => {
            if (!err) {
                resolve(true);
            } else if (err.code === 'ENOENT') {
                resolve(false);
            }
        });
    });
};
