import React from 'react';
import { Avatar } from 'antd';
import PropTypes from 'prop-types';

const UserAvatar = ({ user }) => {
    const { username, displayName, photo } = user;
    return <Avatar src={photo}>{displayName[0].toUpperCase()}</Avatar>;
};

UserAvatar.propTypes = {
    user: PropTypes.object.isRequired,
};
export default UserAvatar;
