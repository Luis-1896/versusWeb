import {Meteor} from 'meteor/meteor';
import {ValidatedMethod} from 'meteor/mdg:validated-method';
import AuthGuard from './../../middlewares/AuthGuard';
import {ResponseMessage} from '../../startup/server/BusinessClass/ResponseMessage';
import {check} from 'meteor/check';
import Utilities from "./../../startup/server/Utilities";
import fileHelper from './../../startup/server/FileOperations';
import UsersServ from '../Users/UsersServ';
import PlayersServ from "./PlayersServ";

// Permisos
import Permissions from "../../startup/server/Permissions";

export const savePlayerMethod = new ValidatedMethod({
    name: 'savePlayer',
    mixins: [MethodHooks],
    permissions: [Permissions.PLAYERS.CREATE, Permissions.PLAYERS.UPDATE],
    beforeHooks: [AuthGuard.checkPermission],
    validate({player}) {
        check(player.firstName, String);
        check(player.lastName, String);
        check(player.username, String);
        check(player.perfil, String);
        check(player.gender, String);
        check(player.phone.lada, String);
        check(player.phone.number, String);
    },
    async run({player, photoFileUser}) {
        let responseMessage = new ResponseMessage();
        console.log(player);
        if (player._id !== null) {//Si existe entonces actualiza
            try {
                check(player._id, String);
                await PlayersServ.updatePlayer(player, photoFileUser);
                responseMessage.create(true, "Jugador actualizado");
            } catch (err) {
                console.error("Error updating user: ", err);
                throw new Meteor.Error("500", "Error al actualizar el jugador.", err);
            }
        } else {//Sino entonces lo crea
            try {
                let userData = {
                    username: player.username,
                    email: player.email,
                    profile: {
                        perfil: player.perfil,
                        nombre: player.firstName,
                        lastName: player.lastName,
                        gender: player.gender,
                        birthday: player.birthday,
                        phone: {
                          lada: player.phone.lada,
                          number: player.phone.number
                        },
                        updated_at: Utilities.currentLocalDate()
                    }
                };
                await UsersServ.createUser(userData, photoFileUser);
                responseMessage.create(true, "Jugador creado");
            } catch (err) {
                console.error("Error creating user: ", err);
                throw new Meteor.Error("500", "Error al crear el Jugador", err);
            }
        }
        return responseMessage;
    }
});