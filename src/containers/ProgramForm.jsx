import React from 'react';
import PropTypes from 'prop-types';
import axios from 'axios';
import RichTextEditor from 'react-rte';
import { Button } from 'reactstrap';
import { API_END_POINT } from '../config';

import Select from 'react-select';
import 'react-select/dist/react-select.css';

const names = [
  'gym_3a','gym_3b','gym_3i','gym_4a','gym_4b','gym_4i','gym_5a','gym_5b','gym_5i','gym_6a','gym_6b','gym_6i','home_3a','home_3b','home_3i','home_4a','home_4b','home_4i','home_5a','home_5b','home_5i','home_6a','home_6b','home_6i' 
]

const goals = [
  'yoga', 'warrior', 'functionFitness', 'weightLoss', 'bodyBuilding', 'powerLifting'
]

export default class ProgramForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: false,
      program: {
        name: '',
        fitness_goal: '',
        total_weeks: 0,
        exercise_ids: [],
      },
      selectedExercises: null,
      exercises: [],
    };
    // this.rteState = RichTextEditor.createEmptyValue();
    // API_END_POINT = 'https://admin.saaditrips.com';
    this.handleInputChange = this.handleInputChange.bind(this);
    this.postPogram = this.postPogram.bind(this);
  }

  componentDidMount() {
    console.log('props', this.props);
    const { match } = this.props;
    if (match.params.programId /* && match.url.indexOf("exercises") < 0 */) {
      axios.get(`${API_END_POINT}/api/v1/program/${match.params.programId}`)
        .then((response) => {
          this.setState({
            program: response.data.program,
          }, () => {
            if(match.url.indexOf("exercises") > 0 ) {
              this.fetchExercises();
            }
          });
        });
    }
    // else {
    //   this.fetchExercises();
    // }
  }

  fetchExercises = () => {
    axios.get(`${API_END_POINT}/api/v1/exercise`)
    .then(response => {
      this.setState({
        exercises: response.data.exercises,
      })
    })
    .catch(() => {
      window.alert("ERROR FETCHING EXERCISES ...")
    })
  }

  setDescription(description) {
    const { program } = this.state;
    program.description = description.toString('html');
    this.setState({
      program,
      description,
    });
  }

  handleInputChange(event) {
    const { value, name } = event.target;

    const { program } = this.state;
    program[name] = value;
    this.setState({ program });
  }

  setExercise(selectedExercise) {
    this.setState(prevState => ({
      exercise: selectedExercise,
      program: {
        ...prevState.program,
        city_id: selectedExercise.ID,
      },
    }))
  }

  handleImages = (event) => {
    const { name } = event.target;
    const { program } = this.state;
    program[name] = event.target.files[0];
    this.setState({ program });
  }

  postPogram(event) {
    event.preventDefault();
    const { match, history } = this.props;
    const { loading, program, gallery } = this.state;

    if (!loading) {
      this.setState({ loading: true });

      if (match.params.programId) {
        axios.put(`${API_END_POINT}/api/v1/program`, program)
          .then((response) => {
            if (response.data && response.status === 200) {
              window.alert(response.data.program);
              this.setState({ loading: false });
            } else {
              window.alert(response.data.program);
              this.setState({ loading: false });
            }
          })
          .catch((err) => {
            window.alert('ERROR UPDATING ...');
            this.setState({ loading: false });
          })
      } else {
        axios.post(`${API_END_POINT}/api/v1/program`, program)
          .then((response) => {
            if (response.data && response.status === 200) {
              window.alert(response.data.program);
              this.setState({ loading: false });
            } else {
              window.alert(response.data.program)
              this.setState({ loading: false });
            }
          })
          .catch((err) => {
            window.alert('ERROR SAVING ...')
            this.setState({ loading: false });
          })
      }
    }
  }

  postExercise = (event) => {
    event.preventDefault();
    const { program, selectedExercises } = this.state;
    if(!!selectedExercises) {
      program.exercise_ids = [];
      selectedExercises.split(',').forEach((exercise, index) => {
        program.exercise_ids[index] = exercise;
      })
      console.log("prog", program);
      axios.put(`${API_END_POINT}/api/v1/program/update_exercises`, program)
      .then((response) => {
        if (response.data && response.status === 200) {
          window.alert("SAVED ...");
          this.setState({ loading: false });
        } else {
          window.alert('ERROR ADDING EXERCISE ...');
          this.setState({ loading: false });
        }
      })
      .catch((err) => {
        window.alert('ERROR ADDING EXERCISE ...');
        this.setState({ loading: false });
      })
    }
  }

  handleSelectChange = (value) => {
    console.log('You\'ve selected:', value);
    this.setState({
      selectedExercises: value,
     });
  }

  render() {
    const {
      program,
      selectedExercises,
      exercises
    } = this.state;
    const showExercises = this.props.match.url.indexOf("exercises") > 0 ? true : false
    return (
      <div className="row animated fadeIn">
        <div className="col-12">
          <div className="row">

            <div className="col-md-12 col-sm-12">
              <div className="x_panel">
                <div className="x_title">
                  <h2>{showExercises ? "Add Exercises" : "Enter Program Details"}</h2>
                </div>
                <div className="x_content">
                  <br />
                  <form
                    id="demo-form2"
                    data-parsley-validate
                    className="form-horizontal form-label-left"
                    onSubmit={showExercises ? this.postExercise : this.postPogram}
                  >
                    {/* <div className="form-group row">
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
                          value={program.name}
                          onChange={this.handleInputChange}
                          readOnly={showExercises ? true : false}
                        />
                      </div>
                    </div> */}

                    <div className="form-group row">
                      <label className="control-label col-md-3 col-sm-3">Name</label>
                      <div className="col-md-6 col-sm-6">
                        <select
                          name="name"
                          value={program.name}
                          className="form-control"
                          onChange={this.handleInputChange}
                          required
                        >
                          <option value="">Select Name</option>
                          {
                            names.map((name, index) => {
                              return (
                                <option key={index} value={name}>{name}</option>
                              )
                            })
                          }
                        </select>
                      </div>
                    </div>

                    <div className="form-group row">
                      <label className="control-label col-md-3 col-sm-3">Fitness Goal</label>
                      <div className="col-md-6 col-sm-6">
                        <select
                          name="fitness_goal"
                          value={program.fitness_goal}
                          className="form-control"
                          onChange={this.handleInputChange}
                          required
                        >
                          <option value="">Select Goal</option>
                          {
                            goals.map((goal, index) => {
                              return (
                                <option key={index} value={goal}>{goal}</option>
                              )
                            })
                          }
                        </select>
                      </div>
                    </div>

                    <div className="form-group row">
                      <label
                        className="control-label col-md-3 col-sm-3"
                      >Total Weeks
                      </label>
                      <div className="col-md-6 col-sm-6">
                        <input
                          required
                          type="number"
                          name="total_weeks"
                          className="form-control"
                          value={program.total_weeks}
                          onChange={this.handleInputChange}
                          readOnly={showExercises ? true : false}
                        />
                      </div>
                    </div>

                    {
                      showExercises
                        ?
                        <div className="form-group row">
                      <label className="control-label col-md-3 col-sm-3">Select Exercises</label>
                      <div className="col-md-6 col-sm-6">
                      <Select
                        multi
                        onChange={(val) => this.handleSelectChange(val)}
                        options={exercises}
                        placeholder="Select exercises"
                        rtl={false}
                        simpleValue
                        value={selectedExercises}
                        valueKey="id"
                        labelKey="name"
                      />
                      </div>
                    </div>
                        :
                        null
                    }

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
