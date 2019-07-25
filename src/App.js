import React from 'react';
import './App.css';
import { Route} from 'react-router-dom';
import Form from 'react-bootstrap/Form';
import Navbar from 'react-bootstrap/Navbar';
import Nav from 'react-bootstrap/Nav';
import { UnsupervisedLearningKeywords } from './unsupervisedLearningKeywords'; 
import { DigitalAnalyticsKeywords } from './DigitalAnalyticsKeywords'; 
import { DigitalLibrariesKeywords } from './DigitalLibrariesKeywords'; 

class App extends React.Component {
  constructor() {
    super();
    this.state = {
      numberOfColumns: 50,
      chartType: 'Bar Chart'
    };
  }

  render() {
  
    return (
      <div id='chart'>
        <Navbar bg='dark' variant='dark'>
          <Navbar.Brand>Comparative Visualization</Navbar.Brand>
          <Nav className='mr-auto'>
            <Nav.Link 
              href='/'
              className='text-white bg-dark'
            >
              Digital Analytics Keywords
            </Nav.Link>
            <Nav.Link
              href='digitalLibrariesKeywords'
              className='text-white bg-dark'
            >
              Digital Libraries Keywords
            </Nav.Link>
            <Nav.Link
              href='unsupervisedLearningKeywords'
              className='text-white bg-dark'
            >
              Unsupervised Learning Keywords
            </Nav.Link>

            <Form.Group controlId='exampleForm.ControlSelect1'>
              <Form.Label className='text-white bg-dark'>
                Number of values
              </Form.Label>
              <Form.Control
                as='select'
                onChange={e =>
                  this.setState({ numberOfColumns: e.target.value })
                }
                value={this.state.numberOfColumns}
              >
                <option value='10'>10</option>
                <option value='20'>20</option>
                <option value='30'>30</option>
                <option value='40'>40</option>
                <option value='50'>50</option>
              </Form.Control>
            </Form.Group>

            <Form.Group controlId='exampleForm.ControlSelect1'>
              <Form.Label className='text-white bg-dark'>
                Change Chart Type
              </Form.Label>
              <Form.Control
                as='select'
                onChange={e =>
                  this.setState({ chartType: e.target.value })
                }
                value={this.state.chartType}
              >
                <option value='Bar Chart'>Bar chart</option>
                <option value='Pie Chart'>Pie chart</option>
                <option value='Double Chart'>Double sided chart</option>
              </Form.Control>
            </Form.Group>
          
          </Nav>
        </Navbar>
        <Route
         exact path='/'
          render={props => (
            <DigitalAnalyticsKeywords
              {...props}
              isauthed={true}
              numberOfColumns={this.state.numberOfColumns}
              chartType={this.state.chartType}
              fulltext={this.props.fulltext1}
              abstract={this.props.abstract1}
            />
          )}
        />
        <Route
          path='/digitalLibrariesKeywords'
          render={props => (
            <DigitalLibrariesKeywords
              {...props}
              isauthed={true}
              numberOfColumns={this.state.numberOfColumns}
              chartType={this.state.chartType}
              fulltext={this.props.fulltext2}
              abstract={this.props.abstract2}
            />
          )}
        />
        <Route
          path='/unsupervisedLearningKeywords'
          render={props => (
            <UnsupervisedLearningKeywords
              {...props}
              isauthed={true}
              numberOfColumns={this.state.numberOfColumns}
              chartType={this.state.chartType}
              fulltext={this.props.fulltext3}
              abstract={this.props.abstract3}
            />
          )}
        />
       
      </div>
    );
  }
}

export default App;