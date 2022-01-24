import { Component, OnInit } from '@angular/core';
import { DataService } from '../data.service';
import { FetchGameRequest } from '../interfaces/fetch-game-request';
import { Router } from '@angular/router';

@Component({
  selector: 'app-lobby',
  templateUrl: './lobby.component.html',
  styleUrls: ['./lobby.component.css']
})
export class LobbyComponent implements OnInit {

  constructor(private router: Router,private dataService: DataService) { }

  gameId: string = localStorage.getItem('activeGame');
  username: string = localStorage.getItem('username');
  queryLimit: number = 100;
  queries: number = 0;
  queryGame : ReturnType<typeof setInterval>;
  players : Array<string>;
  status : string = "Waiting for players..."

  async getGame(username: string,gameId: string,retrieveQuestions: string) {
    if(this.queries >= this.queryLimit) {
      clearInterval(this.queryGame);
      this.status = "Timed out waiting for players."
    }
    this.queries++;
    let fetchGameRequest : FetchGameRequest = {"player":username,"gameId":gameId,"retrieveQuestions":retrieveQuestions};
    let response = await this.dataService.getGame(fetchGameRequest);
    this.players = response.players;
    if(this.players.length > 1) {
      this.status = "Starting game in 3 seconds..."
      clearInterval(this.queryGame);
      setTimeout(() => { this.router.navigate(['/game']) },3000);
    }
  }


  ngOnInit(): void {
    if(localStorage.getItem('activeGame') == null) {
      this.router.navigate(['/home']);
    }
    this.getGame(this.username,this.gameId,'false');
    this.queryGame = setInterval(() => { this.getGame(this.username,this.gameId,'false')},2000);
    localStorage.clearItem('activeQuestion');
  }

}
