import { Component, OnInit } from '@angular/core';
import { SummaryService } from '../summary.service';
import { FormControl } from '@angular/forms';

@Component({
  selector: 'app-selection-criteria-bar',
  templateUrl: './selection-criteria-bar.component.html',
  styleUrls: ['./selection-criteria-bar.component.css']
})
export class SelectionCriteriaBarComponent implements OnInit {
  date = new FormControl('yesterday');
  
  constructor(public summaryService: SummaryService) { }

  ngOnInit(): void {
  }

  onSearch() {
    this.summaryService.date = this.date.value;
  }

}
