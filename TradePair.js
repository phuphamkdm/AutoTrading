
const AutoTrading = require('./AutoTrading');
const CandleStick = require('./CandleStick');
const Globals = require('./Globals');
var binance =  require('binance-api-node');

var PHUONG_PHAP = 0;

class TradePair {
    constructor(asset, base) {
        this.asset = asset.toUpperCase();
        this.base = base.toUpperCase();
        this.symbol = this.asset + this.base;
        this.listCandle1m = [];
        this.listCandle5m = [];
        this.listCandle30m = [];
        this.listCandle1s = [];
        this.listCandle = this.listCandle1m;
        this.listCandleTest = [];

        this.interval = "1s",

        this.lastCandleList  = [];
        this.hasBuy = false;
        this.hasSell = false;
        this.buyPrice = 0;
        this.selPrice = 0;
        this.timeBuy = -1000;
        this.timeSell = -1000;
        this.TIME_5_SECOND = 5*1000;
      
    }
   
    set name(name) {
        this._name = name;
    }
   
    get name() {
        return this._name;
    }
   
    sayHi() {
        console.log("Hi, " + this.symbol);
    }

    async initCandle(){

        var currentTime = new Date().getTime();
        var client =   Globals.client2;
        var nSample = 5;
        var candles = [];
        for(var i = 0; i < nSample; i++){
            var c = await client.candles({symbol: this.symbol, interval: this.interval, limit: 1000, 
                startTime: (currentTime - 1000*1000*(nSample - i)), endTime: (currentTime - 1000*1000*(nSample - i -1))});
            candles = candles.concat(c);
        }

       // var candles = await client.candles({symbol: this.symbol, interval: this.interval, limit: 1000});

        var tongDaoDong = 0;
      
        for(var i = 0; i < candles.length; i++){
            
            var candle = candles[i];
            if(i  == candles.length -1)
              console.log("Candle : " + i + " " + (candle.closeTime  -  candle.openTime) + " " + candles.length); 
            var openPrice = candle.open;
            var lowPrice = candle.low;
            var highPrice = candle.high;
            var closePrice = candle.close;
           
            var candleStick = new CandleStick();
            candleStick.updateCandle(candle);
            this.listCandle.push(candleStick);

            var daoDong = 0;
            if(closePrice > openPrice){
                daoDong = Math.abs(lowPrice - openPrice) + Math.abs(highPrice - lowPrice) + Math.abs(closePrice - highPrice);
                daoDong = Math.abs(highPrice - lowPrice);
                daoDong = daoDong/openPrice;
            }
            else{
                daoDong = Math.abs(highPrice - openPrice) + Math.abs(highPrice - lowPrice) + Math.abs(closePrice - lowPrice);
                daoDong = Math.abs(highPrice - lowPrice);
                daoDong = daoDong/openPrice;
            }
            tongDaoDong += daoDong;	 
        }

        if(this.asset == "BTC"){
            Globals.btcCandle = this.listCandle;
        }   

        this.tongDaoDong = tongDaoDong;
        console.log("TongDaoDong: " + this.symbol + " " + this.tongDaoDong + " " + 1 + " " + candles.length + " " + candles[0].openTime + " " + candles[0].closeTime);

        
        // if(this.asset == "BTC"){
        //     this.thongKeCandleBtc();
        // }
        // else{
        //     this.thongKeDiemTuongQuan();
        // } 

        // test
    }

    runTestTheoXuHuong(){
        nSample = 180;



    }

    async initCandleTest(){
        return;
        var currentTime = new Date().getTime();
        var client = Globals.client2;
        currentTime = 1703896188338;
    
        var candles1 = await client.candles({symbol: this.symbol, interval: this.interval, limit: 1000, startTime: (currentTime - 1000*60*1000*4), endTime: (currentTime -1000*60*1000*3)});
        var candles2 = await client.candles({symbol: this.symbol, interval: this.interval, limit: 1000, startTime: (currentTime - 1000*60*1000*3), endTime: (currentTime -1000*60*1000*2)});
        var candles3 = await client.candles({symbol: this.symbol, interval: this.interval, limit: 1000, startTime: (currentTime - 1000*60*1000*2), endTime: (currentTime -1000*60*1000*1)});
        var candles4 = await client.candles({symbol: this.symbol, interval: this.interval, limit: 1000, startTime: (currentTime - 1000*60*1000*1), endTime: (currentTime -1000*60*1000*0)});
        var candles = ((candles1.concat(candles2)).concat(candles3)).concat(candles4);

        for(var i = 0; i < candles.length; i++){
            
            var candle = candles[i];
           
            var candleStick = cd.getCandleStick();
            candleStick.updateCandle(candle);
            //console.log("testCandle: " + candleStick.open + " " + candleStick.close + " " + (candleStick.open + candleStick.close));
            this.listCandleTest.push(candleStick); 
        }   

        var candles = this.listCandleTest;
        console.log("initCandleTest: " + this.asset + " " + this.listCandleTest.length + " " + candles1.length + " " +  candles2.length + " " +  candles3.length + " " +  candles4.length + " " );

        if(this.asset == "BTC"){
            id.listBtcCandleTest = this.listCandleTest;
            console.log("vao BTC " + id.listBtcCandleTest.length);
        } else{
            console.log(this.asset + " " + id.listBtcCandleTest.length);
        } 
    }

