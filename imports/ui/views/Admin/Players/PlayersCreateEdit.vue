<template>
    <v-container>
        <v-row>
            <v-col>
                <div class="headline">{{dataView.title}}</div>
            </v-col>
            <v-col cols="2">
                <v-btn block type="submit" form="savePlayer" color="primary"
                v-text="dataView.targetButton"></v-btn>
            </v-col>
        </v-row>
        <v-row>
            <v-col>
                <v-card>
                    <v-card-text>
                        <ValidationObserver ref="playerFormObserver" v-slot="{validation, reset}">
                            <v-form @submit.prevent="savePlayer" id="savePlayer" autocomplete="off">
                                <v-row>
                                    <v-col sm="4" md="4">
                                        <v-col>
                                            <v-btn color="primary" class="mb-5" v-if="tempSrc" rounded depressed
                                                   v-on:click="tempSrc=null">
                                                Cambiar
                                            </v-btn>
                                        </v-col>
                                        <v-image-input v-if="!tempSrc" v-model="photoFileUser"
                                                       :image-width="100"
                                                       :image-height="150"
                                                       overlay-background-color="rgba(0,0,0,0.5)"
                                                       overlay-boder-color="#fff"
                                                       overlay-padding="0px"
                                                       rotate-clockwise-icon="mdi-rotate-right"
                                                       rotate-counter-clockwise-icon="mdi-rotate-left"
                                                       upload-icon="cloud_upload"
                                                       scaling-slider-color
                                                       clearable image-format="jpg"/>
                                        <img v-else id="face-preview" :src="tempSrc || 'img/user.png'"
                                             :alt="player.firstName" width="100px">
                                    </v-col>
                                    <v-col sm="8" md="8">
                                        <ValidationProvider v-slot="{ errors }" name="nombre" rules="required">
                                            <v-text-field v-model="player.firstName"
                                                          id="inputfirstName"
                                                          name="firstName"
                                                          :error-messages="errors"
                                                          label="Nombre de pila" required>
                                            </v-text-field>
                                        </ValidationProvider>
                                        <ValidationProvider v-slot="{ errors }" name="apellidos" rules="required">
                                            <v-text-field v-model="player.lastName"
                                                          id="inputlastName"
                                                          name="lastName"
                                                          :error-messages="errors"
                                                          label="Apellidos" required>
                                            </v-text-field>
                                        </ValidationProvider>
                                        <ValidationProvider v-slot="{ errors }" name="usuario" rules="required">
                                            <v-text-field v-model="player.username"
                                                          id="inputUsername"
                                                          :error-messages="errors"
                                                          name="username"
                                                          label="Usuario" required>
                                            </v-text-field>
                                        </ValidationProvider>
                                        <ValidationProvider v-slot="{ errors }" name="correo electronico"
                                                            rules="required|email">
                                            <v-text-field v-model="player.email"
                                                          id="inputEmail"
                                                          :error-messages="errors"
                                                          name="email"
                                                          label="Correo electrónico"
                                                          required>
                                            </v-text-field>
                                        </ValidationProvider>
                                        <ValidationProvider v-slot="{ errors }" name="genero" rules="required">
                                            <v-select v-model="player.gender" :items="genders" id="selectGender"
                                                      item-text="description" item-value="gender"
                                                      :error-messages="errors"
                                                      label="Genero"
                                                      required></v-select>
                                        </ValidationProvider>
                                        <ValidationProvider v-slot="{ errors }" name="fecha de cumpleaños" rules="required">
                                            <v-col cols="12" lg="12">
                                                <v-menu
                                                    v-model="calendar"
                                                    :close-on-content-click="false"
                                                    transition="scale-transition"
                                                    offset-y
                                                    max-width="290px"
                                                    max-height="290px"
                                                >
                                                    <template v-slot:activator="{on}">
                                                        <v-text-field
                                                            v-model="computedDateFormatted"
                                                            label="Fecha de nacimiendo"
                                                            hint="MM/DD/YYYY Formato"
                                                            persistent-hint
                                                            prepend-icon="event"
                                                            readonly
                                                            v-on="on"
                                                        ></v-text-field>
                                                    </template>
                                                        <v-date-picker v-model="player.birthday" no-title  @input="calendar = false"></v-date-picker>
                                                </v-menu>
                                            </v-col>
                                        </ValidationProvider>
                                        <v-row>
                                            <v-col cols="4" lg="3">
                                                <ValidationProvider v-slot="{ errors }" name="lada" rules="required">
                                                    <v-text-field v-model="player.phone.lada"
                                                                  id="inputLada"
                                                                  :error-messages="errors"
                                                                  name="lada"
                                                                  label="Lada" required
                                                    >
                                                    </v-text-field>
                                                </ValidationProvider>
                                            </v-col>
                                            <v-col cols="6" lg="6">
                                                <ValidationProvider v-slot="{ errors }" name="numero" rules="required">
                                                    <v-text-field v-model="player.phone.number"
                                                                  id="inputNumber"
                                                                  :error-messages="errors"
                                                                  name="number"
                                                                  label="Número" required>
                                                    </v-text-field>
                                                </ValidationProvider>
                                            </v-col>
                                        </v-row>

                                    </v-col>
                                </v-row>
                            </v-form>
                        </ValidationObserver>
                    </v-card-text>
                </v-card>
            </v-col>
        </v-row>
    </v-container>
</template>

<script>
    import validateMixin from '../../../mixins/validation';
    import { ValidationProvider, ValidationObserver } from 'vee-validate';
    import { Profile } from '../../../../api/Profiles/Profile';

    export default {
        name: 'PlayersCreateEdit',
        mixins: [validateMixin],
        components: {
            ValidationObserver,
            ValidationProvider
        },
        data(){
            return {
                player: {
                    _id: null,
                    firstName: null,
                    lastName: null,
                    username: null,
                    email: null,
                    perfil: 'player',
                    gender: null,
                    birthday: new Date().toISOString().substr(0, 10),
                    phone: {
                        lada: null,
                        number: null
                    }
                },
                dataView: {
                    title: '',
                    targetButton: ''
                },
                genders: ['Masculino', 'Femenino'],
                tempSrc: null,
                photoFileUser: null,
                date: new Date().toISOString().substr(0, 10),
                calendar: false
            };
        },
        created() {
            if (this.$router.currentRoute.name.includes('create')) {
                this.dataView.title = 'Crear usuario';
                this.dataView.targetButton = 'Crear';
            }
        },
        computed: {
            computedDateFormatted () {
                return this.formatDate(this.player.birthday)
            }
        },
        methods: {
            formatDate (birthday) {
                if (!birthday) return null
                const [year, month, day] = birthday.split('-');
                return `${month}/${day}/${year}`
            },
            async savePlayer(){
                if(await this.isFormValid(this.$refs.playerFormObserver)){
                    this.$loader.activate('Guardando jugador ...');
                    Meteor.call('savePlayer', {player: this.player, photoFileUser: this.photoFileUser}, err => {
                        this.$loader.deactivate();
                        if (err) {
                            console.log('error: ', err);
                            this.$alert.showAlertSimple('error', 'Ocurrió un error al crear el jugador.');
                        } else {
                            this.$alert.showAlertSimple('success', 'Se ha guardado este jugador.');
                            this.$router.push({ name: 'home.players' });
                        }
                    });
                }
            }
        }
    }
</script>

<style scoped></style>