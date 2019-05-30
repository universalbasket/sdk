import { html } from '../../src/lit-html';
const predefined = {
    "justMoved": true,
    "sharedProperty": false,
    "restartLine": false,
    "additionalLine": false
};

export default () => html`
    <input type="hidden" name="landline-options-$object" value="${JSON.stringify(predefined)}" />
`;
