const axios = require('axios').default;

const TOKEN = '8cca1eba25725a58eb512fb659d5c75e6c3c8859'
const TOKEN2 = '35d4fec32f12a8c23805622dd6ce61825c9f1e96'

async function getUserData(locationn){
    const URL = `https://api.github.com/search/users?q=location:${locationn}&per_page=10`

    try {
        const data = (await axios.get(URL,{
            headers:{
                'Authorization' : `token ${TOKEN}`
            }
        })).data;

        console.log(data);
        
    } catch (error) {
        console.log("Axios error");
    }
}


getUserData("toronto");