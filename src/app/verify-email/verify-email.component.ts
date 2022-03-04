import { Component, OnInit } from '@angular/core';
import { DataService } from '../data.service';
import { Router, ActivatedRoute } from '@angular/router';
import { ValidateEmailRequest } from '../interfaces/validate-email-request';


@Component({
  selector: 'app-verify-email',
  templateUrl: './verify-email.component.html',
  styleUrls: ['./verify-email.component.css']
})
export class VerifyEmailComponent implements OnInit {

  constructor(private router: Router,private dataService: DataService, private route: ActivatedRoute) { }

  verificationCode: string = "";
  private sub: any;
  formError: string = "";
  formSuccess: string = "";
  pageState: string = "initial";

  async verifyEmail() {
    let validateEmailRequest : ValidateEmailRequest = {"evc":this.verificationCode}
    let response = await this.dataService.validateEmail(validateEmailRequest);
    if('error' in response && response.error == true) {
      this.formError = response.message;
    }
    else {
      localStorage.setItem('jwt',response.jwt);
      this.router.navigate(['/home']);
    }
  }

  async resendEmail() {
    let response = await this.dataService.newVerificationEmail();
    if('error' in response && response.error == true) {
      this.formError = response.message;
    }
    else if('error' in response && response.error == false) {
      this.formSuccess = response.message;
        this.pageState = "mailSent";
    }
  }

  ngOnInit(): void {
    this.dataService.validateToken().then(response => {
      if(!response) {
        this.router.navigate(['/login']);
      }
    })

    // Get the verification code from the route parameter
    this.sub = this.route.params.subscribe(params => {
    this.verificationCode = params['verificationCode'];
  })
  }

}
