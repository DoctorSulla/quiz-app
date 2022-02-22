import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { DataService } from '../data.service';
import { NewGameRequest } from '../interfaces/new-game-request';
import { JoinGameRequest } from '../interfaces/join-game-request';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  constructor(private router: Router,private dataService: DataService) { }

  categories: Array<string> = [];
  username: string = this.dataService.readToken().username;
  gameId: string = "";
  joinError = "";

  validate() {
    this.gameId = this.gameId.toUpperCase();
    if(this.gameId.length > 6) {
      this.gameId = this.gameId.substring(0,6);
    }
  }

  async startGame(category:string,username:string) {
      let request : NewGameRequest = {"playerOne":username,"category":category};
      let response = await this.dataService.createGame(request);
      this.router.navigate(['/lobby',response.id]);
  }

  async joinGame() {
    let request : JoinGameRequest = {"player":this.username,"action":"JOIN","gameId":this.gameId};
    let response = await this.dataService.joinGame(request);
    if(response.hasOwnProperty('error')) {
      this.joinError = response.message;
    }
    else {
      this.joinError = "";
      this.router.navigate(['/lobby',response.id]);
    }
  }

  ngOnInit(): void {
    if(localStorage.getItem('jwt') == null) {
      this.router.navigate(['/login']);
    }
    localStorage.removeItem('activeGame');
    this.dataService.getCategories().then(response => { this.categories = response.categories});
  }

}
