import { Component, OnInit } from '@angular/core';
import { LoginRequest } from '../interfaces/login-request';
import { RegistrationRequest } from '../interfaces/registration-request';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  constructor(private router: Router) { }

  username: string = "";
  formError: string = "";

  login : LoginRequest;
  register: RegistrationRequest;


  processLogin() :void {
      if(this.username.match(/[a-zA-Z0-9]{3,20}/)) {
        this.router.navigate(['/home']);
        localStorage.setItem('username',this.username);
      }
      else {
        this.formError = "Username must be an alphanumeric character between 3 and 20 characters.";
      }
  }

  ngOnInit(): void {
    if(localStorage.getItem('username') != null) {
      this.router.navigate(['/home']);
    };
  }

}
