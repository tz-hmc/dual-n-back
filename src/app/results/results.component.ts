import { Component, OnInit, Input, ViewChild, SimpleChange } from '@angular/core';
import { MatTable } from '@angular/material/table';
import { Result } from '../game-grade-util';
import { ResultDataSource } from '../result-data-source';

@Component({
  selector: 'app-results',
  templateUrl: './results.component.html',
  styleUrls: ['./results.component.scss']
})
export class ResultsComponent implements OnInit {
  @Input() results: ResultDataSource;
  @ViewChild(MatTable) table: MatTable<Result>;

  get DisplayedColumns() {
    return ['audioTPR', 'positionTPR', 'audioFPR', 'positionFPR'];
  }

  get Datasource() {
    return this.results;
  }

  constructor() { }

  ngOnInit(): void {
  }
}
