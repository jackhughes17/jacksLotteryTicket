const bestBets = {};
const bestMatchedBets = {};
const bet = {


    commission : {
        'betfair_ex_uk' : 0.05,
        'matchbook' : 0.02,
        'smarkets' : 0.02,
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

    getScore(price, realP, gamma = 3) {//work on
        const ev = realP * price - 1;
        realP = 1/realP;
        return ev * (realP ** gamma);
    },

    commissionAdjuster(odds, comm) {
        return 1 + (odds-1)*(1-comm);
    },

    isExchange(bookie) {
        return ['betfair_ex_uk', 'matchbook', 'smarkets'].includes(bookie);
    },

    matchedBetFinder() {//only compares against greatest single best price, may be other matched bets present
        const refinedBets = {};
        const pairs = [
                ['Home', 'Lay Home'],
                ['Away', 'Lay Away'], 
                ['Draw', 'Lay Draw']
            ];

        for (let bet in bestMatchedBets) {
            const match = bestMatchedBets[bet];
            const temp = {};

            pairs.forEach(([backKey, layKey]) => {
                const back = match[backKey];
                const lay = match[layKey];
                
                if (!back || !lay) return;

                if(back.price > lay.price) { //delete bets where the back is less than the lay
                    temp[backKey] = {
                        back : back,
                        lay : lay
                    };
                }
            });
            
            if (Object.keys(temp).length > 0) {
                refinedBets[bet] = temp;
            }

        }

        return refinedBets;
    },

    inspectValue(event) {
        let temp = '';
        let found = false;
        let score;
        event['bets'].forEach(bet => {

            if (!bet.lay && bet.home >= event.realHome) {
                score = this.getScore(bet.home, event.realHome);
                bestBets[score] = `${event.home}: ${bet.home} | bookies: ${bet.bookie} | True: ${event.realHome}`;
                temp += `  ${event.home}: ${bet.home} | bookies: ${bet.bookie} | True: ${event.realHome}\n`;
                found = true;
            } 
            if (!bet.lay && bet.away >= event.realAway) {
                score = this.getScore(bet.away, event.realAway);
                bestBets[score] = `${event.away}: ${bet.away} | bookies: ${bet.bookie} | True: ${event.realAway}`;
                temp += `  ${event.away}: ${bet.away} | bookies: ${bet.bookie} | True: ${event.realAway}\n`;
                found = true;
            } 
            if (!bet.lay && bet.draw && bet.draw >= event.realDraw) {
                score = this.getScore(bet.draw, event.realDraw);
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

    matchedBet(data) {
        const temp = {};
        let bestHome = 0, bestAway = 0, bestDraw = 0;
        let bestLayHome = Infinity, bestLayAway = Infinity, bestLayDraw = Infinity;

        data.bets.forEach(bet => {
            if(!bet.lay) {
                if(bestHome < bet.home) {
                    bestHome = bet.home;
                    temp['Home'] = {'price': bestHome, 'bookies' : bet.bookie}; 
                }
                if(bestAway < bet.away) {
                    bestAway = bet.away;
                    temp['Away'] = {'price': bestAway, 'bookies' : bet.bookie}; 
                }
                if(bet.draw && bestDraw < bet.draw) {
                    bestDraw = bet.draw;
                    temp['Draw'] = {'price': bestDraw, 'bookies' : bet.bookie}; 
                }
            } else {
                if(bestLayHome > bet.home) {
                    bestLayHome = bet.home;
                    temp['Lay Home'] = {'price': bestLayHome, 'bookies' : bet.bookie};
                }
                if(bestLayAway > bet.away) {
                    bestLayAway = bet.away;
                    temp['Lay Away'] = {'price': bestLayAway, 'bookies' : bet.bookie};
                }
                if(bet.draw && bestLayDraw > bet.draw) {
                    bestLayDraw = bet.draw;
                    temp['Lay Draw'] = {'price': bestLayDraw, 'bookies' : bet.bookie};
                }
            } 
        });

        bestMatchedBets[data.match] = temp;
        //console.log(JSON.stringify(bestMatchedBets, null, 2));
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
            for(let i = 0; i<offer.markets.length; i++) {
                let isLay = offer.markets?.[i]?.key === 'h2h_lay';

                const outcomes = offer.markets[i].outcomes;
                
                let homePrice = offer.markets[i].outcomes.find(o => o.name == offers.home).price; 
                let awayPrice = offer.markets[i].outcomes.find(o => o.name == offers.away).price;
                
                const drawObj = outcomes.find(o => o.name === 'Draw'); // may not exist
                let drawPrice = drawObj ? drawObj.price : null;

                if (!isLay && this.isExchange(offer.key)) {
                    homePrice = this.commissionAdjuster(homePrice, this.commission[offer.key]);
                    awayPrice = this.commissionAdjuster(awayPrice, this.commission[offer.key]);
                    if (drawPrice) drawPrice = this.commissionAdjuster(drawPrice, this.commission[offer.key]);
            }
            
                const {realHome, realAway, realDraw} = bet.realOdds(homePrice, awayPrice, drawPrice);
                
                const temp = {
                    'lay' : isLay,
                    'bookie' : offer.key,
                    'home' : homePrice,
                    'away' : awayPrice,
                    'draw' : drawPrice, // stays null if missing
                };
                
                allBets.push(temp);
                
                if (realHome) sumHome += realHome;
                if (realAway) sumAway += realAway;
                if (realDraw) sumDraw += realDraw;;
            }
            
        });
        
        offers['realHome'] = sumHome/betCount;
        offers['realAway'] = sumAway/betCount;
        offers['realDraw'] = sumDraw ? sumDraw / betCount : null;
        offers['bets'] = allBets;
        //console.log(offers);
        return offers;
    }
}

module.exports = {
    bet,
    bestBets
}

