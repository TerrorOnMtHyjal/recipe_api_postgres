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
app.get('/recipes', (req, res) => {

  knex('recipes')
  .join('steps', 'recipes.id', 'steps.recipe_id')
  .select('recipes.name', 'steps.step')
  .then(recipes => {   
    const obj = {};

    recipes.forEach(({name, step}) => {
      if(!obj[name]) obj[name] = [];
      obj[name].push(step);
    });

    const finalResult = Object.keys(obj).map(key => {
      return {name: key, steps: obj[key]};
    });

    res.status(200).send(finalResult);
  })
  .catch(err => res.status(500).send(err));
});

//-------------------------------------------------PUT

//-------------------------------------------------DELETE

//--------------------------------------------***SERVER CONTROLLERS***--------------------------------------------//

app.listen(PORT);
