import { Injectable } from '@angular/core';
import { faAtom, faCat, faTv, faQuestion, faEarthEurope, faCar, faCalculator, faDesktop, faLandmark, faPersonWalking, faFootball, faTrophy, faMasksTheater, faMusic, faBook, faGamepad, faTree, faVideo, faPlus, faCirclePlus, faArrowsRotate } from '@fortawesome/free-solid-svg-icons';


@Injectable({
  providedIn: 'root'
})
export class IconsService {

  constructor() { }

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
    "faVideo": faVideo,
    "faPlus": faPlus,
    "faCirclePlus": faCirclePlus,
    "faArrowsRotate": faArrowsRotate
  };
}
