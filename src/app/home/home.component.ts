import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { DataService } from '../data.service';
import { NewGameRequest } from '../interfaces/new-game-request';
import { JoinGameRequest } from '../interfaces/join-game-request';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  constructor(private router: Router,private dataService: DataService,private route:ActivatedRoute) { }

  categories: Array<string> = [];
  username: string = this.dataService.readToken().username;
  gameId: string;
  joinId: string;
  private sub: any;
  joinError = "";

  validate() {
    this.gameId = this.gameId.toUpperCase();
    if(this.gameId.length > 6) {
      this.gameId = this.gameId.substring(0,6);
    }
  }

  async startGame(category:string) {
      let request : NewGameRequest = {"category":category};
      let response = await this.dataService.createGame(request);
      this.router.navigate(['/lobby',response.id]);
  }

  async joinGame(gameId: string) {
    let request : JoinGameRequest = {"action":"JOIN","gameId":gameId};
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
    this.dataService.validateToken().then(response => {
      if(!response) {
        this.router.navigate(['/login']);
      }
    })
    this.dataService.getCategories().then(response => { this.categories = response.categories});
    // Get the game ID from the route parameter
    this.sub = this.route.params.subscribe(params => {
    this.joinId = params['gameId'];
    if(typeof this.joinId != 'undefined') {
      this.joinGame(this.joinId);
    }
  })
  }

}
