import { html } from 'lit-html';

export default () => html`
    <input type="hidden" name="selected-marketing-contact-options-$object" value="${JSON.stringify(null)}" />
`;