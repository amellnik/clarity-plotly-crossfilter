import { Component, OnInit } from '@angular/core';
import Debounce from 'debounce-decorator'

import Plotly from 'plotly.js';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {

  constructor() { }

  // Data
  data = <any>[];
  // selected_data = <any>[];
  filtered_data = <any>[];

  gender_summary = <any>[];

  // Plot objects
  scatter:any = {};
  histogram:any = {};

  // Required by https://github.com/amellnik/clarity-plotly-crossfilter/issues/1
  last_selection_data:any = {};

  active_filters = <any>[];

  // States
  loading = true;
  outliers_filter_val = 'false';

  ngOnInit() {
    Plotly.d3.csv('https://raw.githubusercontent.com/washingtonpost/data-police-shootings/master/fatal-police-shootings-data.csv')
      .get((error, rows) => {
        if (error) {
          console.log(error)
        } else {
          this.data = rows.map((x,i) => {
            x.flagged = false;
            x.uid = i;
            return x;
          });
          console.log(this.data)
          this.applyFilters();
          this.loading = false;
          this.drawPlots();
        }
      });
  }

  drawPlots() {
    this.drawScatter();
    this.drawHistogram();
  }

  applyFilters() {
    this.filtered_data = this.data.filter(x => {
      for (let f of this.active_filters) {
        if !(x[f.property].toString().toLowerCase().includes(f.value.toLowerCase())) {
          return false;
        }
      }
      return true;
    });
    console.log('Filtered data: ')
    console.log(this.filtered_data);
  }

  drawScatter() {
    this.scatter = {
      data: [{
        mode: 'markers',
        x: this.filtered_data.map(x => x.date),
        y: this.filtered_data.map(x => x.age),
        customdata: this.filtered_data
      }],
      layout: {
        xaxis: {
          type: 'date',
          title: 'Date'
        },
        yaxis: {
          title: 'Age'
        }
      }
    };
  }

  drawHistogram() {
    this.gender_summary = Plotly.d3.nest()
      .key(x => x.gender)
      .entries(this.filtered_data)
      .filter(x => x.key != '')
      .map(o => Object.assign(o.values, {gender: o.key}))
    // console.log(this.gender_summary)

    this.histogram = {
      data: this.gender_summary.map(g => {
        return {
          x: g.map(x => x.age),
          type: 'histogram',
          name: g[0].gender
        }
      }),
      layout: {
        barmode: 'stack',
        xaxis: {
          title: 'Age'
        },
        yaxis: {
          title: 'Count'
        }
      }
    };
    // console.log(this.histogram)
  }


  handleSelection(event: any) {
    console.log('Selection event:')
    console.log(event)
  }

  @Debounce(500)
  handleSelecting(event: any) {
    console.log('Selecting event:')
    console.log(event)
    this.last_selection_data = event;
  }

  flagPoints() {
    this.last_selection_data.points.forEach(x => {
      this.data[x.customdata.uid].flagged = true;
    })
    this.applyFilters();
    this.drawPlots();
  }

  unflagAllPoints() {
    this.data = this.data.map(x => {
      x.flagged = false;
      return x;
    })
    this.applyFilters();
    this.drawPlots();
  }

  @Debounce(500)
  dgRefresh(event: any) {
    console.log('Datagrid refresh event:')
    console.log(event)

    if (event['filters']) {
      this.active_filters = event.filters;
      this.applyFilters();
      this.drawPlots();
    } else {
      this.active_filters = [];
    }
  }

}
