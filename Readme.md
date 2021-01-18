# Measured

<p align="center">
  <a href="#"><img src="https://github.com/qwathi-ai/measured/blob/media/logo.png?raw=true" alt="Measured - Autocast information into rich data." style="width: 50%;"/></a>
</p>

> Autocast information into _data points_.

---
<p align="center">
  <a href="#installation">Installation</a> •
  <a href="#usage">Usage</a> •
  <a href="#documentation">Documentation</a> •
  <!-- <a href="#contributions">Contributions</a> • -->
  <a href="#license">License</a>
</p>
<p align="center">
  <a href="https://travis-ci.com/qwathi-ai/measured">
    <img src="https://img.shields.io/travis/com/qwathi-ai/measured/master?style=flat-square">
  </a>
  <a href="https://github.com/qwathi-ai/measured">
    <img alt="GitHub package.json version" src="https://img.shields.io/github/package-json/v/qwathi-ai/measured?style=flat-square">
  </a>
  <a href='https://coveralls.io/github/qwathi-ai/measured?branch=master'>
    <img src='https://coveralls.io/repos/github/qwathi-ai/measured/badge.svg?branch=master' alt='Coverage Status' />
  </a>
  <a href="./License.md">
    <img src="https://img.shields.io/badge/License-ISC-blue.svg?maxAge=300&style=flat-square">
  </a>
  <a href="https://en.wikipedia.org/wiki/Black_Lives_Matter">
   <img src="https://img.shields.io/badge/✊-BlackLivesMatter-yellowgreen?style=flat-square">
  </a>
</p>
A small, simple and extensible data utility that reads `information` into <u>data</u> points.

## <a name="installation" style="color:#24292e">  Installation</a>

Install via npm

```sh
npm install --save-exact @qwathi-ai/measured
```

## <a name="usage" style="color:#24292e">  Usage</a>

```js
const measured = require('@qwathi-ai/measured');

// Optional
measured.setoptions({
  decimalseparator: [',', '.'],
  dateformat: ['YYYY-MM-DD', 'DD-MM-YYYY'],
  decimalplaces: 3
})

// Autocast the information.
const autocast = measured({
  a: '',
  b: 'false',
  c: '35.3',
  d: '14,9%',
  e: '21-05-2020',
  f: 'hello word',
  g: ['4', 'the', 'love', '"true"', 'th']
})

assert(autocast.symbol === Symbol.for('dictionary'))
console.log(autocast.value) // =>
/*
{
	a: undefined,
  b: false,
  c: 35.3,
  d: 0.149,
  e: '2020-05-21',
  f: 'hello word',
  g: [4, 'the', 'love', true, 'th']
}
*/

```

## <a name="documentation" style="color:#24292e"> Documentation</a>

Complete api documentation can be found [here](./docs/api.md)

## License

Measured is licensed under a [ISC License](./licence.md)
