const fs = require('fs');
const path = require('path');
const chee = require('@cch137/chee');


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

module.exports = chee;