import { html } from '/src/main.js';
import Person from '../../generic/person.js';
import Address from '../../generic/address.js';

export default () => html`
<div name="direct-debit" class="filed-set">
    <div class="field">
        <label class="field__name" for="direct-debit[sort-code]">Sort Code</label>
        <input type="text" name="direct-debit[sort-code]" placeholder="56-00-29" pattern="\d{2}-?\d{2}-?\d{2}" required />
    </div>

    <div class="field">
        <label class="field__name" for="direct-debit[account-number]">Account Number</label>
        <input type="text" name="direct-debit[account-number]" placeholder="26207729" pattern="\d{8}" required/>
    </div>

    ${Person('direct-debit[account-holder]')}
    ${Address('direct-debit[account-holder-address]')}
</div>
`;
