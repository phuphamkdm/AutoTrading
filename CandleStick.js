const Globals = require('./Globals');
class CandleStick {
    constructor() {
      this.open = "0";
      this.high = "0";
      this.low = "0";
      this.close = "0";

      this.trades = 28;
      this.isFinal = false;
      this.startTime = 0;
      this.closeTime = 0;
      this.symbol = "";

      this.name = "First Name";
      this.interval = "1m";
      this.trades = 0;

      this.volume = 65519;
      this.quoteVolume= 0;
      this.buyVolume = 0;
      this.quoteBuyVolume = 0;
    }
   
    set name(name) {
      this._name = name;
    }
   
    get name() {
      return this._name;
    }
   
    sayHi() {
      console.log("Hi, " + this.name + ", your ID is " + this.id);
    }

    isGiam(){
      return this.open < this.close;
    }

    updateCandle(candle){
       this.startTime = candle.startTime;
       this.endTime5s = candle.startTime + Globals.TIME_5_SECOND;
       this.open = parseFloat(candle.open);

       this.high = parseFloat(candle.high);
       this.low = parseFloat(candle.low);
       this.close = parseFloat(candle.close);
       this.volume = parseFloat(candle.volume);
       this.quoteVolume = parseFloat(candle.quoteVolume);
       this.trades = candle.trades;

       this.buyVolume = parseFloat(candle.buyVolume);
       this.quoteBuyVolume = parseFloat(candle.quoteBuyVolume);
       this.isFinal = candle.isFinal;
    }

    updateCandle5s(candePre, candleNow){
      this.startTime = candlePre.endTime5s;
      this.endTime5s = candePre.endTime5s + Globals.TIME_5_SECOND;

      this.open = parseFloat(candle.open);
      this.high = parseFloat(candle.high);
      this.low = parseFloat(candle.low);
      this.close = parseFloat(candle.close);
      this.volume = parseFloat(candle.volume);
      this.quoteVolume = parseFloat(candle.quoteVolume);
      this.trades = candle.trades;

      this.buyVolume = parseFloat(candle.buyVolume);
      this.quoteBuyVolume = parseFloat(candle.quoteBuyVolume);
      this.isFinal = candle.isFinal;
    }

    toString(){
       return "[" + "open: " + this.open + " " + " volume:" + this.volume + " startTime: "  + this.startTime +  "]";
    }
};

module.exports = CandleStick;