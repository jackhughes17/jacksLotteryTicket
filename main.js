const { retrieveOdds, retrieveSports, requestCount, apiToken } = require('./test1.js');
const { bet, bestBets } = require('./bet.js')

const sports = {
    // 'epl' : 'soccer_epl',
    // 'ucl' : 'soccer_uefa_champs_league',
    // 'lge1' : 'soccer_france_ligue_one',
    // 'bundes' : 'soccer_germany_bundesliga',
    // 'sera' : 'soccer_italy_serie_a',
    // 'lala' : 'soccer_spain_la_liga',
    // 'uel' : 'soccer_uefa_europa_league',
    // 'carbao' : 'soccer_england_efl_cup',
    // 'turk' : 'soccer_turkey_super_league',
    // 'port' : 'soccer_portugal_primeira_liga',
    // 'mls' : 'soccer_usa_mls',
    // 'Braz' : 'soccer_brazil_campeonato',
    // 'arg' : 'soccer_argentina_primera_division',
    // 'aus' : 'soccer_austria_bundesliga',
    // 'pol' : 'soccer_poland_ekstraklasa',
    // 'ned' : 'soccer_netherlands_eredivisie',
    // 'mex' : 'soccer_mexico_ligamx',
    // 'kor' : 'soccer_korea_kleague1',
    // 'jap' : 'soccer_japan_j_league',

    // 'cricket' : 'cricket_asia_cup',
    // 'tennisW' : 'tennis_wta_china_open',
    // 'tennisM' : 'tennis_atp_china_open',

    // 'nba' : 'basketball_nba',
    // 'mlb' : 'baseball_mlb',
    
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
    
    for (const sport in sports) {
        const h2h = await retrieveOdds(apiToken, sports[sport], 'h2h');   
        //console.log(JSON.stringify(h2h, null, 2));
        
        for(let i = 0; i < h2h.length; i++){
            bet.inspectValue(bet.condenseBet(h2h[i]));
            bet.matchedBet(bet.condenseBet(h2h[i]));
        }
    }
    
    // // const allSports = await retrieveSports(apiToken);
    // // console.log(allSports);
    
    console.log(JSON.stringify(sortBets(bestBets), null, 2));
    console.log(JSON.stringify(bet.matchedBetFinder(), null, 2));
    
    requestCount();
    
}

main();