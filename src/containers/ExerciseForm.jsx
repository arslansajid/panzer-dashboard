import React from 'react';
import PropTypes from 'prop-types';
import axios from 'axios';
import RichTextEditor from 'react-rte';
import { Button } from 'reactstrap';
import { API_END_POINT } from '../config';
import Cookie from 'js-cookie';

import Select from 'react-select';
import 'react-select/dist/react-select.css';

export default class ExerciseForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: false,
      exercise: {
        name: '',
        total_days: 0,
        sets: 0,
        reps: 0,
        intensity: 0,
        timer_type: '',
        duration: 0,
        rest_duration: 0,
        video_files: [],
        workout_day_id: this.props.match.params.dayId ? this.props.match.params.dayId : "",
      },
      workoutDays: [],
      workoutDay: '',
      exerciseId: '',
      profile_picture: '',
      videoInputCount: 1,
      description: RichTextEditor.createEmptyValue(),
    };
    // this.rteState = RichTextEditor.createEmptyValue();
    // API_END_POINT = 'https://admin.saaditrips.com';
    this.handleInputChange = this.handleInputChange.bind(this);
    this.postExercise = this.postExercise.bind(this);
  }

  componentDidMount() {
    const { match } = this.props;
    if (match.params.exerciseId) {
      axios.get(`${API_END_POINT}/api/v1/exercise/${match.params.exerciseId}`)
      .then((response) => {
        this.setState({
          exercise: response.data.exercise,
        }, () => {
          const {exercise} = this.state;
          if(exercise.videos_url === null) {
            exercise.video_files = [];
            this.setState({ exercise })
          } else {
            this.setState({videoInputCount: exercise.videos_url.length })
          }
        });
      });
    }
    if (match.params.dayId) {
      this.getWorkoutDayById(match.params.dayId)
    } else {
      this.getWorkoutDays();
    }
  }

  getWorkoutDays = () => {
    axios.get(`${API_END_POINT}/api/v1/workout_days`)
    .then(response => {
      this.setState({
        workoutDays: response.data.data,
        responseMessage: 'No Workout Days Found...'
      })
    })
  }

  getWorkoutDayById = (workoutDayId) => {
    axios.get(`${API_END_POINT}/api/v1/workout_days/${workoutDayId}`)
    .then((response) => {
      this.setState({
        workoutDay: response.data.data,
      });
    });
  }

  setWorkoutDay(selectedWorkoutDay) {
    this.setState(prevState => ({
      workoutDay: selectedWorkoutDay,
      exercise: {
        ...prevState.exercise,
        workout_day_id: !!selectedWorkoutDay ? selectedWorkoutDay.id : "",
      },
    }));
  }

  setCity(selectedCity) {
    this.setState(prevState => ({
      city: selectedCity,
      exercise: {
        ...prevState.exercise,
        city_id: selectedCity.ID,
      },
    }));
  }

  setDescription(description) {
    const { exercise } = this.state;
    exercise.description = description.toString('html');
    this.setState({
      exercise,
      description,
    });
  }

  handleInputChange(event) {
    const { value, name } = event.target;

    const { exercise } = this.state;
    exercise[name] = value;
    this.setState({ exercise });
  }

  handleVideoURLChange = (event, index) => {
    const { name } = event.target;
    const { exercise } = this.state;
    exercise[name][index] = event.target.files[0];
    this.setState({ exercise });
  }

  postExercise(event) {
    event.preventDefault();
    const { match, history } = this.props;
    const { loading, exercise } = this.state;
    if (!loading) {
      const fd = new FormData();

      let videosArray = [];
      for (let index = 0; index < exercise.video_files.length; index += 1) {
        videosArray.push(exercise.video_files[index]);
      }

      exercise.video_files.forEach((video, index) => {
        fd.append(`video_files[${index}]`, video);
      });
      delete exercise["video_files"];
      Object.keys(exercise).forEach((eachState) => {
        fd.append(`${eachState}`, exercise[eachState]);
      })

      

      this.setState({ loading: true });
      if (match.params.exerciseId) {
        axios.put(`${API_END_POINT}/api/v1/exercise/${match.params.exerciseId}`, fd)
          .then((response) => {
            if (response.data && response.data.status && response.status === 200) {
              window.alert("SUCCESS !");
              this.setState({ loading: false });
            } else {
              window.alert('ERROR UPDATING !')
              this.setState({ loading: false });
            }
          })
          .catch((err) => {
            window.alert('ERROR UPDATING !')
            this.setState({ loading: false });
          })
      }
      else {
        axios.post(`${API_END_POINT}/api/v1/exercise`, fd)
          .then((response) => {
            if (response.data && response.data.status && response.status === 200) {
              window.alert("SUCCESS !");
              this.setState({ loading: false });
            } else {
              window.alert('ERROR SAVING !')
              this.setState({ loading: false });
            }
          })
          .catch((err) => {
            window.alert('ERROR SAVING !')
            this.setState({ loading: false });
          })
      }
    }
  }

  handleFile = (event) => {
    this.setState({
      profile_picture: event.target.files.length ? event.target.files[0] : '',
    });
  }

  render() {
    console.log(this.state);
    const {
      loading,
      exercise,
      description,
      workoutDay,
      workoutDays,
      videoInputCount
    } = this.state;
    const workoutDaySelected = this.props.match.params.dayId ? true : false
    return (
      <div className="row animated fadeIn">
        <div className="col-12">
          <div className="row">

            <div className="col-md-12 col-sm-12">
              <div className="x_panel">
                <div className="x_title">
                  <h2>Enter Exercise Details</h2>
                </div>
                <div className="x_content">
                  <br />
                  <form
                    id="demo-form2"
                    data-parsley-validate
                    className="form-horizontal form-label-left"
                    onSubmit={this.postExercise}
                  >

                    <div className="form-group row">
                      <label
                        className="control-label col-md-3 col-sm-3"
                      >Name
                      </label>
                      <div className="col-md-6 col-sm-6">
                        <input
                          required
                          type="text"
                          name="name"
                          className="form-control"
                          value={exercise.name}
                          onChange={this.handleInputChange}
                        />
                      </div>
                    </div>

                    <div className="form-group row">
                      <label className="control-label col-md-3 col-sm-3">Workout Day</label>
                      <div className="col-md-6 col-sm-6">
                      <Select
                        onChange={(val) => this.setWorkoutDay(val)}
                        options={workoutDays}
                        placeholder="Select workout day"
                        value={workoutDay}
                        valueKey="id"
                        labelKey="name"
                        isClearable={false}
                        disabled={workoutDaySelected}
                      />
                      </div>
                    </div>

                    <div className="form-group row">
                      <label
                        className="control-label col-md-3 col-sm-3"
                      >Total Days
                      </label>
                      <div className="col-md-6 col-sm-6">
                        <input
                          required
                          type="number"
                          name="total_days"
                          className="form-control"
                          value={exercise.total_days}
                          onChange={this.handleInputChange}
                        />
                      </div>
                    </div>

                    <div className="form-group row">
                      <label
                        className="control-label col-md-3 col-sm-3"
                      >Sets
                      </label>
                      <div className="col-md-6 col-sm-6">
                        <input
                          required
                          type="number"
                          name="sets"
                          className="form-control"
                          value={exercise.sets}
                          onChange={this.handleInputChange}
                        />
                      </div>
                    </div>

                    <div className="form-group row">
                      <label
                        className="control-label col-md-3 col-sm-3"
                      >Reps
                      </label>
                      <div className="col-md-6 col-sm-6">
                        <input
                          required
                          type="number"
                          name="reps"
                          className="form-control"
                          value={exercise.reps}
                          onChange={this.handleInputChange}
                        />
                      </div>
                    </div>

                    <div className="form-group row">
                      <label
                        className="control-label col-md-3 col-sm-3"
                      >Intensity
                      </label>
                      <div className="col-md-6 col-sm-6">
                        <input
                          required
                          type="number"
                          name="intensity"
                          className="form-control"
                          value={exercise.intensity}
                          onChange={this.handleInputChange}
                        />
                      </div>
                    </div>

                    <div className="form-group row">
                      <label className="control-label col-md-3 col-sm-3">Timer Type</label>
                      <div className="col-md-6 col-sm-6">
                        <select
                          name="timer_type"
                          value={exercise.timer_type}
                          className="form-control"
                          onChange={this.handleInputChange}
                          required
                        >
                          <option value="">Select Type</option>
                          <option value="exercise">Exercise</option>
                          <option value="rest">Rest</option>
                        </select>
                      </div>
                    </div>

                    <div className="form-group row">
                      <label
                        className="control-label col-md-3 col-sm-3"
                      >Duration
                      </label>
                      <div className="col-md-6 col-sm-6">
                        <input
                          required
                          type="number"
                          name="duration"
                          className="form-control"
                          value={exercise.duration}
                          onChange={this.handleInputChange}
                        />
                      </div>
                    </div>

                    <div className="form-group row">
                      <label
                        className="control-label col-md-3 col-sm-3"
                      >Rest Duration
                      </label>
                      <div className="col-md-6 col-sm-6">
                        <input
                          required
                          type="number"
                          name="rest_duration"
                          className="form-control"
                          value={exercise.rest_duration}
                          onChange={this.handleInputChange}
                        />
                      </div>
                    </div>

                  {[...Array(videoInputCount)].map((count, index) => {
                    return (
                      <div className="form-group row" key={index}>
                      <label className="control-label col-md-3 col-sm-3">Video</label>
                      <div className="col-md-6 col-sm-6">
                        <input
                          type="file"
                          accept="video/*"
                          name="video_files"
                          className="form-control"
                          onChange={(event) => this.handleVideoURLChange(event, index)}
                        />
                      </div>
                    </div>
                    //   <div className="form-group row" key={index}>
                    //   <label
                    //     className="control-label col-md-3 col-sm-3"
                    //   >Video URL
                    //   </label>
                    //   <div className="col-md-6 col-sm-6">
                    //     <input
                    //       // required
                    //       type="text"
                    //       name="video_files"
                    //       className="form-control"
                    //       value={!!exercise.video_files ? exercise.video_files[index] : []}
                    //       onChange={(event) => this.handleVideoURLChange(event, index)}
                    //     />
                    //   </div>
                    // </div>
                    )
                  })}
                    
                    <div className="form-group row">
                      <label
                        className="control-label col-md-3 col-sm-3"
                      >
                      </label>
                      <div className="col-md-6 col-sm-6 text-right">
                        <Button className={`btn btn-info btn-md mr-1`} onClick={() => this.setState({ videoInputCount: videoInputCount + 1})}>
                          Add more
                        </Button>
                        <Button className={`btn btn-danger btn-md`} onClick={() => {exercise.video_files.pop(); this.setState({exercise, videoInputCount: videoInputCount - 1})} } disabled={videoInputCount === 1}>
                          Remove
                        </Button>
                      </div>
                    </div>

                    <div className="ln_solid" />
                    <div className="form-group row">
                      <div className="col-md-6 col-sm-6 offset-md-3">
                        <Button className={`btn btn-success btn-lg ${this.state.loading ? 'disabled' : ''}`}>
                          <i className={`fa fa-spinner fa-pulse ${this.state.loading ? '' : 'd-none'}`} /> Submit
                        </Button>
                      </div>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

