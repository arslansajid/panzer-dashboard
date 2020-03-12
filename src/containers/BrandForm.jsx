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
      brand: {
        name: '',
        description: '',
      },
    };

    this.handleInputChange = this.handleInputChange.bind(this);
    this.postBrand = this.postBrand.bind(this);
  }

  componentDidMount() {
    console.log('props', this.props)
    const { match } = this.props;
    if (match.params.brandId) {
      axios.get(`${API_END_POINT}/api/brands/one`, { params: {"brandId": match.params.brandId}, headers: {"auth-token" : token}} )
        .then((response) => {
          this.setState({
            brand: response.data.object[0]
          },() => {

          });
        });
    }
  }

  handleInputChange(event) {
    const { value, name } = event.target;

    const { brand } = this.state;
    brand[name] = value;
    this.setState({ brand });
  }

  postBrand(event) {
    event.preventDefault();
    const { match, history } = this.props;
    const { loading, brand } = this.state;
        this.setState({ loading: true });

        // let imgArray = [];
        const fd = new FormData();
        fd.append('description', brand);

        fd.append('coverBanner', JSON.stringify(brand));

        if(match.params.brandId) {
        brand.brandId = match.params.brandId
        axios.post(`${API_END_POINT}/api/brands/update`, brand, {headers: {"auth-token": token}})
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
          axios.post(`${API_END_POINT}/api/brands`, brand, {headers: {"auth-token": token}})
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
      brand,
    } = this.state;
    console.log(this.state);

    return (
      <div className="row animated fadeIn">
        <div className="col-12">
          <div className="row">
          
            <div className="col-md-12 col-sm-12">
              <div className="x_panel">
                <div className="x_title">
                  <h2>Enter Brand Details</h2>
                </div>
                <div className="x_content">
                  <br />
                  <form
                    id="demo-form2"
                    data-parsley-validate
                    className="form-horizontal form-label-left"
                    onSubmit={this.postBrand}
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
                          value={brand.name}
                          onChange={this.handleInputChange}
                        />
                      </div>
                    </div>

                    <div className="form-group row">
                      <label
                        className="control-label col-md-3 col-sm-3"
                      >Description
                      </label>
                      <div className="col-md-6 col-sm-6">
                        <input
                          required
                          type="text"
                          name="description"
                          className="form-control"
                          value={brand.description}
                          onChange={this.handleInputChange}
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

