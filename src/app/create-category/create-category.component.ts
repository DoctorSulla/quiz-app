import { Component, OnInit } from '@angular/core';
import { DataService } from '../data.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-create-category',
  templateUrl: './create-category.component.html',
  styleUrls: ['./create-category.component.css']
})
export class CreateCategoryComponent implements OnInit {

  constructor(private dataService: DataService, private router:Router) { }

  categoryRegExp = new RegExp("^[A-z0-9\-]{4,100}$","i");
  qAndARegExp = new RegExp("^[A-z0-9\?\' \-]{1,200}$","i");

  question = {"question":"","correctAnswer":"","otherAnswers":["","",""]};
  category = {"category":"","questions":[]};

  response = "";

  pageState: string = "ChooseCategory";

  changePageState(newState: string) {
    this.pageState = newState;
  }

  addQuestion() {
    if(this.question.question.match(this.qAndARegExp) && this.question.correctAnswer.match(this.qAndARegExp)) {
      for(let answer of this.question.otherAnswers) {
        if(!answer.match(this.qAndARegExp)) {
          console.error("Questions and answers must be between 1 and 200 alphanumeric characters");
          return false;
        }
      }
      this.category.questions.push(this.question);
      this.question = {"question":"","correctAnswer":"","otherAnswers":["","",""]};
    }
    else {
      console.error("Questions and answers must be between 1 and 200 alphanumeric characters");
    }

  }

  async createCategory() {
    let response = await this.dataService.createCategory(this.category);
    if('error' in response && response.error == true) {
      this.response = response.message;
    }
    else if('error' in response && response.error == false) {
      this.response = response.message;
      this.pageState = "CategoryCreated";
      this.category = {"category":"","questions":[]};
    }
  }

  remove(index:number) {
    this.category.questions.splice(index,1);
  }

  ngOnInit(): void {
    this.dataService.validateToken().then(response => {
      if(!response) {
        this.router.navigate(['/login']);
      }
    })
  }

}
