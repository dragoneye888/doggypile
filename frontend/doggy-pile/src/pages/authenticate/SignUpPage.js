import { useNavigate } from "react-router-dom";
import { Form, Button, Row, Col } from "react-bootstrap"
import DoggyPileAPI from "../../api/DoggyPileAPI";

function SignUpPage() {
  // router params
  const navigate = useNavigate()

  // event handlers
  const handleSignUp = async (event) => {
    event.preventDefault()

    let signupData = {
      username: event.target.elements["username"].value,
      password: event.target.elements["password"].value,
      email: event.target.elements["email"].value,
      first_name: event.target.elements["first-name"].value,
      last_name: event.target.elements["last-name"].value
    }
    console.log("SIGN UP:", signupData)
    const data = await DoggyPileAPI.signup(signupData)

    if (data) {
      navigate(`/login`)
    }
  }


  return (
    <div className="d-flex justify-content-center">
      <Row className="login-cont">
        <Col>
          <Form onSubmit={ handleSignUp } method="POST">
            <h1 className="form-title">Sign Up</h1>
            <Form.Group as={Row} className="mt-3">
              <Col>
                <Form.Control type="text" name="first-name" placeholder="First Name" className="input-field"/>
              </Col>
              <Col>
                <Form.Control type="text" name="last-name" placeholder="Last Name" className="input-field"/>
              </Col>
            </Form.Group>
            <Form.Group className="mt-3">
              <Form.Control type="text" name="username" placeholder="Username" className="input-field"/>
            </Form.Group>
            <Form.Group className="mt-3">
              <Form.Control type="password" name="password" placeholder="Password" className="input-field"/>
            </Form.Group>
            <Form.Group className="mt-3">
              <Form.Control type="email" name="email" placeholder="Email" className="input-field"/>
            </Form.Group>
            <Form.Group className="mt-3">
            </Form.Group>
            <Button className="edit-btn submit signup" type="submit">Create Account</Button>
          </Form>
        </Col>
        <Col>
          <img src={require('../../images/signup-dog.png')} alt="Sign Up doggo" className="signup-doggo"/>
        </Col>
      </Row>
    </div>
  )
}

export default SignUpPage;
