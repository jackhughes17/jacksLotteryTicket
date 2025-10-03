let apiToken = '3796addf307ed1d404b5c8c7aff8ed2d';
apiToken = '6b074ee73a2314de11e7df647f24086f';
apiToken = 'b27eeff2ef7bc72cc3af7bb87f9524c8';
apiToken = '382a5f2e260a709bbe4b3d307e7149b3';
apiToken = '5ad951ecb495b30011ef4fdc43a53344';


let requests;

async function retrieveSports(token) {
    const response = await fetch(`https://api.the-odds-api.com/v4/sports/?apiKey=${token}`, {
        method: 'GET',
    });
    const data = await response.json();
    requests = response.headers.get('x-requests-remaining');
    return data;
}

async function retrieveOdds(token, sport, market) {
    const response = await fetch(`https://api.the-odds-api.com/v4/sports/${sport}/odds/?apiKey=${token}&regions=uk&markets=${market}`, {
        method: 'GET',
    });
    const data = await response.json();
    requests = response.headers.get('x-requests-remaining');
    return data;
}

function requestCount() {
    console.log(`You have ${requests} request currency left.`);
}

module.exports = {
    retrieveOdds,
    retrieveSports,
    requestCount,
    apiToken,
    
}
//const sportsList = await retrieveSports(apiToken);


