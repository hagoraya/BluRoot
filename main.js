const axios = require('axios').default;

async function getUserData(locationn){
    const URL = `https://api.github.com/search/users?q=location:${locationn}&per_page=10`

    try {
        const data = (await axios.get(URL)).data;
        console.log(response);
        
    } catch (error) {
        console.log(error);
    }
}


getUserData("toronto");