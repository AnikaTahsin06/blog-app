import { inject } from "aurelia-framework";
import { AuthService } from "../common/services/auth-service";
import { PostService } from "../common/services/post-service";

@inject(AuthService, PostService)
export class View {
  constructor(AuthService, PostService) {
    this.authService = AuthService;
    this.postService = PostService;
  }

  activate(params) {
    this.error = "";
    this.postService
      .find(params.slug)
      .then((data) => {
        this.post = data.post;
      })
      .catch((error) => {
        this.error = error.message;
      });
  }
}
