
const TradePair = require ('./TradePair');
const Globals = require ('./Globals');


const Binance = require('binance-api-node').default;
const listTradePair= [];

Globals.client = Binance();

//Authenticated client, can make signed calls
Globals.client2 = Binance({
  apiKey: 'FWiVeVtoKEoZvukYannOMNP8mlSEnFrBZvdq2uRySAUXpYRDv3Imnwr4xAUjQ3XG',
  apiSecret: 'LznIlJE2F1WAndSyaVaJDsVwXThrU5tg638o1pgCoKdleOOjsXwweLHPbiN78LHw'
})

var allCoin = ["BTC", "ETH", "SOL", "BNB", "AVAX", "NEAR", "ETC",  "SHIB", "GALA","C98", "DOT", "DOGE", "BLZ", "BCH", "DAR", "PHB",
"POWR", "SFP", "WRX", "ALPINE", "SANTOS", "RUNE", "OG", "OGN", "TRB", "STMX"];

var allCoin = ["BTC", "AVAX"];
//var allCoin = ["BTC", "AVAX"];
var quoteAmount = 0.02;

var listRemarkableCoin = ["OGN"];
var listBtcCandle = [];
var listBtcCandleTest = [];

async function main(){
    //1703896188338

    const express = require('express');
    const app = express();
    const port = 3000;

    // Set up static files (if needed)
    app.use(express.static('public'));

    // Set up a simple route to serve the HTML page
    app.get('/bitcoin-price', (req, res) => {
        res.sendFile(__dirname + '/public/index.html');
    });

    // Set up a WebSocket to update Bitcoin price every second
    const WebSocket = require('ws');
    const wss = new WebSocket.Server({ noServer: true });

    wss.on('connection', (ws) => {
        const binanceWebSocket = Globals.client2.ws.trades(['BTCUSDT'], (trade) => {
            ws.send(JSON.stringify({ price: parseFloat(trade.price) }));
        });

        ws.on('close', () => {
            //binanceWebSocket.close();
            console.log("Connection close");
        });
    });

    // Create a basic HTTP server
    const server = app.listen(port, () => {
        console.log('Server is running on port 3000');
    });

    // Upgrade the server to support WebSocket
    server.on('upgrade', (request, socket, head) => {
        wss.handleUpgrade(request, socket, head, (ws) => {
            wss.emit('connection', ws, request);
        });
    });

    const balance = (await Globals.client2.accountInfo({useServerTime: true})).balances;
    //printBalance(balance);
    var usdtAmount = getUSDTAmount(balance);

    //console.log(await Globals.client2.futuresAccountBalance());
    //console.log("USDT: " + usdtAmount);

    {
        var asset = "BTC";
        var base = "USDT";
        var tradePair = new TradePair(asset, base);
        await tradePair.initCandle();
        t = tradePair.tongDaoDong;
        console.log("t: " + t);

        tradePair.followed = true;
        listTradePair.push(tradePair);
        //tradePair.startingCandle();
    }

    for(var i = 1; i < allCoin.length; i++){
        var asset = allCoin[i];
        var base = "USDT";
        var tradePair = new TradePair(asset, base);
        await tradePair.initCandle();
        t = tradePair.tongDaoDong;
        console.log("t: " + t);

        tradePair.followed = true;
        listTradePair.push(tradePair);
    };

    runtestTradeTheoXuHuongAltcoin(180, 0, 0);
}

function runtestTradeTheoXuHuongAltcoin(nSample, vIn, vOut){
    var quanBuy = 0;
    var quanSell = 0;
    var timeBuy  = 0;
    var timeSell = 0;
    var tongLoiNhuan = 0;
    var tongQuanBuy = 0;
    var tongQuanSell = 0;

    for(var i = 1; i < listTradePair.length; i++){
        listTradePair[i].testTheoXuHuong(nSample, vIn, vOut)
    }

}

