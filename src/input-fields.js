import kebabcase from '/web_modules/lodash.kebabcase.js';

export default class InputFields {
    constructor(useFields, fields = []) {
        this.useFields = useFields;
        this.fields = fields.map(field => {
            const [root, ...rest] = field.split('.');

            return kebabcase(root) + rest.map(part => `[${kebabcase(part)}]`).join('');
        });
    }

    has(key) {
        return !this.useFields || this.fields.some(field => field.startsWith(key));
    }
}
