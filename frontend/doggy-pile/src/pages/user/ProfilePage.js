import DoggyPileAPI from "../../api/DoggyPileAPI";
import PostView from "../../components/posts/viewposts-deleteposts";
import { useEffect, useState } from "react"
import { useParams, Link } from "react-router-dom";
import { Row, Col, Button, Container, Tabs, Tab, Spinner, Form } from "react-bootstrap";
import "./ProfileStyles.scss"
import DatePicker from 'react-datepicker'
import Swal from 'sweetalert2'
// SVG import
import maleSign from "../../images/male-sign.svg"
import femaleSign from "../../images/female-sign.svg"



function ProfilePage(props) {
  // params
  const { userId } = useParams()

  // state
  const [userDetails, setUserDetails] = useState(null)
  const [dogList, setDogList] = useState([])
  const [postList, setPostList] = useState([])
  const [loading, setLoading] = useState(false)
  const [startDate, setStartDate] = useState(new Date())
  const [endDate, setEndDate] = useState(new Date())
  // const [events, setEvents] = useState()
  // const [unacceptedEvents, setUnacceptedEvents] = useState()
  const [userProfile, setUserProfile] = useState()
  

  // effects
  useEffect(() => {
    loadUserDetails()
    loadDogList()
    loadPostList()
    getEvents()
  }, [userId])

  useEffect(() => {
    if (userProfile) {
      console.log("useEffect")
      alertUser()
    }
  }, [userProfile])


  const loadPostList = async () => {
    
    const data = await DoggyPileAPI.getAllItems("post")
    const filteredPosts = data.filter((user) => {
      console.log(">>>>>>>>>>>", user)
      console.log(">>>>>>>>>>>>>", userId)
        return user.user.id == userId
    })    
    setPostList(filteredPosts ? filteredPosts : [])
    console.log("fileterfjdslfjd", filteredPosts)
  }

  const loadUserDetails = async () => {
    setLoading(true)
    const data = await DoggyPileAPI.getItemById("user_profile", userId)
    if (data) {
    setUserDetails(data ? data : null)
    setLoading(false)
    } else {
      setLoading(false)
    }
  }

  const loadDogList = async () => {
    const dogs= []
    const data = await DoggyPileAPI.getAllItems("dogs")
    for (let i=0; i < data.length; i++) {
      if(data[i].user_profile.id.id == userId) {
        dogs.push(data[i])
      }
    }
    setDogList(dogs ? dogs : [])
  }


  // Deleting doggo/posts from list (don't do it! *sadface* )
  const removeDoggo = (deletedDogId) => {
    const newDogList = dogList.filter((dog) => {
      return dog.id !== deletedDogId
    })
    setDogList(newDogList)
  }
  const removePost = (deletedPostId) => {
    const newposts = postList.filter(() => {
      return postList.id !== deletedPostId
    })
    setPostList(newposts)
    return loadPostList()
  }

  // Renders doggos. There's a lot of functions inside, be warned. 
  const renderDogs = () => {
    return dogList.map((dog) => {
      const handleDeleteDog = async () => {
        const data = await DoggyPileAPI.deleteItem("dogs", dog.id)
        if (data) {
          removeDoggo(dog.id)
        }
      }

      // Checks if currently logged in user matches profile. If so, renders the Edit and Delete button
      const showButtons = () => {
        if (props.username.user_id == userId) {
          return (
            <Row>
              <Col xs={4}>
                <Link to={`/dog-profile/${dog.id}/edit-profile`}><Button className="edit-btn me-5">Edit</Button></Link>
              </Col>
              <Col xs={1}>
                <Button onClick={ handleDeleteDog} className="edit-btn ms-3">Delete</Button>
              </Col>
            </Row>
          )
        }
      }
      // Based on the gender value, it will render the gender SVGs that corresponds with it
      const renderGenderSigns = () => {
        if (dog && dog.gender === 'Male') {
          return <img alt="Gender sign" src={maleSign} className="gender"/>
        } 
        else if (dog && dog.gender === 'Female') {
          return <img alt="Gender sign" src={femaleSign} className="gender"/>
        }
      }
      const checkVaccinated = () => {
        if (dog && dog.vaccinated === true) {
          return <><span className="dog-field">Vaccinated</span> <span className="dog-text">Yes</span> </>
        } else if (dog && dog.vaccinated === false) {
        return <><span className="dog-field">Vaccinated</span> <span className="dog-text">No</span></>
        }
      }
      // Since the JSON file doesn't have the names capitalized, this function takes care of that
      const capitalizeBreedName = (str) => {
        return str.replace(/\w\S*/g, function(txt) {
          return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
        })
      }
      return <Row className="dog-cont">
        <Col xs={5}>
          <img src={ dog && dog.profile_pic } alt="Doggo" className="dog-img"/>
        </Col>
        <Col xs={4} className="dog-details">
          <h4 className="dog-name">{dog && dog.name} { renderGenderSigns() }</h4>
          <span className="dog-field">Breed</span> <span className="dog-text">{capitalizeBreedName(dog && dog.breed)}</span>
          <br />
          <span className="dog-field">Size</span> <span className="dog-text">{dog && dog.size}</span>
          <br />
          <span className="dog-field">Age</span> <span className="dog-text">{dog && dog.age}</span>
          <br />
          <span className="dog-field">Friendly with</span> <span className="dog-text">{dog && dog.friendly_with}</span>
          <br />
          {checkVaccinated()}
        </Col>
        <Col>
          {showButtons()}
        </Col>
      </Row>
    })
  }

  // Rendering gender SVGs
  const renderGenderSigns = () => {
    if (userDetails && userDetails.gender === 'Male') {
      return <img alt="Gender sign" src={maleSign} className="gender"/>
    } 
    else if (userDetails && userDetails.gender === 'Female') {
      return <img alt="Gender sign" src={femaleSign} className="gender"/>
    }
  }

  // Show Edit button if user is logged in
  const editProfileBtn = () => {
    if ( !userDetails ) {
      return <Link to={`/profile/${ props.username.user_id}/create-profile`}><Button id="jiggle2" className="edit-btn create">Create Profile</Button></Link> }
    else if ( props.username.user_id == userId ) {
      return (
        <div className="profile-notifications">
          <Link to={`/profile/${ props.username.user_id}/edit-profile`}><Button className="edit-btn">Edit</Button></Link> 
            {/* { events ? <p>Events: <div className="notifications">{events.length}</div></p> : null } */}
            
      </div>
      )
    } else if (props.username.user_id !== userId) {
      return (
        <div>
          <form onSubmit={ submitInvite } id="event-invite-form">
            <label for="event_start" className="datepicker-label">Start Date</label><br/>
            <DatePicker selected={startDate} onChange={(date) => setStartDate(date)} className="datepicker"/><br/>
            <label for="event_end" className="datepicker-label end">End Date</label><br/>
            <DatePicker selected={endDate} onChange={(date) => setEndDate(date)} className="datepicker"/><br/>
            <label for="event_description" className="datepicker-label description">Description</label><br/>
            <input type="text" name="event_description" className="datepicker"/><br/>
            <input type="submit" value="Submit" className="invite-btn"/>
            <hr/>
        </form>
        <Button className="edit-btn invite-btn" onClick={ playDateInvite }>Invite to play date!</Button>
        </div>
        )
    }
  }


  // alerting the user when a new event arrives
  const alertUser = async () => {
    let unacceptedEvents = []
    for (let i = 0; i < userProfile.event.length; i++) {
      if (userProfile.event[i].accepted === false) {
        unacceptedEvents.push(userProfile.event[i])
      }
    }
    if ( (unacceptedEvents) && (unacceptedEvents.length > 0) && (props.username.user_id == userId)) {
      // alert(`You have ${events.length} notifications!`)
      Swal.fire({
        title: `You have ${unacceptedEvents.length} events that haven't been accepted yet.`,
        text: "Do you want to add all of them to your calendar? ",
        showDenyButton: true,
        showCancelButton: true,
        confirmButtonText: 'Yes',
      }).then((result) => {
        if (result.isConfirmed) {
          Swal.fire('Saved!', '', 'success')
          // console.log("HEY LOOK OVER HERE", userProfile)
          for(let i = 0; i < unacceptedEvents.length; i++) {
            unacceptedEvents[i].accepted = true
          }
          // console.log("LOOK HERE DUMMY", userProfile)
          DoggyPileAPI.editItems('user_profile', userId, userProfile).then((response) => {
            setUserProfile(response)
            // console.log(">>>>>>>>>>>>>RESPONSE", response)
          })
        } else if (result.isDenied) {
          Swal.fire('Changes are not saved', '', 'info')
        }
      })
      
    }
  }


  
  // onClick function for play date invites
  const playDateInvite = () => {
    const form = document.getElementById('event-invite-form')

    if (form.style.display === 'none') {
      form.style.display = 'block'
    } else {
      form.style.display = 'none'
    }
  }
  
  const submitInvite = async (e) => {
    e.preventDefault()
    let data = await DoggyPileAPI.getItemById('user_profile', userId)
    let id = 0
    for (let i = 0; i < data.event.length; i++) {
      if (data.event.length < 1) {
        
      } else if (data.event[i].id > id) {
        id = data.event[i].id 
      }
    }
    let inviteData = {}
    inviteData.id = id + 1
    inviteData.title = "Play Date"
    inviteData.start = startDate
    inviteData.end = endDate
    inviteData.description = e.target.elements["event_description"].value
    inviteData.accepted = false
    // inviteData.sender = e.target.elements["event_sender"].value
    inviteData.sender = props.username.username
    
    
    

    if (data) {
      console.log(data)
    }
    data.event.push(inviteData)

    let otherData = await DoggyPileAPI.editItems('user_profile', userId, data)

    if (otherData) {
      console.log(otherData)
    }
    const form = document.getElementById('event-invite-form')

    form.style.display = 'none'
  }

  // get events
  const getEvents = async () => {
    let data = await DoggyPileAPI.getItemById('user_profile', userId)
    setUserProfile(data)
  }

  // Returns all user's post
  const renderPosts = () => {
    return postList.map((myPost) => {
      console.log(myPost)
        return <PostView key={ myPost.id } myPost={ myPost } removePost={ removePost } username={ props.username }/>
        })
      }
  // Render Write Posts to User only
  const renderWritePost = () => {
    if (props.username.user_id == userId) {
      return (
        <>
        <Link key={ 100 } to={`/post/create-post/`}> <Button className="write-btn profile">Write A Post</Button></Link><br/>
        </>
      )
      }
  }

  //Render Add Dog button or not
  const renderAddDogButton = () => {
      if (props.username.user_id == userId) {
      return (
        <>
        <Link key={userId} to={"/dog-profile/create-profile"}><Button className="add-btn mt-3">Add Dog</Button></Link>
        </>
      )
      } 
  }

  // delete event from the event tab
  const deleteEvent = async (id) => {
    console.log(id)
    console.log(userProfile)
    let ind = userProfile.event.indexOf(userProfile.event[id - 1])
    userProfile.event.splice(ind, 1)
    console.log(userProfile)
    let data = await DoggyPileAPI.editItems('user_profile', userId, userProfile)
    setUserProfile(data)
  }
  
  const addToCalendar = async (id) => {
    userProfile.event[id - 1].accepted = true
    let data = await DoggyPileAPI.editItems('user_profile', userId, userProfile)
    setUserProfile(data)
  }

  // Rendering the whole profile details
  const renderProfile = () => {
    if (!userDetails) {
      return <Link to={`/profile/${ props.username.user_id}/create-profile`}><Button className="edit-btn create">Create Profile</Button></Link> }

    return (
    <Container className="profile">
      <Row>
        <Col xs={4}>
          <img src={userDetails && userDetails.profile_pic} className="user-img" alt="User's profile"/>
        </Col>
        <Col xs={7}>
          <Row>
            <Col>
            <h3 align="left">{userDetails && userDetails.id.first_name} {userDetails && userDetails.id.last_name} { renderGenderSigns() }</h3>
            <p align="left" className="location-text">{userDetails && userDetails.city}, {userDetails && userDetails.state}, US</p>
            </Col>
            <Col align="right">
            {editProfileBtn()}
            </Col>
          </Row>
          <p className="about-text" align="left">{userDetails && userDetails.about}</p>
        </Col>
      </Row>

      <div className="d-flex justify-content-center mt-5">
        <Row className="bottom-profile">
          <Tabs defaultActiveKey="dogs" id="profile-tabs">
            <Tab eventKey="dogs" title="Dogs">
              { renderDogs() }
              
              { renderAddDogButton () }
            </Tab>
            <Tab eventKey="posts" title="Posts">
              { postList ? renderWritePost() : null }
              { postList ? renderPosts() : null }
            </Tab>
            <Tab eventKey="events" title="Events" className="events-tab">
              { userProfile && userProfile.event && props.username.user_id == userId ? userProfile.event.map((item, index) => {
                return <div className="d-flex justify-content-center tag-event" key={ index } >
                  <Row className="event-cont">
                    <Col sm={7} className="event-details">
                      <h5 align="left" className="event-title">You have an event called "{item.title}" { item.sender ? `with ${item.sender}` : "" }</h5>
                      <p align="left" className="event-text">{item.description && `"${item.description}"`}</p>
                      <p align="left" className="event-date">{new Date(item.start).toLocaleString()} - {new Date(item.end).toLocaleString()}</p>
                    </Col>
                    <Col className="d-flex flex-row justify-content-end events-btns">
                      { item.accepted === false ? <Button onClick={ () => addToCalendar(item.id) } className="edit-btn add-calendar" >Add to Calendar</Button> : null }
                      <Button onClick={ () => deleteEvent(item.id) } className="navbar-item signup-btn events ms-2" >Delete</Button>
                    </Col>
                  </Row>
                </div>
              }) : null }
            </Tab>
          </Tabs>
        </Row>
      </div>
    </Container> )
  }

  return (
    <>
     { loading ? <Spinner animation="border" variant="secondary" /> : renderProfile() }
    </>
  )
}

export default ProfilePage;