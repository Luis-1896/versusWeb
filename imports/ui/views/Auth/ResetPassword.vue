<template>
    <div>
        <div class="title">Reestablecer contraseña</div>
        <ValidationObserver ref="setPasswordFormObserver">
            <v-form @submit.prevent="resetPassword">
                <ValidationProvider v-slot="{errors}" name="nueva contraseña" vid="confirmation" rules="strength_password|required">
                    <v-text-field v-model="user.password" id="inputNewPassword"
                                  :type="showPass.new ? 'text' : 'password'"
                                  name="password"
                                  :error-messages="errors"
                                  label="Nueva contraseña"
                                  autocomplete="new-password"
                                  required>
                        <template v-slot:append>
                            <v-btn icon @click="showPass.new = !showPass.new" tabindex="-1">
                                <v-icon v-if="!showPass.new">mdi-eye</v-icon>
                                <v-icon v-else>mdi-eye-off</v-icon>
                            </v-btn>
                        </template>
                    </v-text-field>
                </ValidationProvider>
                <ValidationProvider v-slot="{errors}" name="confirmar contraseña" rules="required|confirmed:confirmation">
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
                <div class="d-flex start mt-2">
                    <v-btn type="submit" color="primary" rounded>Resetear</v-btn>
                </div>
            </v-form>
        </ValidationObserver>
    </div>
</template>

<script>
    import Errors from '../../mixins/messages/errors';
    import validateMixin from '../../mixins/validation';
    import { ValidationProvider, ValidationObserver } from 'vee-validate';
    import JsonHelper from '../../mixins/helpers/json';

    export default {
        name: 'ResetPassword',
        components: {
            ValidationObserver,
            ValidationProvider
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
            async resetPassword() {
                if(await this.isFormValid(this.$refs.setPasswordFormObserver)) {
                    const token = this.$route.params.token;
                    Accounts.resetPassword(token, this.user.password, (err) => {
                       if(err) {
                           console.error('An error occurred while resetting the password', err);
                           this.$alert.showAlertSimple('error', 'Se produjo un error al resetear la contraseña');
                       } else {
                           this.$alert.showAlertSimple('success', 'Se reestablecio la contraseña exitosamente!');
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