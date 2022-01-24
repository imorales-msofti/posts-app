import React, { Component } from 'react'
import { Amplify } from 'aws-amplify';

import { I18n } from 'aws-amplify';

import { withAuthenticator } from '@aws-amplify/ui-react';
import '@aws-amplify/ui-react/styles.css';

import awsExports from './aws-exports';

import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import Alert from 'react-bootstrap/Alert';
import Navbar from 'react-bootstrap/Navbar';
import Table from 'react-bootstrap/Table';
import 'bootstrap/dist/css/bootstrap.min.css';

Amplify.configure(awsExports);

I18n.setLanguage('en');
const dict = {
  'en': {
    'Username': 'Email'
  }
}
I18n.putVocabularies(dict);


class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      user: props.user,
      posts: [],
      post: {
        caption: '',
        description: '',
      }
    };

    this.handleFormChange = this.handleFormChange.bind(this);
  }
  
  getPosts = () => {
    const url = `${process.env.REACT_APP_BASE_URL}/posts/`

    return fetch(url)
      .then(request => request.json());
  }

  componentDidMount() {
    this.getPosts()
      .then(({ data }) => this.setState({ posts: data }))
  }

  handleFormChange(event) {

    console.log(event.target.name);

    this.setState({post: {
      ...this.state.post,
      [event.target.name]:event.target.value
    }});
  }

  render() {
    return (

      <Container>
        <Navbar bg="light" expand="lg">
          <Navbar.Brand>Posts App</Navbar.Brand>
          <Navbar.Toggle aria-controls="basic-navbar-nav" />

          <Navbar.Collapse id="basic-navbar-nav">

          </Navbar.Collapse>

          <Navbar.Collapse className="justify-content-end">
            <Navbar.Text>
              {this.props.user.attributes.name}
            </Navbar.Text>
            &nbsp;
            &nbsp;
            <Navbar.Text>
              <Button variant="secondary" type="submit" onClick={this.props.signOut}>
                Sign out
              </Button>
            </Navbar.Text>
          </Navbar.Collapse>
        </Navbar>

        <br />
        <Row>
          <Col>
            <h2>Add New Post</h2>

            <Form>
              <Form.Group className="mb-3" controlId="formCaption">
                <Form.Label>Caption</Form.Label>
                <Form.Control type="text" placeholder="Enter caption" name="caption" value={this.state.post.caption} onChange={this.handleFormChange} />
              </Form.Group>

              <Form.Group className="mb-3" controlId="formDescription">
                <Form.Label>Description</Form.Label>
                <Form.Control type="text" placeholder="description" name="description" value={this.state.post.description} onChange={this.handleFormChange} />
              </Form.Group>

              <Button variant="primary" type="button" onClick={this.addPost}>
                Add
              </Button>
            </Form>

          </Col>

          <Col xs={8}>
            <h2>Feed</h2>
            <Table striped bordered hover size="sm">
              <thead>
                <tr>
                  <th>#</th>
                  <th>Caption</th>
                  <th>Description</th>
                </tr>
              </thead>
              <tbody>
                {
                  this.state.posts.map((itemPost, index) => {
                    return (<tr key={index}>
                      <td>{index + 1}</td>
                      <td>{itemPost.caption}</td>
                      <td>{itemPost.description}</td>
                    </tr>)
                  })
                }
              </tbody>
              {/* <tbody>
                <tr>
                  <td>1</td>
                  <td>Mark</td>
                  <td>Otto</td>
                  <td>@mdo</td>
                </tr>
                <tr>
                  <td>2</td>
                  <td>Jacob</td>
                  <td>Thornton</td>
                  <td>@fat</td>
                </tr>
                <tr>
                  <td>3</td>
                  <td colSpan={2}>Larry the Bird</td>
                  <td>@twitter</td>
                </tr>
              </tbody> */}
            </Table>
          </Col>

        </Row>
      </Container >

    );
  }
}

export default withAuthenticator(App);