import React from 'react';
import * as d3 from 'd3';
import './App.css';
import ReactFauxDOM from 'react-faux-dom';
import { schemeSpectral } from 'd3-scale-chromatic';

export class Chart extends React.Component {
  render() {
    const margin = { top: 80, right: 200, bottom: 200, left: 100 };
    const width = 900 - margin.left - margin.right;
    const height = 700 - margin.top - margin.bottom;

    // data used to decide which color has the bar
    const comparedNames = this.props.comparedData.map(x => x.name); //comparedNames: filter just names from comparedData
    const sharedData = this.props.data.filter(
      //sharedData: filter from comparedNames the names which appear more than one
      x => comparedNames.indexOf(x.name) >= 0
    );

    const xScale = d3
      .scaleBand()
      .range([0, width])
      .round(true)
      .paddingInner(0.1); // space between bars (it's a ratio)

    const yScale = d3.scaleLinear().range([height, 0]);
    //xAxis stays in the bottom
    const xAxis = d3.axisBottom().scale(xScale);
    //yAxis stays on the left
    const yAxis = d3.axisLeft().scale(yScale);
    // chart container
    const container = new ReactFauxDOM.Element('div');
    // color
    const color = d3.scaleOrdinal(schemeSpectral[11]);

    const svg = d3
      .select(container)
      .append('svg')
      .attr('width', width + margin.left + margin.right)
      .attr('height', height + margin.top + margin.bottom)
      .append('g')
      .attr('transform', `translate(${margin.left}, ${margin.right})`);

    const tooltip = d3
      .select('body')
      .append('div')
      .attr('class', 'tooltip')
      .style('opacity', 0);

    xScale.domain(this.props.data.map(d => d.name));
    yScale.domain([0, d3.max(this.props.data, d => d.score)]);
    //name label
    svg
      .append('g')
      .attr('class', 'x axis')
      .attr('transform', `translate(0, ${height})`)
      .call(xAxis)
      .selectAll('text')
      .attr('y', 0)
      .attr('x', 9)
      .attr('dy', '.35em')
      .attr('transform', 'rotate(50)')
      .style('text-anchor', 'start');
    //label: weight
    svg
      .append('g')
      .attr('class', 'y axis')
      .call(yAxis)
      .append('text')
      .attr('transform', 'rotate(-90)')
      .attr('y', 6)
      .attr('dy', '.71em')
      .style('text-anchor', 'end')
      .text('weight');
    //bar
    svg
      .selectAll('.bar')
      .data(this.props.data)
      .enter()
      .append('rect') //bar is basically a rectangle shape
      .attr('class', d => d.name) // add class name to bar
      .attr('x', d => xScale(d.name)) //name of data is on xScale
      .attr('width', xScale.bandwidth())
      .attr('y', d => yScale(d.score)) //value of data is on yScale
      .attr('height', d => height - yScale(d.score))
      .attr('fill', (d, index) => {
        //if the names are exactly the same. then fill the bar with the same color, or else fill it grey (#666)
        if (sharedData.indexOf(d) >= 0) {
          return color(index);
        } else {
          return '#666';
        }
      })

      .on('mouseover', (d, i) => {
        const otherData = this.props.comparedData.filter(
          data => data.name === d.name
        )[0];
        //tooltip to make an interaction with hover to change color of a bar when there is a mouse over, and mouse out to return the original status
        tooltip
          .transition()
          .duration(500)
          .style('opacity', 0.9);

        let tooltipHtmlContent = '';

        if (this.props.id === 'fulltext') {
          if (otherData) {
            tooltipHtmlContent = `Fulltext: <br> name: ${
              d.name
            } <br> weight: <span>${d.score}</span> <br> Abstract: <br> name: ${
              otherData.name
            } <br> weight: <span>${otherData.score}</span>`;
          } else {
            tooltipHtmlContent = `Fulltext: <br> name: ${
              d.name
            } <br> weight: <span>${d.score}</span>`;
          }
        } else {
          if (otherData) {
            tooltipHtmlContent = `Abstract: <br> name: ${
              d.name
            } <br> weight: <span>${d.score}</span> <br> Fulltext: <br> name: ${
              otherData.name
            } <br> weight: <span>${otherData.score}</span>`;
          } else {
            tooltipHtmlContent = `Abstract: <br> name: ${
              d.name
            } <br> weight: <span>${d.score}</span>`;
          }
        }
        tooltip.html(tooltipHtmlContent).style('top', `350px`);
        d3.selectAll('.' + d.name).style('fill', '#17bf3c');
      })

      .on('mouseout', (d, index) => {
        tooltip
          .transition()
          .duration(500)
          .style('opacity', 0);
        d3.selectAll('.' + d.name).style(
          'fill',
          sharedData.indexOf(d) >= 0 ? color(index) : ''
        );
      });

    return (
      <div id={this.props.id} className='chart'>
        {container.toReact()}
      </div>
    );
  }
}
