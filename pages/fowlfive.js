import React, { Component } from "react";
import Link from "next/link";

//  fowlfive.js crypto calculation component for Paper Umbrella 
//  by Dan McKeown http://danmckeown.info copyright 2018 licensed under ISC license
//  update @ v0.3.1 + cryptoCur @ v0.6.15 + paperumbrella @ v0.9.0

const apiProtocol = "https://";
const urlSubdomainOrPrefix = "api.";
const dataSource = "coinmarketcap";
const urlTLD = ".com";
const apiVersion = "/v1"
const cryptoURLExt = "/ticker/";
const cryptoURLbase = apiProtocol + urlSubdomainOrPrefix + dataSource + urlTLD + apiVersion;
const dataSourceWebUrl = "https://" + dataSource + ".com";

class cryptoCur {
  constructor(name, price, cap) {
    this.name = name;
    this.price = price;
    this.cap = cap;
  }
}

var bitcoinP = new cryptoCur();
var ethP = new cryptoCur();
var bchP = new cryptoCur();
var ltcP = new cryptoCur();
var dshP = new cryptoCur();

function getFowlFiveIndexV1(...cryptos) {
  console.log("cryptos array received by getFowlFiveIndexV1: " + cryptos);
  //  expected crypto object parameters: bitcoin, ethereum, bitcoincash, litecoin, dash
  let totalCap = 0;
  let totalPrice = 0;

  const capLimit = cryptos[0].cap; //  assuming for now [0] will be bitcoin
  const priceStandard = cryptos[0].price;
  let subAmount = 0;
  let runningTotal = 0;
  let subAmountArray = [];
  let refAmtTotal = 0;
  let localRebasedPriceRatioTotal = 0;
  let priceTotal = 0;

  for (let crypto of cryptos) {
    totalCap = totalCap + crypto.cap;
    totalPrice = totalPrice + crypto.price;
    let localPriceCapRatio = totalPrice / totalCap;
    console.log("local Price Cap Ratio: " + localPriceCapRatio);

    priceTotal = priceTotal + crypto.price;

    let localCapPercentage = crypto.cap / capLimit;
    console.log("local cap percentage: " + localCapPercentage);
    subAmount = localCapPercentage * crypto.price;
    let localRebasedPriceRatio = crypto.price / priceStandard;
    let localRebasedPrice =
      crypto.price * (localRebasedPriceRatio * crypto.cap) / 10000000000;
    console.log("local Rebased Price Ratio: " + localRebasedPriceRatio);
    if (localRebasedPriceRatio !== 1) {
      localRebasedPriceRatioTotal =
        localRebasedPriceRatioTotal + localRebasedPriceRatio;
    } else {
      localRebasedPriceRatioTotal =
        localRebasedPriceRatioTotal + crypto.price / 10000;
    }

    console.log("local Rebased Price: " + localRebasedPrice);

    let refAmt = localCapPercentage * localRebasedPrice;
    console.log("refAmt: " + refAmt);
    refAmtTotal = refAmtTotal + refAmt;

    let localBTCbasis = crypto.price / cryptos[0].price;
    console.log("localBTCbasis: " + localBTCbasis);
    let localAdjustedRebasedPrice = crypto.price / localBTCbasis; //  this acts like a checksum
    console.log("localAdjustedRebasedPrice: " + localAdjustedRebasedPrice);
    let adjustedFowlTotal = localAdjustedRebasedPrice * localRebasedPriceRatio;
    console.log("adjustedFowlTotal: " + adjustedFowlTotal);

    subAmountArray.push(subAmount);

    runningTotal = localRebasedPrice / 100 + runningTotal;
    console.log("current running total: " + runningTotal);
    console.log("ref amt total: " + refAmtTotal);
  }

  let adjustedLocalRebasedPriceRatioTotal = localRebasedPriceRatioTotal * 1000;
  let fowlFiveIndex = adjustedLocalRebasedPriceRatioTotal;
  console.log("total market cap: " + totalCap);
  console.log("total price " + priceTotal);
  console.log("Fowl Five Index: " + fowlFiveIndex);
  console.log(
    "adjusted localRebasedPriceRatioTotal: " + localRebasedPriceRatioTotal
  );
  return fowlFiveIndex;
}

