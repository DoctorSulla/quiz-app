import {
  trigger,
  style,
  animate,
  transition
} from '@angular/animations';

export const LoginComponentAnimation = trigger('switchForms',[
        transition('visible <=> invisible', [
          animate('400ms 0ms ease-out',style({ opacity:0 })),
          animate('400ms 0ms ease-in',style({opacity:1 })),
        ])
      ])


export const QuestionFadeInAnimation = trigger('fadeIn',[
        transition(':enter', [
          style({ opacity:0 }),
          animate('2000ms 0ms ease-in',style({opacity:1 })),
        ])
      ])
