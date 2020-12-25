import React, { Fragment } from 'react';

import formatToYYYYMMDD from './../utils/dateFormatter';

import './../styles/user/edit_profile_pop_up.css';

class ProfileEditPopUp extends React.Component {
  constructor() {
    super();

    this.state = {
      profileEditData: {
        name: '',
        dob: '',
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      },
      clickedEditButton: '',
      passwordChangeSuccess: false,
      wasPasswordWrong: false
    };
  }

  handleNameChange = e => {
    this.setState({
      profileEditData: {
        ...this.state.profileEditData,
        name: e.target.value
      }
    });
  };

  handleDobChange = e => {
    this.setState({
      profileEditData: {
        ...this.state.profileEditData,
        dob: e.target.value
      }
    });
  };

  handleCurrentPasswordChange = e => {
    this.setState({
      profileEditData: {
        ...this.state.profileEditData,
        currentPassword: e.target.value
      }
    });
  };

  handleNewPasswordChange = e => {
    this.setState({
      profileEditData: {
        ...this.state.profileEditData,
        newPassword: e.target.value
      }
    });
  };

  handleConfirmPasswordChange = e => {
    this.setState({
      profileEditData: {
        ...this.state.profileEditData,
        confirmPassword: e.target.value
      }
    });
  };

  handleFieldEditButtonClick = e => {
    e.preventDefault();

    this.setState({
      ...this.state.profileEditData,
      clickedEditButton: e.target.id
    });
  };

  handleEditCancelClick = e => {
    e.preventDefault();

    if (this.state.clickedEditButton) {
      this.setState({
        profileEditData: {
          name: '',
          dob: '',
          currentPassword: '',
          newPassword: '',
          confirmPassword: ''
        },
        clickedEditButton: ''
      });
    }
  };

  handleEditSubmit = e => {
    e.preventDefault();

    const editedItem = e.target.id.split('-')[1];

    if (editedItem === 'name' && this.state.profileEditData.name) {
      //send request to change name
      this.props.onNameEditSubmit(this.state.profileEditData.name);

      return this.setState({ clickedEditButton: '' });
    }

    if (editedItem === 'dob' && this.state.profileEditData.dob) {
      //send request to change dob
      this.props.onDOBEditSubmit(this.state.profileEditData.dob);

      return this.setState({ clickedEditButton: '' });
    }

    if (editedItem === 'password' && this.state.profileEditData.currentPassword) {
      if (!this.validatePassword()) return;

      return this.props.onPasswordChangeSubmit({
        currentPassword: this.state.profileEditData.currentPassword,
        newPassword: this.state.profileEditData.confirmPassword
      })
        .then(response => {
          this.setState({
            passwordChangeSuccess: true,
            clickedEditButton: ''
          });
        })
        .catch(err => {
          this.setState({
            wasPasswordWrong: true
          });
        });
    }
  };

  validatePassword = () => {
    const { newPassword, confirmPassword } = this.state.profileEditData;

    if ((newPassword.length < 6 || confirmPassword.length < 6) ||
      (confirmPassword !== newPassword)) {
      return false;
    }

    return true;
  };

