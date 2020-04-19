import React from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
// import {Pagination} from 'react-bootstrap';

import { API_END_POINT } from '../config';
import Cookie from 'js-cookie';
const token = Cookie.get('panzer_access_token');

export default class WorkoutDays extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      days: [],
      activePage: 1,
      pages: 1,
      q: '',
      pageSize: 10,
      responseMessage: 'Loading Workout Days...'
    }
  }

  componentWillMount() {
    console.log("######", this.props)
    this.fetchWorkoutDays();
  }

  fetchWorkoutDays = () => {
    const {programId} = this.props.match.params;
    axios.get(`${API_END_POINT}/api/v1/workout_days`, {params: {program_id: programId}})
    .then(response => {
      this.setState({
        days: response.data.data,
        responseMessage: 'No Workout Days Found...'
      })
    })
  } 
  
  getParams() {
    const {
      activePage,
      pageSize,
    } = this.state;
    return {
      params: {
        pageNumber: activePage,
        pageSize,
      },
    };
  }

  deleteWorkoutDays(dayId, index) {
    if(confirm("Are you sure you want to delete this workout day?")) {
      axios.delete(`${API_END_POINT}/api/v1/workout_days/${dayId}`)
        .then(response => {
          if(response.status === 200 && response.data.status) {
            window.alert(response.data.message)
          }
          
          const days = this.state.days.slice();
          days.splice(index, 1);
          this.setState({ days });
        })
        .catch((error) => {
          window.alert("ERROR !")
        })
    }
  }

  handleSelect(page) {
    this.setState({ activePage: page }, () => {
      axios.get(`${API_END_POINT}/api/fetch/locations-fetch`, this.getParams())
    // axios.get(`https://api.saaditrips.com/api/fetch/locations-fetch`, this.getParams())
    .then(response => {
      this.setState({
        days: response.data.items,
        activePage: page
      })
    })
    })
  }

  handleSearch() {
    const { q } = this.state;
    if(q.length) {
    this.setState({loading: true, days: [], responseMessage: 'Loading Workout Days...'})
    // if(q === "") {
    //   this.fetchWorkoutDays();
    // } else {
      axios.get(`${API_END_POINT}/api/days/search`, {params: {"searchWord": this.state.q}, headers: {"auth-token": token}})
      .then((response) => {
        this.setState({
          days: response.data.searchedItems,
          loading: false,
          responseMessage: 'No Workout Days Found...'
        })
      })
    }
  }

  render() {
    const fromPrograms = this.props.location.pathname.includes("programs") ? true : false;
    return (
      <div className="row animated fadeIn">
        <div className="col-12">
          <div className="row space-1">
            <div className="col-sm-4">
              <h3>List of Workout Days</h3>
            </div>
            <div className="col-sm-4">
              <div className='input-group'>
                <input 
                  className='form-control'
                  type="text" name="search"
                  placeholder="Enter keyword"
                  value={this.state.q}
                  onChange={(event) => this.setState({q: event.target.value}, () => {
                    if(this.state.q === "") {
                      this.fetchWorkoutDays();
                    }
                  })}
                  onKeyPress={(event) => {
                    if (event.key === 'Enter') {
                      this.handleSearch();
                    }
                  }}
                />
                <span className="input-group-btn" >
                  <button type="button" onClick={() => this.handleSearch()} className="btn btn-info search-btn">Search</button>
                </span>
              </div>
            </div>

            <div className="col-sm-4 pull-right mobile-space">
                <Link to={fromPrograms ? `/programs/workout-days/${this.props.match.params.programId}/day-form` : "/days/day-form"}>
                  <button type="button" className="btn btn-success">Add New Day</button>
                </Link>
            </div>

          </div>
          <div className="table-responsive">
            <table className="table table-striped">
              <thead>
                <tr>
                  <th>Sr. #</th>
                  {/* <th>Image</th> */}
                  <th>Name</th>
                  <th>Program Id</th>
                  <th>Created at</th>
                </tr>
              </thead>
              <tbody>
                {this.state.days && this.state.days.length >= 1 ?
                  this.state.days.map((day, index) => (
                  <tr key={index}>
                    <td>{index + 1}</td>
                    {/* <td>{<img style={{height: '50px', width: '50px'}} src={day.image && day.image} />}</td> */}
                    <td style={{textTransform: "capitalize"}}>{day.name}</td>
                    <td>{day.program_id}</td>
                    <td>{day.created_at}</td>
                    <td>
                      <Link to={fromPrograms ? `/programs/workout-days/exercises/${day.id}` : `/days/exercises/${day.id}`}>
                        <button type="button" className="btn btn-danger btn-sm">Add Exercises</button>
                      </Link>
                    </td>
                      <td>
                        <Link to={fromPrograms ? `/programs/workout-days/${this.props.match.params.programId}/edit-day/${day.id}` : `/days/edit-day/${day.id}`}>
                          <span className="fa fa-edit" aria-hidden="true"></span>
                        </Link>
                      </td>
                      <td>
                        <span className="fa fa-trash" aria-hidden="true" style={{cursor: 'pointer'}} onClick={() => this.deleteWorkoutDays(day.id, index)}></span>
                      </td>
                  </tr>
                )):
                <tr>
                    <td colSpan="15" className="text-center">{this.state.responseMessage}</td>
                  </tr>
                }
              </tbody>
            </table>
          </div>
          {/* <div className="text-center">
            <Pagination prev next items={this.state.pages} activePage={this.state.activePage} onSelect={this.handleSelect.bind(this)}> </Pagination>
          </div> */}
        </div>
      </div>
    );
  }
}
