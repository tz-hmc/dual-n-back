import { Component, EventEmitter, HostListener, Input, OnInit, Output } from '@angular/core';
import { givenNumberGenerate } from '../game-generation-util';
import { gradePlayerInput, Result } from '../game-grade-util';

@Component({
  selector: 'app-board',
  templateUrl: './board.component.html',
  styleUrls: ['./board.component.scss']
})
export class BoardComponent implements OnInit {

  private currentGameStates: Array<{letter: string, position: number}> = [];
  private currentGameAnswers: Array<{audioMatch: boolean, positionMatch: boolean}> = [];
  private currentGameInputs: Array<{audioMatch: boolean, positionMatch: boolean}> = [];

  private results: Array<Result> = [];

  private stateIndex: number = -1;

  constructor() { }

  @Input() turns: number = 20;
  @Input() mode: any = null;
  @Input() delayMs: number = 3000;
  
  @Output() finish: EventEmitter<string> = new EventEmitter<string>();

  get CurrentPosition() {
    return this.gameIsPlaying() ? this.currentGameStates[this.stateIndex].position : -1;
  }

  get CurrentLetter() {
    return this.gameIsPlaying() ? this.currentGameStates[this.stateIndex].letter : '';
  }

  get IsPlaying() {
    return this.gameIsPlaying();
  }

  ngOnInit(): void {
    
  }

  // call from outside with ref
  play() {
    console.log('begin');
    let {gameStates, gameAnswers} = givenNumberGenerate(this.turns, 1, 5, 5);
    this.currentGameStates = gameStates;
    this.currentGameAnswers = gameAnswers;
    this.stateIndex = 0;
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
    this.results.push(gradePlayerInput(this.currentGameInputs, this.currentGameAnswers));
    console.log(this.currentGameStates);
    console.log(this.currentGameInputs);
    console.log(this.results);
    this.clearCurrentGame();
  }

  clearCurrentGame() {
    this.stateIndex = -1;
    this.currentGameInputs = [];
    this.currentGameAnswers = [];
    this.currentGameStates = [];
  }
}
