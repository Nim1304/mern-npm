#!/usr/bin/node
const spawn = require('child_process').spawn;
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

const run = async () => {
    const args = new commander.Command('init-mern').version(require("./package.json").version)
        .option('-n, --projectname <projectname>', 'Give a project name (ignore the option in case don\'t want new directory)', 'mern')
        .option('-g, --git', 'Initialize with empty git repo', false)
        .option('-i, --install', 'Install Express App dependencied', false)
        .parse(process.argv)
    if (process.argv.length > 2) {
        args.projectname ? 1 : args['projectname'] = ''

        await createDir(args.projectname).then((data) => {
            console.log('\x1b[32m%s\x1b[0m', data);
        })

        await createReactApp(args.projectname).then((data) => {
            console.log('\x1b[32m%s\x1b[0m', "ReactJS Added");
        }).catch(err => {
            console.log('x1b[41m%s\x1b[0m', err);
        })

        fs.copy(path.join(__dirname, 'template/'), path.join(_cwd, args.projectname), async (err) => {
            if (!err) {
                var packageData = JSON.parse(fs.readFileSync(path.join(_cwd, args.projectname, 'package.json')))
                packageData['name'] = args.projectname;
                fs.writeFileSync(path.join(_cwd, args.projectname, 'package.json'), JSON.stringify(packageData, null, 2));
                console.log('\x1b[32m%s\x1b[0m', "Express App Generated");
            }
        })

        args.install ? installDep(args.projectname) : console.log('\x1b[41m%s\x1b[0m', "run npm install after finished setting up");
        args.git ? gitInit(args.projectname) : console.log('\x1b[41m%s\x1b[0m', "Git not initialized");
    } else {
        console.log('Things been a bit different since last update. The tool is now a complete CLI....:).\nRun with --help for...umm..help ;)')
    }
}

run();