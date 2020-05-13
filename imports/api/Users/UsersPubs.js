import {Meteor} from 'meteor/meteor';
import {PermissionMiddleware} from './../../middlewares/PermissionMiddleware';
import Permissions from "../../startup/server/Permissions";

const usersPublication = new PublishEndpoint('users', function () {
    return Meteor.users.find({});
});

usersPublication.use(new PermissionMiddleware([Permissions.USERS.LIST]));