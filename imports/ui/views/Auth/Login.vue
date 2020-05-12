<template>
    <div class="login-wrapper">
        <div class="title secondary--text">Bienvenido!</div>
        <div class="display-1 mb-0 secondary--text">Iniciar sesión</div>
        <ValidationObserver ref="loginObserver" v-slot="{validate, reset}">
            <v-form @submit.prevent="login" autocomplete="nope">
                <ValidationProvider v-slot="{errors}" name=" " rules="required">
                    <v-text-field id="inputUser" v-model="user.userOrEmail" autocomplete="off" required color="primary"
                                  type="text" :error-messages="errors" label="Usuario" name="email" prepend-icon="person">
                    </v-text-field>
                </ValidationProvider>
                <ValidationProvider v-slot="{errors}" name="contraseña" rules="required">
                    <v-text-field id="inputPassword" label="Contraseña" name="password" prepend-icon="lock"
                                  :error-messages="errors" v-model="user.password" required type="password">
                    </v-text-field>
                </ValidationProvider>
                <div class="d-flex justify-end">
                    <v-btn color="primary" tabindex="-1" text :to="{name:'olvideMiContrasena'}" small>¿Olvidé mi contraseña?</v-btn>
                </div>
                <div class="d-flex justify-start">
                    <v-btn type="submit" rounded color="primary" transition="fade">Entrar</v-btn>
                </div>
            </v-form>
        </ValidationObserver>
    </div>
</template>

<script>
    import { mapState, mapMutations } from 'vuex';
    import validateMixin from '../../mixins/validation'
    import {ValidationProvider, ValidationObserver} from 'vee-validate';

    export default {
        mixins: [validateMixin],
        name: "Login",
        components: {
            ValidationProvider,
            ValidationObserver
        },
        data() {
            return {
                user: {
                    userOrEmail: '',
                    password: ''
                },
                error: false,
            };
        },
        computed: {
            ...mapState('auth', ['errorMessage'])
        },
        methods: {
            ...mapMutations('auth', ['setUser', 'authError']),
            async login() {
                if (await this.isFormValid(this.$refs.loginObserver)) {
                    Meteor.loginWithPassword(this.user.userOrEmail, this.user.password, (err) => {
                        if (err) {
                            this.authError(err.error);
                            this.error = true;
                            this.$alert.showAlertFull("mdi-close-circle","error", "Credenciales incorrectas",
                                '', 5000, "right", "bottom");
                        } else {
                            this.$alert.closeAlert();
                            this.setUser(Meteor.user());
                            this.$router.push({ name: 'home' });
                        }
                    });
                }
            },
        },
        async mounted() {
            await this.$refs.loginObserver.reset();
        }
    }
</script>

<style scoped>
    .login-wrapper {
        margin-top: 45px;
    }
</style>
