import React from 'react'
import { connect } from 'react-redux'
import { simpleDispatchProps } from 'actions/utility'
import { fetchUser } from 'actions/userActions'
import Container from 'react-bootstrap/Container'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'


@connect(
  store => ({
    user: store.user.data
  }),
  dispatch =>
    simpleDispatchProps(dispatch, {
      fetchUser
    })
)
class Root extends React.Component {
  componentDidMount() {
    this.props.fetchUser('will')
  }

  render() {
    const {first_name, last_name, email} = this.props.user
    return(<Container>
      <Row>
        <Col>First Name: {first_name}</Col>
        <Col>Last Name: {last_name}</Col>
        <Col>Email: {email}</Col>
      </Row>
    </Container>)
  }
}

export default Root
