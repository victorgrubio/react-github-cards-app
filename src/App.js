import React from 'react';
import './App.css';
import axios from 'axios';

// sample names
// gaearon, sophiebits, sebmarkbage, bvaughn

const CardList = (props) => (
  /*
  Here is an example of a function components, recommended since 16.3 where hooks appeared
  */

  // Here we return a list of cards
  // To get data from an array of users (response of API) and render each user into a Card
  // We apply a jsx expression. We MAP the content of the array. 
  // Therefore, each array element (profile) will create a Card with the prop as the profile itselt
  // by using the array deconstruction

  // We have to pass the key property to react to identify the components
  <div>
    {props.profiles.map(profile => <Card key={profile.id} {...profile}/>)}
  </div>
)

class Card extends React.Component {
  /* 
  Creates a new component to represent a Github card
  Contains the render functio which is required for every component class
  It returns the HTML between parenthesis
  */

  render() {
    // For each profile provided from the props of the component,
    // we will render a different card with the specfic info for each Github user
    const profile = this.props
    return (
      <div className="github-profile">
        <img src={profile.avatar_url} alt=""/>
        <div className="info">
          <div className="name">{profile.name}</div>
          <div className="company">{profile.company}</div>
        </div>
      </div>
    );
  }
}


class Form extends React.Component {
  /*
  Form component to search for a User
  */

  // An alternative to ref is to create an state for the component and
  // use it to store the values. Similar to the ng-model in AngularJS
  state = { userName: ''}

  // We use the await property to get data, so we have to declare async the function
  handleSubmit = async (event) => {
    // We have to add the submit Function to add new user to cardlist 
    // We also have to prevent the default behaviour to avoid the refreshment of the page on submit
    event.preventDefault();
    // We want to fetch data from Github API. To do so, we use axios library 
    // We have a dynamic URL by using the template string (with the curly quotes)
    const resp = await axios.get(`https://api.github.com/users/${this.state.userName}`);
    this.props.onSubmit(resp.data);
    this.setState({ userName: ''})
  }
  render(){
    // We define a function to perform using the onSubmit from HTML

    // Defining the connection between value and state makes the input empty and unavailable. 
    // To write on it again, we have to define an onChange function with an event.
    // onChange contains a function that sets the state (this.setState), similar to update a dict
    // Then, we set the state with the target (input) value property.
    return(
      <form onSubmit={this.handleSubmit}>
        <input 
          type="text" 
          placeholder="Github username" 
          value={this.state.userName} 
          onChange={event => this.setState({ userName: event.target.value })} 
          required/>
        <button>Add card</button>
      </form>
    );
  }
}

/* 
Main App. It contains a Card component defined previously
The title is one of the arguments that is passed in the ReactDOM.render() function
*/
class App extends React.Component {
  // We have to share data between our components
  // Therefore, as we are using a class approach, we have to define the state
  state = {
    profiles: [],
  };

  // add new profile to cardlist, using Form data. Used to share profiles data between components
  addNewProfile = (profileData) => {
    // We have to append the new data to the profiles of the state
    this.setState(prevState => ({
      profiles: [...prevState.profiles, profileData],
    }))
  }
  render() {
    // Then we pass it to the CardList using JSX
    return (
      <div>
        <div className="header">{this.props.title}</div>
        <Form onSubmit={this.addNewProfile}/>
        <CardList profiles={this.state.profiles}/>
      </div>
    );
  }	
}

// Exports the element we want to share to other files: App
export default App;
