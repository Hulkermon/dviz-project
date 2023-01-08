import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class TimelineService {
  spaceRaceStart: Date = new Date(1957, 8, 21);
  firstMoonLanding: Date = new Date(1969, 7, 20);
  spaceXFounding: Date = new Date(2002, 3, 14);
  endOfLaunchDecline: Date = new Date(2004, 6);
  spaceXFirstLaunch: Date = new Date(2008, 9, 28);
  spaceXFirstTestLanding: Date = new Date(2013, 9, 29);
  spaceXFirstSoftTouchDown: Date = new Date(2014, 4, 8);
  spaceXFirstLanding: Date = new Date(2015, 12, 21);
}
