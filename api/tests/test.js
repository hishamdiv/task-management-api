const http = require('http');

const options = {
  hostname: 'localhost',
  port: 8080,
  path: '/api/tasks',
  method: 'GET'
};

const req = http.request(options, res => {
  console.log(`STATUS: ${res.statusCode}`);
  let data = '';
  res.on('data', chunk => {
    data += chunk;
  });
  res.on('end', () => {
    console.log(`BODY: ${data}`);
    if (res.statusCode === 200) {
      console.log('Test GET /api/tasks Passed');
    } else {
      console.error('Test Failed');
      process.exit(1);
    }
  });
});

req.on('error', error => {
  console.error('Test Failed:', error);
  process.exit(1);
});

req.end();
