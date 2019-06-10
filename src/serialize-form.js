import formSerialize from '/web_modules/form-serialize.js';
import camelCaseKeys from '/web_modules/camelcase-keys.js';

/**
 * @param {String} selector
 * @return {Object}
 */
export {
    serializeForm,
    getFormInputKeys
};

function serializeForm(selector = 'form', options = {}) {
    const form = document.querySelector(selector);

    if (!form || !(form instanceof HTMLFormElement)) {
        throw new Error('specified form not found');
    }

    const serialized = formSerialize(form, { empty: false, serializer: hashSerializer, ...options });

    return camelCaseKeys(serialized, { deep: true });
}

function getFormInputKeys(formId) {
    const inputs = serializeForm(formId, { empty: true, serializer: null });

    return Object.keys(inputs);
}

/**
 *
 * Below is copied over from form-serialize(https://github.com/defunctzombie/form-serialize) with customization:
 * Added `-$number`, `-$boolean` and `-$object` convention in the name, parse these value with specified data type, and remove the identifier
 */

const brackets = /(\[[^[\]]*\])/g;

function hashSerializer(result, key, value) {
    const matches = key.match(brackets);

    // Has brackets? Use the recursive assignment function to walk the keys,
    // construct any missing objects in the result tree and make the assignment
    // at the end of the chain.
    if (matches) {
        const keys = parseKeys(key);
        hashAssign(result, keys, value);
    } else {
        // Non bracket notation can make assignments directly.
        const parsed = parseType(key, value);
        key = parsed.key;
        value = parsed.value;

        const existing = result[key];

        // If the value has been assigned already (for instance when a radio and
        // a checkbox have the same name attribute) convert the previous value
        // into an array before pushing into it.
        //
        // NOTE: If this requirement were removed all hash creation and
        // assignment could go through `hashAssign`.

        if (existing) {
            if (!Array.isArray(existing)) {
                result[key] = [existing];
            }
            result[key].push(value);
        } else {
            result[key] = value;
        }
    }

    return result;
}

function parseKeys(string) {
    const keys = [];
    const prefix = /^([^[\]]*)/;
    const children = new RegExp(brackets);
    let match = prefix.exec(string);

    if (match[1]) {
        keys.push(match[1]);
    }

    while ((match = children.exec(string)) !== null) {
        keys.push(match[1]);
    }

    return keys;
}

function parseType(key, value) {
    if (key.includes('-$number')) {
        key = key.replace('-$number', '');
        const num = Number.parseInt(value);
        if (isNaN(num)) {
        } else {
            value = num;
        }
    }

    if (key.includes('-$boolean') || key.includes('-$object')) {
        key = key.replace('-$boolean', '');
        key = key.replace('-$object', '');

        try {
            value = JSON.parse(value);
        } catch (err) { // do nothing
            console.warn('boolean/object type is specified but could not parse the value:', value);
        }
    }

    return { key, value };
}

function hashAssign(result, keys, value) {
    if (keys.length === 0) {
        result = value;
        return result;
    }

    let key = keys.shift();

    if (key.includes('-$number')) {
        key = key.replace('-$number', '');
        const num = Number.parseInt(value);
        if (isNaN(num)) {
            console.warn('number type is specified but non-number value is provided:', value);
        } else {
            value = num;
        }
    }

    if (key.includes('-$boolean') || key.includes('-$object')) {
        key = key.replace('-$boolean', '');
        key = key.replace('-$object', '');

        try {
            value = JSON.parse(value);
        } catch (err) { // do nothing
            console.warn('boolean/object type is specified but could not parse the value:', value);
        }
    }

    const between = key.match(/^\[(.+?)\]$/);

    if (key === '[]') {
        result = result || [];

        if (Array.isArray(result)) {
            result.push(hashAssign(null, keys, value));
        } else {
            // This might be the result of bad name attributes like "[][foo]",
            // in this case the original `result` object will already be
            // assigned to an object literal. Rather than coerce the object to
            // an array, or cause an exception the attribute "_values" is
            // assigned as an array.
            result._values = result._values || [];
            result._values.push(hashAssign(null, keys, value));
        }

        return result;
    }

    // Key is an attribute name and can be assigned directly.
    if (!between) {
        result[key] = hashAssign(result[key], keys, value);
    } else {
        const string = between[1];
        // +var converts the variable into a number
        // better than parseInt because it doesn't truncate away trailing
        // letters and actually fails if whole thing is not a number
        const index = +string;

        // If the characters between the brackets is not a number it is an
        // attribute name and can be assigned directly.
        if (isNaN(index)) {
            result = result || {};
            result[string] = hashAssign(result[string], keys, value);
        } else {
            result = result || [];
            result[index] = hashAssign(result[index], keys, value);
        }
    }

    return result;
}

