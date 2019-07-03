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

# Post page

```html
<div id="post">
</div>

```

# Javascript

```js
import Iris from "iris-cms";

let iris = new Iris("YOUR_API_KEY_HERE");

iris.buildBlog('blog');
//=> Builds the blog main page with all the posts, at the container with id='blog'

iris.buildPost('post');
//=> Builds the specific main page with all the posts, at the container with id='post'

```
