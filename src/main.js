const { retrieveOdds, retrieveSports, requestCount, apiToken } = require('./api.js');
const { bet, bestBets } = require('./bet.js')
const now = new Date();

const sports = {
    'epl' : 'soccer_epl',
    'eflChamp': 'soccer_efl_champ',
    'league1': 'soccer_england_league1',
    'league2': 'soccer_england_league2',
    'carabaoCup': 'soccer_england_efl_cup',

    'ucl' : 'soccer_uefa_champs_league',
    'uel' : 'soccer_uefa_europa_league',

    'lge1' : 'soccer_france_ligue_one',
    'france2': 'soccer_france_ligue_two',

    'bundes' : 'soccer_germany_bundesliga',
    'bundes2': 'soccer_germany_bundesliga2',
    'liga3': 'soccer_germany_liga3',

    'sera' : 'soccer_italy_serie_a',
    'italyB': 'soccer_italy_serie_b',

    'lala' : 'soccer_spain_la_liga',
    'spain2': 'soccer_spain_segunda_division',
    
    'turk' : 'soccer_turkey_super_league',
    'port' : 'soccer_portugal_primeira_liga',
    'ned' : 'soccer_netherlands_eredivisie',
    'gre': 'soccer_greece_super_league',
    'mls' : 'soccer_usa_mls',
    'Braz' : 'soccer_brazil_campeonato',
    'arg' : 'soccer_argentina_primera_division',
    'aus' : 'soccer_austria_bundesliga',
    'pol' : 'soccer_poland_ekstraklasa',
    
    'mex' : 'soccer_mexico_ligamx',
    'kor' : 'soccer_korea_kleague1',
    'jap' : 'soccer_japan_j_league',
    'chile': 'soccer_chile_campeonato',
    'china': 'soccer_china_superleague',
    'libertadores': 'soccer_conmebol_copa_libertadores',
    'sudamericana': 'soccer_conmebol_copa_sudamericana',
    'den': 'soccer_denmark_superliga',
    'fin': 'soccer_finland_veikkausliiga',
    
//     'ire': 'soccer_league_of_ireland',
//     'nor': 'soccer_norway_eliteserien',
//     'sweAllsvenskan': 'soccer_sweden_allsvenskan',
//     'sweSuperettan': 'soccer_sweden_superettan',
//     'sui': 'soccer_switzerland_superleague',
//     'scot': 'soccer_spl',
    
//     // 'wcq': 'soccer_fifa_world_cup_qualifiers_europe',
//     // 'wcWinner': 'soccer_fifa_world_cup_winner',

//     // //AMERICAN FOOTBALL
//     // 'cfl': 'americanfootball_cfl',
//     // 'ncaaf': 'americanfootball_ncaaf',
//     // 'ncaafChamps': 'americanfootball_ncaaf_championship_winner',
//     'nfl': 'americanfootball_nfl',
//     // 'nflSb': 'americanfootball_nfl_super_bowl_winner',
    
//     // //AUSSIE RULES
//     // 'afl': 'aussierules_afl',

//     // //BASEBALL
//     // 'kbo': 'baseball_kbo',
//     // 'mlb': 'baseball_mlb',
//     // 'mlbWs': 'baseball_mlb_world_series_winner',
//     // 'npb': 'baseball_npb',

//     // //BASKETBALL
//     // 'euroleague': 'basketball_euroleague',
//     // 'nba': 'basketball_nba',
//     // 'nbaChamps': 'basketball_nba_championship_winner',
//     // 'nbl': 'basketball_nbl',
//     // 'ncaabChamps': 'basketball_ncaab_championship_winner',
//     // 'wnba': 'basketball_wnba',

//     //BOXING
    'boxing': 'boxing_boxing',

//     // //CRICKET
//     // 'asiaCup': 'cricket_asia_cup',
//     // 't20Intl': 'cricket_international_t20',

//     //GOLF
//     //'masters': 'golf_masters_tournament_winner',
    
//     //HOCKEY
//     // 'liiga': 'icehockey_liiga',
//     // 'mestis': 'icehockey_mestis',
//     // 'nhl': 'icehockey_nhl',
//     // 'nhlChamps': 'icehockey_nhl_championship_winner',
//     // 'shl': 'icehockey_sweden_hockey_league',
//     // 'allsvenskanHockey': 'icehockey_sweden_allsvenskan',

// //     //MMA
    'mma': 'mma_mixed_martial_arts',

// //     //'usElection': 'politics_us_presidential_election_winner',

// //     'nrl': 'rugbyleague_nrl',

// //     //TENNIS
    'tennisATP': 'tennis_atp_china_open',
    'tennisWTA': 'tennis_wta_china_open'
};

function sortBets(obj) {
    const sorted = Object.keys(obj)
    .sort((b, a) => Number(a) - Number(b))
    .reduce((acc, key) => {
        acc[key] = obj[key];
        return acc;
    }, {});
    return sorted;
}

function isInplay(kickOff) {
    const start = new Date(kickOff);           // given ISO string
    const now = new Date().getTime(); // hours, just for football inplay. // current time
        
    return now >= start;
}

async function main() {
    
    for (const sport in sports) {
        const h2h = await retrieveOdds(apiToken, sports[sport], 'h2h');   
        //console.log(JSON.stringify(h2h, null, 2)); //all bets 
        
        for(let i = 0; i < h2h.length; i++){
            if (isInplay(h2h[i].commence_time)) continue;
            bet.inspectValue(bet.condenseBet(h2h[i]));
            bet.matchedBet(bet.condenseBet(h2h[i]));
        }
    }
    
    // // const allSports = await retrieveSports(apiToken); // all sports offered
    // // console.log(allSports);
    
    console.log(JSON.stringify(sortBets(bestBets), null, 2));
    console.log(JSON.stringify(bet.matchedBetFinder(), null, 2));
    
    requestCount();
    
}

main();