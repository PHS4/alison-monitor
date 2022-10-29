Tail = require('tail').Tail;

const logFile = '/var/log/nginx/access.log';
const options = { follow: true }; // allow rollover to succeed.


tail = new Tail(logFile);

console.log("tailing " + logFile)

tail.on("line", function (data) {

  console.log(data);

  if (data.includes(' 502 ')) {
    console.log('found: 502 ' + new Date());

    const { exec } = require("child_process");

    exec("ENV=prd docker-compose --file docker-compose.yml up --build -d", (error, stdout, stderr) => {

      if (error) {
        console.log(`error: ${error.message}`);
        return;
      }
      if (stderr) {
        console.log(`stderr: ${stderr}`);
        return;
      }
      console.log(`stdout: ${stdout}`);
    });

  }

});

tail.on("error", function (error) {
  console.log('ERROR: ', error);
});