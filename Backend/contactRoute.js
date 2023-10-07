const express = require('express');
const bodyParser = require('body-parser');
const app = express();


app.use(express.static('Frontend/pages'));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));


app.post('/submit-form',(req , res) => {
   const {name , email , message} = req.body;
});


//rj33@gmail.com