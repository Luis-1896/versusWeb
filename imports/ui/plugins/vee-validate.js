import { extend, localize } from 'vee-validate';
import { required, email, min, confirmed } from 'vee-validate/dist/rules';
import validatorEs from 'vee-validate/dist/locale/es';

localize('es', validatorEs);
extend('email', email);
extend('required', required);
extend('min', min);
extend('confirmed', confirmed);
extend('strength_password', {
    message: field => `El campo ${field} debe contener al menos: 1 letra mayúscula, 1 letra minúscula, 1 número y un
   carácter especial (por ejemplo,. _ &? Etc.)`,
    validate: value => {
        const strongRegex = new RegExp("^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*\_\.\/\?\¡\¿])(?=.{8,})");
        return strongRegex.test(value);
    }
})