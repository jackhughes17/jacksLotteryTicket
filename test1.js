const apiToken = '3796addf307ed1d404b5c8c7aff8ed2d';

const sports = {
    'epl' : 'soccer_epl',
    'ufc' : 'mma_mixed_martial_arts',
    'wcq' : 'soccer_fifa_world_cup_qualifiers_europe',
}

async function retrieveSports(token) {
    const response = await fetch(`https://api.the-odds-api.com/v4/sports/?apiKey=${token}`, {
        method: 'GET',
    });
    const data = await response;
    return data;
}

const requestCount = await retrieveSports(apiToken);
const sportsList = await requestCount.json();

console.log(requestCount.headers.get('x-requests-remaining'));
//console.log(sportsList);

