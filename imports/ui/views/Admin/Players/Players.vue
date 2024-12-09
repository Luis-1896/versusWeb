<template>
    <v-container>
        <v-row justify="center">
            <v-col xs="12" sm="12" md="10" lg="8" xl="5">
                <transition name="nested-section-view">
                    <div v-if="activeMainView">
                        <div class="d-flex flex-row-reverse mb-5">
                          <v-tooltip bottom transition="fab-transition">
                               <template v-slot:activator="{on}">
                                   <v-btn color="success" v-on="on" fab dark :to="{name:'home.players.create'}">
                                       <v-icon>add</v-icon>
                                   </v-btn>
                               </template>
                               <span>Agregar Jugador</span>
                           </v-tooltip>
                        </div>

                        <v-data-table :headers="headers" :items="users" sort-by="profile" class="elevation-1">
                            <template v-slot:item.profile.path="{item}">
                                <v-avatar size="36px">
                                    <img :src="'./api/getUserThumbnail/'+item._id || '/img/user.png'" alt="Avatar">
                                </v-avatar>
                            </template>
                            <template v-slot:item.status.online="{item}">
                                <v-icon :color="item.status.online?'green':'red'">
                                    mdi-checkbox-blank-circle
                                </v-icon>
                            </template>
                            <template v-slot:body.append="{isMobile}">
                                <tr v-if="!isMobile">
                                    <td>
                                    </td>
                                    <td>
                                    </td>
                                    <td>
                                        <v-text-field v-model="headersData.firstName" type="text"
                                                      label="Nombre"></v-text-field>
                                    </td>
                                    <td>
                                        <v-text-field v-model="headersData.lastName" type="text"
                                                      label="Apellidos"></v-text-field>
                                    </td>
                                    <td>
                                        <v-text-field v-model="headersData.username" type="email"
                                                      label="Usuario"></v-text-field>
                                    </td>
                                    <td></td>
                                </tr>
                            </template>


                        </v-data-table>

                    </div>
                </transition>
                <transition name="nested-section-view">
                    <router-view name="playersOptionsView"></router-view>
                </transition>
            </v-col>
        </v-row>
    </v-container>
</template>

<script>
    import {mapMutations} from 'vuex';

    export default {
        name:"Players",
        data() {
            return{
                userTemp:{
                  preposition: 'al',
                  typeElement: 'usuario',
                  mainNameElement: '',
                  _id: null,
                  element:{}
                },
                search: '',
                headersData:{
                  path:'',
                  status: {},
                  firstName: '',
                  lastName: '',
                  username:''
                },
                activeMainView: true
            };
        },
        watch: {
            '$route'() {
                this.updateMainView();
            }
        },
        mounted() {
            this.updateMainView();
        },
        methods:{
            ...mapMutations('temporal', ['setElement']),
            updateMainView() {
                let currentRoute = this.$router.currentRoute.name.split('.').pop();
                this.activeMainView = (currentRoute === 'players');
            },
        },
        computed: {
            headers() {
                return [
                    {
                        value: 'profile.path', text: 'Imagen', sortable: false
                    },
                    {
                        value: 'status.online', text: 'En línea', sortable: true
                    },
                    {
                        value: 'profile.nombre', text: 'Nombre', sortable:true, filter: value => {
                            return value != null &&
                                    typeof value === 'string' &&
                                    value.toString().toLocaleLowerCase()
                                    .indexOf(this.headersData.firstName.toLocaleLowerCase()) !== -1;
                        }
                    },
                    {
                        value: 'profile.lastName', text: 'Apellidos', sortable:true, filter: value => {
                            return value != null &&
                                typeof value === 'string' &&
                                value.toString().toLocaleLowerCase()
                                    .indexOf(this.headersData.lastName.toLocaleLowerCase()) !== -1;
                        }
                    },
                    {
                        value: 'username', text: 'Usuario', sortable:true, filter: value => {
                            return value != null &&
                                typeof value === 'string' &&
                                value.toString().toLocaleLowerCase()
                                    .indexOf(this.headersData.username.toLocaleLowerCase()) !== -1;
                        }
                    }
                ]
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