import { Component, EventEmitter, getNgModuleById, HostListener, Input, OnInit, Output } from '@angular/core';

const letters = 'abcdefghijklmnopqrstuvwxyz';
const positionIds = [1, 2, 3, 4, 5, 6, 7, 8, 9];
const RETRIES = 10;

const randomGenerate = (turns: number) => {
  let count = turns;
  let letter = null;
  let posId = 0;
  let generated = [];
  while (count > 0) {
    letter = letters.charAt(Math.random() * letters.length);
    posId = positionIds[Math.floor(Math.random() * positionIds.length)];
    generated.push({letter: letter, position: posId});
    count -= 1;
  }
  return generated;
};

const givenNumberGenerate = (turns: number, nBack: number, audioMatchNumber: number, positionMatchNumber: number) => {
  let generated: Array<{letter: string, position: number}> = [];
  let pickedIndices: Array<{letterI: number, positionI: number}> = [];
  // generate random turn index and letter for audio, set its match nBack turns away
  let count = audioMatchNumber;
  let letterI = -1;
  let turnIndex = 0;
  while(count > 0) {
    letterI = Math.random() * letters.length;
    turnIndex = Math.floor(Math.random() * (turns-nBack));
    if(!pickedIndices[turnIndex])
      pickedIndices[turnIndex] = {letterI: -1, positionI: -1};
    if(!pickedIndices[turnIndex+nBack])
      pickedIndices[turnIndex+nBack] = {letterI: -1, positionI: -1};
    pickedIndices[turnIndex].letterI = letterI;
    pickedIndices[turnIndex+nBack].letterI = letterI;
  }
  // generate random turn index and position index for position, set its match nBack turns away
  count = positionMatchNumber;
  let posI = 0;
  turnIndex = 0;
  while(count>0) {
    posI = Math.floor(Math.random() * positionIds.length);
    turnIndex = Math.floor(Math.random() * (turns-nBack));
    if(!pickedIndices[turnIndex])
      pickedIndices[turnIndex] = {letterI: -1, positionI: -1};
    if(!pickedIndices[turnIndex+nBack])
      pickedIndices[turnIndex+nBack] = {letterI: -1, positionI: -1};
    pickedIndices[turnIndex].positionI = posI;
    pickedIndices[turnIndex+nBack].positionI = posI;
  }
  // fill in the rest
  generated = pickedIndices.map((val, index) => {
    // do not create any extra matches
    let invalidPositions = new Set();
    let invalidLetters = new Set();
    let pickRetries = RETRIES;
    if(index+nBack < pickedIndices.length) {
      invalidPositions.add(pickedIndices[index+nBack].positionI);
      invalidLetters.add(pickedIndices[index+nBack].letterI);
    }
    if(index-nBack >= 0) {
      invalidPositions.add(pickedIndices[index-nBack].positionI);
      invalidLetters.add(pickedIndices[index-nBack].letterI);
    }
    let state = {letter: '', position: -1};

    if(val?.letterI >= 0) {
      let letterI = Math.random() * letters.length;
      while(pickRetries > 0 && letterI in invalidLetters) {
        pickRetries -= 1;
        letterI = Math.random() * letters.length;
      }
      state.letter = letters.charAt(letterI);
    } else {
      state.letter = letters.charAt(val.letterI);
    }
    pickRetries = RETRIES;
    if(val?.positionI >= 0) {
      let positionI = Math.random() * positionIds.length;
      while(pickRetries > 0 && positionI in invalidPositions) {
        pickRetries -= 1;
        positionI = Math.random() * positionIds.length;
      }
      state.position = positionIds[positionI];
    } else {
      state.position = positionIds[val.positionI];
    }
    return state;
  })
  return generated;
};

@Component({
  selector: 'app-board',
  templateUrl: './board.component.html',
  styleUrls: ['./board.component.scss']
})
export class BoardComponent implements OnInit {
  private states: Array<{letter: string, position: number}> = [];
  private playerInputs: Array<{sameLetter: boolean, samePosition: boolean}> = [];
  private stateIndex: number = -1;

  constructor() { }

  @Input() turns: number = 30;
  @Input() mode: any = null;
  @Input() delayMs: number = 3000;
  
  @Output() finish: EventEmitter<string> = new EventEmitter<string>();

  get CurrentPosition() {
    return this.gameIsPlaying() ? this.states[this.stateIndex].position : -1;
  }

  get IsPlaying() {
    return this.gameIsPlaying();
  }

  ngOnInit(): void {
    
  }

  // call from outside with ref
  play() {
    console.log('begin');
    this.states = givenNumberGenerate(this.turns, 1, 5, 5);
    this.stateIndex = 0;
    this.playSound();
  }

  gameIsPlaying() {
    return this.stateIndex >= 0 && this.stateIndex < this.turns;
  }

  @HostListener('window:keydown.a',['$event'])
  keypressForA() {
    if(this.gameIsPlaying()) {
      this.playerInputs[this.stateIndex] = {
        ...this.playerInputs[this.stateIndex],
        sameLetter: true,
      };
    }
  }

  @HostListener('window:keydown.l',['$event'])
  keypressForL() {
    if(this.gameIsPlaying()) {
      this.playerInputs[this.stateIndex] = {
        ...this.playerInputs[this.stateIndex],
        samePosition: true,
      };
    }
  }

  playSound() {
    // play sound
    let letter, position = this.states[this.stateIndex];
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
      this.stateIndex = -1;
      console.log(this.states);
      console.log(this.playerInputs);
    }
  }

}
