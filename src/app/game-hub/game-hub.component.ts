import { Component, OnInit } from '@angular/core';
import { DataService } from '../data.service';
import { FetchGameRequest } from '../interfaces/fetch-game-request';
import { AnswerQuestionRequest } from '../interfaces/answer-question-request';
import { LocalGameState } from '../interfaces/local-game-state';

@Component({
  selector: 'app-game-hub',
  templateUrl: './game-hub.component.html',
  styleUrls: ['./game-hub.component.css']
})
export class GameHubComponent implements OnInit {

  constructor(private dataService:DataService) { }
  elapsedTime:number = 0;
  maxTime: number = 1000;
  stepSize: number = 1;

  clientTimer: ReturnType<typeof setInterval>;
  queryGame: ReturnType<typeof setInterval>;
  answeredCurrent: boolean = false;
  gameFinished = false;
  correctAnswer: string;

  gameId: string = localStorage.getItem('activeGame');
  username: string = localStorage.getItem('username');
  player: number;
  result: string;

  localGameState: LocalGameState = {"activeQuestion":0,"question":"","answers":[],"scores":[],"players":[]}

  async getGame(username: string,gameId: string,retrieveQuestions: string) {
    // Get the game
    let fetchGameRequest : FetchGameRequest = {"player":username,"gameId":gameId,"retrieveQuestions":retrieveQuestions};
    let response = await this.dataService.getGame(fetchGameRequest);
    // If the active question has increased the other player has answered
    if(response.activeQuestion > this.localGameState.activeQuestion) {
      clearInterval(this.queryGame);
      this.localGameState.activeQuestion = response.activeQuestion;
      // Store in case page is refreshed
      localStorage.setItem('activeQuestion',String(this.localGameState.activeQuestion));
      this.getGame(this.username,this.gameId,'true');
    }
    if(response.gameStatus == 'Finished') {
      this.endGame(response);
    }
    // Populate the local game state
    this.localGameState.scores = response.scores;
    this.localGameState.players = response.players;

    // If function is called trying to retrieve a question then update the game state and reset the timer
    if(retrieveQuestions == "true") {
        this.localGameState.answers = response.answers;
        this.localGameState.question = response.question;
        this.localGameState.activeQuestion = response.activeQuestion;
        this.answeredCurrent = false;
        this.elapsedTime = 0;
        this.startTimer();
      }
  }

  endGame(response) {
    this.gameFinished = true;
    this.localGameState.scores = response.scores;
    this.localGameState.players = response.players;
    if(this.localGameState.players[0] == this.username) {
      this.player = 1;
    }
    else {
      this.player = 2;
    }
    if(this.localGameState.scores[0] == this.localGameState.scores[1]) {
      this.result = "Draw";
    }
    else if(this.player == 1 && this.localGameState.scores[0] > this.localGameState.scores[1]) {
      this.result = "You Win!";
    }
    else if(this.player == 2 && this.localGameState.scores[0] < this.localGameState.scores[1]) {
      this.result = "You Win!";
    }
    else {
      this.result = "You Lose";
    }
    clearInterval(this.queryGame);
  }

  async answerQuestion(player:string,action:string,gameId:string,answer:string,$event) {
    if(this.answeredCurrent) {
      return false;
    }
    this.answeredCurrent = true;
    let answerQuestionRequest : AnswerQuestionRequest = {"player":player,"action":action,"gameId":gameId,"answer":answer};
    let response = await this.dataService.answerQuestion(answerQuestionRequest);
    if(typeof response.scores != 'undefined') {
      this.localGameState.scores = response.scores;
    }
    if(typeof response.correctAnswer != 'undefined') {
      this.correctAnswer = response.correctAnswer;
    }
    clearInterval(this.clientTimer);
    if(response.correct && $event != null) {
      $event.srcElement.style.backgroundColor = 'green';
    }
    else if(!response.correct && $event != null) {
      $event.srcElement.style.backgroundColor = 'red';
    }
    this.queryGame = setInterval(()=> { this.getGame(this.username,this.gameId,'false')},3000);
  }

  increaseTime() {
    if(this.elapsedTime <= this.maxTime) {
      this.elapsedTime = this.elapsedTime + this.stepSize;
    }
    else {
      this.answerQuestion(this.username,'ANSWER',this.gameId,'void',null);
      clearInterval(this.clientTimer);
    }
  }

  startTimer() {
    this.clientTimer = setInterval(() => { this.increaseTime(); },10);
  }

  ngOnInit(): void {
    // Fetch the first question
    let activeQuestion = parseInt(localStorage.getItem('activeQuestion'));
    this.localGameState.activeQuestion = activeQuestion;
    this.getGame(this.username,this.gameId,'true');
  }

}
