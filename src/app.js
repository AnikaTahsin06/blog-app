import { inject } from 'aurelia-framework';
import { EventAggregator } from 'aurelia-event-aggregator';
import { AuthService } from './common/services/auth-service';
import { PostService } from './common/services/post-service';

@inject(EventAggregator, AuthService, PostService)
export class App {
  constructor(EventAggregator, AuthService, PostService) {
    this.ea = EventAggregator;
    this.authService = AuthService;
    this.postService = PostService;
  }

  attached() {
    this.currentUser = this.authService.currentUser;

    this.subscription = this.ea.subscribe('user', user => {
      this.currentUser = this.authService.currentUser;
    })

    this.postService.allTags().then(data => {
      this.tags = data.tags;
    }).catch(error => {
      this.error = error.message;
    })

    this.postService.allArchives().then(data => {
      this.archives = data.archives;
    }).catch(error => {
      this.error = error.message;
    })
  }

  configureRouter(config, router) {
    config.title = 'Aurelia blog'
    config.map([
      {
        route: '',
        name: 'home',
        moduleId: 'posts/posts',
        title: 'All Posts'
      },
      {
        route: 'login',
        name: 'login',
        moduleId: PLATFORM.moduleName('auth/login'),
        title: 'Login'
      },
      {
        route: 'post/:slug',
        name: 'post-view',
        moduleId: PLATFORM.moduleName('posts/view'),
        title: 'View Post'
      },
      {
        route: 'tag/:tag',
        name: 'tag-view',
        moduleId: PLATFORM.moduleName('posts/tag-view'),
        title: 'View Post by Tag'
      },
      {
        route: 'archive/:archive',
        name: 'archive-view',
        moduleId: PLATFORM.moduleName('posts/archive-view'),
        title: 'View Post by Archive'
      }
    ])
  }

  detached(){
    this.subscription.dispose();
  }

  logout(){
    this.authService.logout().then(data => {
      this.ea.publish('user', null);
    }).catch(error => {
      this.error = error.message;
    })
  }
}
