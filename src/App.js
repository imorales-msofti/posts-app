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

  refreshPosts = (post) => {
    this.getPosts()
      .then(({ data }) => this.setState({ posts: data }));
  }

  editPost = (post) => {
    console.log('editPost');
    console.log(post);
  }

  deletePost = (post) => {

    const url = `${process.env.REACT_APP_BASE_URL}/posts/${post}`

    fetch(url, {
      method: 'DELETE',
      headers: { 'Content-type': 'application/json' },
    })
      .then(() => {
        this.cleanForm();

        this.getPosts()
          .then(({ data }) => this.setState({ posts: data }))
      })
      ;
  }

  cleanForm = () => {
    this.setState({
      post: {
        caption: '',
        description: '',
      }
    })
  }

  addPost = () => {
    const url = `${process.env.REACT_APP_BASE_URL}/posts/`

    fetch(url, {
      method: 'POST',
      headers: { 'Content-type': 'application/json' },
      body: JSON.stringify(
        {
          ...this.state.post,
          user_id: this.state.user.attributes.sub,
          created_at: new Date().toISOString()
        }),
    })
      .then(() => {
        this.cleanForm();

        this.getPosts()
          .then(({ data }) => this.setState({ posts: data }))
      })
      ;

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

    this.setState({
      post: {
        ...this.state.post,
        [event.target.name]: event.target.value
      }
    });
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
            <h2>New Post</h2>

            <Form>
              <Form.Group className="mb-3" controlId="formCaption">
                <Form.Label>Caption</Form.Label>
                <Form.Control type="text" placeholder="Enter caption" name="caption" value={this.state.post.caption} onChange={this.handleFormChange} />
              </Form.Group>

              <Form.Group className="mb-3" controlId="formDescription">
                <Form.Label>Description</Form.Label>
                <Form.Control type="text" placeholder="Enter description" name="description" value={this.state.post.description} onChange={this.handleFormChange} />
              </Form.Group>

              <Button variant="primary" type="button" onClick={this.addPost}>
                Add
              </Button>
            </Form>

          </Col>

          <Col xs={8}>
            <h2>Feed</h2>
            <Button variant="primary" type="button" onClick={this.refreshPosts}>
                Refresh
            </Button>
            <br/>
            <Table striped bordered hover size="sm">
              <thead>
                <tr>
                  <th>#</th>
                  <th>Caption</th>
                  <th>Description</th>
                  <th>CreatedAt</th>
                  <th>Edit</th>
                  <th>Delete</th>
                </tr>
              </thead>
              <tbody>
                {
                  this.state.posts.map((itemPost, index) => {
                    return (<tr key={index}>
                      <td>{index + 1}</td>
                      <td>{itemPost.caption}</td>
                      <td>{itemPost.description}</td>
                      <td>{itemPost.created_at}</td>
                      <td><Button variant="light" type="button" onClick={() => { this.editPost(itemPost._id) }}>Edit</Button></td>
                      <td><Button variant="danger" type="button" onClick={() => { this.deletePost(itemPost._id) }}>Delete</Button></td>
                    </tr>)
                  })
                }
              </tbody>
            </Table>
          </Col>

        </Row>
      </Container >

    );
  }
}

export default withAuthenticator(App);