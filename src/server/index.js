// Make sure only to load .env in development stage
if (process.env.NODE_ENV !== 'production') {
  require('dotenv').load();
}

const app = require('./server.js');
const PORT = process.env.PORT || 3000;

app.listen(PORT, function () {
  console.log('Listening on port ' + PORT);
});
