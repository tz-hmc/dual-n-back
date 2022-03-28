import { Component, EventEmitter, HostListener, OnInit, Output, ViewChild } from '@angular/core';
import { MatDrawer } from '@angular/material/sidenav';
import { GivenNumberGenerate } from '../game-generation-util';
import { gradePlayerInput, Result, ResultRow, toResultRow } from '../game-grade-util';
import { ResultDataSource } from '../result-data-source';
import { GenerationType, Settings } from '../settings/settings.component';
import { audioSprites, playAllSounds } from '../game-audio-util';

@Component({
  selector: 'app-board',
  templateUrl: './board.component.html',
  styleUrls: ['./board.component.scss']
})
export class BoardComponent implements OnInit {
  private currentGameStates: Array<{letter: string, position: number}> = [];
  private currentGameAnswers: Array<{audioMatch: boolean, positionMatch: boolean}> = [];
  private currentGameInputs: Array<{audioMatch: boolean, positionMatch: boolean}> = [];
  private settings: Settings;
  // private delayMs: number = 3000;
  // private turns: number = 20;

  private results: Array<ResultRow> = [];
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
    this.settings = settings;
    let { gameStates, gameAnswers } = (this.settings.generationType === GenerationType.Limited) ? 
        GivenNumberGenerate(this.settings.trials, this.settings.nBack, this.settings.audioMatchNumber, this.settings.positionMatchNumber)
      : { gameStates: [], gameAnswers: [] }; //RandomGenerate();
    this.currentGameStates = gameStates;
    this.currentGameAnswers = gameAnswers;

    this.stateIndex = 0;
    this.drawer.close();
    this.playSound();
  }

  gameIsPlaying() {
    return this.stateIndex >= 0 && this.stateIndex < this.settings.trials;
  }

  @HostListener('window:keydown.a',['$event'])
  keypressForA() {
    this.audioMatch();
  }

  @HostListener('window:keydown.l',['$event'])
  keypressForL() {
    this.positionMatch();
  }

  clickAudioMatch() {
    this.audioMatch();
  }

  clickPositionMatch() {
    this.positionMatch();
  }

  audioMatch() {
    if(this.gameIsPlaying()) {
      this.currentGameInputs[this.stateIndex] = {
        ...this.currentGameInputs[this.stateIndex],
        audioMatch: true,
      };
    }
  }

  positionMatch() {
    if(this.gameIsPlaying()) {
      this.currentGameInputs[this.stateIndex] = {
        ...this.currentGameInputs[this.stateIndex],
        positionMatch: true,
      };
    }
  }

  playSound() {
    // play sound
    let {letter, position} = this.currentGameStates[this.stateIndex];
    audioSprites.play(letter);
    setTimeout(this.checkTurn.bind(this), this.settings.intervalMs);
  }

  checkTurn() {
    // check & display error
    // update state index
    this.stateIndex += 1;
    if(this.stateIndex < this.settings.trials) {
      this.playSound();
    }
    else {
      this.gameFinishCallback();
    }
  }

  gameFinishCallback() {
    this.results = [...this.results, 
      toResultRow(gradePlayerInput(this.currentGameInputs, this.currentGameAnswers), this.settings.nBack)
    ];
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
