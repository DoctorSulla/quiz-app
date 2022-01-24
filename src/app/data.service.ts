import { Injectable } from '@angular/core';
import { CategoriesResponse } from './interfaces/categories-response';
import { NewGameRequest } from './interfaces/new-game-request';
import { JoinGameRequest } from './interfaces/join-game-request';
import { FetchGameRequest } from './interfaces/fetch-game-request';
import { AnswerQuestionRequest } from './interfaces/answer-question-request';


@Injectable({
  providedIn: 'root'
})
export class DataService {


  baseApiUrl: string = 'https://api.quiz-app.co.uk';
  categoriesApi: string = this.baseApiUrl + '/categories/';
  gameApi: string = this.baseApiUrl + '/game/';

  async getCategories() : Promise<CategoriesResponse> {
    let p1 = await fetch(this.categoriesApi);
    let p2 = await p1.json();
    return p2;
  }

  async getGame(gameObject: FetchGameRequest) {
    let url = this.gameApi + "?player=" + gameObject.player + "&gameId=" + gameObject.gameId + "&retrieveQuestions=" + gameObject.retrieveQuestions;
    let p1 = await fetch(url);
    let p2 = await p1.json();
    return p2;
  }

  async createGame(gameObject: NewGameRequest) {
    let p1 = await fetch(this.gameApi,{
      method: 'POST',
      body: JSON.stringify(gameObject)
    });

    let p2 = await p1.json();
    return p2;
  }

  async joinGame(gameObject: JoinGameRequest) {
    let p1 = await fetch(this.gameApi,{
      method: 'PATCH',
      body: JSON.stringify(gameObject),
      headers:{ 'Content-Type': 'application/json'}
    });

    let p2 = await p1.json();
    return p2;
  }

  async answerQuestion(gameObject: AnswerQuestionRequest) {
    let p1 = await fetch(this.gameApi,{
      method: 'PATCH',
      body: JSON.stringify(gameObject),
      headers:{ 'Content-Type': 'application/json'}
    });

    let p2 = await p1.json();
    return p2;
  }

  constructor() { }
}
