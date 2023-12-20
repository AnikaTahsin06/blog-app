import { inject } from "aurelia-framework";
import { EventAggregator } from "aurelia-event-aggregator";
import { AuthService } from "./common/services/auth-service";
import { PostService } from "./common/services/post-service";
import { AuthorizeStep } from "./pipeline-steps/authorize-step";
import { PLATFORM } from "aurelia-pal";

@inject(EventAggregator, AuthService, PostService)
export class App {
  constructor(EventAggregator, AuthService, PostService) {
    this.ea = EventAggregator;
    this.authService = AuthService;
    this.postService = PostService;
  }

  attached() {
    this.currentUser = this.authService.currentUser;

    this.subscription = this.ea.subscribe("user", (user) => {
      this.currentUser = this.authService.currentUser;
    });

    this.updateSidebar();
    this.postSubscription = this.ea.subscribe("post-updated", (updatedAt) => {
      this.updateSidebar();
    });
  }

  updateSidebar() {
    this.postService
      .allTags()
      .then((data) => {
        this.tags = data.tags;
      })
      .catch((error) => {
        this.error = error.message;
      });

    this.postService
      .allArchives()
      .then((data) => {
        this.archives = data.archives;
      })
      .catch((error) => {
        this.error = error.message;
      });
  }

  configureRouter(config, router) {
    config.title = "Aurelia blog";
    this.router = router;
    config.addAuthorizeStep(AuthorizeStep);
    config.map([
      {
        route: "",
        name: "home",
        moduleId: "posts/posts",
        title: "All Posts",
      },
      {
        route: "login",
        name: "login",
        moduleId: PLATFORM.moduleName("auth/login"),
        title: "Login",
      },
      {
        route: "signup",
        name: "signup",
        moduleId: PLATFORM.moduleName("auth/signup"),
        title: "Sign Up",
      },
      {
        route: "create-post",
        name: "create-post",
        moduleId: PLATFORM.moduleName("posts/create"),
        title: "Create Post",
        settings: {
          auth: true,
        },
      },
      {
        route: "post/:slug",
        name: "post-view",
        moduleId: PLATFORM.moduleName("posts/view"),
        title: "View Post",
      },
      {
        route: "post/:slug/edit",
        name: "post-edit",
        moduleId: PLATFORM.moduleName("posts/edit"),
        title: "Edit Post",
        settings: {
          auth: true,
        },
      },
      {
        route: "tag/:tag",
        name: "tag-view",
        moduleId: PLATFORM.moduleName("posts/tag-view"),
        title: "View Post by Tag",
      },
      {
        route: "archive/:archive",
        name: "archive-view",
        moduleId: PLATFORM.moduleName("posts/archive-view"),
        title: "View Post by Archive",
      },
    ]);
  }

  detached() {
    this.subscription.dispose();
    this.postSubscription.dispose();
  }

  logout() {
    this.authService
      .logout()
      .then((data) => {
        this.ea.publish("user", null);
        this.router.navigateToRoute("home");
      })
      .catch((error) => {
        this.error = error.message;
      });
  }
}
