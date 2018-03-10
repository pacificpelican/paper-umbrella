//  server.js for mlBench by http://danmckeown.info copyright 2018

const express = require('express')
const next = require('next')

const port = parseInt(process.env.PORT, 10) || 3000
const dev = process.env.NODE_ENV !== 'production'
const app = next({ dev })
const handle = app.getRequestHandler()

const loki = require("lokijs");

var umbrellaJsonDb = new loki(__dirname + "/db/umbrella.json");

const crypto = require('crypto');

function enc_data_01(inp, cryptoAlg, cryptoPassword) {
  console.log("running enc_data_01 w/" + inp);
  const cipher = crypto.createCipher(cryptoAlg, cryptoPassword);
  let encrypted = cipher.update(inp, 'utf8', 'hex');
  encrypted += cipher.final('hex');
  console.log("encrypted: " + encrypted);
  return encrypted;
}

function enc_data_01_rev(inp, cryptoAlg, cryptoPassword) {
  console.log("running enc_data_01_rev w/" + inp);
  try {
    const decipher = crypto.createDecipher(cryptoAlg, cryptoPassword.toString());
    const encrypted = inp;
    let decrypted = decipher.update(encrypted, 'hex', 'utf8');
    decrypted += decipher.final('utf8');
    return decrypted;
  }
  catch (err) {
    console.error("ERROR DECRYPTING " + err);
    return null;
  }
}

app.prepare()
  .then(() => {
    const server = express()

    server.get('/api/create/v/1/seed/:sd/name/:nm/public/:pbk/private/:pvt/pswd/:pwd', (req, res) => {
      console.log(req.params);
      console.log("received Electrum Bictoin wallet data-- seed: " + req.params.sd + "   name: " + req.params.nm);

      let umbrella = "umbrella";

      umbrellaJsonDb.loadDatabase({}, function () {
        let _collection = umbrellaJsonDb.getCollection(umbrella);

        if (!_collection) {
          console.log("Collection %s does not exit. Creating ...", umbrella);
          _collection = umbrellaJsonDb.addCollection(umbrella);
        }

        const cryptoAlg = 'aes192';

        const cryptoPassword = req.params.pwd;

        let outputSeed = req.params.sd;
        let realSeed = outputSeed.replace(/&/g, ' ');

        let realPrivateKeys = req.params.pvt.replace(/&/g, ' ');

        let realPublicKeys = req.params.pbk.replace(/&/g, ' ');
        let realName = req.params.nm.replace(/&/g, ' ');

        console.log("enc_data_01");
        let encryptedSeed = enc_data_01(realSeed, cryptoAlg, cryptoPassword);

        let encryptedPrivateKeys = enc_data_01(realPrivateKeys, cryptoAlg, cryptoPassword);

        _collection.insertOne({
          name: realName,
          seed: encryptedSeed,
          publicKeys: realPublicKeys,
          privateKeys: encryptedPrivateKeys
        });

        umbrellaJsonDb.saveDatabase();

        let homeLink = "<a href='../../..'>Home</a>";
        res.send(req.params.nm + " with seed data " + req.params.sd[3] + " record created    | " + homeLink);
      });
    })

    server.get('/api/view/v/1/name/:nm/pswd/:pwd', (req, res) => {
      console.log(req.params);
      let userfiles = 'umbrella';

      umbrellaJsonDb.loadDatabase({}, function () {
        let _collection = umbrellaJsonDb.getCollection(userfiles);
        const cryptoAlg = 'aes192';
        let cryptoPassword = req.params.pwd;
        console.log("set cyrptoPassword to " + cryptoPassword);

        if (!_collection) {
          console.log("Collection %s does not exist. Creating ...", userfiles);
          _collection = umbrellaJsonDb.addCollection(userfiles);
        }

        var fileList = _collection.findOne({ name: req.params.nm });
        if ((fileList != 'undefined') && (fileList != null)) {
          console.log('found this data (encrypted): ' + fileList);
          fileList.seed = enc_data_01_rev(fileList.seed, cryptoAlg, cryptoPassword);
          fileList.privateKeys = enc_data_01_rev(fileList.privateKeys, cryptoAlg, cryptoPassword);
          res.send(fileList)
        }
        else {
          res.send(null);
        }
      });
    })

    server.get('/api/getwalletlist/v/1', (req, res) => {
      let userfiles = 'umbrella';

      umbrellaJsonDb.loadDatabase({}, function () {
        let _collection = umbrellaJsonDb.getCollection(userfiles);

        if (!_collection) {
          console.log("Collection %s does not exit. Creating ...", userfiles);
          _collection = umbrellaJsonDb.addCollection(userfiles);
        }

        var fileList = _collection.find();
        res.send(fileList)
      });
    })

    server.get('/api/viewencryped/v/1/name/:nm/pswd/:pwd', (req, res) => {
      console.log(req.params);
      let userfiles = 'umbrella';

      umbrellaJsonDb.loadDatabase({}, function () {
        let _collection = umbrellaJsonDb.getCollection(userfiles);

        if (!_collection) {
          console.log("Collection %s does not exist. Creating ...", userfiles);
          _collection = umbrellaJsonDb.addCollection(userfiles);
        }

        var fileList = _collection.findOne({ name: req.params.nm });
        if ((fileList != 'undefined') && (fileList != null)) {
          console.log('sending this data [will send back seed data and private key data encrypted]: ' + fileList.vFile);
          res.send(fileList)
        }
        else {
          res.send(null);
        }
      });
    })

    server.get('*', (req, res) => {
      //  This route will allow the index component to load; other components won't load directly without wildcard
      return handle(req, res)
    })

    server.listen(port, (err) => {
      if (err) throw err
      console.log(`> Ready on http://localhost:${port}`)
    })
  })
