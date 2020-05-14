<template>
    <ValidationObserver ref="dataFormObserver" v-slot="{validation,reset}">
        <v-form @submit.prevent="saveUser()" id="saveUser" autocomplete="off">
            <v-card>
                <v-card-title>
                    <div class="subtitle-2">
                        DATOS GENERALES
                    </div>
                </v-card-title>
                <v-col>
                    <v-col>
                        <v-row class="justify-sm-space-between">
                            <v-btn color="primary" class="mb-5" rounded depressed
                                   v-on:click="tempSrc=null">
                                Cambiar
                            </v-btn>
                            <v-btn type="submit" form="saveUser" color="primary" rounded depressed>
                                Guardar
                            </v-btn>
                        </v-row>
                    </v-col>
                    <v-col class="ml-1 ">
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
                        <img v-else id="face-preview" :src="tempSrc || '/img/user.png'"
                             :alt="player.username" width="100px" ml="6">
                    </v-col>
                </v-col>
                <v-col>
                    <v-card-text>
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
                    </v-card-text>
                </v-col>
            </v-card>
        </v-form>
    </ValidationObserver>
</template>

<script>
    import validateMixin from '../../mixins/validation';
    import profilesMixin from '../../mixins/accounts/profiles';
    import { mapMutations } from 'vuex';
    import { ValidationProvider, ValidationObserver } from 'vee-validate';
    export default {
        name: 'GeneralDataPlayer',
        mixins: [validateMixin, profilesMixin],
        components: {
            ValidationProvider,
            ValidationObserver
        },
        data() {
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
                genders: ['Masculino', 'Femenino'],
                tempSrc: null,
                photoFileUser: null,
                date: new Date().toISOString().substr(0, 10),
                calendar: false
            };
        },
        created() {
            const player = this.$store.state.auth.user;
            this.player = {
                _id: player._id,
                firstName: player.profile.nombre,
                lastName: player.profile.lastName,
                username: player.username,
                perfil: player.profile.perfil,
                email: player.emails[0].address,
                path: player.profile.path,
                gender: player.profile.gender,
                birthday: player.profile.birthday,
                phone: {
                    lada: player.profile.phone.lada,
                    number: player.profile.phone.number
                }
            };
        },
        computed:{
            computedDateFormatted () {
                return this.formatDate(this.player.birthday)
            }
        },
        mounted() {
            this.renderImage();
        },
        methods: {
            renderImage() {
                let pathImage = 'users/'+ this.player.username+'/'+ this.player.username + '.jpg';
                console.log(pathImage);
                Meteor.call('getImageSrc', { assetPath: pathImage }, (err, src) => {
                    this.tempSrc = src;
                });
            },
            ...mapMutations('auth', ['setUser']),
            formatDate (birthday) {
                if (!birthday) return null
                const [year, month, day] = birthday.split('-');
                return `${month}/${day}/${year}`
            },
            async saveUser() {
                if (await this.isFormValid(this.$refs.dataFormObserver)) {
                    console.log(this.player);
                    Meteor.call('savePlayer',{player: this.player, photoFileUser: this.photoFileUser }, (err) => {
                            if (err) {
                                console.error('Error to save user: ', err);
                                this.$alert.showAlertSimple('error', 'Ocurrió un error al guardar la configuración.');
                            } else {
                                this.setUser(Meteor.user());
                                this.$root.$emit('setUserLogged');
                                this.$alert.showAlertSimple('success', 'Se ha guardado la nueva configuración.');
                            }
                    });
                   /* Meteor.call('saveUser', { user: this.user, photoFileUser: this.photoFileUser },
                        (err) => {
                            if (err) {
                                console.error('Error to save user: ', err);
                                this.$alert.showAlertSimple('error', 'Ocurrió un error al guardar la configuración.');
                            } else {
                                this.setUser(Meteor.user());
                                this.$root.$emit('setUserLogged');
                                this.$alert.showAlertSimple('success', 'Se ha guardado la nueva configuración.');
                            }
                        });*/
                }
            }
        }
    };
</script>

<style scoped>

</style>