let totalCap = 0;
let totalPrice = 0;

var capLimit = 0;
var priceStandard = 0;
let subAmount = 0;
let runningTotal = 0;
let subAmountArray = [];
let refAmtTotal = 0;
var localRebasedPriceRatioTotal = 0;
let priceTotal = 0;

var adjustedLocalRebasedPriceRatioTotal = localRebasedPriceRatioTotal * 1000;
var fowlFiveIndex = adjustedLocalRebasedPriceRatioTotal;

let forCount = 0;

export default class Fowlfive extends Component {
  state = { Ok: true, marketCapTotal: 0, cryptoValTotal: 0, pricesAndCaps: [] };

  constructor() {
    super();
  }

  getCryptoData(crypto) {
    let dest = cryptoURLbase + cryptoURLExt + crypto + "/";
    let that = this;
    let ret = [];

    fetch(dest, {})
      .then(function (response) {
        if (response.ok) {
          console.log("response ok");
          console.log(response.json);
          for (var e in response.json) {
            console.log(e.toString());
          }
          console.log(response.text);
          return response.json();
        }
        throw new Error("Network did not respond.");
        return response.blob();
      })
      .then(function (myReturn) {
        console.log(myReturn);
        let cryptoValSubTotal = myReturn[0].price_usd;
        let marketCapSubTotal = myReturn[0].market_cap_usd;
        console.log(
          "market cap: " + marketCapSubTotal + " | price: " + cryptoValSubTotal
        );
        ret = [marketCapSubTotal, cryptoValSubTotal];
        let oldArr = that.state.pricesAndCaps;
        console.log("adding " + ret + " to " + oldArr);
        ret.push(myReturn[0].id);

        oldArr[oldArr.length] = ret;
        that.setState({ pricesAndCaps: oldArr });
      });
  }

  buildTuples(reducedArray, iteratorCount) {
    console.log("current buildTuples iteration: " + reducedArray);
    let outCount = 0;
    let retArray = [];
    let mutableArray = [];
    for (let i = 0; i < reducedArray.length; i++) {
      console.log("__tuple state:");
      console.log(i, outCount, iteratorCount, reducedArray[i]);
      if (reducedArray[i][2] === "bitcoin") {
        bitcoinP.cap = reducedArray[i][0];
        bitcoinP.price = reducedArray[i][1];
        bitcoinP.name = reducedArray[i][2];
      }
      if (reducedArray[i][2] === "ethereum") {
        ethP.cap = reducedArray[i][0];
        ethP.price = reducedArray[i][1];
        ethP.name = reducedArray[i][2];
      }
      if (reducedArray[i][2] === "bitcoin-cash") {
        bchP.cap = reducedArray[i][0];
        bchP.price = reducedArray[i][1];
        bchP.name = reducedArray[i][2];
      }
      if (reducedArray[i][2] === "litecoin") {
        ltcP.cap = reducedArray[i][0];
        ltcP.price = reducedArray[i][1];
        ltcP.name = reducedArray[i][2];
      }
      if (reducedArray[i][2] === "dash") {
        dshP.cap = reducedArray[i][0];
        dshP.price = reducedArray[i][1];
        dshP.name = reducedArray[i][2];
      }

      if (outCount % iteratorCount !== 0) {
        mutableArray.push(reducedArray[i]);
      } else {
        retArray.push(mutableArray);
        console.log("^^^ adding " + mutableArray + " to " + retArray);
        mutableArray = [];
      }
      outCount++;
    }
    return retArray;
  }

