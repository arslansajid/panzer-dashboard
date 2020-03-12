import React from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import {Pagination} from 'react-bootstrap';
import moment from 'moment';
import { API_END_POINT } from '../config';
import Cookie from 'js-cookie';
const token = Cookie.get('panzer_access_token');

import HasRole from '../hoc/HasRole';

export default class CoverBanner extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      banners: [],
      activePage: 1,
      pages: 1,
      q: '',
      responseMessage: 'Loading Banners...'
    }
  }
  componentWillMount() {
    this.fetchBanners();
  }

  fetchBanners = () => {
    axios.get(`${API_END_POINT}/api/banners`, {headers: {"auth-token": token} })
    .then(response => {
      this.setState({
        banners: response.data.objects,
        pages: Math.ceil(response.data.objects.length/10),
        responseMessage: 'No Banners Found...'
      })
    })
  }

  // const requestParams = {
  //   "userId": userId,
  // }

  deleteBanner(bannerId, index) {
    const requestParams = {
      "bannerId": bannerId,
    }
    if(confirm("Are you sure you want to delete this item?")) {
      axios.delete(`${API_END_POINT}/api/banners/delete`, {data: requestParams, headers: {"auth-token": token}})
        .then(response => {
          const banners = this.state.banners.slice();
          banners.splice(index, 1);
          this.setState({ banners });
          window.alert(response.data.msg);
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
      this.setState({loading: true, banners: [], responseMessage: 'Loading Banners...'})
      axios.get(`${API_END_POINT}/api/banners/search`, {params: {"searchWord": this.state.q}, headers: {"auth-token": token}})
      .then((response) => {
        this.setState({
          banners: response.data.searchedItems,
          loading: false,
          responseMessage: 'No Banners Found...'
        })
      })
      .catch(() => {
        this.setState({
          loading: false,
          responseMessage: 'No Banners Found...'
        })
      })
    }
  }

  render() {
    return (
      <div className="row animated fadeIn">
        <div className="col-12">
          <div className="row space-1">
            <div className="col-sm-4">
              <h3>List of Banners</h3>
            </div>
            <div  className="col-sm-4">
              <div className='input-group'>
                <input
                  className='form-control'
                  type="text"
                  name="search"
                  placeholder="Enter keyword"
                  value={this.state.q}
                  // onChange={(event) => this.setState({q: event.target.value})}
                  onChange={(event) => this.setState({q: event.target.value}, () => {
                    if(this.state.q === "") {
                      this.fetchBanners();
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
                <Link to="/banner/banner_form">
                  <button type="button" className="btn btn-success">Add new  Banner</button>
                </Link>
            </div>

          </div>
          <div className="table-responsive">
            <table className="table table-striped">
              <thead>
                <tr>
                  <th>Sr. #</th>
                  <th>Id</th>
                  <th>Image</th>
                  <th>Name</th>
                  {/* <th>Description</th> */}
                  <th>Date</th>
                </tr>
              </thead>
              <tbody>
                {this.state.banners && this.state.banners.length >= 1 ?
                  this.state.banners.map((banner, index) => (
                  <tr key={index}>
                    <td>{index + 1}</td>
                    <td>{banner._id}</td>
                    <td>{<img style={{height: '50px', width: '70px'}} src={banner.image ? banner.image : null}/>}</td>
                    <td>{banner.name}</td>
                    {/* <td>{banner.description}</td> */}
                    <td>{moment(banner.date).format('DD-MMM-YYYY')}</td>
                      <td>
                        <Link to={`/banner/edit_banner/${banner._id}`}>
                          <span className="fa fa-edit" aria-hidden="true"></span>
                        </Link>
                      </td>
                      <td>
                        <span className="fa fa-trash" aria-hidden="true" style={{cursor: 'pointer'}} onClick={() => this.deleteBanner(banner._id, index)}></span>
                      </td>
                    {/* </HasRole> */}
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
