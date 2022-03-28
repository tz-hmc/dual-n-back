import { DataSource } from "@angular/cdk/collections";
import { ReplaySubject, Observable } from "rxjs";
import { ResultRow } from "./game-grade-util";

export class ResultDataSource extends DataSource<ResultRow> {
  private _dataStream = new ReplaySubject<ResultRow[]>();

  constructor(initialData: ResultRow[]) {
    super();
    this.setData(initialData);
  }

  connect(): Observable<ResultRow[]> {
    return this._dataStream;
  }

  disconnect() {}

  setData(data: ResultRow[]) {
    this._dataStream.next(data);
  }
}
