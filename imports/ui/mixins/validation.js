export default {
    methods: {
        async isFormValid(observer) {
            const valid = await observer.validate();
            if (!valid) {
                this.$alert.showAlertFull('mdi-close-circle',
                    'error',
                    'Error en el formulario',
                    '',
                    5000,
                    'right',
                    'bottom',
                    'Por favor complete todos los campos obligatorios con valores válidos.'
                );
            }
            return valid;
        },
        /**
         * Validación de un objeto json con ciertas reglas.
         * @param object
         * @param rules
         * @returns {boolean}
         */
        validateFields(object, rules) {

            let valid = true, found;

            // Check the object has all the mandatory fields
            rules.forEach((rule) => {
                if (rule.required && !object.hasOwnProperty(rule.field)) {
                    valid = false;
                    console.log(`Object does not have the mandatory field ${ rule.field }`);
                }
            });

            // Validate the field values, and remove extra fields.
            if (valid) {

                for (let key in object) {

                    found = false;

                    rules.some((rule) => {
                        if (key === rule.field) {
                            found = true;
                            if (object[key] !== null && object[key] !== undefined &&
                                object[key].constructor === rule.type) {

                                if (rule.type === Array) {
                                    object[key].some((item) => {
                                        return !(valid = this.validateFields(item, rule.itemRules));
                                    });
                                } else if (rule.type === Object) {
                                    valid = this.validateFields(object, rule.itemRules);
                                } else if (rule.type === String || rule.type === Number) {
                                    valid = true;
                                }

                            } else {
                                valid = false;
                            }
                            //console.log('Field: ', rule.field, 'Value', object[key], 'valid', valid);
                            return true;
                        }
                    });

                    if (found === false) {
                        delete object[key];
                        //console.log(`An extra field has been removed: ${ key }`);
                    } else if (valid === false) {
                        break;
                    }
                }
            }

            return valid;
        }
    }
};