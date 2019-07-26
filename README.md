# iris-cms

[![npm (scoped)](https://img.shields.io/npm/v/iris-cms.svg)](https://www.npmjs.com/package/iris-cms)
[![npm bundle size (minified)](https://img.shields.io/bundlephobia/min/iris-cms.svg)](https://www.npmjs.com/package/iris-cms)

Loads a blog from your Iris Account to your website.

## Install

```
$ npm install iris-cms
```

## Usage

# Blog page

```html
<div id="blog">
</div>

```

# Javascript

```js
import Iris from "iris-cms";

var options = {
  apiKey: 'YOUR_API_KEY_HERE',
  elementId: 'blog'
}

let iris = new Iris(options);

//=> Builds the entire blog inside the div

```
