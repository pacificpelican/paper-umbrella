Paper Umbrella
----
☂️
----

***Web Technology "Paper Wallet" for saving cryptocurrency data***

**WARNING: EXPERIMENTAL SOFTWARE FOR RESEARCH AND EDUCATION PURPOSES ONLY**

**by [Dan McKeown](http://danmckeown.info)**

**built using [ReactJS](https://reactjs.org/) for layout, [LokiJS](http://lokijs.org/) as the JSON database, [ExpressJS](https://expressjs.com/) as the API sever, with [NextJS](https://github.com/zeit/next.js/) for server-side rendering, and scaffolded with [create-next-app](https://github.com/segmentio/create-next-app)**

**requirements**

- Mac, Windows or Linux system
- Git
- [NodeJS](https://nodejs.org)/NPM

**Quick Start**
At your Mac Terminal or Linux command line or Windows CMD.exe:

- `git clone https://github.com/pacificpelican/paper-umbrella.git`
- `cd paper-umbrella`
- `npm install`
- `npm run dev`
- `open http://localhost:3000`

**About**
- Paper Umbrella can be used to enter data (public/private keys in wif format and/or key seed data) that is then encrypted with the password the user provides.  The user must enter the same password along with the name of the wallet into the lookup form in order to later reveal the private keys.  Each wallet is encrypted separately so the password may be different among them.
- The wallets currently stored are listed and when clicked the name field of the lookup form is populated.
- The button `generate arbitrary data` will auto-populate fields of the key entry form (except for the user password), however the seed data is not used to generate the keys: the public and private keys are randomly generated Bitcoin Testnet addresses via [bitcoinjs-lib](https://github.com/bitcoinjs/bitcoinjs-lib) while the seed data (set of word-like objects) is generated by shuffling around the characters from an excerpt of [Dubliners](http://www.gutenberg.org/ebooks/2814) by James Joyce.
