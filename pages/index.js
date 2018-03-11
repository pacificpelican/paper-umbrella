//  index.js for Paper Umbrella by http://danmckeown.info copyright 2018 licensed under ISC license

import React from "react";
import Link from "next/link";
import Fowlfive from "./fowlfive";
import Tracker from "./tracker";
import Elecwalletview from './elecwalletview.js';
import Umbrellafooter from './umbrellafooter.js';

export default () => (
  <div>
    <ul id="componentsList">
      <h1 id="topLevelHeading">Paper Umbrella 🌂</h1>
      <div id="refreshlink"><a href="" id="refr">refresh page</a></div>
      <li>
        <Fowlfive />
      </li>
      <li>
        <Tracker />
      </li>
    </ul>
    <style>{`
      :root {
        --light-color: #BAC1B8;
        --main-bg: rgb(255, 255, 255);
        --logo-border-color: rebeccapurple;
        --blue-color: #58A4B0;
        --green-color: #0C7C59;
        --dark-color: #2B303A;
        --red-color: #D64933;
      }
      h1#topLevelHeading {
        font-family: Courier, serif;
      }
      footer#sitefooter {
        background-color: lightgreen;
        border-top-right-radius: 0.7em;
        max-width: 33vw;
        margin-top: 33px;
        font-family: "Fira Code", "Hack", Menlo, monospace;
        margin-left: 2.7rem;
      }
      footer#sitefooter a {
        text-decoration: none;
        color: #130b2d;
      }
      div#refreshlink a {
        font-size: 10px;
        font-family: Futura, Georgia, serif;
        color: lightgray;
      }
      footer#terms, footer#codelink {
        background-color: lightgray;
        border-top-right-radius: 0.7em;
        max-width: 39vw;
        margin-top: 23px;
        font-family: Futura, Georgia, serif;
        margin-left: 2.8rem;
        font-size: 0.7em;
      }
      ul#componentsList {
        list-style-type: none;
      }
      `}</style>
    <Umbrellafooter />
  </div>
);
