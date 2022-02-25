import { Component, OnInit } from '@angular/core';
import { LoginRequest } from '../interfaces/login-request';
import { RegistrationRequest } from '../interfaces/registration-request';
import { Router } from '@angular/router';
import { LoginComponentAnimation } from '../animations/animations';
import { DataService } from '../data.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
  animations: [LoginComponentAnimation]
})
export class LoginComponent implements OnInit {


  constructor(private router: Router,private dataService: DataService) { }

  username: string = "";
  formError: string = "";

  login : LoginRequest = {"email":"","password":""};
  register: RegistrationRequest = {"username":"","email":"","password":"","confirmPassword":""};

  pageState : string = "Login";
  activeTab: boolean = true;


  async processLogin(loginRequest: LoginRequest) {
    let response = await this.dataService.createSession(loginRequest);
    if('error' in response && response.error == true) {
      this.formError = response.message;
    }
    else {
      localStorage.setItem('jwt',response.jwt);
      this.router.navigate(['/home']);
    }
  }

  async processRegistration(registrationRequest: RegistrationRequest) {
    let response = await this.dataService.register(registrationRequest);
    if('error' in response && response.error == true) {
      this.formError = response.message;
    }
    else {
      localStorage.setItem('jwt',response.jwt);
      this.router.navigate(['/home']);
    }
  }

  changeActive(status: boolean) :void {
    this.activeTab = status;
  }

  toggleForms($event) :void {
    if($event.fromState == 'void') {

    }
    else {
      this.formError = "";
      setTimeout(()=> { if(this.pageState == 'Login') { this.pageState = 'Register'; } else { this.pageState = 'Login' }},400)
    }
  }

  ngOnInit(): void {
    if(localStorage.getItem('jwt') != null) {
      this.router.navigate(['/home']);
    };
  }

}
