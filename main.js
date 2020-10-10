const axios = require('axios').default;
const { Db } = require('mongodb');
const mongoose = require('mongoose')

const LOCATION = 'toronto'
const GITHUB_TOKEN = '8cca1eba25725a58eb512fb659d5c75e6c3c8859'
const MONGO_URL = 'mongodb+srv://tempUser:3g9HA0UVqkSpNZtR@appdb-kenzv.mongodb.net/github-users?retryWrites=true&w=majority'

const userSchema = new mongoose.Schema({
    name: String,
    html_url: String,
    location: String,
})

var userModel = mongoose.model('user',userSchema);


async function getUserData(location){
    const URL = `https://api.github.com/search/users?q=location:${location}&per_page=10`;
    try {
        const data = (await axios.get(URL,{
            headers:{
                'Authorization' : `token ${GITHUB_TOKEN}`
            }
        })).data.items;

        const result = [];
        data.forEach(element => {
            const obj = {
                'login' : element.login,
                'html_url': element.html_url

            }
            result.push(obj)
        });

        return result;

    } catch (error) {
        console.log(error);
    }



}


async function saveToDB(data, location){
    mongoose.connect(MONGO_URL, {useNewUrlParser: true, useUnifiedTopology: true});
    const DB = mongoose.connection;
    DB.on('error', console.error.bind(console, 'Database connection error:'))
    DB.once('open', function(){
        //Connected to MongoDB 
        
    })
    


}


getUserData(LOCATION).then((data) => {
    console.log(data);
    //store users in DB 
    saveToDB(data, LOCATION)
})