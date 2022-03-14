import { Component, OnInit, Output, EventEmitter } from '@angular/core';

export type State = {
  letter: any,
  position: number
}

export type Settings = {
  nback: number,
  intervalMs: number,
  trials: number,
  soundVolume: number,
  keypressEventName: {
    AudioMatch: any,
    PositionMatch: any
  },
  useRandom: boolean,
  audioMatchNumber: number,
  positionMatchNumber: number,
}

const DEFAULT_SETTINGS: Settings = {
  nback: 1,
  intervalMs: 3000,
  trials: 24,
  soundVolume: 50,
  keypressEventName: {
    AudioMatch: 'window:keydown.a',
    PositionMatch: 'window:keydown.l'
  },
  useRandom: false,
  audioMatchNumber: 12,
  positionMatchNumber: 12
}

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.scss']
})
export class SettingsComponent implements OnInit {
  private nBackLevels: Array<number> = [1, 2, 3, 4, 5];
  private settings: Settings = DEFAULT_SETTINGS;

  constructor() { }

  get NBackLevels() {
    return this.nBackLevels;
  }

  get Settings() {
    return this.settings;
  }

  @Output() changeSetting: EventEmitter<Settings> = new EventEmitter<Settings>();

  ngOnInit(): void {

  }

  onNBackChange() {
    this.changeSetting.emit(this.settings);
  }
}
