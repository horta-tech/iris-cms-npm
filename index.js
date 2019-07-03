class Iris {
  constructor(apiKey) {
    this.apiKey = apiKey
    this.indexUrl = 'https://iris.horta.dev/api/v1/posts?api_key=' + this.apiKey;
  }

  async getPosts() {
    let headers = {
      method: 'GET',
      headers: {'Content-Type':'application/x-www-form-urlencoded'}
    };
    
    return await fetch(this.indexUrl, headers)
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

  postUrl(slug) {
    return `https://iris.horta.dev/api/v1/posts/${slug}?api_key=` + this.apiKey;
  }

  buildBlog(elementId) {
    let blogPage = document.getElementById(elementId);
    let blogGrid = document.createElement('div');
    blogGrid.classList.add('blog_grid');
    this.getPosts().then((posts) => {
      posts.forEach((post) => {
        let postLink = document.createElement('a');
        let postImage = document.createElement('img');
        let postText = document.createElement('h1');
  
        postText.innerText = post.main_title;
  
        postImage.src = post.banner_image.url;
  
        postLink.href = window.location.origin + '/post?' + post.slug;
  
        postLink.appendChild(postImage);
        postLink.appendChild(postText);
        blogGrid.appendChild(postLink);
  
      });
      blogPage.appendChild(blogGrid);
    }); 
  }

  buildPost(elementId) {
    let postPage = document.getElementById(elementId);
    let postGrid = document.createElement('div');
    postGrid.classList.add('post-grid');

    let postWrapper = document.createElement('div');
    postWrapper.classList.add('post-wrapper');

    this.getPost(window.location.search.substr(1)).then((post) => {

      // Build Banner

      let postBanner = document.createElement('div');
      postBanner.classList.add('post_banner');
      postBanner.setAttribute('style', `background-image: linear-gradient(transparent 0%, transparent 75%, rgba(0,0,0,0.3) 80%, rgba(0,0,0,1) 100%), url(${post.banner_image.url});`);

      let bannerContent = document.createElement('div');
      bannerContent.classList.add('banner_content');

      let mainTitle = document.createElement('h1');
      mainTitle.classList.add('main_title');
      mainTitle.innerText = post.main_title;

      let bannerText = document.createElement('p');
      bannerText.classList.add('banenr_text');
      bannerText.innerText = post.banner_text;

      bannerContent.appendChild(mainTitle);
      bannerContent.appendChild(bannerText);
      postBanner.appendChild(bannerContent);
      postPage.appendChild(postBanner);

      // Build Intro

      let introduction = document.createElement('section');
      introduction.classList.add('introduction');

      let secondaryTitle = document.createElement('h2');
      secondaryTitle.classList.add('secondary_title');
      secondaryTitle.innerText = post.secondary_title;

      let firstIntroduction = document.createElement('p');
      firstIntroduction.classList.add('first_introduction');
      firstIntroduction.innerText = post.first_introduction;

      let internalLinksList = document.createElement('ul');
      internalLinksList.classList.add('internal_links_list');

      post.internal_links.forEach((link) => {
        let item = document.createElement('li');
        item.classList.add('internal_links_item');

        let newLink = document.createElement('a');
        newLink.classList.add('internal_link');
        newLink.href = link.url;
        newLink.innerText = link.text;

        item.appendChild(newLink);
        internalLinksList.appendChild(item);
      });

      let secondIntroduction = document.createElement('p');
      secondIntroduction.classList.add('second_introduction');
      secondIntroduction.innerText = post.second_introduction;

      introduction.appendChild(secondaryTitle);
      introduction.appendChild(firstIntroduction);
      introduction.appendChild(internalLinksList);
      introduction.appendChild(secondIntroduction);

      postWrapper.appendChild(introduction);

      // Build Topics

      let topics = document.createElement('section');
      topics.classList.add('topics');

      post.topics.forEach((topic) => {
        let topicImage = document.createElement('img');
        topicImage.classList.add('topic_image');
        topicImage.src = topic.image.url;

        let topicTitle = document.createElement('h3');
        topicTitle.classList.add('topic_title');
        topicTitle.innerText = topic.title

        let topicContent = document.createElement('p');
        topicContent.classList.add('topic_content');
        topicContent.innerText = topic.content;

        topics.appendChild(topicImage);
        topics.appendChild(topicTitle);
        topics.appendChild(topicContent);
      });

      postWrapper.appendChild(topics);

      // Build CTA

      let newCta = document.createElement('section');
      newCta.classList.add('call-to-action');

      let ctaLink = document.createElement('a');
      ctaLink.classList.add('cta-link');
      ctaLink.href = post.call_to_action_link;

      let ctaWrapper = document.createElement('div');
      ctaWrapper.classList.add('cta-wrapper');

      let ctaImage = document.createElement('img');
      ctaImage.classList.add('cta_image');
      ctaImage.src = post.call_to_action_image.url;

      let ctaContent = document.createElement('p');
      ctaContent.classList.add('cta_content');
      ctaContent.innerText = post.call_to_action_content;

      ctaWrapper.appendChild(ctaImage);
      ctaWrapper.appendChild(ctaContent);
      ctaLink.appendChild(ctaWrapper);
      newCta.appendChild(ctaLink);
      postWrapper.appendChild(newCta);

      // Build Closure

      let closure = document.createElement('section');
      closure.classList.add('closure');

      let closureImage = document.createElement('img');
      closureImage.classList.add('closure_image');
      closureImage.src = post.closure_image.url;

      let closureTitle = document.createElement('h3');
      closureTitle.classList.add('closure_title');
      closureTitle.innerText = post.closure_title;

      let closureText = document.createElement('p');
      closureText.classList.add('closure_text');
      closureText.innerText = post.closure_text;

      closure.appendChild(closureImage);
      closure.appendChild(closureTitle);
      closure.appendChild(closureText);
      postWrapper.appendChild(closure);

      // Append to page

      postGrid.appendChild(postWrapper);
      postPage.appendChild(postGrid);
    });
  }
}

const iris = new Iris("AchBRWDwc38ku24GkMfBNHW7");

// export default Iris;
