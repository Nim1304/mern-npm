#!usr/bin/env node
const { spawn } = require('child_process');
const inquirer = require('inquirer');
const path = require('path');
const _cwd = process.cwd();
const fs = require('fs-extra');

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
    
    createDir('hi');
    fs.copySync(path.join(__dirname,'template/'),path.join(_cwd,'hi'));

}

run();