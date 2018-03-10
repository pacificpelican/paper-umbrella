//  tracker.js for Paper Umbrella by http://danmckeown.info copyright 2018 licensed under ISC license

import React, { Component } from "react";
import Head from "next/head";

import bitcoin from "bitcoinjs-lib";
import Elecwalletview from "./elecwalletview";

let crypto;
try {
  crypto = require("crypto");
} catch (err) {
  console.error("crypto not available in this NodeJS version");
  window.alert("Abandon all hope, crypto library not found.");
  let err = new Error();
  throw err;
}

const numberScale = 100000000000000;

const walletQuery = "/api/getwalletlist/v/1";

function createMarkup(inner) {
  return { __html: inner };
}

const updateDOM = function(dataset, inpSel = "input#nameinput") {
  document.getElementById(inpSel).value = dataset;
};

function getCryptoNow() {
  var retVal;
  crypto.randomBytes(8, (err, buf) => {
    if (err) throw err;
    let rVal = buf.toString("hex");
    console.log(`${buf.length} bytes of random data: ${buf.toString("hex")}`);
    let rValHTML = `<span>${rVal}</span>`;
    retVal = rVal;
  });
  return retVal;
}

function math_floor_random_number(scale) {
  var newdigit = Math.floor(Math.random() * scale + 1);
  return newdigit;
}

function rng() {
  return Buffer.from("zzzzzzzzzziizzzzzzzzzzzzzzzzzzzz");
}

function get_bitcoin_testnet_keypair_array() {
  //	deprecated
  var testnet = bitcoin.networks.testnet;
  var keyPair = bitcoin.ECPair.makeRandom({ network: testnet, rng: rng });
  var wif = keyPair.toWIF();
  var address = keyPair.getAddress();
  var keyData = [keyPair, wif, address];
  return keyData;
}

class bitcoinElectrumData {
  constructor(name) {
    this.name = name;
  }
  getElectrumDataArray() {
    return [this.name, this.seedData, this.electrumPW, this.keyData];
  }
  updateElectrumData(arr) {
    this.iTitle = arr[0];
    this.seedData = arr[1];
    this.electrumPW = arr[2];
    this.keyData = arr[3];
    this.publicKeys = arr[4];
    this.privateKeys = arr[5];
    return true;
  }
  iTitle = "";
  umbrellaID = "btc-umb-ID-" + getCryptoNow();
  umbrellaType = "electrumBTC1";
  seedData = "";
  keyData = {};
  electrumPW = "";
  publicKeys = "";
  privateKeys = "";
}

let itemName = "btc-umb-no-" + math_floor_random_number(100000000000);
var btcWallet = new bitcoinElectrumData(itemName);

const arbitraryBtcData = get_bitcoin_testnet_keypair_array();

export default class Tracker extends Component {
  state = {
    cValue: "",
    cVal: "",
    sValue: "",
    sVal: "",
    publicKeyValue: "",
    privateKeyValue: "",
    publicKeys: "",
    privateKeys: "",
    pswd: "",
    passwd: "",
    walletprops: {},
    lookupWalletName: "",
    queryWalletName: "",
    displayValue: {},
    xyk: {}
  };

  constructor(props) {
    super(props);

    this.handlecValueChange = this.handlecValueChange.bind(this);
    this.handlesValueChange = this.handlesValueChange.bind(this);
    this.handlePublicKeyValueChange = this.handlePublicKeyValueChange.bind(
      this
    );
    this.handlePrivateKeyValueChange = this.handlePrivateKeyValueChange.bind(
      this
    );
    this.handlePswdValueChange = this.handlePswdValueChange.bind(this);
    this.handleWalletTitleValueChange = this.handleWalletTitleValueChange.bind(
      this
    );
    this.handleSubmitAdjustQuery = this.handleSubmitAdjustQuery.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);

    this.xyk = new bitcoinElectrumData("no9");
    this.xyk.publicKeys = get_bitcoin_testnet_keypair_array()[1];
    this.xyk.privateKeys = get_bitcoin_testnet_keypair_array()[0];

