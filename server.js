const express = require('express');
const bodyParser = require('body-parser');

//const DATABASE_URL = process.env.DATABASE_URL || global.DATABASE_URL || 'mongodb://localhost/hn-api';
const PORT = process.env.PORT || 8080;
const app = express();

app.use(bodyParser.json());

//----------------------------------------------***END POINTS***--------------------------------------------------//

//--------------------------------------------------POST
app.post('/stories', (req, res) => {
 
});

//-------------------------------------------------GET

app.get('/stories', (req, res)=>{
  Story.find().sort({votes: -1}).limit(20).exec()
  .then(stories => {
    res.status(200).json({
      Stories: stories.map(currentStory => currentStory.apiRepr())
    });
  })
  .catch(err => {
    console.error(err);
    res.status(500).json({message: 'Something went wrong when GETTING all stories!'});
  });
});

//-------------------------------------------------PUT

//----------------------------------------------------DELETE

//--------------------------------------------***SERVER CONTROLLERS***--------------------------------------------//

let server;
function runServer() {
  return new Promise((resolve, reject) => {
    mongoose.connect(DATABASE_URL, err => {
      if (err) {
        return reject(err);
      }
      server = app.listen(PORT, () => {
        console.log(`Your app is listening on port ${PORT}`);
        resolve();
      })
      .on('error', err => {
        mongoose.disconnect();
        reject(err);
      });
    });
  });
}

function closeServer() {
  return mongoose.disconnect().then(() => {
     return new Promise((resolve, reject) => {
       console.log('Closing server');
       server.close(err => {
           if (err) {
               return reject(err);
           }
           resolve();
       });
     });
  });
}

if (require.main === module) {
  runServer().catch(err => console.error(err));
}

module.exports = {app, runServer, closeServer};