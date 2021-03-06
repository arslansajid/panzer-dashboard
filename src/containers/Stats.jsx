import React from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import Cookie from 'js-cookie';
import { API_END_POINT } from '../config';
const token = Cookie.get('panzer_access_token');

// import {Pagination} from 'react-bootstrap';
// import LineChart from '../components/LineChart'
// import PieChart from '../components/PieChart'
// import BarChart from '../components/BarChart'
// import Doughnut from '../components/Doughnut'

export default class Area extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      exercises: [],
      programs: [],
    }
  }
  componentWillMount() {
      axios.get(`${API_END_POINT}/api/v1/exercise`)
      .then(response => {
        this.setState({
          exercises: response.data.data,
          loading: false,
          responseMessage: 'No Exercise Found'
        })
      })
      .catch(err => {
        console.log("error fetching data");
      })
      axios.get(`${API_END_POINT}/api/v1/program`)
      .then(response => {
        this.setState({
          programs: response.data.program_set,
          responseMessage: 'No Programs Found...'
        })
      })
      .catch(err => {
        console.log("error fetching data");
      })
  }

  render() {
    const { exercises, programs } = this.state;
    return (
      <div className="row">
        <div className="col-12">
          <div className="row">
            <div className="col-sm-4">
            </div>
            <div className="col-sm-4 pull-right mobile-space">
            </div>
          </div>
          <div className="text-center space-2">
          </div>
            <div className = 'row space-1'>
              <div className='col-sm-6'>
                <h3 className='space-1'>Total Programs</h3>
                <h5>{programs.length ? programs.length : "Fetching programs..."}</h5>
                {/* <Doughnut className='chart' data={[1,2,3,4,5,6,7]} labels={['Mon','Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']}/> */}
              </div>
              <div className='col-sm-6 '>
                <h3 className='space-1'>Total Exercises</h3>
                <h5>{exercises.length ? exercises.length : "Fetching exercises..."}</h5>
                {/* <PieChart className='chart' data={[5,7]}/> */}
              </div>
            </div>
        </div>
      </div>
    );
  }
}
