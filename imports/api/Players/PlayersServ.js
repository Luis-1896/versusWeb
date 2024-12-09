import {Profile} from "../Profiles/Profile";
import {ResponseMessage} from "../../startup/server/BusinessClass/ResponseMessage";
import fileHelper from "../../startup/server/FileOperations";
import Utilities from "../../startup/server/Utilities";
import {check} from 'meteor/check'
import {Meteor} from "meteor/meteor";

const PATH_USER_FILES = "users/";
const EXTENSION_LOGO_IMAGE = ".jpg";

export default {
    setUserRoles(idUser, perfil) {
        let permisos = Profile.findOne({name: perfil}).permissions;
        Meteor.users.update(idUser, {
            $set: {
                roles: {}
            }
        });
        Roles.setUserRoles(idUser, permisos, perfil);
    },
    isAvailableNewUsername(oldUsername, newUsername) {
        let targetUsername = [];
        let isAvailable = false;
        if (oldUsername !== newUsername) {
            targetUsername = Meteor.users.find({username: newUsername}).fetch();
            if (targetUsername.length === 0) {
                isAvailable = true;
            }
        }
        return isAvailable;
    },
    isAvailableNewEmail(oldEmail, newEmail) {
        let targetEmail = [];
        let isAvailable = false;
        if (oldEmail !== newEmail) {
            targetEmail = Meteor.users.find({"emails.address": newEmail}).fetch();
                if (targetEmail.length === 0) {
                    isAvailable = targetEmail;
                }
        }
        return isAvailable;
    },
    async updatePlayer(newUser, photoFileUser){
        let responseMessage = new ResponseMessage();
        let currentUser = Meteor.users.findOne(newUser._id);
        let isAvailableNewEmail=this.isAvailableNewEmail(currentUser.emails[0].address, newUser.email);
        let isAvailableNewUserName=this.isAvailableNewUsername(currentUser.username, newUser.username);

        if (currentUser.emails[0].address !== newUser.email && !isAvailableNewEmail) {
            throw new Meteor.Error("500", "El nuevo email ya se encuentra en uso");
        }
        if (currentUser.username !== newUser.username && !isAvailableNewUserName) {
            throw new Meteor.Error("500", "El nuevo nombre de usuario ya se encuentra en uso");
        }

        if (currentUser.emails[0].address !== newUser.email) {
            Accounts.removeEmail(newUser._id, currentUser.emails[0].address);
            Accounts.addEmail(newUser._id, newUser.email);
        }

        if(currentUser.username !== newUser.username){
            Accounts.setUsername(newUser._id, newUser.username);
            if(fileHelper.existsUserDirectory(currentUser.username)){
                let isSuccessChangeFoldername=await fileHelper.updateUserFoldername(currentUser.username, newUser.username);
                if(!isSuccessChangeFoldername){
                    throw new Meteor.Error("500", "Hubo error al actualizar el directorio del jugador");
                }
                let isSucessChangeResourceFilesUser = await fileHelper.updateLogoAndThumbnailNamesOfUser(
                    currentUser.username + EXTENSION_LOGO_IMAGE, newUser.username + EXTENSION_LOGO_IMAGE,
                    PATH_USER_FILES + newUser.username);
                if (!isSucessChangeResourceFilesUser) {
                    throw new Meteor.Error("500", "Hubo error al actualizar los recursos del jugador");
                }
            }
        }
        Meteor.users.update(newUser._id,{
            $set:{
                profile: {
                    perfil: newUser.perfil,
                    nombre: newUser.firstName,
                    lastName: newUser.lastName,
                    gender: newUser.gender,
                    birthday: newUser.birthday,
                    phone: {
                        lada: newUser.phone.lada,
                        number: newUser.phone.number
                    },
                    updated_at: Utilities.currentLocalDate(),
                    path: PATH_USER_FILES + newUser.username
                }
            }
        });
        this.setUserRoles(newUser._id, newUser.perfil);
        if (photoFileUser) {
            newUser["path"] = PATH_USER_FILES + newUser.username;
            let base64Image = photoFileUser.split(";base64,").pop();
            let isError = await fileHelper.saveFileFromBase64(base64Image,
                newUser.username + EXTENSION_LOGO_IMAGE, `users/${newUser.username}`);
            if (isError) {
                throw new Meteor.Error('500', 'Error al guardar los recursos del jugador. (1)', isError);
            } else {
                let error = await fileHelper.updateThumbnail(`users/${newUser.username}`, newUser.username + EXTENSION_LOGO_IMAGE);
                if (error) {
                    console.log('There was an error creating the thumbnail', error);
                    throw new Meteor.Error('500', 'Error al guardar los recursos del jugador. (2)');
                }
            }
        }
        responseMessage.isStatus = true;
        responseMessage.message = "Player updated successful";
        return responseMessage;
    }
}