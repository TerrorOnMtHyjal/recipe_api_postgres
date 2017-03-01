const express = require('express');
const bodyParser = require('body-parser');
const knex = require('knex')({
    client: 'pg',
    connection: {
        user: 'jared',
        password: 'h',
        database: 'recipe_api'
    }
});


const PORT = process.env.PORT || 8080;
const app = express();

app.use(bodyParser.json());

//----------------------------------------------***END POINTS***--------------------------------------------------//

//--------------------------------------------------POST
app.post('/recipes', (req, res) => {

  knex.insert({
    name: req.body.name,
    description: req.body.description
  })
  .returning('id')
  .into('recipes')
  .then(id => {
    return knex.insert(req.body.steps.map((step, index) => {
      return {
        step: step,
        step_number: index += 1,
        recipe_id : id[0]
      };  
    })).into('steps');
  })
  .then(recipe => {
    res.status(200).send("Working!");
  })
  .catch(err => res.status(500).send(err));
});


//-------------------------------------------------GET
// app.get('/recipes', (req, res) => {
//   knex('recipes')
//   .select('*')
//   //.innerJoin('steps', 'recipe.id', 'steps.recipe_id')
//   .then(recipes => {
//     console.log("hello");
//     res.status(200).send(recipes);
//   }).catch(err => res.status(500).send(err));
// });

app.get('/recipes', (req, res) => {
  knex('recipes')
  .join('steps', 'recipes.id', 'steps.recipe_id')
  .select('recipes.name', 'steps.step')
  .then(recipes => {
    res.status(200).send(recipes);
  });
});


//-------------------------------------------------PUT

//-------------------------------------------------DELETE

//--------------------------------------------***SERVER CONTROLLERS***--------------------------------------------//

app.listen(PORT);

// knex.select('recipes.name', 'tags.tag')
//     .from('recipes')
//     .join('tags', 'tags.recipe_id', 'recipe.id')
//     .then(function(rows) {
//         console.log(rows)
//     });

// let server;
// function runServer() {
//   return new Promise((resolve, reject) => {
//     mongoose.connect(DATABASE_URL, err => {
//       if (err) {
//         return reject(err);
//       }
//       server = app.listen(PORT, () => {
//         console.log(`Your app is listening on port ${PORT}`);
//         resolve();
//       })
//       .on('error', err => {
//         mongoose.disconnect();
//         reject(err);
//       });
//     });
//   });
// }

// function closeServer() {
//   return mongoose.disconnect().then(() => {
//      return new Promise((resolve, reject) => {
//        console.log('Closing server');
//        server.close(err => {
//            if (err) {
//                return reject(err);
//            }
//            resolve();
//        });
//      });
//   });
// }

// if (require.main === module) {
//   runServer().catch(err => console.error(err));
// }

// module.exports = {app, runServer, closeServer};