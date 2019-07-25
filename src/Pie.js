import * as React from 'react';
import { Component } from 'react';
import * as d3 from 'd3';
import ReactFauxDOM from 'react-faux-dom';
import './Pie.css';
import { schemeRdYlBu } from 'd3-scale-chromatic';
export class Pie extends Component {
  render() {
    const margin = { top: 10, right: 200, bottom: 10, left: 300 };
    const width = 1100 - margin.left - margin.right;
    const height = 1000 - margin.top - margin.bottom;

    // names
    const names = this.props.data.map(x => x.name);
    // data used to decide which color has the bar
    const comparedNames = this.props.comparedData.map(x => x.name); //comparedNames: to pair names that are the same
    const sharedData = this.props.data
      .filter(
        //sharedData: to have the same colour for that same pair of names
        x => comparedNames.indexOf(x.name) >= 0
      )
      .map(x => x.name);
    // chart container
    const container = new ReactFauxDOM.Element('div');
    container.setAttribute('class', 'pie-chart');
    // define data
    var dataset = this.props.data;
    var total = d3.sum(dataset.map(d => d.score));
    // typeOfData
    let type = this.props.type;

    // chart dimensions

    // a circle chart needs a radius
    var radius = Math.min(width, height) / 2;

    // legend dimensions
    var legendRectSize = 10; // defines the size of the colored squares in legend
    var legendSpacing = 5; // defines spacing between squares

    // define color scale
    var color = d3.scaleOrdinal(schemeRdYlBu[11]);

    var svg = d3
      .select(container) // select element in the DOM with id 'chart'
      .attr('position', 'absolute')
      .append('svg') // append an svg element to the element we've selected
      .attr('width', width + 100) // set the width of the svg element we just added
      .attr('height', height) // set the height of the svg element we just added
      .append('g') // append 'g' element to the svg element
      .attr('transform', 'translate(' + width / 2 + ',' + height / 2 + ')'); // our reference is now to the 'g' element. centerting the 'g' element to the svg element

    var arc = d3
      .arc()
      .innerRadius(150) // a hole inside the pie chart for donut chart
      .outerRadius(radius - 50); // size of overall chart

    var pie = d3
      .pie() // start and end angles of the segments
      .value(function(d) {
        return d.score;
      }) // how to extract the numerical data from each entry in our dataset
      .sort(null); // by default, data sorts in oescending value. this will mess with our animation so we set it to null

    // define tooltip
    let tooltip = d3
      .select('body') // select element in the DOM with id 'chart'
      .append('div') // append a div element to the element we've selected
      .style('opacity', 0)
      .style('top', '100')
      .style('left', '100')
      .attr('class', 'tooltip-' + type); // add class 'tooltip' on the divs we just selected
    // .attr('class', 'tooltip-piechart');
    tooltip
      .append('div') // add divs to the tooltip defined above
      .attr('class', 'name'); // add class 'name' on the selection

    tooltip
      .append('div') // add divs to the tooltip defined above
      .attr('class', 'score'); // add class 'score' on the selection

    tooltip
      .append('div') // add divs to the tooltip defined above
      .attr('class', 'percent'); // add class 'percent' on the selection

    dataset.forEach(function(d) {
      d.score = +d.score; // calculate score as we iterate through the data
      d.enabled = true; // add enabled property to track which entries are checked
    });

    // creating the chart
    svg
      .selectAll('path') // select all path elements inside the svg. specifically the 'g' element. they don't exist yet but they will be created below
      .data(pie(dataset)) //associate dataset wit he path elements we're about to create. must pass through the pie function. it magically knows how to extract values and bakes it into the pie
      .enter() //creates placeholder nodes for each of the values
      .append('path') // replace placeholders with path elements
      .attr('d', arc) // define d attribute with arc function above
      .attr('fill', function(d, index) {
        if (sharedData.indexOf(d.data.name) >= 0) {
          return color(d.data.name);
        } else {
          return '#98CAD9';
        }
      })
      .attr('class', function(d) {
        return d.data.name;
      });
    // mouse event handlers are attached to path so they need to come after its definition
    svg
      .selectAll('path')
      .on('mouseover', function(d) {
        // when mouse enters div
        var total = d3.sum(
          dataset.map(function(d) {
            // calculate the total number of tickets in the dataset
            return d.enabled ? d.score : 0; // checking to see if the entry is enabled. if it isn't, we return 0 and cause other percentages to increase
          })
        );
        let percent = Math.round((1000 * d.data.score) / total) / 10; // calculate percent
        svg.select('.name').html(d.data.name); // set current name
        svg.select('.score').html('$' + d.data.score); // set current score
        svg.select('.percent').html(percent + '%'); // set percent calculated above
        // tooltip
        d3.select('.tooltip-' + type)
          .transition()
          .duration(100)
          .style('opacity', 1);
        d3.select('.tooltip-' + type)
          .html(`<div>${d.data.name}: ${d.data.score}<br> ${percent}%</div>`)
          .style('position', 'absolute')
          .style('font-weight', 'bold')
          .style('color', '#333')
          .style('padding', '20px')
          .style('text-align', 'center')
          .style('width', '200px');
        // make 2 pie with the same name have the same color
        d3.selectAll('.' + d.data.name).attr('fill', 'green');
      })
      .on('mouseout', function(d, index) {
        // when mouse leaves div
        d3.select('.tooltip-' + type).style('opacity', '0'); // hide d3.select('.tooltip-' + type) for that element
        d3.selectAll('.' + d.data.name).attr(
          'fill',
          sharedData.indexOf(d.data.name) >= 0 ? color(index) : '#98CAD9'
        );
      })
      .on('mousemove', d => {
        d3.select('.tooltip-' + type)
          .style('top', '150px')
          .style('left', width + 'px');
        const otherData = this.props.comparedData.filter(
          x => x.name === d.data.name
        )[0];
        console.log(otherData);

        // when mouse moves. change tooltip's position
        if (type === 'fulltext') {
          // tooltip for abstract
          d3.select('.tooltip-abstract').style('opacity', '1');
          d3.select('.tooltip-abstract')
            .style('top', height * 0.62 + 'px')
            .style('left', '1150px');
          if (otherData) {
            let percent = Math.round((1000 * otherData.score) / total) / 10;
            d3.select('.tooltip-abstract')
              .html(
                `<div>${otherData.name}: ${
                  otherData.score
                }<br> ${percent}%</div>`
              )
              .style('position', 'absolute')
              .style('font-weight', 'bold')
              .style('color', '#333')
              .style('padding', '20px')
              .style('text-align', 'center')
              .style('width', '200px');
          } else {
            d3.select('.tooltip-abstract').style('opacity', 0);
          }
          // tooltip for fulltext
          d3.select('.tooltip-' + type)
            .style('top', height * 0.62 + 'px')
            .style('left', '190px');
        } else {
          // tooltip for fulltext
          d3.select('.tooltip-fulltext').style('opacity', '1');
          d3.select('.tooltip-fulltext')
            .style('top', height * 0.62 + 'px')
            .style('left', '190px');
          if (otherData) {
            let percent = Math.round((1000 * otherData.score) / total) / 10;
            d3.select('.tooltip-fulltext')
              .html(
                `<div>${otherData.name}: ${
                  otherData.score
                }<br> ${percent}%</div>`
              )
              .style('position', 'absolute')
              .style('font-weight', 'bold')
              .style('color', '#333')
              .style('padding', '20px')
              .style('text-align', 'center')
              .style('width', '200px');
          } else {
            d3.select('.tooltip-fulltext').style('opacity', 0);
          }
          // tooltip for abstract
          d3.select('.tooltip-' + type)
            .style('top', height * 0.62 + 'px')
            .style('left', '1150px');
        }
      });

    // define legend
    var legend = svg
      .selectAll('.legend')
      .data(names) // refers to an array of names from our dataset
      .enter() // creates placeholder
      .append('g') // replace placeholders with g elements
      .attr('class', 'legend') // each g is given a legend class
      .attr('transform', function(d, i) {
        var height = legendRectSize + legendSpacing; // height of element is the height of the colored square plus the spacing
        var offset = (height * color.domain().length) / 2; // vertical offset of the entire legend = height of a single element & half the total number of elements
        var horz = 27 * legendRectSize; // the legend is shifted to the left to make room for the text
        var vert = i * height - offset - 20; // the top of the element is hifted up or down from the center using the offset defiend earlier and the index of the current element 'i'
        return 'translate(' + horz + ',' + vert + ')'; //return translation
      });
    // adding colored squares to legend
    legend
      .append('rect') // append rectangle squares to legend
      .attr('width', legendRectSize) // width of rect size is defined above
      .attr('height', legendRectSize) // height of rect size is defined above
      .attr('fill', function(d, index) {
        if (sharedData.indexOf(d) >= 0) {
          return color(d);
        } else {
          return '#98CAD9';
        }
      });

    // adding text to legend
    legend
      .append('text')
      .attr('x', legendRectSize + legendSpacing)
      .attr('y', legendRectSize - legendSpacing)
      .text(function(d) {
        return d;
      }); // return name

    return <div>{container.toReact()}</div>;
  }
}