    processBuyAndSell(){
        // Xac dinh xu huong, amount
        // Amount măc định là 2000
        // Xu hướng được theo btc/asset ti lệ

        // btc tăng các altcoin tăng và btc giảm altcoin giảm (chung);
        // btc tăng mạnh đạt được ổn định khi altcoin chưa tăng đủ => altcoin tăng (cần phải số hóa)
        // btc giảm mạnh đạt được ổn định altcoin giảm

        if(PHUONG_PHAP == 0){
            this.tuongQuanBtcProcess();
        }

    }

    tuongQuanBtcProcess(){
        console.log("tuongQuanBtcProcess");
        console.log("btcList: " + " " + this.asset + " " + id.listBtcCandle.length);

        //
    }

    
    thongKeCandleBtc(){
        var nTypeDaoDong05 = 0;
        var nTypeDaoDong1 = 0;
        var nTypeDaoDong2 = 0;
        var nTypeDaoDong5 = 0;
        var nTypeDaoDong10 = 0;
        var nTypeDaoDong20 = 0;
        var nTypeDaoDong50 = 0;
        var nTypeDaoDong100 = 0;
        var nTypeDaoDong200 = 0;
        var nTypeDaoDong400 = 0;
        var nTypeDaoDongSieuLon = 0;

        for(var i = 0; i < this.listCandle.length ; i++){
            var candle = this.listCandle[i];
            var doDaoDong = Math.abs(candle.close - candle.open);
            if(doDaoDong < 0.5){
                nTypeDaoDong05++;
            }
            else if(doDaoDong < 1){
                nTypeDaoDong1++;
            }
            else if(doDaoDong < 2){
                nTypeDaoDong2++;
            }
            else if(doDaoDong < 5){
                nTypeDaoDong5++;
            }
            else if(doDaoDong < 10){
                nTypeDaoDong10++;
            }
            else if(doDaoDong < 20){
                nTypeDaoDong20++;
            }
            else if(doDaoDong < 50){
                nTypeDaoDong50++;
            }
            else if(doDaoDong < 100){
                nTypeDaoDong100++;
            }
            else if(doDaoDong < 200){
                nTypeDaoDong200++;
            }
            else if(doDaoDong < 400){
                nTypeDaoDong400++;
            }
            else {
                nTypeDaoDongSieuLon++;
            }
        }

        console.log("Thong ke dao dong btc: "  + nTypeDaoDong05+ " " + nTypeDaoDong1 + " " +  nTypeDaoDong2 + " " +  nTypeDaoDong5 + " " + nTypeDaoDong10 + " " + nTypeDaoDong20 + " " + nTypeDaoDong50 + " " + 
                                                        nTypeDaoDong100 + " " + nTypeDaoDong200 + " " + nTypeDaoDong400 + " " + nTypeDaoDongSieuLon);
    }

    thongKeDiemTuongQuan(){
        var nMau = 30.0;
        for(var i = 0; i < this.listCandle.length - 1 -30; i++){
            var mX = 0;
            var mY = 0;
            var sumX = 0;
            var sumY = 0;
            var sumXY = 0;
            var sumX2 = 0;
            var sumY2 = 0;

            for(var j = 0; j < nMau; j++){
                var candle = this.listCandle[i + j];
                var candleBtc = Globals.btcCandle[i+j];
                var yi = candle.close - candle.open;
                var xi = candleBtc.close - candleBtc.open;
                sumX = sumX + xi;
                sumY = sumY + yi;
                sumXY = sumXY + xi*yi;
                sumX2 = sumX2 + xi*xi;
                sumY2 = sumY2 + yi*yi;
            }
         
            var r = sumXY - 30*(sumX/nMau)*(sumY/nMau);
            r = r/ Math.sqrt(sumX2 - sumX*sumX/nMau) /Math.sqrt(sumY2 - sumY*sumY/nMau);
            
            if( sumX < 1){
                sumX = 1;
            }
            console.log("tuong quan: " + i + " " + r + " " + (sumY/sumX*Globals.btcCandle[i].open/this.listCandle[i].open ) );
        }
    }

