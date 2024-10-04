import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { Subscribable, Subscription } from 'rxjs';
import { User } from '../../Auth/user.model';
import { LoginService } from '../../Auth/login.service';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css',
})
export class HeaderComponent implements OnInit, OnDestroy {
  isLogedIn: boolean = false;

  loginservice = inject(LoginService);
  private userSub!: Subscription;
  private userData?: User;

  ngOnInit(): void {
    this.userSub = this.loginservice.user.subscribe((user) => {
      this.isLogedIn = !!user;
      this.userData = user;
      console.log('UserOk ' + !!user);
    });
  }
  LogUd() {
    this.userData = undefined;
    this.isLogedIn = false;
    // this.userData?.next(null);
  }

  Login() {}
  ngOnDestroy(): void {
    this.userSub.unsubscribe();
  }
  get getName() {
    return this.getLogedInName();
  }

  getLogedInName() {
    if (this.isLogedIn) {
      return this.userData?.email;
    }
    return '';
  }
}
