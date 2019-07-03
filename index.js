class Iris {
  constructor(apiKey) {
    this.apiKey = apiKey
    this.indexUrl = 'https://iris.horta.dev/api/v1/posts?api_key=' + this.apiKey;
  }

  getPosts() {
    fetch(this.indexUrl)
    .then(response => response.json())
    .then((myJson) => {
      return myJson
    })
  }

  postUrl(slug) {
    return `https://iris.horta.dev/api/v1/posts/${slug}?api_key=` + this.apiKey;
  }
}

export default Iris;
