class Iris {
  constructor(options = {}) {
    this.apiKey = options.apiKey
    if (options.testUrl) {
      this.apiUrl = `${options.testUrl}/api/v1/`
    } else {
      this.apiUrl = 'https://iriscms.herokuapp.com/api/v1/'
    }
    this.developmentMode = options.developmentMode
    let irisContainer = document.getElementById(options.elementId);

    this.buildContent(irisContainer);

    // Blog animation
    this.fadeIn(irisContainer);
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

  formatString(word) {
    let a = 0
    while (a != -1) {
      a = word.indexOf('%C');
      word = word.replace(word.substring(a, a + 6),decodeURIComponent(word.substring(a, a + 6)));
    }
    return word.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
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
    if (this.developmentMode) {
      style.href = `./templates/${styleName}.css`;
    } else {
      style.href = 'https://iriscms.herokuapp.com/styles/' + styleName + '.css';
    };
    head.appendChild(style);
  };

  buildBlog(irisContainer) {
    let blogGrid = document.createElement('div');
    blogGrid.classList.add('blog_grid');
    this.getPosts().then((response) => {

      // Set Meta tags

      // Set head
      let head = document.querySelector('head');

      if(response.template){
       this.style(response.template);
      }

      if (!head) {
        head = document.createElement('head');
        let html = document.querySelector('html');
        html.insertAdjacentHTML('afterbegin', head);
      };

      // Set viewport
      let hasViewport = false;
      if (head.querySelectorAll('meta').forEach ((meta) => {
        if (meta.name === 'viewport') {
          hasViewport = true;
        }
      }));
      if (!hasViewport) {
        let metaViewport = document.createElement('meta');
        metaViewport.name = "viewport";
        metaViewport.setAttribute('content', 'width=device-width, initial-scale=1');
        head.appendChild(metaViewport);
      };

      // Has http equiv
      let hasHttpequiv = false;
      if (head.querySelectorAll('meta').forEach((meta) => {
        if (meta.name === 'http-equiv') {
          hasHttpequiv = true
        }
      }));
      if (!hasHttpequiv) {
        let metaHttp = document.createElement('meta');
        metaHttp.name = "http-equiv";
        metaHttp.setAttribute('content', "IE=edge,chrome=1");
        head.appendChild(metaHttp);
      }

      // Set title
      let hasTitle = false;
      if (head.querySelector('title')) {
        hasTitle = true;
      }
      if (response.account_title && !hasTitle) {
        let accountTitle = document.createElement('title');
        accountTitle.innerHTML = `${response.account_title}`;
        head.appendChild(accountTitle);
      };

      // Set meta description
      let hasMetaDescription = false;
      head.querySelectorAll('meta').forEach ((meta) => {
        if (meta.name === 'description') {
          hasMetaDescription = true;
        }
      });
      if (response.account_description && !hasMetaDescription) {
        let metaDescrition = document.createElement('meta');
        metaDescrition.name = "description";
        metaDescrition.setAttribute('content', `${response.account_description}`);
        head.appendChild(metaDescrition);
      };

      // Set meta keywords
      let hasMetaKeywords = false;
      head.querySelectorAll('meta').forEach ((meta) => {
        if (meta.name === 'keywords') {
          hasMetaKeywords = true;
        }
      });
      if (response.account_keyword && !hasMetaKeywords) {
        let metaKeywords = document.createElement('meta');
        metaKeywords.name = "keywords";
        metaKeywords.setAttribute('content', `${response.account_keyword}`);
        head.appendChild(metaKeywords);
      };

      let subTitleDiv = document.createElement('div');
      subTitleDiv.classList.add('sub-title-div');

      let subTitle = document.createElement('h1');
      subTitle.classList.add('sub-title');
      subTitle.innerHTML = response.account_name.toUpperCase();
      subTitleDiv.appendChild(subTitle);
      irisContainer.appendChild(subTitleDiv);

      let posts = response.data;
      this.progressiveRender(posts.slice(0, 3), blogGrid);

      irisContainer.appendChild(blogGrid);

      let subTitle1 = this.titleH2('EM DESTAQUE');
      irisContainer.appendChild(subTitle1);

      let highlightedPosts = document.createElement('div');
      highlightedPosts.classList.add('highlighted-posts');

      this.progressiveRender(posts.slice(3, 6), highlightedPosts)

      irisContainer.appendChild(highlightedPosts);

      let subTitle2 = this.titleH2('MAIS NOT&IacuteCIAS');
      irisContainer.appendChild(subTitle2);

      let morePosts = document.createElement('div');
      morePosts.classList.add('more-posts');

      let lastPosts = posts.slice(6);

      let lastThreePosts = document.createElement('div');
      lastThreePosts.classList.add('last-three-posts');

      if (lastPosts.length % 2 == 1) {
        this.progressiveRender(lastPosts.slice(0, -3), morePosts);
        this.progressiveRender(lastPosts.slice(-3), lastThreePosts);
      } else {
        this.progressiveRender(lastPosts, morePosts)
      };

      this.animateOnScreen(morePosts);
      this.animateOnScreen(lastThreePosts);

      const htmlPosts = document.querySelectorAll('.post-div');

      irisContainer.appendChild(morePosts);
      irisContainer.appendChild(lastThreePosts);

    });
  };



  postCard(post) {
    let postDiv = document.createElement('div');
    postDiv.style = `background-image: url(${post.banner_image.url})`;
    postDiv.classList.add('post-div');

    let postLink = document.createElement('a');
    let postText = document.createElement('h3');
    let postDescription = document.createElement('p');
    let postUpdateInfo = document.createElement('p');
    let postDate = new Date(post.updated_at).toLocaleDateString();
    let postTime = new Date(post.updated_at).toLocaleTimeString();

    postText.innerHTML = post.main_title;

    postDescription.classList.add('description');
    postDescription.innerHTML = post.secondary_title;

    postUpdateInfo.classList.add('updatedinfo');
    postUpdateInfo.innerText = "Atualizado em " + postDate;

    postLink.href = window.location.href + '?post=' + post.slug;

    let bannerInfo = document.createElement('div');
    bannerInfo.classList.add('banner-info');
    bannerInfo.appendChild(postUpdateInfo);
    bannerInfo.innerHTML += '<hr>';
    bannerInfo.appendChild(postText);
    postDiv.appendChild(bannerInfo);
    postLink.appendChild(postDiv);
    postLink.appendChild(postDescription);
    return postLink;
  };

  titleH2(text) {
    let subTitleDiv = document.createElement('div');
    subTitleDiv.classList.add('sub-title-div');
    let subTitle = document.createElement('h2');
    subTitle.classList.add('sub-title');
    subTitle.innerHTML = text;
    subTitleDiv.appendChild(subTitle);
    return subTitleDiv;
  };

  buildPost(irisContainer, slug) {
    let postGrid = document.createElement('div');
    postGrid.classList.add('post-grid');

    let postWrapper = document.createElement('div');
    postWrapper.classList.add('post-wrapper');

    this.getPost(slug).then((response) => {
      let post = response.data

      // Set head
      if(response.template){
       this.style(response.template);
      }

      let head = document.querySelector('head');
      if (!head) {
        head = document.createElement('head');
        let html = document.querySelector('html');
        html.insertAdjacentHTML('afterbegin', head);
      };

      let title = head.querySelector('title');

      let titleText = post.main_title
      if (post.seo_title) {
        titleText = post.seo_title
      };

      // Set Seo Title

      if (title) {
        title.innerHTML = `${response.account_name} | ${titleText}`;
        if (title.innerHTML.length > 70) { title.innerHTML = title.innerHTML.substring(0,67) + "..." }
      } else {
        title = document.createElement('title')
        title.innerHTML = `${response.account_name} | ${titleText}`
        if (title.innerHTML.length > 70) { title.innerHTML = title.innerHTML.substring(0,67) + "..." }
        head.insertAdjacentHTML('afterbegin', title);
      };

      // Set META tags

      // Set meta description
      let hasMetaDescription = false;
      head.querySelectorAll('meta').forEach((meta) =>{
        if (meta.name === 'description') {
          meta.content = post.meta_description;
          hasMetaDescription = true;
        }
      });
      if (!hasMetaDescription) {
        let metaDescription = document.createElement('meta');
        metaDescription.name = "description";
        metaDescription.setAttribute('content', post.meta_description);
        head.appendChild(metaDescription);
      };

      // Set meta keywords
      let hasMetaKeywords = false;
      head.querySelectorAll('meta').forEach((meta) =>{
        if (meta.name === 'keywords') {
          meta.content = post.keyphrase;
          hasMetaKeywords = true;
        }
      });
      if (!hasMetaKeywords) {
        let metakeyphrase = document.createElement('meta');
        metakeyphrase.name = "keywords";
        metakeyphrase.setAttribute('content', post.keyphrase);
        head.appendChild(metakeyphrase);
      };

      // Set og title
      let hasMetaOgTitle = false;
      head.querySelectorAll('meta').forEach((meta) =>{
        if (meta.property === 'og:title') {
          meta.content = post.seo_title;
          hasMetaOgTitle = true;
        }
      });
      if (!hasMetaOgTitle) {
        let ogTitle = document.createElement('meta');
        ogTitle.setAttribute('property', 'og:title');
        ogTitle.setAttribute('content', post.seo_title);
        head.appendChild(ogTitle);
      };

      // Set og description
      let hasMetaOgDescription = false;
      head.querySelectorAll('meta').forEach((meta) =>{
        if (meta.property === 'og:description') {
          meta.content = post.meta_description;
          hasMetaOgDescription = true;
        }
      });
      if (!hasMetaOgDescription) {
        let ogDescription = document.createElement('meta');
        ogDescription.setAttribute('property', 'og:description');
        ogDescription.setAttribute('content', post.meta_description);
        head.appendChild(ogDescription);
      };

      // Set meta og type
      let hasMetaOgType = false;
      head.querySelectorAll('meta').forEach((meta) =>{
        if (meta.property === 'og:type') {
          meta.content = 'website';
          hasMetaOgType = true;
        }
      });
      if (!hasMetaOgType) {
        let ogType = document.createElement('meta');
        ogType.setAttribute('property', 'og:type');
        ogType.setAttribute('content', 'website');
        head.appendChild(ogType);
      };

      // Set meta og image
      var formatedUrl = this.formatString(post.banner_image.url);
      let hasMetaOgImage = false;
      head.querySelectorAll('meta').forEach((meta) =>{
        if (meta.property === 'og:image') {
          meta.content = formatedUrl;
          hasMetaOgImage = true;
        }
      });
      if (!hasMetaOgImage) {
        let ogImage = document.createElement('meta');
        ogImage.setAttribute('property', 'og:image');
        ogImage.setAttribute('content', formatedUrl);
        head.appendChild(ogImage);
      };

      // Set meta viewport
      let hasMetaViewport = false;
      head.querySelectorAll('meta').forEach((meta) =>{
        if (meta.name === 'viewport') {
          meta.content = 'width=device-width, initial-scale=1';
          hasMetaViewport = true;
        }
      });
      if (!hasMetaViewport) {
        let metaViewport = document.createElement('meta');
        metaViewport.name = "viewport";
        metaViewport.setAttribute('content', 'width=device-width, initial-scale=1');
        head.appendChild(metaViewport);
      };

      // Set meta http equiv
      let hasMetaHttp = false;
      head.querySelectorAll('meta').forEach((meta) =>{
        if (meta.name === 'http-equiv') {
          meta.content =  "IE=edge,chrome=1";
          hasMetaHttp = true;
        }
      });
      if (!hasMetaHttp) {
        let metaHttp = document.createElement('meta')
        metaHttp.name = "http-equiv";
        metaHttp.setAttribute('content', "IE=edge,chrome=1")
        head.appendChild(metaHttp);
      }


      // Build Home Button

      let homeButton = document.createElement('a');

      homeButton.innerHTML = `<svg class="back-link svg-color" version="1.0" xmlns="http://www.w3.org/2000/svg" width="120px" height="120px" viewBox="0 0 1280.000000 1280.000000" preserveAspectRatio="xMidYMid meet"><metadata>Created by potrace 1.15, written by Peter Selinger 2001-2017</metadata><g transform="translate(0.000000,1280.000000) scale(0.100000,-0.100000)" stroke="none"><path d="M4969 10256 c-646 -572 -1825 -1616 -2620 -2320 -794 -703 -1445 -1282 -1447 -1286 -3 -8 537 -620 548 -620 4 0 407 354 896 788 489 433 1515 1341 2278 2017 764 677 1426 1263 1472 1302 l82 73 2358 -2090 c1298 -1149 2364 -2089 2369 -2089 6 0 131 138 279 306 196 223 267 309 260 319 -5 7 -1185 1054 -2621 2327 -2305 2040 -2617 2313 -2645 2314 -30 1 -146 -100 -1209 -1041z"/><path d="M2470 9648 l0 -992 33 30 c31 30 1280 1156 1284 1158 0 1 5 180 9 399 l7 397 -667 0 -666 0 0 -992z"/><path d="M5744 9127 c-236 -210 -1070 -949 -1852 -1641 l-1422 -1259 0 -2371 c0 -2275 1 -2373 19 -2411 23 -51 74 -101 120 -117 28 -10 286 -13 1216 -13 l1180 0 5 1065 c5 985 6 1067 22 1097 23 42 80 88 127 102 28 8 315 11 1027 11 939 0 991 -1 1030 -19 57 -26 110 -92 123 -153 7 -33 11 -392 11 -1078 l0 -1030 1163 0 c1261 0 1218 -2 1291 54 19 14 43 45 55 69 l21 43 1 2375 1 2374 -314 280 c-289 258 -3344 2963 -3378 2991 -13 10 -83 -48 -446 -369z"/></g></svg>`;
      homeButton.href = window.location.pathname;
      homeButton.target = '_self';

      irisContainer.appendChild(homeButton);

      // Build Banner

      let postBanner = document.createElement('div');
      postBanner.classList.add('post_banner');

      let bannerImage = document.createElement('img');
      bannerImage.addEventListener('load', this.removeLoadScreen);
      bannerImage.src = post.banner_image.url;
      bannerImage.alt = response.account_name + ' | ' + post.keyphrase + ' | ' + post.main_title;
      bannerImage.classList.add('banner_background');

      let authorAndDescription = document.createElement('div');
      authorAndDescription.classList.add('author-and-description');

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

      authorAndDescription.appendChild(postAuthor);
      authorAndDescription.appendChild(postDescription);
      bannerContent.appendChild(authorAndDescription);
      bannerContent.innerHTML += '<hr>';
      bannerContent.appendChild(mainTitle);
      bannerContent.appendChild(bannerText);
      postBanner.appendChild(bannerImage);
      postBanner.appendChild(bannerContent);
      irisContainer.appendChild(postBanner);

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
        newLink.setAttribute( 'target','_blank' );

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

        let topicdiv = document.createElement('div');
        topicdiv.classList.add('topic');

        if (topic.image.url != null) {
          let topicImage = document.createElement('img');
          topicImage.classList.add('topic_image');
          topicImage.src = topic.image.url;
          topicImage.alt = topic.label;
          let topicImagePath = topic.image.url.split(/\/|\./);
          topicImage.title = topicImagePath[topicImagePath.length - 2];
          topicdiv.appendChild(topicImage);

          let imageLabel = document.createElement('p');
          imageLabel.innerHTML = topic.label;
          imageLabel.classList.add('image-label');
          topicdiv.appendChild(imageLabel);
        };

        let topicTitle = document.createElement('h3');
        topicTitle.classList.add('topic_title');
        topicTitle.innerHTML = topic.title.toUpperCase();;

        let topicContent = document.createElement('p');
        topicContent.classList.add('topic_content');
        topicContent.innerHTML = topic.content;


        topicdiv.appendChild(topicTitle);
        topicdiv.appendChild(topicContent);

        topics.appendChild(topicdiv);
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
      newCta.classList.add('call-to-action');

      let ctaButton = document.createElement('Button');
      ctaButton.classList.add('cta-button')
      ctaLink.appendChild(ctaButton);

      ctaWrapper.appendChild(ctaContent);
      ctaWrapper.appendChild(ctaLink);
      ctaButton.innerHTML = post.call_to_action_link_description;
      newCta.appendChild(ctaWrapper);
      postWrapper.appendChild(newCta);

      // Build Closure

      let closure = document.createElement('section');
      closure.classList.add('closure');

      let closureText = document.createElement('p');
      closureText.classList.add('closure_text');
      closureText.innerHTML = post.closure_text;

      closure.appendChild(closureText);
      postWrapper.appendChild(closure);

      // Append to page

      postGrid.appendChild(postWrapper);
      irisContainer.appendChild(postGrid);

      // Related posts

      let posts = response.related_posts;
      let blogGrid = document.createElement('div');
      blogGrid.classList.add('last_posts');

        posts.forEach((post) => {
          let postDiv = document.createElement('div');
          let postLink = document.createElement('a');
          let postImage = document.createElement('img');
          let postSmallDiv = document.createElement('div');
          let postText = document.createElement('h3');
          let postPublished = document.createElement('p');
          let postDate = new Date(post.updated_at).toLocaleDateString();

          postPublished.innerText =  "Atualizado em " + postDate;
          postPublished.classList.add("published");

          postText.innerHTML = post.main_title;

          postImage.src = post.banner_image;
          postImage.alt = response.account_name + ' | ' + post.main_title;
          postLink.href = window.location.pathname + '?post=' + post.slug;

          postLink.href = window.location.pathname + '?post=' + post.slug;

          postDiv.classList.add('small_post_banner');
          postLink.appendChild(postImage);
          postLink.appendChild(postPublished);
          postSmallDiv.appendChild(postText);
          postSmallDiv.classList.add('small_post_content');
          postLink.appendChild(postSmallDiv);
          postDiv.appendChild(postLink);
          blogGrid.appendChild(postDiv);

        });
        postGrid.appendChild(blogGrid);

    });
  }

  async buildContent(irisContainer){
    if (irisContainer) {

      let headers = {
        method: 'GET',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded'
        }
      };

      let query = new URLSearchParams(window.location.search);
      let slug = query.get('post')

      irisContainer.innerHTML = '';
      let mainContainer = document.createElement('div');
      mainContainer.setAttribute("id", "iris-main-container");

      irisContainer.appendChild(mainContainer);

      if (slug) {
        this.buildPost(mainContainer, slug);
      } else {
        this.buildBlog(mainContainer);
      }

      // fetch(this.infoUrl(), headers)
      // .then(response => response.json())
      // .then((data) => {
      //   this.accountInfo = data;

      //   Set Style according to template

      //   if (this.accountInfo.template && this.accountInfo.template != '') {
      //     this.style(this.accountInfo.template);
      //   };
      //   let query = new URLSearchParams(window.location.search);
      //   let slug = query.get('post')

      //   irisContainer.innerHTML = '';
      //   let mainContainer = document.createElement('div');
      //   mainContainer.setAttribute("id", "iris-main-container");

      //   irisContainer.appendChild(mainContainer);

      //   if (slug) {
      //     this.buildPost(mainContainer, slug);
      //   } else {
      //     this.buildBlog(mainContainer);
      //   }
      // })
    }
  }

