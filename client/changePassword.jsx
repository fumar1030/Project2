const helper = require('./helper.js');
const React = require('react');
const { createRoot } = require('react-dom/client');

const handleChangePassword = async (e) => {
  e.preventDefault();
  helper.hideError();

  const oldPass = e.target.querySelector('#oldPass').value;
  const newPass = e.target.querySelector('#newPass').value;
  const newPass2 = e.target.querySelector('#newPass2').value;

  if (!oldPass || !newPass || !newPass2) {
    helper.handleError('All fields are required!');
    return false;
  }

  if (newPass !== newPass2) {
    helper.handleError('New passwords do not match!');
    return false;
  }

  const response = await fetch('/changePassword', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ oldPass, newPass, newPass2 }),
  });

  const result = await response.json();
  if (!response.ok) {
    helper.handleError(result.error);
  } else {
    alert(result.message);
    window.location.href = '/garden';
  }

  return false;
};

const ChangePasswordForm = () => {
  return (
    <form
      id="changeForm"
      name="changeForm"
      onSubmit={handleChangePassword}
      method="POST"
      className="mainForm"
    >
      <label htmlFor="oldPass">Current Password: </label>
      <input id="oldPass" type="password" name="oldPass" placeholder="Current password" />

      <label htmlFor="newPass">New Password: </label>
      <input id="newPass" type="password" name="newPass" placeholder="New password" />

      <label htmlFor="newPass2">Confirm New Password: </label>
      <input id="newPass2" type="password" name="newPass2" placeholder="Confirm password" />

      <input className="formSubmit" type="submit" value="Change Password" />
    </form>
  );
};

const init = () => {
  const root = createRoot(document.getElementById('content'));
  root.render(<ChangePasswordForm />);
};

window.onload = init;
