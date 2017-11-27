import React, { Component } from 'react';
import './App.css';
import List from '../List';
import TextField from 'material-ui/TextField';
import AppBar from 'material-ui/AppBar';
import RaisedButton from 'material-ui/RaisedButton';

const flatstyle = {
  backgroundColor: 'pink'
}
class App extends Component {
  constructor(props) {
    super(props)
    this.state = {
      term: "",
      items: [props]
    }
  }

  onChange=(event) => {
    this.setState({
      term:event.target.value
    })
  }

  onSubmit = (event) => {
    event.preventDefault();
    fetch('/todos', {
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      method: 'POST',
      body: JSON.stringify({
        itemToDo: this.state.term,
        complete : false,
        postpone: 'Later mate'
      })
    })
    .then(response => response.json())
    .then(value => {
      console.log(value)
      this.onGetTodos();
    })
    .catch(err => console.log(err));
  }

  onGetTodos=()=>{
    fetch('/todos')
    .then(response => response.json())
    .then(data => {
      console.log(data);
      this.setState(prevState => (
        {
          items : data.payload.map(item => ({
            todo: item.itemToDo,
            complete: item.complete,
            postpone:item.postpone,
          }))
        }
      ));
    })
  }

  onComplete=(i)=>{
    this.setState(prevState => (
      {
        items : [
          ...prevState.items.slice(0,i),
          {
            todo: prevState.items[i].todo,
            complete: !prevState.items[i].complete
          },
          ...prevState.items.slice(i+1)
        ]
      }
    ));
  }
  render() {
    return (
      <div style={flatstyle}>
        <AppBar title="react"/>
        <form onSubmit={this.onSubmit}>
        <TextField value={this.state.term} onChange={this.onChange} floatingLabelText="bring some stuffs"/>
        <RaisedButton label="just Do it" secondary={true}  type="submit"/>

      </form>
      <RaisedButton label="Get Todos" primary={true} onClick={this.onGetTodos}/>
      <List items={this.state.items} onComplete={this.onComplete}/>
      </div>
    )
  }
}

export default App;
