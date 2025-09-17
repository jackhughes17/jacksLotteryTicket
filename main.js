const { retrieveOdds, retrieveSports, requestCount, apiToken } = require('./test1.js');
const { bet, bestBets } = require('./bet.js')

const football = {
    // 'epl' : 'soccer_epl',
    'ucl' : 'soccer_uefa_champs_league',
    // 'lge1' : 'soccer_france_ligue_one',
    // 'bundes' : 'soccer_germany_bundesliga',
    // 'sera' : 'soccer_italy_serie_a',
    // 'lala' : 'soccer_spain_la_liga',
    // 'ufc' : 'mma_mixed_martial_arts',
    // 'wcq' : 'soccer_fifa_world_cup_qualifiers_europe',
}

function sortBets(obj) {
    const sorted = Object.keys(obj)
    .sort((b, a) => Number(a) - Number(b))
    .reduce((acc, key) => {
        acc[key] = obj[key];
        return acc;
    }, {});
    return sorted;
}
async function main() {
    let allBets = {};

    for (const league in football) {
        const outrights = await retrieveOdds(apiToken, football[league], 'h2h');
        
        for(let i = 0; i < outrights.length; i++){
            bet.condenseBet(outrights[i]);
        }

        allBets = {...allBets, ...bestBets};
    }
    
    //const goals = await retrieveOdds(apiToken, sports.ucl, 'btts');
    
    //console.log(JSON.stringify(goals, null, 2));
    // const allSports = await retrieveSports(apiToken);
    // console.log(allSports);
    
    // // console.log(JSON.stringify(bets, null, 2));

    
    console.log(JSON.stringify(sortBets(allBets), null, 2));
    requestCount();
    
}

main();