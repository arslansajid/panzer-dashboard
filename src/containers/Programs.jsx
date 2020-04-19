import React from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import {Pagination} from 'react-bootstrap';

import { API_END_POINT } from '../config';
// import Swal from 'sweetalert2'
import Cookie from 'js-cookie';
const token = Cookie.get('panzer_access_token');

import HasRole from '../hoc/HasRole';

export default class Programs extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      programs: [],
      activePage: 1,
      pages: 1,
      q: '',
      pageSize: 10,
      responseMessage: 'Loading Programs...'
    }
  }

  componentWillMount() {
    this.fetchCategories();
  }

  fetchCategories = () => {
    axios.get(`${API_END_POINT}/api/v1/program`)
    .then(response => {
      this.setState({
        programs: response.data.program_set,
        responseMessage: 'No Programs Found...'
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

  // deleteProgram(programId, index) {
  //   if(confirm("Are you sure you want to delete this program?")) {
  //     axios.delete(`${API_END_POINT}/api/v1/program/${programId}`)
  //       .then(response => {
  //         if(response.status === 200) {
  //           Swal.fire({
  //             type: 'success',
  //             title: 'Deleted...',
  //             text: 'Program has been deleted successfully!',
  //           })
  //         }
          
  //         const programs = this.state.programs.slice();
  //         programs.splice(index, 1);
  //         this.setState({ programs });
  //       });
  //   }
  // }

  handleSelect(page) {
    this.setState({ activePage: page }, () => {
      axios.get(`${API_END_POINT}/api/fetch/locations-fetch`, this.getParams())
    // axios.get(`https://api.saaditrips.com/api/fetch/locations-fetch`, this.getParams())
    .then(response => {
      this.setState({
        programs: response.data.items,
        activePage: page
      })
    })
    })
  }

  handleSearch() {
    const { q } = this.state;
    if(q.length) {
    this.setState({loading: true, programs: [], responseMessage: 'Loading Programs...'})
    // if(q === "") {
    //   this.fetchCategories();
    // } else {
      axios.get(`${API_END_POINT}/api/programs/search`, {params: {"searchWord": this.state.q}, headers: {"auth-token": token}})
      .then((response) => {
        this.setState({
          programs: response.data.searchedItems,
          loading: false,
          responseMessage: 'No Programs Found...'
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
              <h3>List of Programs</h3>
            </div>
            <div className="col-sm-4">
              <div className='input-group'>
                <input 
                  className='form-control'
                  type="text" name="search"
                  placeholder="Enter keyword"
                  value={this.state.q}
                  // onChange={(event) => this.setState({q: event.target.value})}
                  onChange={(event) => this.setState({q: event.target.value}, () => {
                    if(this.state.q === "") {
                      this.fetchCategories();
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
                <Link to="/programs/program-form">
                  <button type="button" className="btn btn-success">Add New Program</button>
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
                  <th>Total Weeks</th>
                </tr>
              </thead>
              <tbody>
                {this.state.programs && this.state.programs.length >= 1 ?
                  this.state.programs.map((program, index) => (
                  <tr key={index}>
                    <td>{index + 1}</td>
                    {/* <td>{<img style={{height: '50px', width: '50px'}} src={program.image && program.image} />}</td> */}
                    <td style={{textTransform: "capitalize"}}>{program.name}</td>
                    {/* <td>{program.size}</td> */}
                    <td>{program.total_weeks}</td>
                    <td>
                      <Link to={`/programs/workout-days/${program.id}`}>
                        <button type="button" className="btn btn-info btn-sm">Work Out Days</button>
                      </Link>
                    </td>
                      <td>
                        <Link to={`/programs/edit-program/${program.id}`}>
                          <span className="fa fa-edit" aria-hidden="true"></span>
                        </Link>
                      </td>
                      {/* <td>
                        <span className="fa fa-trash" aria-hidden="true" style={{cursor: 'pointer'}} onClick={() => this.deleteProgram(program.id, index)}></span>
                      </td> */}
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
