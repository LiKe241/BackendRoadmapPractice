var shell = require('./shellCommands');

shell.cd('q');  // error: ./q does not exist
shell.cd('..');
shell.cd('/home/lhaoy666');
shell.cd();
