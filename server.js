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
  });
});



    // recipes.forEach(({name, step}) => {
    //   if(currentRecipe.name === ""){
    //     currentRecipe.name = name;
    //   }
    //   console.log(currentRecipe.name);
    //   if(currentRecipe.name != name){
    //     recipesResult.push(currentRecipe);
    //     currentRecipe.name = name;
    //     currentRecipe.steps = [];
    //   }
    //   currentRecipe.steps.push(step);
    //   console.log(recipesResult);
    // });

//[ { " ",[" "," "," "] } , {} ,{} ]

// [
//   {
//     "name": "Super Sushi",
//     "step": "Get fish and stuff"
//   },
//   {
//     "name": "Super Sushi",
//     "step": "Roll it all up"
//   },
//   {
//     "name": "Super Sushi",
//     "step": "Eat sushi"
//   },
//   {
//     "name": "Super Sushi 3",
//     "step": "Get super fish and stuff"
//   },
//   {
//     "name": "Super Sushi 3",
//     "step": "Roll it all up with fervor"
//   },
//   {
//     "name": "Super Sushi 3",
//     "step": "Eat sushi all day"
//   }
// ]


//-------------------------------------------------PUT

//-------------------------------------------------DELETE

//--------------------------------------------***SERVER CONTROLLERS***--------------------------------------------//

app.listen(PORT);
