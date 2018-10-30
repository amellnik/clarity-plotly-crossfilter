import { Component, OnInit } from '@angular/core';
import Plotly from 'plotly.js';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {

  constructor() { }

  data = <any>[];
  selected_data = <any>[];
  gender_summary = <any>[];
  scatter:any = {};
  histogram:any = {};



  loading = true;

  ngOnInit() {
    Plotly.d3.csv('https://raw.githubusercontent.com/washingtonpost/data-police-shootings/master/fatal-police-shootings-data.csv')
      .get((error, rows) => {
        if (error) {
          console.log(error)
        } else {
          this.data = rows;
          console.log(this.data)
          this.loading = false;
          this.drawPlots();
        }
      });
  }

  drawPlots() {
    this.drawScatter();
    this.drawHistogram();
  }

  drawScatter() {
    this.scatter = {
      data: [{
        mode: 'markers',
        x: this.data.map(x => x.date),
        y: this.data.map(x => x.age)
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
      .entries(this.data)
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

  handleSelecting(event: any) {
    console.log('Selecting event:')
    console.log(event)
  }



}
