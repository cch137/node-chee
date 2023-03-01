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

const walkdir = (_dir, type=1) => {
  _dir = path.resolve(_dir);
  const filepathList = [];
  for (const f of fs.readdirSync(_dir)) {
    const itemPath = path.join(_dir, f);
    const isDir = fs.statSync(itemPath).isDirectory();
    switch (type) {
      case 1: // files only
        if (isDir) filepathList.push(...walkdir(itemPath));
        else filepathList.push(itemPath);
        break;
      case 0: // files and dirs
        if (isDir) filepathList.push(...walkdir(itemPath));
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
chee.walkdir = walkdir;

const promiseDir = (dirname) => {
  if (!fs.existsSync(dirname)) {
    fs.mkdirSync(dirname, { recursive: true });
  }
}
chee.promiseDir = promiseDir;

/**
 * To execute a system command
 * @param {String} command 
 * @returns 
 */
const sysExec = (command) => {
  try {
    const message = execSync(command, {encoding: 'utf8'});
    console.log(message);
    return message;
  } catch (e) {
    console.error(e.stdout);
    return e.stdout;
  }
}
chee.sysExec = sysExec;

module.exports = chee;

fetch('https://registry.npmjs.org/@cch137/node-chee/latest')
.then(res => res.json())
.then(data => {
  const currentVersion = JSON.parse(fs.readFileSync(path.join(__dirname, 'package.json'))).version;
  const latestVersion = data.version;
  if (currentVersion != latestVersion) {
    throw new Error (
      `Please use the following commands to install the latest version of @cch137/node-chee:\n`
      + `npm uninstall @cch137/node-chee; npm i @cch137/node-chee@${latestVersion}\n`
    );
  }
});