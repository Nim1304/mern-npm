#!/usr/bin/node
const spawn = require('child_process').spawn;
const inquirer = require('inquirer');
const path = require('path');
const fs = require('fs-extra');
const commander = require('commander');
const _cwd = process.cwd();

const createDir = (name) => {
    return new Promise((resolve, reject) => {
        if (name == '')
            resolve('Kept Directory')
        else
            fs.mkdirs(path.join(_cwd, `${name}`)).then(() => {
                resolve('Directory Created');
            }).catch(err => reject(err));
    });
}

const createReactApp = (name) => {
    return new Promise((resolve, reject) => {
        const command = spawn('npx', ['create-react-app', 'client'], {
            cwd: path.join(_cwd, name),
            stdio: "inherit"
        });
        command.on('close', _ => {
            resolve();
        })
        command.on('error', err => {
            reject(err);
        })
    })
}

const installDep = (name) => {
    return new Promise((resolve, reject) => {
        const command = spawn('npm', ['i', 'express', 'mongoose', 'body-parser', 'cookie-parser', 'path'], {
            cwd: path.join(_cwd, name),
            stdio: 'inherit'
        });
        command.on('close', _ => {
            resolve();
        })
        command.on('error', err => {
            reject(err);
        })
    })
}

const gitInit = (name) => {
    spawn('git', ['init'], {
        cwd: path.join(_cwd, name),
        stdio: 'inherit'
    });
}

const showHelp = () => {
    console.log("There's been some changes since last update... :)\n");
    console.log("usage: init-mern [<projectname>] [options]\n\n");
    console.log("Options:\n");
    console.log(` -g, --git         Initialize with git repo\n -i, --install     Install Express App dependencies\n -h, --help        Show this help menu`);
}
const run = async () => {
    if (process.argv.length > 2) {
        const questions = await inquirer.prompt([
            {
                type: 'input',
                name: 'projectName',
                message: 'What is the name of the project? (Use small letters and without space, leave blank for using current directory)'
            },
            {
                type: 'confirm',
                name: "installDep",
                message: "Install Node Modules for Express App?(y)",
                default: "yes"
            },
            {
                type: 'confirm',
                name: 'gitInit',
                message: "Initialize with git ?",
                default: 'no'
            }
        ]);
        // console.log(questions);
        questions.projectName = questions.projectName.trim()
        console.log(questions)
        await createDir(questions.projectName).then((data) => {
            console.log('\x1b[32m%s\x1b[0m', data);
        })

        await createReactApp(questions.projectName).then((data) => {
            console.log('\x1b[32m%s\x1b[0m', "ReactJS Added");
        }).catch(err => {
            console.log('x1b[41m%s\x1b[0m', err);
        })

        fs.copy(path.join(__dirname, 'template/'), path.join(_cwd, questions.projectName), async (err) => {
            if (!err) {
                var packageData = JSON.parse(fs.readFileSync(path.join(_cwd, questions.projectName, 'package.json')))
                packageData['name'] = questions.projectName;
                fs.writeFileSync(path.join(_cwd, questions.projectName, 'package.json'), JSON.stringify(packageData, null, 2));
                console.log('\x1b[32m%s\x1b[0m', "Express App Generated");
            }
        })

        questions.installDep ? installDep(questions.projectName) : console.log('\x1b[41m%s\x1b[0m', "run npm install after finished setting up");
        questions.gitInit ? gitInit(questions.projectName) : console.log('\x1b[41m%s\x1b[0m', "Git not initialized");
    } else {
        console.log('lol');
    }
}

// run();
// showHelp()

const args = commander.program
                        .option('-g, --git','Initialize with empty git repo',false)
                        .option('-i, --install','Install Express App dependencied',false).parse(process.argv);

console.log(args);
