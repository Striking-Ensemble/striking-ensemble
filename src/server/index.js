// Make sure only to load .env in development stage
if (process.env.NODE_ENV !== 'production') {
  // app will throw error if .env variables
  // are not given values
  require('dotenv-safe').load();
}

const PORT = process.env.PORT || 3000;
const app = require('./server');

app.listen(PORT, function () {
  console.log('Listening on port ' + PORT);
});
