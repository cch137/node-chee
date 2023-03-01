const fs = require('fs');
const path = require('path');
const chee = require('@cch137/chee');
const { execSync } = require('child_process');


let CONFIG_PATH;

Object.defineProperty(chee, 'CONFIG_PATH', {
  get() {
    return CONFIG_PATH;;
  },
  set(newValue) {
    CONFIG_PATH = newValue;
    chee.config = require(newValue);
    chee.saveConfig = () => {
      fs.writeFileSync(CONFIG_PATH, JSON.stringify(chee.config, null, 4), {encoding: 'utf8'});
    }
  }
});

chee.walkdir = (_dir, type=1) => {
  _dir = path.resolve(_dir);
  const filepathList = [];
  for (const f of fs.readdirSync(_dir)) {
    const itemPath = path.join(_dir, f);
    const isDir = fs.statSync(itemPath).isDirectory();
    switch (type) {
      case 1: // files only
        if (isDir) filepathList.push(...chee.walkdir(itemPath));
        else filepathList.push(itemPath);
        break;
      case 0: // files and dirs
        if (isDir) filepathList.push(...chee.walkdir(itemPath));
        filepathList.push(itemPath);
        break;
      case 2: // dirs only
        if (isDir) filepathList.push(itemPath);
        else continue;
        break;
    }
  };
  return filepathList;
};

/**
 * To execute a system command
 * @param {String} command 
 * @returns 
 */
chee.sysExec = (command) => {
  try {
    const message = execSync(command, {encoding: 'utf8'});
    console.log(message);
    return message;
  } catch (e) {
    console.error(e.stdout);
    return e.stdout;
  }
}

module.exports = chee;

fetch('https://www.npmjs.com/package/@cch137/node-chee')
.then(res => res.text())
.then(text => {
  const currentVersion = JSON.parse(fs.readFileSync(path.join(__dirname, 'package.json'))).version;
  const latestVersion = /Latest version: (\d+.\d+.\d+),/.exec(text)[1];
  if (currentVersion != latestVersion) {
    console.log('Installing the latest version of @cch137/node-chee...');
    chee.sysExec(`npm i @cch137/node-chee@${latestVersion}`);
  }
});