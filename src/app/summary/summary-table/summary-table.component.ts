import { Component, OnInit } from '@angular/core';
import { SummaryService } from '../summary.service';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-summary-table',
  templateUrl: './summary-table.component.html',
  styleUrls: ['./summary-table.component.css']
})
export class SummaryTableComponent implements OnInit {

  users$: Observable<any[]>;
  userDetail$: Observable<any[]>;
  total$: Observable<number>;
  columns$: Observable<any[]>;
  detailColumns$: Observable<any[]>;
  public selectedUser = '';

  constructor(public summaryService: SummaryService) { 
    this.users$ = summaryService.users$;
    this.userDetail$ = summaryService.userDetail$;
    this.total$ = summaryService.total$;
    this.columns$ = summaryService.xref$;
    this.detailColumns$ = summaryService.detailXref$;
    this.summaryService.selectedUser.subscribe(res => {
      this.selectedUser = res;
    });
  }

  ngOnInit(): void { }

  onSelectUser(user_name: string) {
    this.selectedUser != user_name ? 
      this.summaryService.selectedUser.next(user_name) : 
      this.summaryService.selectedUser.next('');
  }

  onSort(col: string) {
    this.summaryService.sort_order = this.summaryService.sort_order == 1 ? 2 : 1;
    this.summaryService.sort_col = col;
  }
  ngOnDestroy() {
    // Clean up chart when the component is removed
    this.summaryService.selectedUser.unsubscribe()
  }

}
