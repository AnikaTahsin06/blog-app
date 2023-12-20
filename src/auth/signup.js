import { inject } from "aurelia-framework";
import { EventAggregator } from "aurelia-event-aggregator";
import { Router } from "aurelia-router";
import { AuthService } from "../common/services/auth-service";

@inject(EventAggregator, Router, AuthService)
export class Signup {
  constructor(EventAggregator, Router, AuthService) {
    this.ea = EventAggregator;
    this.router = Router;
    this.authService = AuthService;
  }

  activate() {
    this.error = null;
  }

  signup() {
    this.error = null;
    this.authService
      .signup(this.name)
      .then((data) => {
        this.ea.publish("user", data.name);
        this.router.navigateToRoute("home");
      })
      .catch((error) => {
        this.error = error.message;
      });
  }
}
