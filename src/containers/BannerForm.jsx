import React from 'react';
import PropTypes from 'prop-types';
import axios from 'axios';
import RichTextEditor from 'react-rte';
import { Button } from 'reactstrap';
import moment from 'moment';
import { API_END_POINT } from '../config';
import Cookie from 'js-cookie';
const token = Cookie.get('panzer_access_token');

import { DateRangePicker } from 'react-dates';
import 'react-dates/initialize';

import Select from 'react-select';
import 'react-select/dist/react-select.css';

export default class GalleryForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: false,
      banner: {
        name: '',
        image: '',
      },
      hotels: [],
      hotel: '',
      startDate: null,
      endDate: null,
      focusedInput: null,
      description: RichTextEditor.createEmptyValue(),
    };

    this.handleInputChange = this.handleInputChange.bind(this);
    this.postCoverBanner = this.postCoverBanner.bind(this);
  }

  componentDidMount() {
    console.log('props', this.props)
    const { match } = this.props;
    if (match.params.bannerId) {
      axios.get(`${API_END_POINT}/api/banners/one`, { params: {"bannerId": match.params.bannerId}, headers: {"auth-token" : token}} )
        .then((response) => {
          this.setState({
            banner: response.data.object[0]
          },() => {

          });
        });
    }
  }

  setHotel(selectedHotel) {
    this.setState(prevState => ({
      hotel: selectedHotel,
      banner: {
        ...prevState.banner,
        hotel_id: selectedHotel.ID,
      },
    }));
  }

  setDescription(description) {
    const { banner } = this.state;
    banner.description = description.toString('html');
    this.setState({
      banner,
      description,
    });
  }

  handleInputChange(event) {
    const { value, name } = event.target;

    const { banner } = this.state;
    banner[name] = value;
    this.setState({ banner });
  }

  // handleImages = (event) => {
  //   this.setState({ banner: event.target.files[0] });
  // }

  handleImages = (event) => {
    const { name } = event.target;
    const { banner } = this.state;
    banner[name] = event.target.files[0];
    this.setState({ banner });
  }

  postCoverBanner(event) {
    event.preventDefault();
    const { match, history } = this.props;
    const { loading, banner } = this.state;
        this.setState({ loading: true });

        const fd = new FormData();
        Object.keys(banner).forEach((eachState) => {
          fd.append(`${eachState}`, banner[eachState]);
        })

        if(match.params.bannerId) {
        banner.bannerId = match.params.bannerId
        delete banner["_id"]
        delete banner["userId"]
        delete banner["date"]
        delete banner["__v"]
        this.setState({ banner });
        axios.post(`${API_END_POINT}/api/banners/update`, fd, {headers: {"auth-token": token}})
          .then((response) => {
            if (response.status === 200) {
              window.alert(response.data.msg);
              this.setState({ loading: false });
            } else {
              window.alert('ERROR')
              this.setState({ loading: false });
            }
          });
        }
        else {
          axios.post(`${API_END_POINT}/api/banners`, fd, {headers: {"auth-token": token}})
          .then((response) => {
            if (response.status === 200) {
              window.alert(response.data.msg);
              this.setState({ loading: false });
            } else {
              window.alert('ERROR')
              this.setState({ loading: false });
            }
          });
        }
        }



  render() {
    const {
      loading,
      banner,
    } = this.state;
    console.log(this.state);

    return (
      <div className="row animated fadeIn">
        <div className="col-12">
          <div className="row">
          
            <div className="col-md-12 col-sm-12">
              <div className="x_panel">
                <div className="x_title">
                  <h2>Enter banner Details</h2>
                </div>
                <div className="x_content">
                  <br />
                  <form
                    id="demo-form2"
                    data-parsley-validate
                    className="form-horizontal form-label-left"
                    onSubmit={this.postCoverBanner}
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
                          value={banner.name}
                          onChange={this.handleInputChange}
                        />
                      </div>
                    </div>

                    {/* <div className="form-group row">
                      <label
                        className="control-label col-md-3 col-sm-3"
                      >Image
                      </label>
                      <div className="col-md-6 col-sm-6">
                        <input
                          required
                          type="text"
                          name="image"
                          className="form-control"
                          value={banner.image}
                          onChange={this.handleInputChange}
                        />
                      </div>
                    </div> */}

                    <div className="form-group row">
                      <label className="control-label col-md-3 col-sm-3">Image</label>
                      <div className="col-md-6 col-sm-6">
                        <input
                          type="file"
                          accept="image/*"
                          name="image"
                          className="form-control"
                          onChange={this.handleImages}
                          // multiple
                          required
                        />
                      </div>
                    </div>

                    <div className="ln_solid" />
                    <div className="form-group row">
                      <div className="col-md-6 col-sm-6 offset-md-3">
                        <Button className={`btn btn-success btn-lg ${this.state.loading ? 'disabled' : ''}`}>
                          <i className={`fa fa-spinner fa-pulse ${this.state.loading ? '' : 'd-none'}`}/> Submit
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

