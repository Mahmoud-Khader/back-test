'use strict'

const express = require('express');
const cors = require('cors');
const app = express();
app.use(cors());
app.use(express.json());
const mongoose = require('mongoose');
const { default: axios } = require('axios');
require('dotenv').config();
const PORT = process.env.PORT || 8080;
// mongoose.connect('mongodb://localhost:27017/Digimon', { useNewUrlParser: true, useUnifiedTopology: true });
mongoose.connect('mongodb+srv://mahmoud:mahmoud123456789@cluster0.gt8fb.mongodb.net/myFirstDatabase?retryWrites=true&w=majority', { useNewUrlParser: true, useUnifiedTopology: true });

app.get('/', (req, res) => {
    res.send('hello m3lem')
})
app.listen(PORT, () => {
    console.log(`${PORT} ahamd wa7sh`);
})


//https://digimon-api.vercel.app/api/digimon
app.get('/api', getApiData);
app.get('/fav', getAllData);
app.post('/fav', creatFav);
app.delete('/fav/:id', deleteData);
app.put('/fav/:id', updateData);

async function getApiData(req, res) {
    const url = 'https://digimon-api.vercel.app/api/digimon';
    const apiData = await axios.get(url);
    const apiMap = apiData.data.map(item => {
        return new Saleem(item)
    });
    res.send(apiMap);
}

class Saleem {
    constructor(data) {
        this.name = data.name;
        this.img = data.img;
        this.level = data.level;
    }
}

//////////////////////////////////////////////////

// GETTING DATA from email database

const favSchema = new mongoose.Schema({
    name: String,
    img: String,
    level: String,
})

const myUserModel = new mongoose.Schema({
    email: String,
    data: [favSchema]
})

const favModel = mongoose.model('user', myUserModel);

function seedUser() {
    let mahmoud = new favModel({
        email: 'mahmoudkhader2010@gmail.com',
        // email: 'mahmoudkhader2010@gmail.com',
        data: [{
            name: "Koromon",
            img: "https://digimon.shadowsmith.com/img/koromon.jpg",
            level: "In Training"
        },
        {
            name: "Tsunomon",
            img: "https://digimon.shadowsmith.com/img/tsunomon.jpg",
            level: "In Training"
        },

        ]

    })
    mahmoud.save();
}

// seedUser();

function getAllData(req, res) {
    // let obj=seedUser();
    // res.send(obj);
    let email = req.query.email;
    favModel.findOne({ email: email }, (erorr, user) => {
        res.send(user.data);
        console.log(user.data);
    })

}
////////////////////////////////////////////
// ADD FUNCTION

function creatFav(req, res) {
    const {
        email, name, img, level
    } = req.body;

    favModel.findOne({email:email},(error,user)=>{

        const newFav={
            name:name,
            img:img,
            level:level
        }
        user.data.push(newFav);
        user.save();
        res.send(user.data);
        
    })

}

///////////////////////////////////////////////////
// delete function

function deleteData(req, res) {
    const id = req.params.id;
    const email = req.query.email;
    favModel.findOne({ email: email }, (error, user) => {
       
        user.data.splice(id, 1);
        user.save();
        res.send(user.data)
    })
}

///////////////////////////////////////////////////
// Update Function

function updateData  (req, res)  {
    const id = req.params.id;
    const {
        email, name, img, level
    } = req.body;
    favModel.findOne({ email: email }, (error, user) => {
        if (error) {
            res.send(error)
        }
        const newFav = { 
            name: name, 
            img: img, 
            level: level 
        }
        user.data.splice(id, 1, newFav);
        user.save();
        res.send(user.data)
    })
}
