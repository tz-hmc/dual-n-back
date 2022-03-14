import { Component, OnInit, Input } from '@angular/core';

export type Result = {
  AudioTP: number,
  PostionTP: number,
  AudioFP: number,
  PositionFP: number
}

@Component({
  selector: 'app-results',
  templateUrl: './results.component.html',
  styleUrls: ['./results.component.scss']
})
export class ResultsComponent implements OnInit {
  @Input() results: Array<Result> = [];

  constructor() { }

  ngOnInit(): void {
  }

}
