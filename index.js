#!usr/bin/env node
const { spawn } = require('child_process');
const inquirer = require('inquirer');
const path = require('path');
const _cwd = process.cwd();
const fs = require('fs-extra');

const createDir = (name)=>{
    return new Promise((resolve,reject)=>{
        fs.mkdirs(path.join(_cwd,`${name}`)).then(()=>{
            resolve('Directory Created')
        }).catch(err=> reject(err));
    });
}

const createReactApp = (name)=>{
    return new Promise((resolve,reject)=>{
        spawn('npx',['create-react-app','client'],{
            cwd: path.join(_cwd,name),
            stdio:"inherit"
        })
        resolve('success');
    })
}
const run = async () => {
    const questions = await inquirer.prompt([
        {
            type: 'input',
            name: 'projectName',
            message: 'What is the name of the project? (Use small letters and without space)'
        }
    ]);
    // console.log(questions);
    // var a=spawn('ls',['-al'],{
    //     cwd:path.join(_cwd,'template'),
    //     stdio:"inherit"
    // });
    // console.log(a);
    await createDir(questions.projectName);
    // await createReactApp(questions.projectName);
    fs.copySync(path.join(__dirname,'template/'),path.join(_cwd,questions.projectName));

}

run();