  processCoinTuple(bitcoinTuple) {
    console.log(
      "running processCoinTuple wih " +
      bitcoinTuple[2] +
      " at forCount:" +
      forCount
    );
    if (capLimit < bitcoinTuple[0]) {
      capLimit = bitcoinTuple[0];
    }
    if (priceStandard < bitcoinTuple[1]) {
      priceStandard = bitcoinTuple[1];
    }

    totalCap = totalCap + bitcoinTuple[0];
    totalPrice = totalPrice + bitcoinTuple[1];
    let localPriceCapRatio = totalPrice / totalCap;
    console.log("#local Price Cap Ratio: " + localPriceCapRatio);

    priceTotal = priceTotal + bitcoinTuple[1];

    let localCapPercentage = bitcoinTuple[0] / capLimit;
    console.log("#local cap percentage: " + localCapPercentage);
    subAmount = localCapPercentage * bitcoinTuple[1];
    let localRebasedPriceRatio = bitcoinTuple[1] / priceStandard;
    let localRebasedPrice =
      bitcoinTuple[1] *
      (localRebasedPriceRatio * bitcoinTuple[0]) /
      10000000000;
    console.log("#local Rebased Price Ratio: " + localRebasedPriceRatio);
    if (localRebasedPriceRatio !== 1) {
      console.log(
        "adding " +
        localRebasedPriceRatio +
        " to localRebasedPriceRatioTotal " +
        localRebasedPriceRatioTotal
      );
      localRebasedPriceRatioTotal =
        localRebasedPriceRatioTotal + localRebasedPriceRatio;
    } else {
      localRebasedPriceRatioTotal =
        localRebasedPriceRatioTotal + bitcoinTuple[1] / 10000;
    }

    console.log("#local Rebased Price: &&&&&  " + localRebasedPrice);

    let refAmt = localCapPercentage * localRebasedPrice;
    console.log("#refAmt: " + refAmt);
    refAmtTotal = refAmtTotal + refAmt;

    let localBTCbasis = bitcoinTuple[1] / priceStandard;
    console.log("#localBTCbasis: " + localBTCbasis);
    let localAdjustedRebasedPrice = bitcoinTuple[1] / localBTCbasis; //  this acts like a checksum
    console.log("#localAdjustedRebasedPrice: " + localAdjustedRebasedPrice);
    let adjustedFowlTotal = localAdjustedRebasedPrice * localRebasedPriceRatio;
    console.log("#adjustedFowlTotal: " + adjustedFowlTotal);

    subAmountArray.push(subAmount);

    runningTotal = localRebasedPrice / 100 + runningTotal;
    console.log("#current running total: " + runningTotal);
    console.log("#ref amt total: " + refAmtTotal);
    console.log(
      localRebasedPriceRatio,
      adjustedFowlTotal,
      runningTotal,
      refAmtTotal
    );
    return [
      localRebasedPriceRatio,
      adjustedFowlTotal,
      runningTotal,
      refAmtTotal
    ];
  }

