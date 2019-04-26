const formSerializer = require('form-serialize');
const camelCaseKeys = require('camelcase-keys');

/**
 *
 * @param {HTMLFormElement} form
 * @return {Object}
 */
export default function serialize(form) {
    const obj = formSerializer(form, { empty: true, serializer });
    return camelCaseKeys(obj, { deep: true });
}

// Matches bracket notation.
var brackets = /(\[[^\[\]]*\])/g;

const serializer = function customSerializer(result, key, value) {
    var matches = key.match(brackets);

    // Has brackets? Use the recursive assignment function to walk the keys,
    // construct any missing objects in the result tree and make the assignment
    // at the end of the chain.
    if (matches) {
        var keys = parse_keys(key);
        hash_assign(result, keys, value);
    }
    else {
        // Non bracket notation can make assignments directly.
        var existing = result[key];

        // If the value has been assigned already (for instance when a radio and
        // a checkbox have the same name attribute) convert the previous value
        // into an array before pushing into it.
        //
        // NOTE: If this requirement were removed all hash creation and
        // assignment could go through `hash_assign`.

        if (existing) {
            if (!Array.isArray(existing)) {
                result[key] = [ existing ];
            }
            result[key].push(value);
        }
        else {
            result[key] = value;
        }
    }

    return result;
};

function parse_keys(string) {
    var keys = [];
    var prefix = /^([^\[\]]*)/;
    var children = new RegExp(brackets);
    var match = prefix.exec(string);

    if (match[1]) {
        keys.push(match[1]);
    }

    while ((match = children.exec(string)) !== null) {
        keys.push(match[1]);
    }

    return keys;
}

function hash_assign(result, keys, value) {
    if (keys.length === 0) {
        result = value;
        return result;
    }

    var key = keys.shift();
    console.log('key', key);
    if (key.includes('-$number')) {
        key = key.replace('-$number', '');
        const num = Number.parseInt(value);
        if (isNaN(num)) {
            console.error('number type is specified but non-number value is provided:', value);
        } else {
            value = num;
        }
    }

    if (key.includes('-$boolean')) {
        key = key.replace('-$boolean', '');
        try {
            value = JSON.parse(value);
        } catch(err) { // do nothing
            console.error('boolen type is specified but non-boolean value is provided:', value);
        }
    }

    var between = key.match(/^\[(.+?)\]$/);


    if (key === '[]') {
        result = result || [];

        if (Array.isArray(result)) {
            result.push(hash_assign(null, keys, value));
        }
        else {
            // This might be the result of bad name attributes like "[][foo]",
            // in this case the original `result` object will already be
            // assigned to an object literal. Rather than coerce the object to
            // an array, or cause an exception the attribute "_values" is
            // assigned as an array.
            result._values = result._values || [];
            result._values.push(hash_assign(null, keys, value));
        }

        return result;
    }

    // Key is an attribute name and can be assigned directly.
    if (!between) {
        result[key] = hash_assign(result[key], keys, value);
    } else {
        var string = between[1];
        // +var converts the variable into a number
        // better than parseInt because it doesn't truncate away trailing
        // letters and actually fails if whole thing is not a number
        var index = +string;

        // If the characters between the brackets is not a number it is an
        // attribute name and can be assigned directly.
        if (isNaN(index)) {
            result = result || {};
            result[string] = hash_assign(result[string], keys, value);
        }
        else {
            result = result || [];
            result[index] = hash_assign(result[index], keys, value);
        }
    }

    return result;
}

