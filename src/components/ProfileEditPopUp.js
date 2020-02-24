import React, { Fragment } from 'react';

import { localhost } from '../constants/config';
import formatToYYYYMMDD from './../utils/dateFormatter';

import './../styles/user/editProfilePopUp.css';

class ProfileEditPopUp extends React.Component {

  constructor() {
    super();

    this.state = {
      profileEditData: {
        name: '',
        dob: '',
      },
      clickedEditButton: '',
    }
  }

  handleNameChange = (e) => {
    this.setState({
      profileEditData: {
        name: e.target.value
      }
    })
  }

  handleDobChange = (e) => {

    this.setState({
      profileEditData: {
        dob: e.target.value
      }
    })
  }

  handleFieldEditButtonClick = (e) => {
    e.preventDefault();

    this.setState({
      clickedEditButton: e.target.id
    });

  }

  handleEditCancelClick = (e) => {

    e.preventDefault();
    if (this.state.clickedEditButton) {
      this.setState({
        clickedEditButton: ''
      })
    }
  }

  handleEditSubmit = (e) => {
    e.preventDefault();
    const editedItem = e.target.id.split('-')[1];

    if (editedItem === 'name') {
      if (this.state.profileEditData.name) {
        //send request to change name
        this.props.onNameEditSubmit(this.state.profileEditData.name);
        this.setState({
          clickedEditButton: ''
        });
      }
    }
    else if (editedItem === 'dob') {
      if (this.state.profileEditData.dob) {
        //send request to change dob
        this.props.onDOBEditSubmit(this.state.profileEditData.dob);
        this.setState({
          clickedEditButton: ''
        });
      }
    }
  }

  render() {

    return (
      <div className="profile-edit-popup">
        <div className="profile-edit-container">
          <h3>
            Edit Profile
          </h3>
          <form className="profile-edit-wrapper-form">
            <div className="profile-edit-field-container">

              <div className="profile-edit-field-wrapper">
                <label htmlFor="user-name">Name: </label>
                {
                  this.state.clickedEditButton === 'edit-name-button' ?
                    <input type="text" name="user-name" defaultValue={this.props.userData.name} onChange={this.handleNameChange} autoFocus>
                    </input> :
                    <span>{this.props.userData.name}</span>
                }
              </div>

              <div className="edit-action-buttons">
                {
                  this.state.clickedEditButton === 'edit-name-button' ?
                    <Fragment>
                      <button id="save-name-button" onClick={this.handleEditSubmit}>Save</button>
                      <button id="cancel-name-button" onClick={this.handleEditCancelClick}>Cancel</button>
                    </Fragment> :
                    <button id="edit-name-button" onClick={this.handleFieldEditButtonClick} style={{ backgroundImage: `url(http://${localhost}:3000/edit-solid.svg)` }}></button>
                }
              </div>

            </div>

            <div className="profile-edit-field-container">
              <div className="profile-edit-field-wrapper">
                <label htmlFor="user-dob">DOB: </label>
                {
                  this.state.clickedEditButton === 'edit-dob-button' ?
                    <input type="date" defaultValue={formatToYYYYMMDD(this.props.userData.dob)} onChange={this.handleDobChange}>
                    </input> :
                    <span>{this.props.userData.dob}</span>
                }
              </div>

              <div className="edit-action-buttons">
                {
                  this.state.clickedEditButton === 'edit-dob-button' ?
                    <Fragment>
                      <button id="save-dob-button" onClick={this.handleEditSubmit}>Save</button>
                      <button id="cancel-dob-button" onClick={this.handleEditCancelClick}>Cancel</button>
                    </Fragment> :
                    <button id="edit-dob-button" onClick={this.handleFieldEditButtonClick} style={{ backgroundImage: `url(http://${localhost}:3000/edit-solid.svg)` }}></button>
                }
              </div>

            </div>
          </form>

          <button className="edit-profile-close-button" onClick={(e) => this.props.onClosePopUpClick(e)}>Close</button>
        </div>
      </div>
    );
  }
}

export default ProfileEditPopUp;