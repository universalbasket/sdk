import { html } from '../../src/lit-html';

export default () => html`
<div name="account" class="filed-set">
    <div class="field">
        <label class="field__name" for="account[email]">Email</label>
        <input type="email" name="account[email]" placeholder="example@example.com" value="example@example.com" required>
    </div>

    <div class="field">
        <label class="field__name" for="account[phone]">Phone</label>
        <input type="text" name="account[phone][country-code]" value="gb" required>
        <input type="tel" name="account[phone][number]" placeholder="phone number" value="07912341234" required>
    </div>

    <div>
        <input type="hidden" name="account[password]" value="">
        <input type="hidden" name="account[is-existing-$boolean]" value="false">
    </div>
</div>`;
