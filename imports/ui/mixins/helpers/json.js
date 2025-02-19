export default {
    methods: {
        /**
         * Set all key values to null recursively.
         * @param json
         */
        setNulls(json) {
            for (let jsonKey in json) {
                if (json[jsonKey].constructor === Number || json[jsonKey].constructor === String) {
                    json[jsonKey] = null;
                } else if (json[jsonKey].constructor === Object) {
                    this.setNulls(json[jsonKey]);
                }
            }
        },
        /**
         * Extracts specific key values from object2 and assign them to object1.
         * @param object1
         * @param object2
         * @return boolean: true => successful copy, false => copy failed.
         */
        copyValues(object1, object2) {
            let result = true;
            if (object2.constructor === Object) {
                for (let key in object1) {
                    if (object2.hasOwnProperty(key)) {
                        object1[key] = object2[key];
                    } else {
                        result = false;
                    }
                }
            } else {
                result = false;
            }
            return result;
        },
        findObjectByValue(array, key, searchValue) {
            let result = false;
            array.some(object => {
                if (object.hasOwnProperty(key) && object[key] === searchValue) {
                    result = object;
                    return true;
                }
            });
            return result
        }
    }
}