async function testTradeTheoXuHuongAltcoin(nSample, timeOut){
    var quanBuy = 0;
    var quanSell = 0;
    var timeBuy = 0;
    var timeSell = 0;
    var tongLoiNhuan = 0;
    var tongQuanBuy = 0;
    var tongQuanSell = 0;

    listBtcCandleTest = _listBtcCandleTest;
    console.log("leng: " + listBtcCandleTest.length + " " + listTradePair.length);

    for(var i = nSample; i < listBtcCandleTest.length; i++){
        var listTuongQuan = [];
        
        for(var j = 0; j < listTradePair.length; j++){
            var tp = listTradePair[j];
            var tuongQuan = tp.countTuongQuanTest(i, nSample);
            listTuongQuan.push(tuongQuan);
        }
        var maxIndex = -1;
        var maxTuongQuan = -2000;
        var minIndex = -1;
        var minTuongQuan = 2000;

        for(var j = 1; j < listTuongQuan.length; j++){
            var tp = listTradePair[j];
            if(tp.hasBuy == false && tp.hasSell == false && listTuongQuan[j] >= maxTuongQuan){
                maxIndex = j;
                maxTuongQuan = listTuongQuan[j];
            }

            if(tp.hasSell == false && tp.hasBuy == false &&  listTuongQuan[j] <= minTuongQuan){
                minIndex = j;
                minTuongQuan = listTuongQuan[j];
            }
        }

        if(quanBuy < 4 && (i - timeBuy) >= timeOut/5 && quanBuy < 4 && maxTuongQuan){
            if(maxIndex >= 0 ){
                console.log(" " + listTuongQuan.length + " " + maxIndex + " " + minIndex + " " + maxTuongQuan + " " + minTuongQuan);
                var tpMax = listTradePair[maxIndex];
 
                tpMax.hasBuy = true;
                tpMax.priceBuy = tpMax.listCandleTest[i].open;
                tpMax.timeBuy = i;
                timeBuy = i;
                quanBuy += 1;
                tongQuanBuy += 1;
                console.log("buy: " + i + " " + tpMax.asset + " " + tongQuanBuy + " " + tongQuanSell + " " + quanBuy + " " + quanSell);
            }

        }

        // if(quanSell < 4 && (i - timeSell) >= timeOut/5 && quanSell < quanBuy + 1 && minIndex >= 0){
        //     console.log(" " + listTuongQuan.length + " " + maxIndex + " " + minIndex + " " + maxTuongQuan + " " + minTuongQuan);
        //     var tpMin = listTradePair[minIndex];
        //     //processBuy
        //     tpMin.hasSell = true;
        //     tpMin.priceSell = tpMin.listCandleTest[i].open;
        //     timeSell = i;
        //     tpMin.timeSell = i;
        //     quanSell += 1;
        //     tongQuanSell += 1;
        //     console.log("sell: " + i + " " + tpMin.asset + " " + tongQuanBuy + " " + tongQuanSell +  " " + quanBuy + " " + quanSell);
        // }


        for(var j = 0; j < listTradePair.length; j++){
            var tp = listTradePair[j];
            
            if(tp.hasBuy && (i - tp.timeBuy) >= timeOut){
                if(tp.hasBuy){
                    tp.hasBuy = false;
                    tongLoiNhuan = (tp.listCandleTest[i].open - tp.priceBuy)/tp.priceBuy;
                    quanBuy--;

                    console.log("buyOut: " + i + " " + tp.asset + " " + tongQuanBuy + " " + tongQuanSell + " " +  quanBuy + " " + quanSell);
                }
            } 

            // if(tp.hasSell && (i - tp.timeSell) >= timeOut){
            //     if(tp.hasSell){
            //         tp.hasSell = false;
            //         tongLoiNhuan = (tp.priceSell - tp.listCandleTest[i].open)/tp.priceSell;
            //         quanSell--;
            //         console.log("sellOut: " + i + " " + tp.asset + " " + tongQuanBuy + " " + tongQuanSell + " " +  quanBuy + " " + quanSell);
            //     }
            // }
        }
    }

    console.log("Tong Loi Nhuan : " + tongLoiNhuan + " " + tongQuanBuy + " " + tongQuanSell);
}

function printBalance(balance){
    for(var i = 0; i < balance.length; i++){
        var coinInfo = balance[i];
        if(parseFloat(coinInfo["free"]) != 0){
            console.log(coinInfo);
        }
    }
}

function getUSDTAmount(balance){
    for(var i = 0; i < balance.length; i++){
        var coinInfo = balance[i];
        if(coinInfo.asset == "USDT"){
            return coinInfo.free;
        }
    }
}


main();
process.on('unhandledRejection', (reason, promise) => {
    console.error('Unhandled Rejection at:', promise, 'reason:', reason);
    // You might want to do something more meaningful here, like sending an alert or logging to a service.
});

process.on('uncaughtException', (error) => {
    console.error('Uncaught Exception:', error.message);
    process.exit(1); // Exit the process after an uncaught exception
});
