#!usr/bin/env node
const { spawn } = require('child_process');
const inquirer = require('inquirer');
const path = require('path');

const createDir = (name)=>{
    spawn('mkdir',[`${name}`],{
        cwd:process.cwd()
    })
}


const run = async () => {
    var a = await inquirer.prompt([
        {
            type: 'list',
            name: 'frontend',
            message: 'What frontend do you want to use?',
            choices: [{ name: "Yes", value: "yes" }, { name: "No", value: "no" }]
        },
        {
            type: 'list',
            name: 'frontend1',
            message: 'What frontend do you want to use?',
            choices: [{ name: "Yes", value: "yes" }, { name: "No", value: "no" }]
        }
    ]);

    spawn('git', ['status'], {
        cwd: process.cwd(),
        detached: true,
        stdio: "inherit"
    });
    createDir('hii');
    changeDir(__dirname);
    console.log(a);
}

run();