    // this.setState({xyk: this.xyk});

  }

  handlecValueChange(event) {
    console.log("updating cValue: " + event.target.value);
    let userValue = event.target.value;
    this.setState({ cValue: userValue, cVal: userValue });
  }

  handlesValueChange(event) {
    console.log("updating sValue: " + event.target.value);
    let userValue = event.target.value;
    this.setState({ sValue: userValue, sVal: userValue });
  }

  handlePublicKeyValueChange(event) {
    console.log("updating public key: " + event.target.value);
    let userValue = event.target.value;
    this.setState({ publicKeyValue: userValue, publicKeys: userValue });
  }

  handlePrivateKeyValueChange(event) {
    console.log("updating private key: " + event.target.value);
    let userValue = event.target.value;
    this.setState({ privateKeys: userValue, privateKeyValue: userValue });
  }

  handlePswdValueChange(event) {
    console.log("updating Umbrella (system) password: " + event.target.value);
    let userValue = event.target.value;
    this.setState({ passwd: userValue });
  }

  handleWalletTitleValueChange(event) {
    let userValue = event.target.value;
    this.setState({ queryWalletName: userValue });
  }

  handleSubmitAdjustQuery(event) {
    let walletName = document.getElementById("nameinput").value;
    let systemPassword = this.state.passwd;
    this.VoidUpdateCurrentWalletData(walletName, systemPassword);

    event.preventDefault();
  }

  handleUpdateCurrentName(event) {
    alert();
    console.log("running handleUpdateCurrentName");
    let userValue = event.target.value;
    this.setState({ lookupWalletName: userValue });
  }

  handleSubmit(event) {
    console.log("generated wif: " + this.xyk.publicKeys.toString());
    console.log("cValue via handleSubmit: " + this.state.cVal);
    btcWallet.updateElectrumData([this.state.cVal, this.state.sVal, "pw", {}]);
    console.log("seed data for " + this.state.cVal + ": " + btcWallet.seedData);

    var myImage = document.querySelector("img");

    let fetch = window.fetch;

    let rawSeed = this.state.sVal;
    let encodedSeed = rawSeed.replace(/ /g, "&");
    let encodedPrivateKeys = this.state.privateKeys.replace(/ /g, "&");
    let encodePublicKeys = this.state.publicKeys.replace(/ /g, "&");
    let encodedName = this.state.cVal.replace(/ /g, "&");

    let theRequest =
      "/api/create/v/1/seed/" +
      encodedSeed +
      "/name/" +
      this.state.cVal +
      "/public/" +
      encodePublicKeys +
      "/private/" +
      encodedPrivateKeys +
      "/pswd/" +
      this.state.passwd;

    console.log("about to Fetch: " + theRequest);

    fetch(theRequest)
      .then(function(response) {
        return response.blob();
      })
      .then(function(myBlob) {
        var el = document.getElementById("pks");
        el.value = "_";
        var el3 = document.getElementById("pk-h1");
        el3.textContent = "data sent [refresh to confirm save]";
        var el = document.getElementById("sed");
        el.value = "_";
        var el2 = document.getElementById("seed-h1");
        el2.textContent = "data sent";
      });

    event.preventDefault();
  }

  VoidUpdateWalletList() {
    var that = this;
    fetch(walletQuery, {})
      .then(function(response) {
        if (response.ok) {
          console.log("response ok");
          console.log(response.json);
          for (var e in response.json) {
            console.log(e.toString());
          }
          console.log(response.text);
          return response.json();
        }
        throw new Error("API did not respond.");
        return response.blob();
      })
      .then(function(myReturn) {
        console.log(myReturn);

        that.setState({ displayValue: myReturn });
      });
  }

  VoidUpdateCurrentWalletData(theName, thePassword) {
    let that = this;
    let ret = [];
    var urlForName = "/api/view/v/1/name/" + theName + "/pswd/" + thePassword;
    fetch(urlForName, {})
      .then(function(response) {
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
      .then(function(myReturn) {
        console.log(myReturn);
        that.setState({ walletprops: myReturn });
      });
  }

  VoidPopulateArbitraryData = () => {
    //  btcAddressGenerator = new bitcoinElectrumData("no9");
    console.log("getting arbitrary BTC address data");
    var testnet = bitcoin.networks.testnet;
  //  var keyPair = get_bitcoin_testnet_keypair_array()[0];
    let keyPair1 = arbitraryBtcData[0];
    let wif1 = arbitraryBtcData[1];
    let address1 = arbitraryBtcData[2];

    // let publicKey = arbitraryBtcData[0];
    // let privateKey = arbitraryBtcData[0];

    console.log(wif1);
    console.log(address1);

    this.setState({ publicKeyValue: address1, publicKeys: address1 });
    this.setState({ privateKeys: wif1, privateKeyValue: wif1 });

    // this.xyk.publicKeys = get_bitcoin_testnet_keypair_array()[1];
    // this.xyk.privateKeys = get_bitcoin_testnet_keypair_array()[0];

    // let publicKey = xyk.publicKeys;
    // let privateKey = xyk.privateKeys;

    // let updatePublicKey = (newPublicKey) =>  {
    //   console.log("updating public key: " + newPublicKey);
    //   let userValue = newPublicKey;
    //   this.setState({ publicKeyValue: userValue, publicKeys: userValue });
    // }

    // updatePublicKey(publicKey)
  
    // handlePrivateKeyValueChange(event) {
    //   console.log("updating private key: " + event.target.value);
    //   let userValue = event.target.value;
    //   this.setState({ privateKeys: userValue, privateKeyValue: userValue });
    // }
  }

  componentWillMount() {}
  componentDidMount(props) {
    const fetch = window.fetch;

    const obvParam = this.props.cryptocurrency;

    var that = this;

    this.VoidUpdateWalletList();
  }
  render() {
    var testnet = bitcoin.networks.testnet;
    var keyPair = get_bitcoin_testnet_keypair_array()[0];
    var wif = keyPair.toWIF();
    var address = keyPair.getAddress();

    let iterArr = this.state.displayValue;
    console.log("display value:");
    console.log(this.state.displayValue);
    let dispData = "";

    for (let i = 0; i < iterArr.length; i++) {
      console.log("innerObj: ");
      console.log(iterArr[i]);

      dispData =
        dispData +
        "<button className='btn-tr' onClick={document.getElementById('nameinput').value=event.target.textContent;}>" +
        iterArr[i].name +
        "</button>";
    }

    console.log("wif:" + wif);
    console.log("address: " + address);
    console.log(getCryptoNow());
    return (
      <div
        className="cryptoTracker"
        id={"cryptoTracker" + math_floor_random_number(500)}
      >
        <div className="cryptoTrackerTitleDiv">
          <span
            className="cryptoWalletVal"
            id={"cryptoWalletVal" + math_floor_random_number(500)}
          >
            <a href="http://paperumbrella.pacificio.com">☂</a> Paper Umbrella
            Crypto Asset Archiver
          </span>
          <br />
        </div>
        <div id="walletslist">
          <h5 className="smallHeadline">Stored Wallets:</h5>
          <div dangerouslySetInnerHTML={createMarkup(dispData)} />
        </div>
        <div id="storeddata">
          <h5 className="smallHeadline">Look up wallet info:</h5>
          <div id="adjustQuery">
            <form
              id="setWalletNameForLookup"
              onSubmit={this.handleSubmitAdjustQuery}
            >
              <label className="getRecord">
                Your Umbrella Password:
                <input
                  type="text"
                  value={this.state.passwd}
                  onChange={this.handlePswdValueChange}
                />
              </label>
              <br />
              <br />
              <label className="getRecord">
                Wallet Title:
                <input id="nameinput" type="text" />
              </label>
              <br />
              <br />
              <input id="lookup" type="submit" value="Look up" />
            </form>
          </div>
          <Elecwalletview walletprops={this.state.walletprops} />
        </div>
        <div className="cryptoInfoDisplay">
          <section className="cryptoInfoDisplay--title">
            <h6 id="sysPW">
              your Paper Umbrella system password: {this.state.passwd}
            </h6>
            <h2 id="cryptoLabel">
              Bitcoin <a href="https://electrum.org/#home">Electrum</a> Wallet
              Backup 🚛
            </h2>
            <h4>title: {this.state.cVal}</h4>
            <section id="seed-h1">seed data: {this.state.sVal}</section>
            <section>public key(s): {this.state.publicKeys} <button onClick={this.VoidPopulateArbitraryData} id="genPubKey">generate arbitrary data</button></section>
            <section id="pk-h1">
              private key(s): {this.state.privateKeys}
            </section>
            <form id="walletItemSave" onSubmit={this.handleSubmit}>
              <label className="addRecordInput">
                Your Umbrella Password:
                <input
                  type="text"
                  value={this.state.passwd}
                  onChange={this.handlePswdValueChange}
                />
              </label>
              <br />
              <br />
              <label className="addRecordInput">
                Title:
                <input
                  type="text"
                  value={this.state.cValue}
                  onChange={this.handlecValueChange}
                />
              </label>
              <br />
              <br />
              <label className="addRecordInput">
                Seed*:
                <input
                  id="sed"
                  type="text"
                  value={this.state.sValue}
                  onChange={this.handlesValueChange}
                />
              </label>
              <br />
              <br />
              <label className="addRecordInput">
                Public Key(s):
                <input
                  type="text"
                  value={this.state.publicKeyValue}
                  onChange={this.handlePublicKeyValueChange}
                />
              </label>
              <br />
              <br />
              <label className="addRecordInput">
                Private Key(s):
                <textarea
                  id="pks"
                  type="text"
                  onChange={this.handlePrivateKeyValueChange}
                  value={this.state.privateKeyValue}
                />
              </label>
              <br />
              <br />
              <input id="save" type="submit" value="Save" />
            </form>
          </section>
        </div>
        <Head>
          <title>Paper Umbrella crypto backup app</title>
          <meta
            name="viewport"
            content="width=device-width, initial-scale=1.0"
          />
          <link
            href="https://fonts.googleapis.com/css?family=VT323"
            rel="stylesheet"
          />
          <meta charset="utf-8" />
        </Head>
        <style>{`
      :root {
        --light-color: #BAC1B8;
        --main-bg: rgb(255, 255, 255);
        --logo-border-color: rebeccapurple;
        --blue-color: #D8FFDD;
        --green-color: #0C7C59;
        --dark-color: #2B303A;
		--red-color: #D64933;
		--ui-width: 80vw;
		--bg-2: #DEDBD8;
		--green-scheme-0: #D7FDEC;
		--green-scheme-1: #A7F9D4;
		--green-scheme-2: #B1E2CC;
		--green-scheme-3: #AFCEC0;
		--green-scheme-4: #8AA096;
		--pink: #FECEE9;
	  }
	  * { 
	  	  box-sizing: border-box;
	  }
		button,
		input,
		optgroup,
		select,
		textarea {
			font-family: inherit; /* 1 */
			font-size: 100%; /* 1 */
			line-height: 1.15; /* 1 */
			margin: 0; /* 2 */
		}
      div.cryptoTracker {
		width: var(--ui-width);
		background-color: var(--green-scheme-0, lightgreen);
		padding-left: 0.4em;
		padding-right: 0.3em;
	  }
	  div.cryptoInfoDisplay input {
		  backgroud-color: floralWhite;
		  min-width: 38vw;
	  }
	  div.cryptoInfoDisplay {
		margin-left: 0.4em;
		margin-right: 0.3em;
		padding-left: 0.4em;
		padding-right: 0.3em;
		font-family: Helvetica, "Lucida Sans", "Ubuntu Sans", "Roboto", sans-serif;
		background-color: var(--green-scheme-2);
	  }
	  h6#sysPW {
		background-color: #b0cdfc;
	  }
	  div.cryptoTrackerTitleDiv {
		font-family: "Hack", "Fira Code", Menlo, monospace;
	  }
	  div#walletslist {
	 	background-color: var(--green-scheme-1);
		border-top-right-radius: 4em;
	  }
	  div#adjustQuery {
		font-family: "Anonymous Pro", "Fira Code", Menlo, monospace;
	  }
	  input#lookup, input#save {
		background-color: var(--pink, pink);
		width: 300px;
		height: 50px;
	  }
	  div#wltview {
		background-color: floralWhite;
	  }
	  span.cryptoWalletVal {
		font-family: 'VT323', monospace;
		font-size: 28px;
	  }
	  .smallHeadline {
		font-family: Helvetica, Roboto, "Segoe UI", "Ubuntu", "Anonymous Pro", "Fira Code", Menlo, monospace;
	  }
	  section.cryptoInfoDisplay--title section {
		font-family: Helvetica, "Lucida Sans", "Ubuntu Sans", "Roboto", sans-serif;
		margin-bottom: 14px;
	  }
	  h2 a {
		text-decoration: none;
		color: darkblue;
	  }
	  div.cryptoTracker, div.cryptoInfoDisplay, h6#sysPW {
		border-top-right-radius: 3rem;
	  }
	  div.cryptoInfoDisplay{
		border-bottom-right-radius: 0.4rem;
	}
	  h6#sysPW, div.cryptoTracker {
		border-bottom-right-radius: 3rem;
	  }
	  span.cryptoWalletVal a {
		text-decoration: none;
		color: black;
	  }
    `}</style>
      </div>
    );
  }
}
