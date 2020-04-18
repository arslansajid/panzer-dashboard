import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Switch, Route, withRouter } from 'react-router-dom';
import axios from "axios";
import Cookie from 'js-cookie';
import Header from '../components/Header';
import Footer from '../components/Footer';
import Sidebar from '../components/Sidebar';
import Breadcrumb from '../components/Breadcrumb';
import Stats from '../containers/Stats'
import { Container } from 'reactstrap';

import Programs from '../containers/Programs';
import ProgramForm from './ProgramForm';

import Users from '../containers/Users';
import UserForm from '../containers/UserForm';

import Days from '../containers/Days';
import DayForm from '../containers/DayForm';

import Exercise from './Exercise';
import ExerciseForm from './ExerciseForm';

import GalleryForm from '../containers/GalleryForm';
import Gallery from '../containers/Gallery';

import BannerForm from './BannerForm';
import Banner from './Banner';

import OrderForm from '../containers/OrderForm';
import Orders from '../containers/Orders';

import Items from './Items';
import ItemsForm from './ItemsForm';

import Brands from './Brands';
import BrandForm from './BrandForm';

import Properties from './Properties';
import PropertyForm from './PropertyForm';

import { API_END_POINT } from "../config";

class App extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      loading: true,
      user: null,
      displayLoading: true,
      displayApp: false,
      displayMessage: 'Loading User Data...'
    }
  }

  componentWillMount() {
    const { dispatch, history } = this.props;
    const token = Cookie.get('panzer_access_token');
    if (token) {
      axios.defaults.headers.common.Authorization = `${token}`;
      this.setState({ loading: false });
    } else {
      history.push('/login');
    }
  }

  render() {
      return (
      <div className="app">
        <Header/>
        <div className="app-body">
          <Sidebar {...this.props} user={this.state.user}/>
          <main className="main">
            <Breadcrumb/>
            <Container fluid>
              <Switch>
                  <Route exact={true} path='/' component={Stats}/>     

                  <Route exact={true} path="/programs" component={Programs}/>
                  <Route exact={true} path="/programs/program-form" component={ProgramForm}/>
                  <Route exact={true} path="/programs/edit-program/:programId" component={ProgramForm}/>
                  <Route exact={true} path="/programs/exercises/:programId" component={ProgramForm}/>
                  <Route key={"inside-program"} exact={true} path="/programs/workout-days/:programId" component={Days}/>
                  <Route key={"inside-program-form"} exact={true} path="/programs/workout-days/:programId/day-form" component={DayForm}/>
                  <Route key={"inside-program-edit-form"} exact={true} path="/programs/workout-days/:programId/edit-day/:dayId" component={DayForm}/>
                  
                  <Route exact={true} path="/users" component={Users}/>
                  <Route exact={true} path='/users/user_form' component={UserForm}/>
                  <Route exact={true} path="/users/edit_user/:userId" component={UserForm}/>

                  <Route exact={true} path="/exercise" component={Exercise}/>
                  <Route exact={true} path="/exercise/exercise-form" component={ExerciseForm}/>
                  <Route exact={true} path="/exercise/edit-exercise/:exerciseId" component={ExerciseForm}/>

                  <Route key={"side-bar"} exact={true} path="/days" component={Days}/>
                  <Route exact={true} path="/days/day-form" component={DayForm}/>
                  <Route exact={true} path="/days/edit-day/:dayId" component={DayForm}/>
                  
                </Switch>
              </Container>
              </main>
            </div>
            <Footer />
          </div>
      );
  }
}

App.propTypes = {
  dispatch: PropTypes.func.isRequired,
  history: PropTypes.instanceOf(Object).isRequired,
  user: PropTypes.object,
};

function mapStateToProps(state) {
  return {
    user: state.user,
  };
}

export default withRouter(connect(mapStateToProps)(App));