    countTuongQuanTest0(i, nSample){
        return (this.listCandleTest[i-1].close - this.listCandleTest[i-1].open)/ this.listCandleTest[i-1].open; 
    }

    countTuongQuanTest1(i, nSample){
        return (this.listCandleTest[i-1].close - this.listCandleTest[i-nSample].open)/ this.listCandleTest[i-nSample].open;

    }

    countTuongQuan(i, nSample){
        if(this.asset == "BTC"){
            return 0;
        }

        //return (this.listCandleTest[i-1].close - this.listCandleTest[i-nSample].open)/ this.listCandleTest[i-nSample].open;

        var res = 0;
        var nGiam = 0;
        var nTang = 0;
        var nKhongDoi = 0;
        var sumGiam = 0;
        var sumBtcGiam = 0;
        //console.log("gia open: " + this.listCandle[i].open);
        for(var j = i - nSample; j < i; j++){
            if((j - (i - nSample)) % 5 == 4){
                var btcCandle  = Globals.btcCandle;
                var candle = this.listCandle[j];
    
                if(btcCandle[j].close - btcCandle[j - 4].open < 0){
                    nGiam += 1;
                    sumBtcGiam += (btcCandle.close - btcCandle.open);
                    sumGiam += this.listCandle[j].close - this.listCandle[j-4].open;
                }
                else if(btcCandle[j].close - btcCandle[j - 4].open == 0){
                    nKhongDoi ++;
                }
                else{
                    nTang++;
                }
            }

        }

        if(nGiam < 0){
            res = 0;
        }
        else {
            res = sumGiam/this.listCandle[i - nSample].open;
        }

        console.log("TuongQuanne: " + res + " " +  nGiam + " " + " " + nTang + " " + nKhongDoi);
        return res;
    }

    startingCandle(){
        //var curCandleTime =  0;
       console.log("startingCanle(): ")
        var client = Globals.client2;
        
        client.ws.candles(this.symbol, this.interval, candle => {
            console.log(candle);
            var updateCandlestick = this.listCandle[this.listCandle1m.length -1];	                           
            
            if (updateCandlestick.startTime != candle.startTime) {
                //curCandleTime = candle.startTime;
                //candleLast = new candleStick1
              // new candlestick

                var newCandle = new CandleStick();
                newCandle.updateCandle(candle);
                console.log("candles: " + this.listCandle[this.listCandle.length - 1]);
                this.listCandle.push(newCandle);
                this.lastCandleList = [];
                var candleStick1 =new CandleStick();
                candleStick1.updateCandle(candle);
                this.lastCandleList.push(candleStick1);

            }
            else{
                updateCandlestick.updateCandle(candle);
                var candleStick1 = new CandleStick();
                candleStick1.updateCandle(candle);
                this.lastCandleList.push(candleStick1);
            }

            if(this.asset == "BTC"){
                Globals.btcCandle = this.listCandle;
            }  

            //this.processBuyAndSell();

            console.log("candle length: " + this.listCandle.length);
        })
      
    }

    testTheoXuHuong(nSample, vIn, vOut){

        console.log("testTheoXuhuong: " + this.symbol);
        var tongLoiNhuan = 0;
        var nBuy = 0;

        for(var i = nSample; i < this.listCandle.length; i++){
            var tuongQuan = this.countTuongQuan(i, nSample);

            //console.log("TuongQuan: " + " " + tuongQuan);

            if(this.hasBuy == false && tuongQuan > vIn){
                this.hasBuy = true;
                this.buyPrice = this.listCandle[i].open;
                this.timeBuy = i;
                console.log("buyPrice: " + this.buyPrice);
                nBuy++;
            }

            if(this.hasBuy && tuongQuan < vOut && i > (this.timeBuy + 100)){
                this.hasBuy = false;
                var priceBan = this.listCandle[i].open;
                console.log("sellPrice: " + priceBan);
                tongLoiNhuan += (priceBan - this.buyPrice)/this.buyPrice;
            }
        }

        console.log("Tong loi nhuan " + tongLoiNhuan + " " + nBuy);
    }


};

// exports.getTradePair  =  async function(asset, base){
//     var t = new TradePair(asset, base);
//     await t.initCandle();
//     return t;
// } 


// exports.getTradePairTest  =  async function(asset, base){
//     var t = new TradePair(asset, base);
//     await t.initCandleTest();
//     return t;
// } 

module.exports = TradePair;


