import { Component, OnInit } from '@angular/core';
import { DataService } from '../data.service';
import { FetchGameRequest } from '../interfaces/fetch-game-request';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-lobby',
  templateUrl: './lobby.component.html',
  styleUrls: ['./lobby.component.css']
})
export class LobbyComponent implements OnInit {

  constructor(private router: Router,private dataService: DataService, private route: ActivatedRoute) { }

  gameId: string;
  username: string = this.dataService.readToken().username;
  queryLimit: number = 100;
  queries: number = 0;
  queryGame : ReturnType<typeof setInterval>;
  players : Array<string>;
  status : string = "Waiting for players..."
  countdown: number = 3;

  private sub: any;

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
      this.status = "Starting game in " + this.countdown + " seconds...";
      setInterval(()=> {
        if(this.countdown > 0) { this.countdown--; }
        this.status = "Starting game in " + this.countdown + " seconds..."
      },1000)
      clearInterval(this.queryGame);
      setTimeout(() => { this.router.navigate(['/game',this.gameId]) },3000);
    }
  }


  ngOnInit(): void {
    // Get the game ID from the route parameter
    this.sub = this.route.params.subscribe(params => {
    this.gameId = params['gameId'];
    this.getGame(this.username,this.gameId,'false');
    this.queryGame = setInterval(() => { this.getGame(this.username,this.gameId,'false')},2000);
  })
  }

}
