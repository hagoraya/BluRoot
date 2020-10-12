const axios = require('axios').default;
const mongoose = require('mongoose')

//Github personal access token 
const GITHUB_TOKEN = '8cca1eba25725a58eb512fb659d5c75e6c3c8859'
const MONGO_URL = 'mongodb+srv://tempUser:3g9HA0UVqkSpNZtR@appdb-kenzv.mongodb.net/github-users?retryWrites=true&w=majority'



const LOCATION = 'iceland'

//Main function
getUserData(LOCATION).then((users) => {
    console.log(`Got top 10 developers from ${LOCATION}`);
    saveToDB(users, LOCATION).then(() => {
        console.log("All users saved to DataBase");
    }).catch((err) => {
        console.log(err);
    })

})



const userSchema = new mongoose.Schema({
    login: {
        type: String,
        unique: true,
    },
    html_url: String,
    location: String,
})

//For mongodb duplicate check: will return an error when you try to save a user with same login
userSchema.path('login').index({unique: true})

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

    var counter = 0

    //Establish a DB connected
    mongoose.connect(MONGO_URL, 
        {
        useNewUrlParser: true, 
        useUnifiedTopology: true, 
        useCreateIndex: true
        }
    ).then(() => {
        //console.log("Connected To DB");

        data.map((user) => {

            //Create a new User model
             var newUser = new userModel({
                 login: user.login,
                 html_url: user.html_url,
                 location: location,
             });

 
             newUser.save()
             .then(() => { 
                 //User successfully saved
                counter++;
                
                //Close DB connection if all users have been processed
                 if(counter == data.length){
                    mongoose.connection.close();
                 }
             })
             .catch((err) => {
                 //The user already exists or there was an error
                counter++;
                
                //Close DB connection if all users have been processed
                if(counter == data.length){
                    mongoose.connection.close();
                }   
             });
        });
    }).catch((err) => {
        console.log('Error connecting to DB ' + err);
    })
}
