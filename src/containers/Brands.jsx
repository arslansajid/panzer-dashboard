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
      brands: [],
      activePage: 1,
      pages: 1,
      q: '',
      responseMessage: 'Loading Brands...'
    }
  }
  componentWillMount() {
    this.fetchBanners();
  }

  fetchBanners = () => {
    axios.get(`${API_END_POINT}/api/brands`, {headers: {"auth-token": token} })
    .then(response => {
      this.setState({
        brands: response.data.objects,
        pages: Math.ceil(response.data.objects.length/10),
        responseMessage: 'No Brands Found...'
      })
    })
  }

  // const requestParams = {
  //   "userId": userId,
  // }

  deleteBrand(brandId, index) {
    const requestParams = {
      "brandId": brandId,
    }
    if(confirm("Are you sure you want to delete this item?")) {
      axios.delete(`${API_END_POINT}/api/brands/delete`, {data: requestParams, headers: {"auth-token": token}})
        .then(response => {
          const brands = this.state.brands.slice();
          brands.splice(index, 1);
          this.setState({ brands });
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
      this.setState({loading: true, brands: [], responseMessage: 'Loading Brands...'})
      axios.get(`${API_END_POINT}/api/brands/search`, {params: {"searchWord": this.state.q}, headers: {"auth-token": token}})
      .then((response) => {
        this.setState({
          brands: response.data.searchedItems,
          loading: false,
          responseMessage: 'No Brands Found...'
        })
      })
      .catch(() => {
        this.setState({
          loading: false,
          responseMessage: 'No Brands Found...'
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
              <h3>List of Brands</h3>
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
                <Link to="brands/brand_form">
                  <button type="button" className="btn btn-success">Add new Brand</button>
                </Link>
            </div>

          </div>
          <div className="table-responsive">
            <table className="table table-striped">
              <thead>
                <tr>
                  <th>Sr. #</th>
                  <th>Id</th>
                  {/* <th>Image</th> */}
                  <th>Name</th>
                  <th>Description</th>
                  {/* <th>Date</th> */}
                </tr>
              </thead>
              <tbody>
                {this.state.brands && this.state.brands.length >= 1 ?
                  this.state.brands.map((brand, index) => (
                  <tr key={index}>
                    <td>{index + 1}</td>
                    <td>{brand._id}</td>
                    {/* <td>{<img style={{height: '50px', width: '70px'}} src={brand.image ? brand.image : null}/>}</td> */}
                    <td>{brand.name}</td>
                    <td>{brand.description}</td>
                    {/* <td>{moment(brand.date).format('DD-MMM-YYYY')}</td> */}
                      <td>
                        <Link to={`/brands/edit_brand/${brand._id}`}>
                          <span className="fa fa-edit" aria-hidden="true"></span>
                        </Link>
                      </td>
                      <td>
                        <span className="fa fa-trash" aria-hidden="true" style={{cursor: 'pointer'}} onClick={() => this.deleteBrand(brand._id, index)}></span>
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
