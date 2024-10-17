import { Component } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';
import { HeaderComponent } from './header/header.component';
import { LoginService } from '../Auth/login.service';
import { FormsModule, NgForm } from '@angular/forms';
// import { LoadingSpinnerComponent } from '../shared/loading-spinner.component';
import { SearchControlComponent } from './search-control/search-control.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    RouterOutlet,
    HeaderComponent,
    // LoadingSpinnerComponent,
    FormsModule,
    SearchControlComponent,
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
})
export class AppComponent {
  title = 'OutlookTest';
  isLogedIn = false;
  isLoginProgress = false;

  constructor(private loginService: LoginService, private router: Router) {}

  onSubmit(loginform: NgForm) {
    const password = 'kli'; //loginform.form.value.password;
    const userName = 'kli'; // loginform.form.value.email;
    this.isLoginProgress = true;
    this.loginService.login(userName, password).subscribe({
      next: (token) => {
        this.isLogedIn = true;
        // this.router.navigate(['/home']);
        // this.token = token.access_token;
      },
      error: (e) => console.error(e),
      complete: () => (this.isLoginProgress = false),
    });
  }
}
