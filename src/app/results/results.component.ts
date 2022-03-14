import { Component, OnInit, Input } from '@angular/core';
import { Result } from '../game-grade-util';

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
