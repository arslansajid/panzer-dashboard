import React from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import {Pagination} from 'react-bootstrap';

import { API_END_POINT } from '../config';
import Cookie from 'js-cookie';
const token = Cookie.get('panzer_access_token');

export default class Exercise extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      exercises: [],
      activePage: 1,
      pages: 1,
      q: '',
      loading: false,
      responseMessage: 'Loading Exercise...'
    }
    // API_END_POINT = 'https://admin.saaditrips.com';
  }

  componentWillMount() {
    this.fetchExercise();
  }

  fetchExercise = () => {
    this.setState({ loading: true })
    axios.get(`${API_END_POINT}/api/v1/exercise`)
    .then(response => {
      this.setState({
        exercises: response.data.data,
        loading: false,
        responseMessage: 'No Exercise Found'
      })
    })
    .catch(() => {
      this.setState({
        loading: false,
        responseMessage: 'No Exercise Found...'
      })
    })
  }
  
  deleteExercise(exerciseId, index) {
    if(confirm("Are you sure you want to delete this exercise?")) {
      axios.delete(`${API_END_POINT}/api/v1/exercise/${exerciseId}`)
        .then(response => {
          const exercises = this.state.exercises.slice();
          exercises.splice(index, 1);
          this.setState({ exercises });
          window.alert(response.data.message);
        });
    }
  }

  handleSelect(page) {
    axios.get(`/api/area?offset=${(page-1)*10}`)
      .then(response => {
        this.setState({
          areas: response.data.items,
          activePage: page
        })
      })
  }

  handleSearch() {
    const { q } = this.state;
    if(q.length) {
    this.setState({loading: true, exercises: [], responseMessage: 'Loading Exercise...'})
    // if(q === "") {
    //   this.fetchExercise();
    // } else {
      axios.get(`${API_END_POINT}/api/items/exercise/search`, {params: {"searchWord": this.state.q}, headers: {"auth-token": token}})
      .then((response) => {
        this.setState({
          exercises: response.data.searchedItems,
          loading: false,
          responseMessage: 'No Exercise Found...'
        })
      })
      .catch(() => {
        this.setState({
          loading: false,
          responseMessage: 'No Exercise Found...'
        })
      })
    }
  }

  render() {
    // console.log(this.state);
    const {loading, exercises, responseMessage} = this.state; 
    return (
      <div className="row animated fadeIn">
        <div className="col-12">
          <div className="row space-1">
            <div className="col-sm-4">
              <h3>List of Exercises</h3>
            </div>
            <div  className="col-sm-4">
              <div className='input-group'>
                <input
                  className='form-control'
                  type="text"
                  name="search"
                  placeholder="Enter keyword"
                  value={this.state.q}
                  onChange={(event) => this.setState({q: event.target.value}, () => {
                    if(this.state.q === "") {
                      this.fetchExercise();
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
              <Link to="/exercise/exercise-form">
                <button type="button" className="btn btn-success">Add New Exercise</button>
              </Link>
          </div>

          </div>
          <div className="table-responsive">
            <table className="table table-striped">
              <thead>
                <tr>
                  <th>Sr. #</th>
                  {/* <th>Picture</th> */}
                  <th>Name</th>
                  <th>Program</th>
                  <th>Day</th>
                  <th>Position</th>
                  <th>Total Days</th>
                  <th>Sets</th>
                  <th>Reps</th>
                  <th>Intensity</th>
                  <th>Timer_type</th>
                  <th>Duration</th>
                  <th>Rest Duration</th>
                  <th>Total Days</th>
                  <th>Video Urls</th>
                </tr>
              </thead>
              <tbody>
                {this.state.exercises && this.state.exercises.length >= 1 ?
                this.state.exercises.map((exercise, index) => (
                  <tr key={index}>
                  <td>{index + 1}</td>
                  <td style={{textTransform: "capitalize"}}>{exercise.name}</td>
                  <td style={{textTransform: "capitalize"}}>{exercise.program_name}</td>
                  <td style={{textTransform: "capitalize"}}>{exercise.day_name}</td>
                  <td style={{textTransform: "capitalize"}}>{exercise.position}</td>
                  {/* <td>{<img style={{height: '50px', width: '50px'}} src={exercise.image && exercise.image}/>}</td> */}
                  <td>{exercise.total_days}</td>
                  <td>{exercise.sets}</td>
                  <td>{exercise.reps}</td>
                  <td>{exercise.intensity}</td>
                  <td>{exercise.timer_type ? exercise.timer_type : "-"}</td>
                  <td>{exercise.duration ? exercise.duration : "-"}</td>
                  <td>{exercise.timer_type ? exercise.timer_type : "-"}</td>
                  <td>{exercise.rest_duration ? exercise.rest_duration : "-"}</td>
                  <td>{exercise.video_urls ? exercise.video_urls.length : "-"}</td>
                  <td>
                    <Link to={`/exercise/edit-exercise/${exercise.id}`}>
                      <span className="fa fa-edit" aria-hidden="true"></span>
                    </Link>
                  </td>
                  <td>
                    <span className="fa fa-trash" style={{cursor: 'pointer'}} aria-hidden="true" onClick={() => this.deleteExercise(exercise.id, index)}></span>
                  </td>
                </tr>
                )) :
                (
                  <tr>
                    <td colSpan="15" className="text-center">{responseMessage}</td>
                  </tr>
                )
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
