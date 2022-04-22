const axios = require('axios');

async function search(req, res, baseUrl){
    let text = req.body.text;

    if(text.length > 0){
        axios.post(baseUrl + 'search', {title: text}).then((response) => {
            res.json(response.data);
        });
    }
}

module.exports = {
    search: search,
}