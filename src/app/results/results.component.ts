import { Component, OnInit, Input, ViewChild, SimpleChange } from '@angular/core';
import { MatTable } from '@angular/material/table';
import { Result } from '../game-grade-util';
import { ResultDataSource } from '../result-data-source';

function format(num: number) {
  return num.toPrecision(4);
}

function TPR(TP: number, FN: number): number {
  return TP/(TP + FN);
}

function FPR(FP: number, TN: number): number {
  return FP/(FP + TN); 
}

function AudioTPR(element: Result) {
  return TPR(element.audioTP, element.audioFN);
}

function AudioFPR(element: Result) {
  return FPR(element.audioFP, element.audioTN);
}

function PositionTPR(element: Result) {
  return TPR(element.positionTP, element.positionFN);
}

function PositionFPR(element: Result) {
  return FPR(element.positionFP, element.positionTN);
}

@Component({
  selector: 'app-results',
  templateUrl: './results.component.html',
  styleUrls: ['./results.component.scss']
})
export class ResultsComponent implements OnInit {
  @Input() results: ResultDataSource;
  @ViewChild(MatTable) table: MatTable<Result>;

  get DisplayedColumns() {
    return ['nBackLevel', 'audioTPR', 'positionTPR', 'audioFPR', 'positionFPR'];
  }

  get Datasource() {
    return this.results;
  }

  badAudioTPR(element: Result) {
    return AudioTPR(element) <= 0.3;
  }

  goodAudioTPR(element: Result) {
    return AudioTPR(element) >= 0.8;
  }

  badPositionTPR(element: Result) {
    return AudioTPR(element) <= 0.3;
  }

  goodPositionTPR(element: Result) {
    return AudioTPR(element) >= 0.8;
  }

  badAudioFPR(element: Result) {
    return AudioFPR(element) >= 0.2;
  }

  goodAudioFPR(element: Result) {
    return AudioFPR(element) <= 0.1;
  }

  badPositionFPR(element: Result) {
    return AudioFPR(element) >= 0.2;
  }

  goodPositionFPR(element: Result) {
    return AudioFPR(element) <= 0.1;
  }

  AudioTPRString(element: Result) {
    return `${element.audioTP}/${element.audioTP + element.audioFN} (${format(AudioTPR(element)*100)}%)`;
  }

  PositionTPRString(element: Result) {
    return `${element.positionTP}/${element.positionTP+element.positionFN} (${format(PositionTPR(element)*100)}%)`;
  }

  AudioFPRString(element: Result) {
    return `${element.audioFP}/${(element.audioFP+element.audioTN)} (${format(AudioFPR(element)*100)}%)`;
  }

  PositionFPRString(element: Result) {
    return `${element.positionFP}/${(element.positionFP+element.positionTN)} (${format(PositionFPR(element)*100)}%)`;
  }

  constructor() { }

  ngOnInit(): void {
  }
}
