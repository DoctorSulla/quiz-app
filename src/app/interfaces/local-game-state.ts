export interface LocalGameState {
  activeQuestion: number,
  question: string,
  answers: Array<string>,
  players: Array<string>,
  scores: Array<number>
}