  componentWillMount() { }
  componentDidMount() {
    const fetch = window.fetch;

    const obvParam = this.props.cryptocurrency;

    var that = this;

    var abitcoinArry = this.getCryptoData("bitcoin");
    var ethereumArray = this.getCryptoData("ethereum");
    var bitcoincashArray = this.getCryptoData("bitcoin-cash");
    var litecoinArray = this.getCryptoData("litecoin");
    var dashArray = this.getCryptoData("dash");
  }
  render() {
    console.log("CryptoCoins array (of arrays)--: " + this.state.pricesAndCaps);
    console.log("array 0--: " + this.state.pricesAndCaps[0]);
    console.log("array 1--: " + this.state.pricesAndCaps[1]);
    console.log(
      "CryptoCoins array (of arrays) length: " + this.state.pricesAndCaps.length
    );

    var bitcoinData,
      ethereumData,
      bitcoincashData,
      litecoinData,
      dashData = [];

    var globalLocalRebasedPriceRatio = 0;

    let iterArray = this.state.pricesAndCaps;

    const repackedData = this.buildTuples(iterArray, 3);

    for (let i = 0; i < iterArray.length; i++) {
      console.log("forCount:" + forCount);
      forCount++;
      console.log("------name-" + iterArray[i][2]);
      console.log("------cap-" + iterArray[i][0]);
      console.log("------price-" + iterArray[i][1]);
      if (this.state.pricesAndCaps[i][2] === "bitcoin") {
        let bitcoinTuple = this.state.pricesAndCaps[i];
        //   bitcoinTuple[1] = 20000; //  literal price data can be injected like this in testing
        bitcoinData = this.processCoinTuple(bitcoinTuple);
        globalLocalRebasedPriceRatio =
          globalLocalRebasedPriceRatio + bitcoinData[0];
      } else if (this.state.pricesAndCaps[i][2] === "ethereum") {
        let ethereumTuple = this.state.pricesAndCaps[i];
        ethereumData = this.processCoinTuple(ethereumTuple);
        globalLocalRebasedPriceRatio =
          globalLocalRebasedPriceRatio + ethereumData[0];
      } else if (this.state.pricesAndCaps[i][2] === "bitcoin-cash") {
        let thiscoinTuple = this.state.pricesAndCaps[i];
        bitcoincashData = this.processCoinTuple(thiscoinTuple);
        globalLocalRebasedPriceRatio =
          globalLocalRebasedPriceRatio + bitcoincashData[0];
      } else if (this.state.pricesAndCaps[i][2] === "litecoin") {
        let thiscoinTuple = this.state.pricesAndCaps[i];
        litecoinData = this.processCoinTuple(thiscoinTuple);
        globalLocalRebasedPriceRatio =
          globalLocalRebasedPriceRatio + litecoinData[0];
      } else if (this.state.pricesAndCaps[i][2] === "dash") {
        let thiscoinTuple = this.state.pricesAndCaps[i];
        dashData = this.processCoinTuple(thiscoinTuple);
        globalLocalRebasedPriceRatio =
          globalLocalRebasedPriceRatio + dashData[0];
      }
    }

    adjustedLocalRebasedPriceRatioTotal = globalLocalRebasedPriceRatio * 1000;
    fowlFiveIndex = adjustedLocalRebasedPriceRatioTotal;

    console.log("**FOWL FIVE INDEX: " + fowlFiveIndex);
    console.log("bitcoinP.name is " + bitcoinP.name);
    console.log("ethP.name is " + ethP.name);
    console.log("bchP.name is " + bchP.name);
    console.log("ltcP.name is " + ltcP.name);
    console.log("dshP.name is " + dshP.name);

    var ffindex = getFowlFiveIndexV1(bitcoinP, ethP, bchP, ltcP, dshP);
    console.log("ffindex calculated by function: " + ffindex);
    var ffindexURL = "/addfowlfive/" + ffindex + "/datetime/" + Date.now();

    return (
      <div id="fowlComponentDiv">
        <span id="ffhead">
          Fowl Five Index
        </span>
        <span id="ffabout">
          <a href="https://djmblog.com/page/Fowl-Five-Index">about</a>
        </span>
        <br />
        <span id="creatorCredit">
          by <a href="http://danmckeown.info">Dan McKeown</a>
        </span>
        <div id="fowlComponentDiv2">
          <span id="info" />
          <span id="fowlTotal">{ffindex.toFixed(4)}</span>
        </div>
        <aside id="sourceInfo">
          <span id="sourceC">price data via <a href={dataSourceWebUrl}>{dataSource}</a></span>
        </aside>
        <style>
          {`
            div#fowlComponentDiv {
              padding-left: 0.2em;
              border-style: none;
              width: 30vw;
              background-color: #f3e8f7;
            }
            span#fowlTotal {
              font-size: 18px;
              font-family: "Hack", "Fira Code", "Menlo", monospace;
              color: #070b2d;
            }
            span#ffhead, span#ffhead a {
              font-size: 20px;
              font-family: "Lucida Grande", "Helvetica", "Roboto", "Ubuntu Sans", sans-serif;
              color: #3c0ed1;
              text-decoration: none;
            }
            span#creatorCredit, span#creatorCredit a {
              font-size: 14px;
              font-family: "Opens Sans", "Roboto", "Ubuntu Sans", "Helvetica", sans-serif;
              color: Gainsboro;
            }
            span#sourceC, span#sourceC a {
              font-size: 12px;
              color: darkgray;
            }
            span#ffabout, span#ffabout a {
              margin-left: 0.6em;
              font-size: 10px;
              color: silver;
            }
            `}
        </style>
      </div>
    );
  }
}
