import { Component, OnInit } from '@angular/core';
import { DataService } from '../data.service';
import { FetchGameRequest } from '../interfaces/fetch-game-request';
import { AnswerQuestionRequest } from '../interfaces/answer-question-request';
import { LocalGameState } from '../interfaces/local-game-state';
import { ActivatedRoute, Router } from '@angular/router';
import { QuestionFadeInAnimation } from '../animations/animations';

@Component({
  selector: 'app-game-hub',
  templateUrl: './game-hub.component.html',
  styleUrls: ['./game-hub.component.css'],
  animations: [QuestionFadeInAnimation]
})
export class GameHubComponent implements OnInit {

  constructor(private dataService:DataService,private route:ActivatedRoute,private router: Router) { }

  // Variables to control client side timer
  elapsedTime:number = 0;
  maxTime: number = 1000;
  stepSize: number = 1;
  clientTimer: ReturnType<typeof setInterval>;
  startTimerDelay: ReturnType<typeof setTimeout>;

  // Interval for querying the game
  queryGame: ReturnType<typeof setInterval>;

  answeredCurrent: boolean = false;
  gameFinished = false;
  correctAnswer: string;

  username: string = this.dataService.readToken().username;
  player: number;
  result: string;

  gameId: string;
  private sub: any;

  // Controls whether the answers and the timer bar should be displayed
  showAnswers: boolean = false;

  localGameState: LocalGameState = {"activeQuestion":0,"question":"","answers":[],"scores":[],"players":[]}

  async getGame(gameId: string,retrieveQuestions: string) {
    // Get the game
    let fetchGameRequest : FetchGameRequest = {"gameId":gameId,"retrieveQuestions":retrieveQuestions};
    let response = await this.dataService.getGame(fetchGameRequest);
    // If the active question has increased both players have answered
    if(response.activeQuestion > this.localGameState.activeQuestion) {
      clearInterval(this.queryGame);
      this.localGameState.activeQuestion = response.activeQuestion;
      // Store in case page is refreshed
      localStorage.setItem('activeQuestion',String(this.localGameState.activeQuestion));
      this.correctAnswer = "";
      this.getGame(this.gameId,'true');
    }
    if(response.gameStatus == 'Finished') {
      this.endGame(response);
    }
    // Populate the local game state
    this.localGameState.scores = response.scores;
    this.localGameState.players = response.players;

    if(this.localGameState.players[0] == this.username) {
      this.player = 1;
    }
    else {
      this.player = 2;
    }

    // If function is called trying to retrieve a question then update the game state and reset the timer
    if(retrieveQuestions == "true") {
        this.localGameState.question = response.question;
        // Hide the answers
        this.showAnswers = false;
        this.localGameState.answers = response.answers;
        this.localGameState.activeQuestion = response.activeQuestion;
        this.answeredCurrent = false;
        this.elapsedTime = 0;
        setTimeout(()=>{ this.showAnswers = true; },10);
        this.startTimerDelay = setTimeout(()=>{ this.startTimer(); },2000);
      }
  }

  endGame(response) {
    this.gameFinished = true;
    this.localGameState.scores = response.scores;
    this.localGameState.players = response.players;

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

  async answerQuestion(action:string,gameId:string,answer:string,$event) {
    clearTimeout(this.startTimerDelay);
    if(this.answeredCurrent) {
      return false;
    }
    this.answeredCurrent = true;
    let answerQuestionRequest : AnswerQuestionRequest = {"action":action,"gameId":gameId,"answer":answer};
    let response = await this.dataService.answerQuestion(answerQuestionRequest);
    if(typeof response.scores != 'undefined') {
      this.localGameState.scores = response.scores;
    }
    if(typeof response.correctAnswer != 'undefined') {
      this.correctAnswer = response.correctAnswer;
    }
    clearInterval(this.clientTimer);
    if(response.correct && $event != null) {
      $event.target.style.backgroundColor = 'green';
    }
    else if(!response.correct && $event != null) {
      $event.target.style.backgroundColor = 'red';
    }
    this.queryGame = setInterval(()=> { this.getGame(this.gameId,'false')},3000);
  }

  increaseTime() {
    if(this.elapsedTime <= this.maxTime) {
      this.elapsedTime = this.elapsedTime + this.stepSize;
    }
    else {
      this.answerQuestion('ANSWER',this.gameId,'void',null);
      clearInterval(this.clientTimer);
    }
  }

  startTimer() {
    // Remove any previous client timers
    clearInterval(this.clientTimer);
    // Set a new client timer
    this.clientTimer = setInterval(() => { this.increaseTime(); },10);
  }

  ngOnInit(): void {
    this.dataService.validateToken().then(response => {
      if(!response) {
        this.router.navigate(['/login']);
      }
    })
    // Get the game ID from the route parameter
    this.sub = this.route.params.subscribe(params => {
    this.gameId = params['gameId'];
    // Fetch the first question
    let activeQuestion = parseInt(localStorage.getItem('activeQuestion'));
    this.localGameState.activeQuestion = activeQuestion;
    this.getGame(this.gameId,'true');
    });
  }

}
