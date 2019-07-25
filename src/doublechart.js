import React from 'react';
import * as d3 from 'd3';
import ReactFauxDOM from 'react-faux-dom';
import './App.css';
// double sided chart https://bl.ocks.org/kaijiezhou/bac86244017c850034fe
export class DoubleChart extends React.Component {
  render() {
    // chart container
    const container = new ReactFauxDOM.Element('div');
    container.setAttribute('class', 'double-chart');

    const labelArea = 90;
    const width = 700;
    const bar_height = 5;
    const height = bar_height * 200;
    // const margin = { top: 80, right: 200, bottom: 200, left: 100 };
    // const width = 900 - margin.left - margin.right;
    // const height = 700 - margin.top - margin.bottom;
    const rightOffset = width + labelArea;

    const lCol = 'abstract';
    const rCol = 'fulltext';
    var xFrom = d3.scaleLinear().range([0, width]);
    var xTo = d3.scaleLinear().range([0, width]);
    var y = d3.scaleBand().rangeRound([10, height]); 

    let data = [];
    let abstract = [...this.props.abstract];
    const abstractNames = this.props.abstract.map(x => x.name);

    this.props.fulltext.forEach(f => {
      const index = abstractNames.indexOf(f.name);
      if (index > -1) {
        data.push({
          name: f.name,
          fulltext: f.score,
          abstract: this.props.abstract[index].score
        });
        abstract.splice(index, 1);
      } else {
        data.push({ name: f.name, fulltext: f.score, abstract: 0 });
      }
    });

    abstract.forEach(a =>
      data.push({ name: a.name, fulltext: 0, abstract: a.score })
    );

    // data.sort((a, b) => {
    //     if (a.fulltext > b.fulltext) {
    //         return 1; 
    //     } else if (a.fulltext < b.fulltext) {
    //         return -1;
    //     } else {
    //         if (a.abstract > b.abstract) {
    //             return 1; 
    //         } else if (a.abstract < b.abstract) {
    //             return -1; 
    //         } else {
    //             return 0; 
    //         }
    //     }
    // })
    console.log('data', data);

    const doublechart = d3
      .select(container)
      .append('svg')
      .attr('class', 'doublechart')
      .attr('width', labelArea + width + width)
      .attr('height', height);

    xFrom.domain(
      d3.extent(data, function(d) {
        return d[lCol];
      })
    );
    xTo.domain(
      d3.extent(data, function(d) {
        return d[rCol];
      })
    );

    y.domain(
      data.map(function(d) {
        return d.name;
      })
    );

    const yPosByIndex = function(d) {
      return y(d.name);
    };
    doublechart
      .selectAll('rect.left')
      .data(data)
      .enter()
      .append('rect')
      .attr('x', function(d) {
        return width - xFrom(d[lCol]);
      })
      .attr('y', yPosByIndex)
      .attr('class', 'left')
      .attr('width', function(d) {
        return xFrom(d[lCol]);
      })
      .attr('height', y.bandwidth());
    doublechart
      .selectAll('text.leftscore')
      .data(data)
      .enter()
      .append('text')
      .attr('x', function(d) {
        return width - xFrom(d[lCol]) - 40;
      })
      .attr('y', function(d) {
        return y(d.name) + y.bandwidth() / 2;
      })
      .attr('dx', '20')
      .attr('dy', '.36em')
      .attr('text-anchor', 'end')
      .attr('class', 'leftscore')
      .text(function(d) {
        return d[lCol];
      });
    doublechart
      .selectAll('text.name')
      .data(data)
      .enter()
      .append('text')
      .attr('x', labelArea / 2 + width)
      .attr('y', function(d) {
        return y(d.name) + y.bandwidth() / 2;
      })
      .attr('dy', '.20em')
      .attr('text-anchor', 'middle')
      .attr('class', 'name')
      .text(function(d) {
        return d.name;
      });

    doublechart
      .selectAll('rect.right')
      .data(data)
      .enter()
      .append('rect')
      .attr('x', rightOffset)
      .attr('y', yPosByIndex)
      .attr('class', 'right')
      .attr('width', function(d) {
        return xTo(d[rCol]);
      })
      .attr('height', y.bandwidth());
    doublechart
      .selectAll('text.score')
      .data(data)
      .enter()
      .append('text')
      .attr('x', function(d) {
        return xTo(d[rCol]) + rightOffset + 60;
      })
      .attr('y', function(d) {
        return y(d.name) + y.bandwidth() / 2;
      })
      .attr('dx', -5)
      .attr('dy', '.36em')
      .attr('text-anchor', 'end')
      .attr('class', 'score')
      .text(function(d) {
        return d[rCol];
      });
    doublechart
      .append('text')
      .attr('x', width / 3)
      .attr('y', 12)
      .attr('class', 'title')
      .text('Abstract');
    doublechart
      .append('text')
      .attr('x', width / 3 + rightOffset)
      .attr('y', 12)
      .attr('class', 'title')
      .text('Fulltext');
    doublechart
      .append('text')
      .attr('x', width + labelArea / 3)
      .attr('y', 12)
      .attr('class', 'title')
      .text('Name');

    return <div>{container.toReact()}</div>;
  }
}
