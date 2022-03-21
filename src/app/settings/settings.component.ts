import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';

export enum GenerationType {
  Random = "Random",
  Limited = "Limited"
}

export type Settings = {
  nBack: number,
  intervalMs: number,
  trials: number,
  // soundVolume: number,
  // keypressEventName: {
  //   AudioMatch: any,
  //   PositionMatch: any
  // },
  generationType: GenerationType,
  audioMatchNumber: number,
  positionMatchNumber: number,
}

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.scss']
})
export class SettingsComponent implements OnInit {
  private nBackLevels: Array<number> = [1, 2, 3, 4, 5];

  public settingsForm = new FormGroup({
    nBack: new FormControl(2),
    trials: new FormControl(24),
    intervalMs: new FormControl(3000),
    generationType: new FormControl(GenerationType.Limited),
    audioMatchNumber: new FormControl(5),
    positionMatchNumber: new FormControl(5)
  });
  
  constructor() { }

  get NBackLevels() {
    return this.nBackLevels;
  }

  get GenerationTypes() {
    return Object.keys(GenerationType);
  }

  get IsLimitedGeneration() {
    return this.settingsForm.get("generationType")?.value === GenerationType.Limited;
  }

  @Output() playWithSettings: EventEmitter<Settings> = new EventEmitter<Settings>();

  ngOnInit(): void {

  }

  onPlay(settingsForm: FormGroup) {
    console.log(settingsForm);
    this.playWithSettings.emit(this.settingsForm.value);
  }
}
