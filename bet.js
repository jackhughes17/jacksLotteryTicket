const bestBets = {};

const bet = {

    commission : {
        'betfair_ex_uk' : 0.05,
        'matchbook' : 0.02,
    },

    retreiveMatch(data) {
        return `${data.home_team} vs ${data.away_team}`;
    },

    retreiveDate(data) {
        return `${data.commence_time}`;
    },

    realOdds(h, a, d) {
        const overRound = 1/h + 1/a + 1/d;
        const realHome = 1 / (1/h / overRound);
        const realAway = 1 / (1/a / overRound);
        const realDraw = 1 / (1/d / overRound);
        // console.log(overRound, h,home, a, away, d, draw);
        return {realHome, realAway, realDraw};
    },

    inspectValue(event) {
        let temp = '';
        let found = false;
        let score;
        event['bets'].forEach((bet) => {

            if (bet.home >= event.realHome) {
                score = bet.home/event.realHome * 100;
                bestBets[score] = `${event.home}: ${bet.home} | bookies: ${bet.bookie} | True: ${event.realHome}`;
                temp += `  ${event.home}: ${bet.home} | bookies: ${bet.bookie} | True: ${event.realHome}\n`;
                found = true;
            } 
            if (bet.away >= event.realAway) {
                score = bet.away/event.realAway * 100;
                bestBets[score] = `${event.away}: ${bet.away} | bookies: ${bet.bookie} | True: ${event.realAway}`;
                temp += `  ${event.away}: ${bet.away} | bookies: ${bet.bookie} | True: ${event.realAway}\n`;
                found = true;
            } 
            if (bet.draw >= event.realDraw) {
                score = bet.draw/event.realDraw * 100;
                bestBets[score] = `Draw: ${bet.draw} | bookies: ${bet.bookie} | True: ${event.realDraw}`;
                temp += `  Draw: ${bet.draw} | bookies: ${bet.bookie} | True: ${event.realDraw}\n`;
                found = true; 
            }
            
        });
        if (found) {
            temp = `Date: ${event.date} \nMatch: ${event.match} \n` + temp;
            console.log(temp);
        }
    },

    condenseBet(data) {
        
        let sumHome = 0, sumAway = 0, sumDraw = 0;
        const betCount = data['bookmakers'].length;
        const allBets = [];
        const offers = {
            'match' : bet.retreiveMatch(data),
            'date' : bet.retreiveDate(data),
            'home' : data.home_team,
            'away' : data.away_team,
        };       

        data['bookmakers'].forEach(offer => {
            const homePrice = offer.markets[0].outcomes.find(o => o.name == offers.home).price;
            const awayPrice = offer.markets[0].outcomes.find(o => o.name == offers.away).price;
            const drawPrice = offer.markets[0].outcomes.find(o => o.name == 'Draw').price;
            const {realHome, realAway, realDraw} = bet.realOdds(homePrice, awayPrice, drawPrice);
            const temp = {};
            temp['bookie'] = offer.key;
            temp['home'] = homePrice;
            temp['away'] = awayPrice;
            temp['draw'] = drawPrice;
            allBets.push(temp);
            sumHome += realHome;
            sumAway += realAway;
            sumDraw += realDraw;
            
        });
        
        offers['realHome'] = sumHome/betCount;
        offers['realAway'] = sumAway/betCount;
        offers['realDraw'] = sumDraw/betCount;
        offers['bets'] = allBets;
        // console.log(offers);
        bet.inspectValue(offers);
    }
}

module.exports = {
    bet,
    bestBets,
}

