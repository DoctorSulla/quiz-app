import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { DataService } from '../data.service';
import { NewGameRequest } from '../interfaces/new-game-request';
import { JoinGameRequest } from '../interfaces/join-game-request';
import { faAtom, faCat, faTv, faQuestion, faEarthEurope, faCar, faCalculator, faDesktop, faLandmark, faPersonWalking, faFootball, faTrophy, faMasksTheater, faMusic, faBook, faGamepad, faTree, faVideo } from '@fortawesome/free-solid-svg-icons';


@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  constructor(private router: Router,private dataService: DataService,private route:ActivatedRoute) { }

  categories: Array<any> = [];
  username: string = this.dataService.readToken().username;
  gameId: string;
  joinId: string;
  private sub: any;
  joinError = "";

  faIcons = {
    "faAtom":faAtom,
    "faCat":faCat,
    "faTv":faTv,
    "faQuestion":faQuestion,
    "faEarthEurope":faEarthEurope,
    "faCar":faCar,
    "faCalculator":faCalculator,
    "faDesktop":faDesktop,
    "faLandmark":faLandmark,
    "faPersonWalking":faPersonWalking,
    "faFootball":faFootball,
    "faTrophy":faTrophy,
    "faMasksTheater":faMasksTheater,
    "faMusic":faMusic,
    "faBook":faBook,
    "faGamepad": faGamepad,
    "faTree": faTree,
    "faVideo": faVideo
  };

  faAtom = faAtom;
  faCat = faCat;
  faTv = faTv;
  faQuestion = faQuestion;
  faEarthEurope = faEarthEurope;
  faCar = faCar;
  faCalculator = faCalculator;
  faDesktop = faDesktop;
  faLandmark = faLandmark;
  faPersonWalking = faPersonWalking;
  faFootball = faFootball;
  faTrophy = faTrophy;


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
    this.dataService.getCategories().then(response => { this.categories = response.categories.sort()});
    // Get the game ID from the route parameter
    this.sub = this.route.params.subscribe(params => {
    this.joinId = params['gameId'];
    if(typeof this.joinId != 'undefined') {
      this.joinGame(this.joinId);
    }
  })
  }

}
