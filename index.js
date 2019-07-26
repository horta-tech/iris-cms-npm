class Iris {
  constructor(options = {}) {
    this.apiKey = options.apiKey
    if (options.testUrl) {
      this.apiUrl = `${options.testUrl}/api/v1/`
    } else {
      this.apiUrl = 'https://iris.horta.dev/api/v1/'
    }
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
    let reset = document.createElement('link');
    reset.rel = 'stylesheet';
    reset.type = 'text/css';
    reset.href = 'https://iris.horta.dev/styles/reset.css';
    head.appendChild(reset);
    let style = document.createElement('link');
    style.rel = 'stylesheet';
    style.type = 'text/css';
    style.href = 'https://iris.horta.dev/styles/' + styleName + '.css';
    head.appendChild(style);
  };

  buildBlog(elementId) {
    let blogPage = document.getElementById(elementId);
    blogPage.innerHTML = '';
    let blogGrid = document.createElement('div');
    blogGrid.classList.add('blog_grid');
    this.getPosts().then((response) => {
      let posts = response.data;
      if (response.template != '') {
        this.style(response.template);
      };
      posts.forEach((post) => {
        let postLink = document.createElement('a');
        let postImage = document.createElement('img');
        let postText = document.createElement('h1');

        postText.innerHTML = post.main_title;

        postImage.src = post.banner_image.url;

        postLink.href = window.location.href + '?post=' + post.slug;

        postLink.appendChild(postImage);
        postLink.appendChild(postText);
        blogGrid.appendChild(postLink);

      });
      blogPage.appendChild(blogGrid);
    });
  }

  buildPost(elementId, slug) {
    let postPage = document.getElementById(elementId);
    postPage.innerHTML = '';
    let postGrid = document.createElement('div');
    postGrid.classList.add('post-grid');

    let postWrapper = document.createElement('div');
    postWrapper.classList.add('post-wrapper');

    this.getPost(slug).then((response) => {
      let post = response.data

      // Set style according to template

      if (this.accountInfo.template && this.accountInfo.template != '') {
        this.style(this.accountInfo.template);
      };

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

      // Build Banner

      let postBanner = document.createElement('div');
      postBanner.classList.add('post_banner');
      postBanner.setAttribute('style', `background-image: linear-gradient(transparent 0%, transparent 75%, rgba(0,0,0,0.3) 80%, rgba(0,0,0,1) 100%), url(${post.banner_image.url});`);

      let bannerContent = document.createElement('div');
      bannerContent.classList.add('banner_content');

      let mainTitle = document.createElement('h1');
      mainTitle.classList.add('main_title');
      mainTitle.innerHTML = post.main_title;

      let bannerText = document.createElement('p');

      bannerText.classList.add('banner_text');
      bannerText.innerHTML = post.banner_text;

      bannerContent.appendChild(mainTitle);
      bannerContent.appendChild(bannerText);
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

      post.topics.forEach((topic) => {
        if (topic.image.url != null) {
          let topicImage = document.createElement('img');
          topicImage.classList.add('topic_image');
          topicImage.src = topic.image.url;
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
        newCta.classList.add('call-to-action');
        ctaWrapper.appendChild(ctaImage);
      } else{
        newCta.classList.add('call-to-action-imageless');
      }

      ctaWrapper.appendChild(ctaContent);
      ctaLink.appendChild(ctaWrapper);
      newCta.appendChild(ctaLink);
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
        closureImage.src = post.closure_image.url;
        closure.appendChild(closureImage);
      }
      closure.appendChild(closureTitle);
      closure.appendChild(closureText);
      postWrapper.appendChild(closure);

      // Append to page

      postGrid.appendChild(postWrapper);
      postPage.appendChild(postGrid);
    });

    // Build Post Links
    let blogGrid = document.createElement('div');
    blogGrid.classList.add('last_posts');
    this.getPosts(6).then((posts) => {
      posts.data.forEach((post) => {
        let postLink = document.createElement('a');
        let postImage = document.createElement('img');
        let postText = document.createElement('h1');

        postText.innerHTML = post.main_title;

        postImage.src = post.banner_image.url;
        postLink.href = window.location.pathname + '?post=' + post.slug;

        postLink.appendChild(postImage);
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

        let query = new URLSearchParams(window.location.search);
        let slug = query.get('post')

        if (document.getElementById(elementId)) {
          if (slug) {
            this.buildPost(elementId, slug);
          } else {
            this.buildBlog(elementId);
          }
        }
      })
  }
}

export default Iris;