  render() {
    return (
      <div className="profile-edit-popup">
        <div className="profile-edit-container">
          <h3>Edit Profile</h3>
          <div className="profile-edit-wrapper-form">
            <div className="profile-edit-field-container">
              <div className="profile-edit-field-wrapper">
                <label className="profile-edit-field-label">
                  Name:&ensp;
                </label>
                {this.state.clickedEditButton === 'edit-name-button' ? (
                  <input
                    className="profile-edit-input-field"
                    type="text"
                    name="user-name"
                    defaultValue={this.props.userData.name}
                    onChange={this.handleNameChange}
                    autoFocus />
                ) : (
                    <span>{this.props.userData.name}</span>
                  )}
              </div>

              <div className="edit-action-buttons">
                {this.state.clickedEditButton === 'edit-name-button' ? (
                  <Fragment>
                    <button
                      id="save-name-button"
                      onClick={this.handleEditSubmit}>
                      Save
                    </button>
                    <button
                      id="cancel-name-button"
                      onClick={this.handleEditCancelClick}>
                      Cancel
                    </button>
                  </Fragment>
                ) : (
                    <button
                      id="edit-name-button"
                      onClick={this.handleFieldEditButtonClick}
                      style={{
                        backgroundImage: `url(edit-solid.svg)`
                      }} />
                  )}
              </div>
            </div>

            <div className="profile-edit-field-container">
              <div className="profile-edit-field-wrapper">
                <label className="profile-edit-field-label">
                  DOB:&ensp;
                </label>
                {this.state.clickedEditButton === 'edit-dob-button' ? (
                  <input
                    className="profile-edit-input-field"
                    type="date"
                    defaultValue={formatToYYYYMMDD(this.props.userData.dob)}
                    onChange={this.handleDobChange} />
                ) : (
                    <span>{this.props.userData.dob}</span>
                  )}
              </div>

              <div className="edit-action-buttons">
                {this.state.clickedEditButton === 'edit-dob-button' ? (
                  <Fragment>
                    <button
                      id="save-dob-button"
                      onClick={this.handleEditSubmit}>
                      Save
                    </button>
                    <button
                      id="cancel-dob-button"
                      onClick={this.handleEditCancelClick}>
                      Cancel
                    </button>
                  </Fragment>
                ) : (
                    <button
                      id="edit-dob-button"
                      onClick={this.handleFieldEditButtonClick}
                      style={{
                        backgroundImage: `edit-solid.svg)`
                      }} />
                  )}
              </div>
            </div>

            <div className="profile-edit-field-container">
              <div className="profile-edit-field-wrapper">
                <label className="profile-edit-field-label">
                  Password:&ensp;
                </label>
                {this.state.clickedEditButton === 'edit-password-button' ? (
                  <div className="password-edit-field-container">
                    <input
                      className={this.state.wasPasswordWrong
                        ? 'profile-edit-input-field current-password-wrong'
                        : 'profile-edit-input-field'
                      }
                      type="password"
                      defaultValue=""
                      placeholder="Current Password"
                      onChange={this.handleCurrentPasswordChange} />
                    {this.state.wasPasswordWrong ? (
                      <label className="password-wrong-label">
                        Wrong Password!
                      </label>
                    ) : ''}
                    <input
                      className="profile-edit-input-field"
                      type="password"
                      defaultValue=""
                      placeholder="New Password"
                      onChange={this.handleNewPasswordChange} />
                    {this.state.profileEditData.newPassword.length > 0 &&
                      this.state.profileEditData.newPassword.length < 6 ? (
                        <label className="password-length-constraint-label">
                          At least 6 characters!
                        </label>
                      ) : ''}
                    <input
                      className={this.validatePassword()
                        ? 'profile-edit-input-field password-change-match'
                        : 'profile-edit-input-field password-change-not-match'
                      }
                      type="password"
                      defaultValue=""
                      placeholder="Confirm New Password"
                      onChange={this.handleConfirmPasswordChange} />
                  </div>
                ) : ''}
                <div className="edit-action-buttons">
                  {this.state.clickedEditButton === 'edit-password-button' ? (
                    <Fragment>
                      <button
                        id="save-password-button"
                        onClick={this.handleEditSubmit}>
                        Save
                      </button>
                      <button
                        id="cancel-password-button"
                        onClick={this.handleEditCancelClick}>
                        Cancel
                      </button>
                    </Fragment>
                  ) : (
                      <Fragment>
                        {this.state.passwordChangeSuccess ? (
                          <label className="password-successfully-changed-label">
                            Password Successfully Changed
                          </label>
                        ) : (
                            <button
                              id="edit-password-button"
                              onClick={this.handleFieldEditButtonClick}>
                              Change
                            </button>
                          )}
                      </Fragment>
                    )}
                </div>
              </div>
            </div>
          </div>

          <button
            className="edit-profile-close-button"
            onClick={e => this.props.onClosePopUpClick(e)}>
            Close
          </button>
        </div>
      </div>
    );
  }
}

export default ProfileEditPopUp;
