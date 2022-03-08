export interface FullCategory {
  category: string,
  icon: string,
  questions: Array<question>
}

export interface question {
  correctAnswer: string,
  otherAnswers: Array<string>
}
