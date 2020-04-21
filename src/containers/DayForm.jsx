import React from 'react';
import axios from 'axios';
import { Button } from 'reactstrap';
import { API_END_POINT } from '../config';

import Select from 'react-select';
import 'react-select/dist/react-select.css';

export default class ProgramForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: false,
      workoutDay: {
        name: '',
        program_id: this.props.match.params.programId ? this.props.match.params.programId : "",
        position: 0,
      },
      selectedProgram: null,
      programs: [],
    };
    this.handleInputChange = this.handleInputChange.bind(this);
    this.postWorkoutDay = this.postWorkoutDay.bind(this);
  }

  componentDidMount() {
    console.log('props ########', this.props);
    const { match } = this.props;

    axios.get(`${API_END_POINT}/api/v1/program`)
    .then(response => {
      this.setState({
        programs: response.data.program_set,
        responseMessage: 'No Programs Found...'
      })
    })

    if (match.params.dayId) {
      axios.get(`${API_END_POINT}/api/v1/workout_days/${match.params.dayId}`)
        .then((response) => {
          this.setState({
            workoutDay: response.data.data,
          }, () => {
            this.fetchProgramById(this.state.workoutDay.program_id)
          });
        });
    }
    if (match.params.programId) {
      this.fetchProgramById(match.params.programId)
    }
  }

  fetchProgramById = (programId) => {
    axios.get(`${API_END_POINT}/api/v1/program/${programId}`)
    .then((response) => {
      this.setState({
        selectedProgram: response.data.program,
      });
    });
  }

  handleInputChange(event) {
    const { value, name } = event.target;

    const { workoutDay } = this.state;
    workoutDay[name] = value;
    this.setState({ workoutDay });
  }

  postWorkoutDay(event) {
    event.preventDefault();
    const { match } = this.props;
    const { loading, workoutDay } = this.state;

    if (!loading) {
      this.setState({ loading: true });

      if (match.params.dayId) {
        axios.put(`${API_END_POINT}/api/v1/workout_days/${match.params.dayId}`, workoutDay)
          .then((response) => {
            if (response.data && response.status === 200 && response.data.status) {
              window.alert(response.data.message);
              this.setState({ loading: false });
            } else {
              window.alert(response.data.message);
              this.setState({ loading: false });
            }
          })
          .catch((err) => {
            window.alert('ERROR UPDATING ...');
            this.setState({ loading: false });
          })
      } else {
        axios.post(`${API_END_POINT}/api/v1/workout_days`, workoutDay)
          .then((response) => {
            if (response.data && response.status === 200 && response.data.status) {
              window.alert("SUCCESS !");
              this.setState({ loading: false });
            } else {
              window.alert("ERROR !")
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

  setProgram(selectedItem) {
    this.setState(prevState => ({
      selectedProgram: selectedItem,
      workoutDay: {
        ...prevState.workoutDay,
        program_id: selectedItem.id,
      },
    }));
  }

  render() {
    const {
      workoutDay,
      selectedProgram,
      programs
    } = this.state;
    console.log("#######", this.state)
    const fromProgram = this.props.match.params.programId ? true : false;
    return (
      <div className="row animated fadeIn">
        <div className="col-12">
          <div className="row">

            <div className="col-md-12 col-sm-12">
              <div className="x_panel">
                <div className="x_title">
                  <h2>Enter Workout Day Details</h2>
                </div>
                <div className="x_content">
                  <br />
                  <form
                    id="demo-form2"
                    data-parsley-validate
                    className="form-horizontal form-label-left"
                    onSubmit={this.postWorkoutDay}
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
                          value={workoutDay.name}
                          onChange={this.handleInputChange}
                        />
                      </div>
                    </div>

                    <div className="form-group row">
                      <label className="control-label col-md-3 col-sm-3">Select Program</label>
                      <div className="col-md-6 col-sm-6">
                      <Select
                        onChange={(val) => this.setProgram(val)}
                        options={programs}
                        placeholder="Select program"
                        value={selectedProgram}
                        valueKey="id"
                        labelKey="name"
                        disabled={fromProgram}
                      />
                      </div>
                    </div>

                    <div className="form-group row">
                      <label
                        className="control-label col-md-3 col-sm-3"
                      >Position
                      </label>
                      <div className="col-md-6 col-sm-6">
                        <input
                          required
                          type="number"
                          name="position"
                          className="form-control"
                          value={workoutDay.position}
                          onChange={this.handleInputChange}
                        />
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
