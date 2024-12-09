<template>
    <div>
        <div class="title">Establecer contraseña</div>
        <ValidationObserver ref="setPasswordFormObserver">
            <v-form @submit.prevent="setPassword">
                <ValidationProvider v-slot="{errors}" name="nueva contraseña"
                                    rules="required|min:8|strength_password"
                                    vid="password">
                    <v-text-field v-model="user.password" id="inputNewPassword"
                                  :type="showPass.new ? 'text' : 'password'"
                                  name="password"
                                  :error-messages="errors"
                                  label="Nueva contraseña"
                                  autocomplete="new-password">
                        <template v-slot:append>
                            <v-btn icon @click="showPass.new = !showPass.new" tabindex="-1">
                                <v-icon v-if="!showPass.new">mdi-eye</v-icon>
                                <v-icon v-else>mdi-eye-off</v-icon>
                            </v-btn>
                        </template>
                    </v-text-field>
                </ValidationProvider>
                <ValidationProvider v-slot="{errors}" name="confirmar contraseña" rules="required|confirmed:password">
                    <v-text-field v-model="user.confirmPassword" id="inputConfirmPassword"
                                  :type="showPass.confirm ? 'text' : 'password'"
                                  :error-messages="errors"
                                  name="password_confirmation"
                                  label="Confirmar contraseña"
                                  required>
                        <template v-slot:append>
                            <v-btn icon @click="showPass.confirm = !showPass.confirm" tabindex="-1">
                                <v-icon v-if="!showPass.confirm">mdi-eye</v-icon>
                                <v-icon v-else>mdi-eye-off</v-icon>
                            </v-btn>
                        </template>
                    </v-text-field>
                </ValidationProvider>
                <div class="d-flex justify-start mt-2">
                    <v-btn type="submit" color="primary" rounded>Enviar</v-btn>
                </div>
            </v-form>
        </ValidationObserver>
    </div>
</template>

<script>
    import Errors from '../../mixins/messages/errors';
    import validateMixin from '../../mixins/validation';
    import JsonHelper from '../../mixins/helpers/json';
    import { ValidationProvider, ValidationObserver } from 'vee-validate';

    export default {
        name: 'setInitialPassword',
        components: {
            ValidationProvider,
            ValidationObserver
        },
        mixins: [Errors, validateMixin, JsonHelper],
        data() {
            return {
                user: {
                    password: null,
                    confirmPassword: null
                },
                showPass: {
                    new: false,
                    confirm: false
                }
            };
        },
        methods: {
            async setPassword() {
                if (await this.isFormValid(this.$refs.setPasswordFormObserver)) {
                    const token = this.$route.params.token;
                    Accounts.resetPassword(token, this.user.password, err => {
                        if (err) {
                            console.error('An error occurred while setting the password\n', err);
                            this.$alert.showAlertSimple('error', 'Se produjo un error al establecer la contraseña');
                        } else {
                            this.$alert.showAlertSimple('success', 'Se estableció la contraseña exitosamente');
                            this.$router.push({ name: 'login' });
                        }
                    });
                }
            }
        }
    }
</script>
<style scoped>

</style>