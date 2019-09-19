import React, { Component } from "react";
import {
  Button,
  Segment,
  Container,
  Divider,
  Message,
  Form,
  Image
} from "semantic-ui-react";

import 'semantic-ui-css/semantic.min.css';
import logo from './images/receiptbook-logo.png';

import { post } from "axios";

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      file: null,
      display: null,
      receiptMessage: null
    };
  }

  fileInputRef = React.createRef();

  onFormSubmit = e => {
    e.preventDefault(); // Stop form submit
    this.fileUpload(this.state.file).then(response => {
      this.setState({receiptMessage: response.data}, () => {
        console.log(response.data);
      })
    });
  };

  fileChange = e => {
    try {
      this.setState({ file: e.target.files[0], display: URL.createObjectURL(e.target.files[0])}, () => {
        console.log("File chosen --->", this.state.file);
      });
    } catch(e) {}
  };

  // Import datasources/schemas Tab 1
  fileUpload = file => {
    const url = "http://localhost:8000/api/receipts/";
    const formData = new FormData();
    formData.append("file", file);
    const config = {
      headers: {
        "Content-type": "multipart/form-data"
      }
    };
    return post(url, formData, config);
  };

  render() {
    return (
      <Segment style={{ padding: "5em 1em" }} vertical>
        <Image src={logo} style={{"width": "100px"}} centered></Image>
        <Divider horizontal>Receipt-Book</Divider>
          <Container className="inputFormContainer">
            <Container className="messageContainer">
              <Message className="appMessage">Textify your invoices and bills.</Message>
            </Container>
            <Form onSubmit={this.onFormSubmit}>
              {
                !!this.state.file && !!this.state.display &&
                  <Image src={this.state.display} style={{"width": "250px"}} className="uploadedImage" centered></Image>
              }
              <Form.Field>
                <Button
                  type="button"
                  content="Choose Image"
                  labelPosition="left"
                  icon="image"
                  className="chooseImageButton"
                  onClick={() => this.fileInputRef.current.click()}
                />
                <input
                  ref={this.fileInputRef}
                  type="file"
                  hidden
                  onChange={this.fileChange}
                />
              </Form.Field>
              <Container className="submitButtonContainer">
                <Button 
                  type="submit" 
                  className="submitButton" 
                  disabled={!this.state.file || !this.state.display} 
                  primary
                >Upload</Button>
              </Container>
            </Form>
          </Container>
          { !!this.state.receiptMessage && 
          <>
            <Divider horizontal>Result</Divider>
            <Container className="resultContainer">
                <Message className="receiptMessage">{this.state.receiptMessage}</Message>
            </Container>
          </>
          }
      </Segment>
    );
  }
}

export default App;