import {
  trigger,
  style,
  animate,
  transition
} from '@angular/animations';

export const LoginComponentAnimation = trigger('switchForms',[
        transition('visible <=> invisible', [
          animate('600ms 0ms ease-out',style({ opacity:0 })),
          animate('600ms 0ms ease-in',style({opacity:1 })),
        ])
      ])
