import { Component, EventEmitter, HostListener, OnInit, Output, ViewChild } from '@angular/core';
import { MatDrawer } from '@angular/material/sidenav';
import { GivenNumberGenerate } from '../game-generation-util';
import { gradePlayerInput, Result } from '../game-grade-util';
import { ResultDataSource } from '../result-data-source';
import { GenerationType, Settings } from '../settings/settings.component';

@Component({
  selector: 'app-board',
  templateUrl: './board.component.html',
  styleUrls: ['./board.component.scss']
})
export class BoardComponent implements OnInit {
  private currentGameStates: Array<{letter: string, position: number}> = [];
  private currentGameAnswers: Array<{audioMatch: boolean, positionMatch: boolean}> = [];
  private currentGameInputs: Array<{audioMatch: boolean, positionMatch: boolean}> = [];
  private delayMs: number = 3000;
  private turns: number = 20;

  private results: Array<Result> = [];
  private resultDataSource: ResultDataSource = new ResultDataSource(this.results);

  private stateIndex: number = -1;

  constructor() { }
  
  @Output() finish: EventEmitter<string> = new EventEmitter<string>();
  @ViewChild(MatDrawer) drawer: MatDrawer;

  get CurrentPosition() {
    return this.gameIsPlaying() ? this.currentGameStates[this.stateIndex].position : -1;
  }

  get CurrentLetter() {
    return this.gameIsPlaying() ? this.currentGameStates[this.stateIndex].letter : '';
  }

  get Results() {
    return this.resultDataSource;
  }

  get IsPlaying() {
    return this.gameIsPlaying();
  }

  ngOnInit(): void {
  }

  // call from outside with ref
  play(settings: Settings) {
    console.log('begin');

    let { gameStates, gameAnswers } = (settings.generationType === GenerationType.Limited) ? 
        GivenNumberGenerate(settings.trials, settings.nBack, settings.audioMatchNumber, settings.positionMatchNumber)
      : { gameStates: [], gameAnswers: [] }; //RandomGenerate();
    this.currentGameStates = gameStates;
    this.currentGameAnswers = gameAnswers;
    this.delayMs = settings.intervalMs;
    this.turns = settings.trials;

    this.stateIndex = 0;
    this.drawer.close();
    this.playSound();
  }

  gameIsPlaying() {
    return this.stateIndex >= 0 && this.stateIndex < this.turns;
  }

  @HostListener('window:keydown.a',['$event'])
  keypressForA() {
    if(this.gameIsPlaying()) {
      this.currentGameInputs[this.stateIndex] = {
        ...this.currentGameInputs[this.stateIndex],
        audioMatch: true,
      };
    }
  }

  @HostListener('window:keydown.l',['$event'])
  keypressForL() {
    if(this.gameIsPlaying()) {
      this.currentGameInputs[this.stateIndex] = {
        ...this.currentGameInputs[this.stateIndex],
        positionMatch: true,
      };
    }
  }

  playSound() {
    // play sound
    let letter, position = this.currentGameStates[this.stateIndex];
    setTimeout(this.checkTurn.bind(this), this.delayMs);
  }

  checkTurn() {
    // check & display error
    // update state index
    this.stateIndex += 1;
    if(this.stateIndex < this.turns) {
      this.playSound();
    }
    else {
      this.gameFinishCallback();
    }
  }

  gameFinishCallback() {
    this.results = [...this.results, gradePlayerInput(this.currentGameInputs, this.currentGameAnswers)];
    this.resultDataSource.setData(this.results);
    console.log(this.currentGameStates);
    console.log(this.currentGameInputs);
    console.log(this.resultDataSource);
    this.clearCurrentGame();
    this.drawer.open();
  }

  clearCurrentGame() {
    this.stateIndex = -1;
    this.currentGameInputs = [];
    this.currentGameAnswers = [];
    this.currentGameStates = [];
  }
}
