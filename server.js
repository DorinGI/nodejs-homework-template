const app = require('./app');
const dotenv = require('dotenv');

dotenv.config();

const port = process.env.PORT || 3000;

// app.listen(3000, () => {
//   console.log('Server is running. Use our API on port: 3000');
// });
app.listen(port, () => {
  console.log(`Server started.Listening on ${port} Port`);
});