  progressiveRender(postList, postContainer){
    var currentPost = this.postCard(postList[0]);
    postContainer.appendChild(currentPost);
    var nextPost = this.postCard(postList[1]);
    var postCounter = 1;

    var bgImage = nextPost.firstChild.style.backgroundImage.replace(/url\(['"]?(.*?)['"]?\)/i, "$1");

    var nextImage = document.createElement('img');
    nextImage.src = bgImage;

    // nextImage.addEventListener('load', () => {
    //   postCounter += 1;
    //   postContainer.appendChild(nextPost);
    //   nextPost = this.postCard(postList[postCounter]);
    //   bgImage = nextPost.firstChild.style.backgroundImage.replace(/url\(['"]?(.*?)['"]?\)/i, "$1");
    //   nextImage.src = bgImage;
    // });

    // nextImage.addEventListener('error', () => {
    //   postCounter += 1;
    //   postContainer.appendChild(nextPost);
    //   nextPost = this.postCard(postList[postCounter]);
    //   bgImage = nextPost.firstChild.style.backgroundImage.replace(/url\(['"]?(.*?)['"]?\)/i, "$1");
    //   nextImage.src = bgImage;
    // });

    setInterval(() => {
      if(postContainer.lastChild.getBoundingClientRect().y < window.pageYOffset + window.innerHeight && postList[postCounter]){
        postCounter += 1;
        postContainer.appendChild(nextPost);
        nextPost = this.postCard(postList[postCounter]);
        bgImage = nextPost.firstChild.style.backgroundImage.replace(/url\(['"]?(.*?)['"]?\)/i, "$1");
        nextImage.src = bgImage;
      }
    }, 100);


  };

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

  animateOnScreen(postContainer){
    setInterval(() => {
      Array.from(postContainer.children).forEach((post) => {
        if(post.getBoundingClientRect().y < window.pageYOffset + window.innerHeight){
          post.style.opacity = 1;
        }else{
          post.style.opacity = 0;
        }
      });
    }, 100);
  }

  fadeIn(object){
    object.style.opacity = 0;
    object.style.transition = '1s';
    setTimeout(() => {
      var opacity;
      for(opacity = 0; opacity < 101; opacity++){
        object.style.opacity = opacity/100;
      }
    }, 1000);
  }

}

// export default Iris;
