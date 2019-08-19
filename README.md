# iris-cms

[![npm (scoped)](https://img.shields.io/npm/v/iris-cms.svg)](https://www.npmjs.com/package/iris-cms)
[![npm bundle size (minified)](https://img.shields.io/bundlephobia/min/iris-cms.svg)](https://www.npmjs.com/package/iris-cms)

Loads a blog from your Iris Account to your website.

## Install

## Usage with pure HTML

# HTML

```html
<div id="blog">
</div>

<script type="module">
  import { Iris } from "https://cdn.jsdelivr.net/npm/iris-cms/index.js";
  options = {
    apiKey: 'YOUR_API_KEY_HERE',
    elementId: 'blog'
  }
  let iris = new Iris(options)
</script>

<!-- Gets the latest version of Iris and builds the content inside the blog div -->
```



## Usage with NPM

```
$ npm install iris-cms
```

# Blog page

```html
<div id="blog">
</div>

```

# Javascript

```js
import Iris from "iris-cms";

const options = {
  apiKey: 'YOUR_API_KEY_HERE',
  elementId: 'blog'
}

let iris = new Iris(options);

//=> Builds the content inside the blog div

```


