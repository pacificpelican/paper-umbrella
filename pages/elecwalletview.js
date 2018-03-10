//  elecwalletview.js for Paper Umbrella by http://danmckeown.info copyright 2018 licensed under ISC license
export default ({ walletprops }) => (
  <div id="wltview">
    <h2 id="elecWalletViewh2">Electrum ₿ Wallet {walletprops.name}</h2>
    <ul id="elecwalletlist">
      <li>public keys: {walletprops.publicKeys}</li>
      <li>private keys: {walletprops.privateKeys}</li>
      <li>seed data: {walletprops.seed}</li>
    </ul>
    <style>{`
    ul#elecwalletlist li {
      font-family: Helvetica, "Lucida Sans", "Ubuntu Sans", "Roboto", sans-serif;
      margin-bottom: 14px;
      }
    h2#elecWalletViewh2 {
      font-family: "Fira Code", "Inconsolata", "Hack", Menlo, monospace;
    }
    `}
      </style>
  </div>
);