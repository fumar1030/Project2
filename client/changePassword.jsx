const helper = require('./helper.js');
const React = require('react');
const { createRoot } = require('react-dom/client');

const handleChangePassword = (e) => {
    e.preventDefault();
    helper.hideError();

    const username = e.target.querySelector('#user').value;
    const oldPass = e.target.querySelector('#oldPass').value;
    const newPass = e.target.querySelector('#newPass').value;
    const newPass2 = e.target.querySelector('#newPass2').value;

    if (!username || !oldPass || !newPass || !newPass2) {
        helper.handleError('All fields are required!');
        return false;
    }

    if (newPass !== newPass2) {
        helper.handleError('New passwords do not match!');
        return false;
    }

    helper.sendPut(e.target.action, { username, oldPass, newPass, newPass2 });
    return false;
};

const ChangePasswordWindow = (props) => {
    return (
        <form id="changePasswordForm"
            name="changePasswordForm"
            onSubmit={handleChangePassword}
            action="/changePassword"
            method="PUT"
            className="mainForm"
        >
            <label htmlFor="username">Username: </label>
            <input id="user" type="text" name="username" placeholder="username" />
            <label htmlFor="oldPass">Old Password: </label>
            <input id="oldPass" type="password" name="oldPass" placeholder="old password" />
            <label htmlFor="newPass">New Password: </label>
            <input id="newPass" type="password" name="newPass" placeholder="new password" />
            <label htmlFor="newPass2">Retype New Password: </label>
            <input id="newPass2" type="password" name="newPass2" placeholder="retype new password" />
            <input className="formSubmit" type="submit" value="Change Password" />
        </form>
    );
};

const init = () => {
    const root = createRoot(document.getElementById('content'));
    root.render(<ChangePasswordWindow />);
};

window.onload = init;