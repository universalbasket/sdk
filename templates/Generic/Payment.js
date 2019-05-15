import { html } from '../../src/lit-html';
import Person from './Person';
import Address from './Address';

const CARD_BRANDS = ['visa, mastercard, amex, discover'];

export default (prefix = 'payment') => html`
<div class="filed-set">
    ${Person(`${prefix}[person]`)}

    <div name="${prefix}[card]" class="filed-set">
        <div class="field">
            <span class="field__name">Type</span>
            <div class="field__inputs group group--merged">
                <input type="radio" name="${prefix}[card][type]" id="${prefix}[card][type]-debit" value="debit"/>
                <label for="${prefix}[card][type]-debit" class="button">debit</label>

                <input type="radio" name="${prefix}[card][type]" id="${prefix}[card][type]-credit" value="credit"/>
                <label for="${prefix}[card][type]-credit" class="button">credit</label>
            </div>
        </div>

        <div class="field">
            <label class="field__name">brand</label>
            <select name="${prefix}[card][brand]">
                ${ CARD_BRANDS.map(c => html`
                <option value="${c}" /> ${ c }</option>`
                ) }
            </select>
        </div>

        <div class="field">
            <label class="field__name" for="pan">Card Number</label>
            <input type="text"
                name="pan"
                id= "pan",
                maxlength="19"
                placeholder="XXXX XXXX XXXX XXXX"
                required />
        </div>

        <div class="field">
            <label class="field__name" for="${prefix}[card][expiration-date]">Expiry Date</label>
            <input type="text"
                name="${prefix}[card][expiration-date]"
                id= "expiry-year",
                maxlength="8"
                placeholder="YYYY-MM"
                value="2020-10"
                required />
        </div>

        <div class="field">
            <label class="field__name" for="${prefix}[card][name]">name</label>
            <input type="text"
                name="${prefix}[card][name]"
                placeholder="Jane Doe"
                value="Jane Doe"
                required />
        </div>

        <div class="field">
            <label class="field__name" for="${prefix}[card][cvv]">cvv</label>
            <input type="tel"
                name="${prefix}[card][cvv]"
                placeholder="000"
                maxlength="4"
                value="123"
                required />
        </div>
    </div>

    ${Address(`${prefix}[address]`)}
</div>
`;
