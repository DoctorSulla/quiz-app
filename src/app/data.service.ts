import { Injectable } from '@angular/core';
import { CategoriesResponse } from './interfaces/categories-response';
import { NewGameRequest } from './interfaces/new-game-request';
import { JoinGameRequest } from './interfaces/join-game-request';
import { FetchGameRequest } from './interfaces/fetch-game-request';
import { AnswerQuestionRequest } from './interfaces/answer-question-request';
import { LoginRequest } from './interfaces/login-request';
import { RegistrationRequest } from './interfaces/registration-request';
import { JwtValidationRequest } from './interfaces/jwt-validation-request';
import { ValidateEmailRequest } from './interfaces/validate-email-request';


@Injectable({
  providedIn: 'root'
})
export class DataService {


  baseApiUrl: string = 'https://api.quiz-app.co.uk';
  categoriesApi: string = this.baseApiUrl + '/categories/';
  gameApi: string = this.baseApiUrl + '/game/';
  sessionApi: string = this.baseApiUrl + '/session/';
  registrationApi: string = this.baseApiUrl + '/registration/';
  verificationApi: string = this.baseApiUrl + '/session/verify/';
  resendEmailApi: string = this.baseApiUrl + '/verificationEmail/';

  jwt: string;
  headers: HeadersInit

  // Login / registration related API calls

  async createSession(loginRequest: LoginRequest) {
    let p1 = await fetch(this.sessionApi,{
      method: 'POST',
      body: JSON.stringify(loginRequest)
    });

    let p2 = await p1.json();
    return p2;
  }

  async register(registrationRequest: RegistrationRequest) {
    let p1 = await fetch(this.registrationApi,{
      method: 'POST',
      body: JSON.stringify(registrationRequest)
    });

    let p2 = await p1.json();
    return p2;
  }

  async validateEmail(validateEmailRequest:ValidateEmailRequest) {
    this.updateJwt();
    let p1 = await fetch(this.registrationApi,{
      method: 'PATCH',
      headers: this.headers,
      body: JSON.stringify(validateEmailRequest)
    });

    let p2 = await p1.json();
    return p2;
  }

  async newVerificationEmail() {
    this.updateJwt();
    let p1 = await fetch(this.resendEmailApi,{
      method: 'POST',
      headers: this.headers
    });

    let p2 = await p1.json();
    return p2;
  }

  // Reference data related API calls

  async getCategories() : Promise<CategoriesResponse> {
    this.updateJwt();
    let p1 = await fetch(this.categoriesApi,{
      headers: this.headers,
    });
    let p2 = await p1.json();
    return p2;
  }

  async createCategory(category:any) {
    this.updateJwt();
    let p1 = await fetch(this.categoriesApi,{
      method: 'POST',
      headers: this.headers,
      body: JSON.stringify(category)
    });

    let p2 = await p1.json();
    return p2;
  }

  // Game related API calls

  async getGame(gameObject: FetchGameRequest) {
    this.updateJwt();
    let url = this.gameApi + "?gameId=" + gameObject.gameId + "&retrieveQuestions=" + gameObject.retrieveQuestions;
    let p1 = await fetch(url,{
      headers: this.headers
    });
    let p2 = await p1.json();
    return p2;
  }

  async createGame(gameObject: NewGameRequest) {
    this.updateJwt();
    let p1 = await fetch(this.gameApi,{
      method: 'POST',
      headers: this.headers,
      body: JSON.stringify(gameObject)
    });

    let p2 = await p1.json();
    return p2;
  }

  async joinGame(gameObject: JoinGameRequest) {
    this.updateJwt();
    let p1 = await fetch(this.gameApi,{
      method: 'PATCH',
      headers: this.headers,
      body: JSON.stringify(gameObject)
    });

    let p2 = await p1.json();
    return p2;
  }

  async answerQuestion(gameObject: AnswerQuestionRequest) {
    this.updateJwt();
    let p1 = await fetch(this.gameApi,{
      method: 'PATCH',
      headers: this.headers,
      body: JSON.stringify(gameObject)
    });

    let p2 = await p1.json();
    return p2;
  }

  // Auth related methods

  readToken() {
    if(localStorage.getItem('jwt') == null) {
      return false;
    }
    let parts : Array<string> = localStorage.getItem('jwt').split('.');
    let encodedPayload : string = parts[1];
    let payload : string = atob(encodedPayload);
    let user = JSON.parse(payload);
    return user;
  }

  async validateToken() {
    this.updateJwt();
    if(this.jwt == null) {
      return false;
    }
    let jwtValidationRequest: JwtValidationRequest = {"jwt":this.jwt};
    let p1 = await fetch(this.verificationApi,{
      method: 'POST',
      headers: this.headers,
      body: JSON.stringify(jwtValidationRequest)
    });
    if(p1.status != 200) {
      return false;
    }

    let p2 = await p1.json();
    if(p2.error) {
      return false;
    }
    return true;
  }

  updateJwt() {
    this.jwt = localStorage.getItem('jwt');
    this.headers = {
        'jwt' : this.jwt,
        'Content-Type': 'application/json'
      };
  }

  constructor() {
 }
}
