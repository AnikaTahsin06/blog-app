import { inject } from "aurelia-framework";
import { EventAggregator } from "aurelia-event-aggregator";
import { Router } from "aurelia-router";
import { PostService } from "../common/services/post-service";

@inject(EventAggregator, Router, PostService)
export class Create {
  constructor(EventAggregator, Router, PostService) {
    this.ea = EventAggregator;
    this.router = Router;
    this.postService = PostService;
  }

  activate() {
    this.post = {
      title: "",
      body: "",
      tags: [],
    };
    this.title = "Create Post";
  }

  createPost() {
    this.postService
      .create(this.post)
      .then((data) => {
        this.ea.publish("post-updated", Date());
        this.router.navigateToRoute("post-view", { slug: data.slug });
      })
      .catch((error) => {
        this.error = error.message;
        alert(this.error);
      });
  }
}
