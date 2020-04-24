#!/usr/bin/node
const { spawn } = require('child_process');
const inquirer = require('inquirer');
const path = require('path');
const _cwd = process.cwd();
const fs = require('fs-extra');

const createDir =(name)=>{
    return new Promise((resolve,reject)=>{
        fs.mkdirs(path.join(_cwd,`${name}`)).then(()=>{
            resolve('Directory Created');
        }).catch(err=> reject(err));
    });
}

const createReactApp = (name)=>{
    return new Promise((resolve,reject)=>{
        spawn('npx',['create-react-app','client'],{
            cwd: path.join(_cwd,name),
            stdio:"inherit"
        });
        resolve('success');
    })
}

const installDep =(name)=>{
    return new Promise((resolve,reject)=>{
        spawn('npm',['install'],{
            cwd:path.join(_cwd,name),
            stdio:'inherit'
        });
        resolve('success');
    })
}

const gitInit = (name)=>{
    spawn('git',['init'],{
        cwd : path.join(_cwd,name),
        stdio:'inherit'
    });
}

const run = async () => {
    const questions = await inquirer.prompt([
        {
            type: 'input',
            name: 'projectName',
            message: 'What is the name of the project? (Use small letters and without space)'
        },
        {
            type: 'confirm',
            name:"installDep",
            message:"Install Node Modules for Express App?(y)",
            default: "yes"
        },
        {
            type:'confirm',
            name:'gitInit',
            message: "Initialize with git ?",
            default :'no'
        }
    ]);
    console.log(questions);
    await createDir(questions.projectName).then((data)=>{
        console.log('\x1b[32m%s\x1b[0m',"Directory Created");
    })

    await createReactApp(questions.projectName).then((data)=>{
        console.log('\x1b[32m%s\x1b[0m',"ReactJS Added");
    })

    fs.copy(path.join(__dirname,'template/'),path.join(_cwd,questions.projectName),(err)=>{
        if(!err)
            console.log('\x1b[32m%s\x1b[0m',"Express App Generated");
    })

    questions.installDep ? installDep(questions.projectName) : console.log('\x1b[41m%s\x1b[0m',"run npm install after finished setting up");
    questions.gitInit ? gitInit(questions.projectName) : console.log('\x1b[41m%s\x1b[0m',"Git not initialized");
}

run();