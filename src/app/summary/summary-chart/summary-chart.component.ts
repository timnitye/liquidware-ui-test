import { Component, Inject, NgZone, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

// amCharts imports
import * as am4core from '@amcharts/amcharts4/core';
import * as am4charts from '@amcharts/amcharts4/charts';
import am4themes_animated from '@amcharts/amcharts4/themes/animated';
import { SummaryService } from '../summary.service';
import { Observable } from 'rxjs';


@Component({
  selector: 'app-summary-chart',
  templateUrl: './summary-chart.component.html',
  styleUrls: ['./summary-chart.component.css']
})
export class SummaryChartComponent {
  chart: any;
  selectedUser = '';
  selected = false;

  constructor(
    @Inject(PLATFORM_ID) private platformId: any, 
    private zone: NgZone,
    private summaryService: SummaryService
  ) {
    this.summaryService.selectedUser.subscribe(res => {
      this.selectedUser = res;
      this.selected = res.length > 0 ? true : false;
      console.log('chart selected', this.selected);
    });
  }

  onBack() {
    this.summaryService.selectedUser.next('');
  }

  onSelectUser(user_name: string) {
    this.selectedUser != user_name ? 
      this.summaryService.selectedUser.next(user_name) : 
      this.summaryService.selectedUser.next('');
  }

  // Run the function only in the browser
  browserOnly(f: () => void) {
    if (isPlatformBrowser(this.platformId)) {
      this.zone.runOutsideAngular(() => {
        f();
      });
    }
  }

  ngAfterViewInit() {
    this.browserOnly(() => {
      /* Chart code */
      am4core.useTheme(am4themes_animated);

      // Create chart instance
      let chart = am4core.create("chartdiv", am4charts.XYChart);
      
      // Add data
      this.summaryService.users$.subscribe(res => {
        chart.data = res.map(user => {return {"user": user.user_name, "visits": Number.parseInt(user.rank_score)}})
        console.log('chart.data', chart.data);
      });

      chart.padding(40, 40, 40, 40);
      chart.responsive.enabled = true;
      chart.scrollbarX = new am4core.Scrollbar();
      chart.scrollbarX.animationDuration = 500;
      chart.zoomOutButton.disabled = true;

      let categoryAxis = chart.xAxes.push(new am4charts.CategoryAxis());
      categoryAxis.renderer.grid.template.location = 0;
      categoryAxis.dataFields.category = "user";
      categoryAxis.renderer.minGridDistance = 60;
      categoryAxis.renderer.inversed = true;
      categoryAxis.renderer.grid.template.disabled = true;

      let valueAxis = chart.yAxes.push(new am4charts.ValueAxis());
      valueAxis.title.text = "Workload Ranking";
      valueAxis.title.fontWeight = "bold";
      valueAxis.min = 0;
      valueAxis.extraMax = 0.1;
      valueAxis.rangeChangeEasing = am4core.ease.linear;
      valueAxis.rangeChangeDuration = 1500;
      valueAxis.renderer.labels.template.fontSize = 16;

      let series = chart.series.push(new am4charts.ColumnSeries());
      series.name = "Workload Ranking";
      series.dataFields.categoryX = "user";
      series.dataFields.valueY = "visits";
      series.tooltipText = "{valueY.value}";
      series.defaultState.transitionDuration = 3000;
      series.hiddenState.transitionDuration = 3000;
      series.sequencedInterpolation = true;
      series.columns.template.strokeOpacity = 0;
      series.columns.template.column.cornerRadiusTopRight = 10;
      series.columns.template.column.cornerRadiusTopLeft = 10;
      series.columns.template.focusable = true;
      series.columns.template.hoverOnFocus = true;

      // on click event
      series.columns.template.events.once("hit", function(ev) {
        let user_name: any = ev.target.dataItem?.categories["categoryX"];
        this.onSelectUser(user_name);
        this.summaryService.userDetail$.subscribe(res => {
          chart.data = res.map(user => {return {"user": user.end_date, "visits": Number.parseInt(user.rank_score)}})
        });
      }, this);
      series.columns.template.events.on("hit", function(ev) {
        let user_name: any = ev.target.dataItem?.categories["categoryX"];
        this.onSelectUser(user_name);
      }, this);
      let labelBullet = series.bullets.push(new am4charts.LabelBullet());
      labelBullet.label.verticalCenter = "bottom";
      labelBullet.label.dy = -10;
      labelBullet.label.text = "{values.valueY.workingValue.formatNumber('#.')}";

      this.chart = chart;
    });
  }

  ngOnDestroy() {
    // Clean up chart when the component is removed
    this.browserOnly(() => {
      if (this.chart) {
        this.chart.dispose();
      }
    });
    this.summaryService.selectedUser.unsubscribe()
  }
}
