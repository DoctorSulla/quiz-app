import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-create-category',
  templateUrl: './create-category.component.html',
  styleUrls: ['./create-category.component.css']
})
export class CreateCategoryComponent implements OnInit {

  constructor() { }

  question = {"question":"","correctAnswer":"","otherAnswers":["","",""]};

  category = {"category":"","questions":[]};

  addQuestion() {
    this.category.questions.push(this.question);
    this.question = {"question":"","correctAnswer":"","otherAnswers":["","",""]};
  }

  ngOnInit(): void {
  }

}
