import { inject } from 'aurelia-framework';
import { PostService } from '../common/services/post-service';

@inject(PostService)
export class Posts {
  constructor(PostService) {
    this.postService = PostService;
  }

  attached(){
    this.error = '';
    this.viewPost = true;
    this.postService.allPostPreviews().then(data => {
        this.posts = data.posts;
    }).catch(error => {
      this.error = error.message;
    })
  }
}
