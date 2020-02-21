import { Injectable } from '@angular/core';
import { Meta } from '@angular/platform-browser';

@Injectable()
export class SeosearchService {

  constructor(private meta: Meta) { }

  // generateTags(config) {
  //   // default values
  //   config = { 
  //     title: 'Hairfolio website', 
  //     description: 'your post is publish your friend and selling your product ', 
  //     image: 'https://angularfirebase.com/images/logo.png',
  //     slug: '',
  //     ...config
  //   }

  //   this.meta.updateTag({ name: 'twitter:card', content: 'summary' });
  //   this.meta.updateTag({ name: 'twitter:site', content: '@Hairfolio' });
  //   this.meta.updateTag({ name: 'twitter:title', content: config.title });
  //   this.meta.updateTag({ name: 'twitter:description', content: config.description });
  //   this.meta.updateTag({ name: 'twitter:image', content: config.image });
    
  //   this.meta.updateTag({ name: 'twitter:creator', content: "@author_handle" });
  //   this.meta.updateTag({ name: 'twitter:data1', content: "$3" });
  //   this.meta.updateTag({ name: 'twitter:label1', content: "Price" });
  //   this.meta.updateTag({ name: 'twitter:data2', content: "Black" });
  //   this.meta.updateTag({ name: 'twitter:label2', content: "Color" });

  //   this.meta.updateTag({ property: 'og:type', content: 'article' });
  //   this.meta.updateTag({ property: 'og:site_name', content: 'Hairfolio' });
  //   this.meta.updateTag({ property: 'og:title', content: config.title });
  //   this.meta.updateTag({ property: 'og:description', content: config.description });
  //   this.meta.updateTag({ property: 'og:image', content: config.image });
  //   this.meta.updateTag({ property: 'og:url', content: `http://180.211.99.165:8080/jaisal/hairfolio/dist/#/${config.slug}` });
  // }

}
