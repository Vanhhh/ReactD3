import React from 'react';
import './App.css';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import { Chart } from './Chart';
import { Pie } from './Pie';
import { DoubleChart } from './doublechart';

export class DigitalLibrariesKeywords extends React.Component {
  shouldComponentUpdate(nextProps) {
    return (
      this.props.numberOfColumns !== nextProps.numberOfColumns ||
      this.props.chartType !== nextProps.chartType
    );
  }

  render() {
    let { numberOfColumns, fulltext, abstract, chartType } = this.props; //let fulltext = this.props.fulltext;
    fulltext = fulltext.slice(0, numberOfColumns); // cat array theo do dai nguoi dung nhap
    abstract = abstract.slice(0, numberOfColumns);

    if (chartType === 'Double Chart') {
      return (
        <div>
          <h4 className='p-3 mb-2 bg-secondary text-white'>
            Digital Libraries Keywords
          </h4>
          <Row >
            <Col xs={12}>
            <DoubleChart
              id='fulltext'
              fulltext={fulltext}
              abstract={abstract}
              numberOfColumns={numberOfColumns}
            />
            </Col>
          </Row>
        </div>
      );
    }

    let fullTextChart, abstractChart;
    if (chartType === 'Bar Chart') {
      fullTextChart = (
        <Chart
          id='fulltext'
          data={fulltext}
          comparedData={abstract}
          numberOfColumns={numberOfColumns}
        />
      );
      abstractChart = (
        <Chart
          id='abstract'
          data={abstract}
          comparedData={fulltext}
          numberOfColumns={numberOfColumns}
        />
      );
    } else {
      fullTextChart = (
        <Pie type='fulltext' data={fulltext} comparedData={abstract} />
      );
      abstractChart = (
        <Pie type='abstract' data={abstract} comparedData={fulltext} />
      );
    }
    return (
      <div>
        <h4 className='p-3 mb-2 bg-secondary text-white'>
          Digital Libraries Keywords
        </h4>
        <Row>
          <Col xs={6}>
            <Row>
              <Col className='col align-self-center'>
                <h5>Fulltext:</h5>
              </Col>
            </Row>
            {fullTextChart}
          </Col>
          <Col xs={6}>
            <Row>
              <Col className='col align-self-center'>
                <h5>Abstract:</h5>
              </Col>
            </Row>
            {abstractChart}
          </Col>
        </Row>
      </div>
    );
  }
}
