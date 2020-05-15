<template>
    <v-container>
        <v-row class="section-body">
            <v-col lg="6" sm="6">
                <h2>Amigos</h2>
            </v-col>
            <v-col lg="6" sm="6">
                <h2>Agregar amigos</h2>
                <v-card>
                    <v-sheet
                            id="scrolling-techniques-2"
                            class="overflow-y-auto"
                            max-height="500">
                        <v-list style="...">
                            <v-card
                                    class="mx-auto mb-3"
                                    max-width="344"
                                    outlined
                                     v-for="(user,i) in users"
                            >
                                <v-list-item three-line>
                                    <v-list-item-content>
                                        <div class="overline mb-4">{{user.profile.nombre}}</div>
                                        <v-list-item-title class="headline mb-1">{{user.profile.lastName}}</v-list-item-title>
                                        <v-list-item-subtitle>{{user.profile.perfil}}</v-list-item-subtitle>
                                    </v-list-item-content>
                                    <v-avatar size="36px">
                                        <img :src="'./api/getUserThumbnail/'+user._id || '/img/user.png'" alt="Avatar">
                                    </v-avatar>
                                </v-list-item>

                                <v-card-actions>
                                    <v-btn v-on:click="addFriend(user)">Agregar</v-btn>
                                    <v-btn text>Eliminar</v-btn>
                                </v-card-actions>
                            </v-card>
                        </v-list>
                    </v-sheet>
                </v-card>
            </v-col>

        </v-row>
    </v-container>
</template>

<script>
    import {mapMutations} from 'vuex';
    import date from "../../../mixins/helpers/date";

    export default {
        name: 'FriendRequest',
        mixins: [date],
        data() {
            return {
                friends:{
                    idSender: null,
                    idFriendRequest: null,
                    date: null,
                    accept: null
                }
            };
        },
        methods:{
            addFriend(friend){
                this.friends.idSender=Meteor.userId();
                this.friends.idFriendRequest= friend._id;
                this.friends.date=this.currentLocalDate().toISOString();
                console.log(this.friends);
            }
        },
        meteor: {
            $subscribe:{
                'users':[]
            },
            users() {
                const usuarios= Meteor.users.find({ _id: { $ne: Meteor.userId()}}).fetch();
                const jugadores=usuarios.filter(function(usuario){
                    return usuario.profile.perfil==='player';
                });
                return jugadores;
            }
        }
    }
</script>

<style scoped>

</style>