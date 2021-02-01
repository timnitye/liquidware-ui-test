import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject } from 'rxjs';

interface State {
  date: string;
  limit: number;
  page: number;
  sort_col: string;
  sort_order: number;
}

@Injectable({
  providedIn: 'root'
})
export class SummaryService {
  private apiUrl: string = 'https://demo.liquidware.com/lwl/api?json=';
  private users = new BehaviorSubject<any[]>([]);
  private userDetail = new BehaviorSubject<any[]>([]);
  private total = new BehaviorSubject<number>(0);
  private xref = new BehaviorSubject<any[]>([]);
  private detailXref = new BehaviorSubject<any[]>([]);
  public selectedUser = new BehaviorSubject<string>('');

  private _state: State = {
    date: 'yesterday',
    limit: 10,
    page: 1,
    sort_col: 'rank_score',
    sort_order: 2
  };

  constructor(
    private http: HttpClient
  ) { 
    this.selectedUser.subscribe(res => {
      if(res.length > 0) {
        this.getUserDetail(res);
      } else {
        this.getUsers();
      }
    });
  }

  get users$() { return this.users.asObservable(); }
  get userDetail$() { return this.userDetail.asObservable(); }
  get total$() { return this.total.asObservable(); }
  get xref$() { return this.xref.asObservable(); }
  get detailXref$() { return this.detailXref.asObservable(); }
  get page() { return this._state.page; }
  get limit() { return this._state.limit; }
  get date() { return this._state.date; }

  set page(page: number) { this._set({page}); }
  set limit(limit: number) { this._set({limit}); }
  set sort_col(sort_col: string) { this._set({sort_col}); }
  set sort_order(sort_order: number) { this._set({sort_order}); }
  set date(date: string) { this._set({date}); }

  private _set(patch: Partial<State>) {
    Object.assign(this._state, patch);
    this.getUsers();
  }
  
  getUsers() {
    const searchCriteria = {
      "inspector": "0",
      "basis": "users",
      "columns": "record_count,cpu_used_mhz,rank_score,memory_used_mb,page_used_mb,total_io_bps,total_iops,net_total_bps,cpu_context_switching_avg,swap_page_faults,page_faults,node_count,user_count,cid_seconds",
      "date": this._state.date,
      "limit": this._state.limit,
      "page": this._state.page,
      "sort_col": this._state.sort_col,
      "sort_order": this._state.sort_order
    };
    return this.http.get<any>(`${this.apiUrl}${JSON.stringify(searchCriteria)}`)
      .subscribe(
        res => {
          this.users.next(res["table"]);
          this.total.next(res["total_rows"]);
          this.xref.next(Object.entries(res["xref"]));
          console.log('getUsers()', res);
        },
        error => {
          console.log('getUsers() error', error);
        }
      );;
  }

  getUserDetail(username: string) {
    const searchCriteria = {
      "inspector": "0",
      "basis": "users",
      "resolution": "hourly",
      "columns": "record_count,cpu_used_mhz,rank_score,memory_used_mb,page_used_mb,total_io_bps,total_iops,net_total_bps,cpu_context_switching_avg,swap_page_faults,page_faults,node_count,user_count,cid_seconds",
      "date": this._state.date,
      "limit": "0",
      "sort_col": "end_date",
      "sort_order": "1",
      "user_name": username
    };
    return this.http.get<any>(`${this.apiUrl}${JSON.stringify(searchCriteria)}`)
      .subscribe(
        res => {
          this.userDetail.next(res["table"]);
          this.detailXref.next(Object.entries(res["xref"]));
          console.log('userDetail', this.userDetail.value);
        },
        error => {
          console.log('userDetail', error);
        }
      );
  }
}
