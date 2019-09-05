class Iris {
  constructor(options = {}) {

    this.apiKey = options.apiKey
    if (options.testUrl) {
      this.apiUrl = `${options.testUrl}/api/v1/`
    } else {
      this.apiUrl = 'https://iris.horta.dev/api/v1/'
    }

    let page = document.getElementById(options.elementId);
    page.insertAdjacentHTML('afterend', `<div id='iris-main-container'><div id='${options.elementId}'></div></div>`);
    page.remove();

    this.buildContent(options.elementId);
  }

  indexUrl() {
    return this.apiUrl + 'posts?api_key=' + this.apiKey;
  }

  postUrl(slug) {
    return this.apiUrl + `posts/${slug}?api_key=` + this.apiKey;
  }

  infoUrl() {
    return this.apiUrl + 'account-info?api_key=' + this.apiKey;
  }

  async getPosts(limit) {
    let headers = {
      method: 'GET',
      headers: {'Content-Type':'application/x-www-form-urlencoded'}
    };
    let limitedUrl;
    if (limit) {
      limitedUrl = this.indexUrl() + `&limit=${limit}`;
    } else {
      limitedUrl = this.indexUrl();
    }
    return await fetch(limitedUrl, headers)
    .then(response => response.json())
    .then((myJson) => {
      return myJson;
    })
  }

  async getPost(slug) {
    let headers = {
      method: 'GET',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      }
    };

    return await fetch(this.postUrl(slug), headers)
      .then(response => response.json())
      .then((myJson) => {
        return myJson;
      })
  }

  style(styleName) {
    let head = document.getElementsByTagName('HEAD')[0];
    let style = document.createElement('link');
    style.rel = 'stylesheet';
    style.type = 'text/css';
    style.href = 'https://iris.horta.dev/styles/' + styleName + '.css';
    head.appendChild(style);
  };

  buildBlog(elementId) {
    let blogPage = document.getElementById(elementId);

    let blogGrid = document.createElement('div');
    blogGrid.classList.add('blog_grid');
    this.getPosts().then((response) => {
      let posts = response.data;

      posts.forEach((post) => {
        let postLink = document.createElement('a');
        let postImage = document.createElement('img');
        let postText = document.createElement('h1');
        let postDescription = document.createElement('p');
        let postAuthor = document.createElement('p');
        let postDate = new Date(post.updated_at).toLocaleDateString();
        let postTime = new Date(post.updated_at).toLocaleTimeString();


        postText.innerHTML = post.main_title;
        if(post.author){
          postDescription.innerText = "Atualizado em " + postDate + " " + postTime;
          postAuthor.innerText = post.author.email;
        }

        postImage.addEventListener('load', this.removeLoadScreen);
        postImage.alt = response.account_name + ' | ' + post.main_title;

        postImage.src = post.banner_image.url;
        postImage.class = 'iris-img';

        postLink.href = window.location.href + '?post=' + post.slug;

        postLink.appendChild(postImage);
        postLink.appendChild(postText);
        postLink.appendChild(postDescription);
        postLink.appendChild(postAuthor);
        blogGrid.appendChild(postLink);

      });
      blogPage.appendChild(blogGrid);
    });

  }

  buildPost(elementId, slug) {
    let postPage = document.getElementById(elementId);

    let postGrid = document.createElement('div');
    postGrid.classList.add('post-grid');

    let postWrapper = document.createElement('div');
    postWrapper.classList.add('post-wrapper');

    this.getPost(slug).then((response) => {
      let post = response.data

      // Set META tags

      let head = document.getElementsByTagName('head')[0]

      let title = document.getElementsByTagName('title')[0]
      let titleText = post.main_title
      if (post.seo_title) {
      titleText = post.seo_title
      }
      title.innerHTML += ` | ${titleText}`
      if (title.innerHTML.length > 70) { title.innerHTML = title.innerHTML.substring(0,67) + "..."}

      let metaDescription = document.createElement('meta')
      metaDescription.name = "description";
      metaDescription.setAttribute('content', post.meta_description);

      let ogTitle = document.createElement('meta')
      ogTitle.setAttribute('property', 'og:title');
      ogTitle.setAttribute('content', post.seo_title);

      let ogDescription = document.createElement('meta')
      ogDescription.setAttribute('property', 'og:description');
      ogDescription.setAttribute('content', post.meta_description);;

      let ogType = document.createElement('meta')
      ogType.setAttribute('property', 'og:type');
      ogType.setAttribute('content', 'website');

      let ogImage = document.createElement('meta')
      ogImage.setAttribute('property', 'og:image');
      ogImage.setAttribute('content', post.banner_image.url);

      let metaViewport = document.createElement('meta')
      metaViewport.name = "viewport";
      metaViewport.setAttribute('content', 'width=device-width, initial-scale=1');

      let metaHttp = document.createElement('meta')
      metaHttp.name = "http-equiv";
      metaHttp.setAttribute('content', "IE=edge,chrome=1")

      head.appendChild(metaDescription);
      head.appendChild(ogTitle);
      head.appendChild(ogDescription);
      head.appendChild(ogType);
      head.appendChild(ogImage);
      head.appendChild(metaViewport);
      head.appendChild(metaHttp);

      // Build Home Button

      let homeButton = document.createElement('a');

      homeButton.innerHTML = `<svg class="back-link svg-color" version="1.0" xmlns="http://www.w3.org/2000/svg" width="120px" height="120px" viewBox="0 0 1280.000000 1280.000000" preserveAspectRatio="xMidYMid meet"><metadata>Created by potrace 1.15, written by Peter Selinger 2001-2017</metadata><g transform="translate(0.000000,1280.000000) scale(0.100000,-0.100000)" stroke="none"><path d="M4969 10256 c-646 -572 -1825 -1616 -2620 -2320 -794 -703 -1445 -1282 -1447 -1286 -3 -8 537 -620 548 -620 4 0 407 354 896 788 489 433 1515 1341 2278 2017 764 677 1426 1263 1472 1302 l82 73 2358 -2090 c1298 -1149 2364 -2089 2369 -2089 6 0 131 138 279 306 196 223 267 309 260 319 -5 7 -1185 1054 -2621 2327 -2305 2040 -2617 2313 -2645 2314 -30 1 -146 -100 -1209 -1041z"/><path d="M2470 9648 l0 -992 33 30 c31 30 1280 1156 1284 1158 0 1 5 180 9 399 l7 397 -667 0 -666 0 0 -992z"/><path d="M5744 9127 c-236 -210 -1070 -949 -1852 -1641 l-1422 -1259 0 -2371 c0 -2275 1 -2373 19 -2411 23 -51 74 -101 120 -117 28 -10 286 -13 1216 -13 l1180 0 5 1065 c5 985 6 1067 22 1097 23 42 80 88 127 102 28 8 315 11 1027 11 939 0 991 -1 1030 -19 57 -26 110 -92 123 -153 7 -33 11 -392 11 -1078 l0 -1030 1163 0 c1261 0 1218 -2 1291 54 19 14 43 45 55 69 l21 43 1 2375 1 2374 -314 280 c-289 258 -3344 2963 -3378 2991 -13 10 -83 -48 -446 -369z"/></g></svg>`;
      homeButton.href = window.location.pathname;
      homeButton.target = '_self';

      postPage.appendChild(homeButton);

      // Build Banner

      let postBanner = document.createElement('div');
      postBanner.classList.add('post_banner');

      let bannerImage = document.createElement('img');
      bannerImage.addEventListener('load', this.removeLoadScreen);
      bannerImage.src = post.banner_image.url;
      bannerImage.alt = response.account_name + ' | ' + post.keyphrase.toUpperCase() + ' | ' + post.main_title;
      bannerImage.classList.add('banner_background');


      let bannerContent = document.createElement('div');
      bannerContent.classList.add('banner_content');

      let mainTitle = document.createElement('h1');
      mainTitle.classList.add('main_title');
      mainTitle.innerHTML = post.main_title;

      let bannerText = document.createElement('p');

      bannerText.classList.add('banner_text');
      bannerText.innerHTML = post.banner_text;

      let postDescription = document.createElement('p');
      let postAuthor = document.createElement('p');
      let postDate = new Date(post.updated_at).toLocaleDateString();
      let postTime = new Date(post.updated_at).toLocaleTimeString();

      if (post.author){
        postDescription.innerText = "Atualizado em " + postDate + " " + postTime;
        postAuthor.innerText = "Publicado por " + post.author.email;
      }

      bannerContent.appendChild(mainTitle);
      bannerContent.appendChild(bannerText);
      bannerContent.appendChild(postDescription);
      bannerContent.appendChild(postAuthor);
      postBanner.appendChild(bannerImage);
      postBanner.appendChild(bannerContent);
      postPage.appendChild(postBanner);

      // Build Intro

      let introduction = document.createElement('section');
      introduction.classList.add('introduction');

      let secondaryTitle = document.createElement('h2');
      secondaryTitle.classList.add('secondary_title');
      secondaryTitle.innerHTML = post.secondary_title;

      let firstIntroduction = document.createElement('p');
      firstIntroduction.classList.add('first_introduction');
      firstIntroduction.innerHTML = post.first_introduction;

      let internalLinksList = document.createElement('ul');
      internalLinksList.classList.add('internal_links_list');

      post.internal_links.forEach((link) => {
        let item = document.createElement('li');
        item.classList.add('internal_links_item');

        let newLink = document.createElement('a');
        newLink.classList.add('internal_link');
        newLink.href = link.url;
        newLink.innerHTML = link.text;

        item.appendChild(newLink);
        internalLinksList.appendChild(item);
      });

      let secondIntroduction = document.createElement('p');
      secondIntroduction.classList.add('second_introduction');
      secondIntroduction.innerHTML = post.second_introduction;

      introduction.appendChild(secondaryTitle);
      introduction.appendChild(firstIntroduction);
      introduction.appendChild(internalLinksList);
      introduction.appendChild(secondIntroduction);

      postWrapper.appendChild(introduction);

      // Build Topics

      let topics = document.createElement('section');
      topics.classList.add('topics');

      post.ordered_topics.forEach((topic) => {
        if (topic.image.url != null) {
          let topicImage = document.createElement('img');
          topicImage.classList.add('topic_image');
          topicImage.src = topic.image.url;
          topicImage.alt = response.account_name + ' | ' + topic.title.toUpperCase() + ' | ' + post.main_title;
          topics.appendChild(topicImage);
        };

        let topicTitle = document.createElement('h3');
        topicTitle.classList.add('topic_title');
        topicTitle.innerHTML = topic.title

        let topicContent = document.createElement('p');
        topicContent.classList.add('topic_content');
        topicContent.innerHTML = topic.content;


        topics.appendChild(topicTitle);
        topics.appendChild(topicContent);
      });

      postWrapper.appendChild(topics);

      // Build CTA

      let newCta = document.createElement('section');

      let ctaLink = document.createElement('a');
      ctaLink.classList.add('cta-link');
      ctaLink.href = post.call_to_action_link;

      let ctaWrapper = document.createElement('div');
      ctaWrapper.classList.add('cta-wrapper');


      let ctaContent = document.createElement('p');
      ctaContent.classList.add('cta_content');
      ctaContent.innerHTML = post.call_to_action_content;

      if (post.call_to_action_image.url != null) {
        let ctaImage = document.createElement('img');
        ctaImage.classList.add('cta_image');
        ctaImage.src = post.call_to_action_image.url;
        ctaImage.alt = response.account_name + ' | ' + post.call_to_action_content + ' | ' + post.main_title;
        newCta.classList.add('call-to-action');
        ctaLink.appendChild(ctaImage);
      } else{
        newCta.classList.add('call-to-action-imageless');
      }

      ctaLink.appendChild(ctaContent);
      ctaWrapper.appendChild(ctaLink);
      newCta.appendChild(ctaWrapper);
      postWrapper.appendChild(newCta);

      // Build Closure

      let closure = document.createElement('section');
      closure.classList.add('closure');


      let closureTitle = document.createElement('h3');
      closureTitle.classList.add('closure_title');
      closureTitle.innerHTML = post.closure_title;

      let closureText = document.createElement('p');
      closureText.classList.add('closure_text');
      closureText.innerHTML = post.closure_text;

      if (post.closure_image.url != null) {
        let closureImage = document.createElement('img');
        closureImage.classList.add('closure_image');
        closureImage.alt = response.account_name + ' | ' + post.closure_title + ' | ' + post.main_title;
        closureImage.src = post.closure_image.url;
        closure.appendChild(closureImage);
      }
      closure.appendChild(closureTitle);
      closure.appendChild(closureText);
      postWrapper.appendChild(closure);

      // Append to page

      postGrid.appendChild(postWrapper);
      postPage.appendChild(postGrid);

      // Related posts

      let posts = response.related_posts;
      let blogGrid = document.createElement('div');
      blogGrid.classList.add('last_posts');

        posts.forEach((post) => {
          let postLink = document.createElement('a');
          let postImage = document.createElement('img');
          let postText = document.createElement('h1');
          let postPublished = document.createElement('p');
          let postDate = new Date(post.updated_at).toLocaleDateString();

          postPublished.innerText =  "Atualizado em " + postDate + " " + postTime;

          postText.innerHTML = post.main_title;

          postImage.src = post.banner_image;
          postImage.alt = posts.account_name + ' | ' + post.main_title;
          postLink.href = window.location.pathname + '?post=' + post.slug;

          postLink.appendChild(postImage);
          postLink.appendChild(postPublished);
          postLink.appendChild(postText);
          blogGrid.appendChild(postLink);

        });
        postGrid.appendChild(blogGrid);

    });
  }

  async buildContent(elementId){
    let headers = {
      method: 'GET',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      }
    };

    fetch(this.infoUrl(), headers)
      .then(response => response.json())
      .then((data) => {
        this.accountInfo = data;

        // Set Style according to template

        if (this.accountInfo.template && this.accountInfo.template != '') {
          this.style(this.accountInfo.template);
        };
        let query = new URLSearchParams(window.location.search);
        let slug = query.get('post')

        if (document.getElementById(elementId)) {
          this.addLoadScreen();
          setTimeout(this.removeLoadScreen, 4000);
          if (slug) {
            this.buildPost(elementId, slug);
          } else {
            this.buildBlog(elementId);
          }


        }
      })

  }

  async addLoadScreen(){
    let loadScreen = document.createElement('div');
    loadScreen.id = 'load-screen'
    loadScreen.style ="position: fixed; top: 0; bottom: 0; right: 0; left: 0; background-color: rgba(230, 230, 230, 0.6); z-index: 1000; display: flex; justify-content: center; justify-items: center; flex-direction: column; text-align: center;";
    loadScreen.innerHTML = `<svg class="svg-color" width="100px" height="100px" style="align-self: center;">
            <circle cx="50" cy="50" ng-attr-r="{{config.radius}}" ng-attr-stroke-width="{{config.width}}" ng-attr-stroke="{{config.stroke}}" ng-attr-stroke-dasharray="{{config.dasharray}}" fill="none" stroke-linecap="round" r="27" stroke-width="7" stroke="gray" stroke-dasharray="42.411500823462205 42.411500823462205" transform="rotate(60 50 50)">
              <animateTransform attributeName="transform" type="rotate" calcMode="linear" values="0 50 50;360 50 50" keyTimes="0;1" dur="1s" begin="0s" repeatCount="indefinite"></animateTransform>
            </circle>
          </svg><p class="svg-color" style="font-family: sans-serif;">CARREGANDO</p>`
    document.body.appendChild(loadScreen);
  }

  removeLoadScreen(){
    let loadScreen = document.getElementById('load-screen');
    if(loadScreen){
      loadScreen.remove();
    }
  }
}

export default Iris;
