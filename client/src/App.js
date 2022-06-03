import React, { Component } from "react";
import Form from "./components/Form";



/*

const AddBook = (props) => {
  return (
  <div className= "add_book">
    <label>
      Enter your personal name
      <input type="text" name = "Name" value = {props.name} onChange = { (e) => props.handleChange(e) } />
    </label>
    <br />
    <label>
      Enter your Address 
      <input type="text" name="Address" value = {props.address} onChange = { (e) => props.handleChange(e) } />
    </label>
    <br />
    <label>
      Upload your book
      <input type="file" name="Book" onChange = { (e) => props.uploadBook(e) } /> 
    </label>
    <br />
    <Button onClick = {(e) => props.handleSubmit(e) }>
      Submit
    </Button>
  </div>
  )
}

const Info = (props) => {
  return (
  <div className= "Info">
    <label>Your Name: {props.name}</label> <br/>
    <label>Your Address: {props.address}</label> <br />
    <label>Your Account Balance: {props.value}</label> <br />
    <Button onClick={ (e) => props.fetchFile(e) }>Fetch your book</Button> <br />
  </div>
  )
}


class Book extends Component {

  constructor(props) {
    super(props);
    this.state = {Name: "", Address: "", Val: 0, Book: null, Content: false, Change: false};
    
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.uploadBook = this.uploadBook.bind(this);
  }

  handleChange(e) {
    this.setState({[e.target.name]: e.target.value});
  }

  handleSubmit = async (e) =>  {
    // store book 
    if (this.state.Content) {
      // store the book to IPFS
      console.log("Storing book to IPFS");
      //const client = create('https://ipfs.infura.io:5001/api/v0');
      //try {
        //const meta = await client.add(this.state.Book);
        //const url = `https://ipfs.infura.io/ipfs/${meta.path}`;
        //console.log("Content-Hash: ", url);
      //} catch (error) {
        //console.log(error.message);
      //}
      
    }
    this.setState({Change: true});
  }

  uploadBook(e) {
    const book = e.target.files[0];
    const reader = new window.FileReader();
    reader.readAsArrayBuffer(book);
    //reader.readAsText(book);
    
    reader.onloadend = () => {
      // store the data 
      this.setState({Book: Buffer(reader.result), Content: true});
      console.log("Content: ", Buffer(reader.result));
    }

    e.preventDefault();
  }
  */

  function App() {
    return (
      //<Form />
      <Form />
    );
  }

  export default App;
  