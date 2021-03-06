import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { DataService } from '../data.service';
import { IconsService } from '../icons.service';
import { NewGameRequest } from '../interfaces/new-game-request';
import { JoinGameRequest } from '../interfaces/join-game-request';
import { CategoriesResponse } from '../interfaces/categories-response';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  constructor(private router: Router,private dataService: DataService,private route:ActivatedRoute, private iconsService: IconsService) { }

  categories: Array<any> = [];
  username: string = this.dataService.readToken().username;
  gameId: string;
  joinId: string;
  private sub: any;
  joinError = "";

  faIcons = this.iconsService.faIcons;

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

  async getCategories() {
    let response : CategoriesResponse = await this.dataService.getCategories();
    this.categories = response.categories.sort((a,b) => { return a.name.localeCompare(b.name) })
    this.cacheCategories(response);
  }

  cacheCategories(categoriesResponse: CategoriesResponse) {
    localStorage.setItem('categories-cache',JSON.stringify(categoriesResponse.categories));
    localStorage.setItem('categories-cache-expiry',String(Date.now()+(12*3600*1000)));
  }

  ngOnInit(): void {
    this.dataService.validateToken().then(response => {
      if(!response) {
        this.router.navigate(['/login']);
      }
    })
    if(localStorage.getItem('categories-cache') && localStorage.getItem('categories-cache') && Date.now() < parseInt(localStorage.getItem('categories-cache-expiry'))) {
      this.categories = JSON.parse(localStorage.getItem('categories-cache'));
    }
    else {
      this.getCategories();
    }
    // Get the game ID from the route parameter
    this.sub = this.route.params.subscribe(params => {
    this.joinId = params['gameId'];
    if(typeof this.joinId != 'undefined') {
      this.joinGame(this.joinId);
    }
  })
  }

}
