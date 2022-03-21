import { DataSource } from "@angular/cdk/collections";
import { ReplaySubject, Observable } from "rxjs";
import { Result } from "./game-grade-util";

export class ResultDataSource extends DataSource<Result> {
  private _dataStream = new ReplaySubject<Result[]>();

  constructor(initialData: Result[]) {
    super();
    this.setData(initialData);
  }

  connect(): Observable<Result[]> {
    return this._dataStream;
  }

  disconnect() {}

  setData(data: Result[]) {
    this._dataStream.next(data);
  }
}
