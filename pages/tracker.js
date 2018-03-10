//  tracker.js for Paper Umbrella by http://danmckeown.info copyright 2018 licensed under ISC license

import React, { Component } from "react";
import Head from "next/head";

import bitcoin from "bitcoinjs-lib";
import Elecwalletview from "./elecwalletview";
const TheSistersByJamesJoyceExcerpt = `The reading of the card persuaded me that he was dead and I was disturbed to find myself at check. Had he not been dead I would have gone into the little dark room behind the shop to find him sitting in his arm-chair by the fire, nearly smothered in his great-coat. Perhaps my aunt would have given me a packet of High Toast for him and this present would have roused him from his stupefied doze. It was always I who emptied the packet into his black snuff-box for his hands trembled too much to allow him to do this without spilling half the snuff about the floor. Even as he raised his large trembling hand to his nose little clouds of smoke dribbled through his fingers over the front of his coat. It may have been these constant showers of snuff which gave his ancient priestly garments their green faded look for the red handkerchief, blackened, as it always was, with the snuff-stains of a week, with which he tried to brush away the fallen grains, was quite inefficacious. I wished to go in and look at him but I had not the courage to knock. I walked away slowly along the sunny side of the street, reading all the theatrical advertisements in the shop-windows as I went. I found it strange that neither I nor the day seemed in a mourning mood and I felt even annoyed at discovering in myself a sensation of freedom as if I had been freed from something by his death. I wondered at this for, as my uncle had said the night before, he had taught me a great deal. He had studied in the Irish college in Rome and he had taught me to pronounce Latin properly. He had told me stories about the catacombs and about Napoleon Bonaparte, and he had explained to me the meaning of the different ceremonies of the Mass and of the different vestments worn by the priest. Sometimes he had amused himself by putting difficult questions to me, asking me what one should do in certain circumstances or whether such and such sins were mortal or venial or only imperfections. His questions showed me how complex and mysterious were certain institutions of the Church which I had always regarded as the simplest acts. The duties of the priest towards the Eucharist and towards the secrecy of the confessional seemed so grave to me that I wondered how anybody had ever found in himself the courage to undertake them; and I was not surprised when he told me that the fathers of the Church had written books as thick as the Post Office Directory and as closely printed as the law notices in the newspaper, elucidating all these intricate questions. Often when I thought of this I could make no answer or only a very foolish and halting one upon which he used to smile and nod his head twice or thrice. Sometimes he used to put me through the responses of the Mass which he had made me learn by heart; and, as I pattered, he used to smile pensively and nod his head, now and then pushing huge pinches of snuff up each nostril alternately. When he smiled he used to uncover his big discoloured teeth and let his tongue lie upon his lower lip—a habit which had made me feel uneasy in the beginning of our acquaintance before I knew him well. As I walked along in the sun I remembered old Cotter’s words and tried to remember what had happened afterwards in the dream. I remembered that I had noticed long velvet curtains and a swinging lamp of antique fashion. I felt that I had been very far away, in some land where the customs were strange—in Persia, I thought.... But I could not remember the end of the dream.`;

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

function wrapper() {
  //  return Buffer.from(getArbitraryWord(TheSistersByJamesJoyceExcerpt, 30));
  let inpString =
    "lzzzzzzzziizzzzzzzzzzzzz" +
    getArbitraryWord(TheSistersByJamesJoyceExcerpt, 30) +
    getArbitraryWord(TheSistersByJamesJoyceExcerpt, 30) +
    getArbitraryWord(TheSistersByJamesJoyceExcerpt, 2) +
    getArbitraryWord(TheSistersByJamesJoyceExcerpt, 2);
  return Buffer.from(inpString);
}

function get_bitcoin_testnet_keypair_array() {
  var testnet = bitcoin.networks.testnet;
  //  let arbitrarySequence = getArbitraryWord(TheSistersByJamesJoyceExcerpt, 30);

  var keyPair = bitcoin.ECPair.makeRandom({ network: testnet, rng: wrapper });
  //  var keyPair = bitcoin.ECPair.makeRandom({ network: testnet, rng: rng });
  var wif = keyPair.toWIF();
  var address = keyPair.getAddress();
  var keyData = [keyPair, wif, address];
  return keyData;
}

function getArbitraryWord(inpString, segment = 7) {
  //    if inpString is an array, crush into a string
  //  segment is the univeral word length for the purposes of this function
  let ln = inpString.length - segment;
  let position = math_floor_random_number(ln);
  return inpString[position] + inpString[position];
  let retWord = ``;
  for (let i = 0; i < segment; i++) {
    // retWord[i] = inpString[i + position];
    retWord = retWord + inpString[i + position];
  }
  console.log("retWord: " + retWord);
  return retWord;
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

var arbitraryBtcData = get_bitcoin_testnet_keypair_array();

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
    console.log("getting arbitrary BTC address data");
    var testnet = bitcoin.networks.testnet;
    let keyPair1 = arbitraryBtcData[0];
    let wif1 = arbitraryBtcData[1];
    let address1 = arbitraryBtcData[2];

    console.log(wif1);
    console.log(address1);

    let segment = 12;

    let retWords = ``;
    for (let i = 0; i < segment; i++) {
      //  retWords[i] = getArbitraryWord(TheSistersByJamesJoyceExcerpt, 6);
      retWords =
        retWords + " " + getArbitraryWord(TheSistersByJamesJoyceExcerpt, 6);
    }

    console.log("made up seed: " + retWords);

    this.setState({ publicKeyValue: address1, publicKeys: address1 });
    this.setState({ privateKeys: wif1, privateKeyValue: wif1 });
    this.setState({ sVal: retWords, sValue: retWords });

    arbitraryBtcData = get_bitcoin_testnet_keypair_array();
  };

  componentWillMount() {}
  componentDidMount(props) {
    const fetch = window.fetch;

    const obvParam = this.props.cryptocurrency;

    var that = this;

    this.VoidUpdateWalletList();
  }
  render() {
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
            <section>
              public key(s): {this.state.publicKeys}{" "}
              <button onClick={this.VoidPopulateArbitraryData} id="genPubKey">
                generate arbitrary data
              </button>
            </section>
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
