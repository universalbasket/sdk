import { html } from '/web_modules/lit-html.js';
import { ifDefined } from '/web_modules/lit-html/directives/if-defined.js';

import PriceDisplay from '../../../src/builtin-templates/price-display.js'

function getTermsAndConditions() {
    return {
        "type": "StructuredText",
        "name": "Here's the legal bit",
        "contents": [
            {
                "type": "StructuredText",
                "name": "Sky Broadband",
                "contents": [
                    {
                        "type": "Text",
                        "text": "New 18 month minimum terms and separate contracts for Sky Broadband, Sky Talk and Sky Broadband Boost. Standard prices apply after 18 months (currently £25pm for Sky Broadband Essential; £32pm for Sky Broadband Superfast; £0-£12pm Sky Talk; and £5pm for Sky Broadband Boost."
                    },
                    {
                        "type": "Text",
                        "text": "Sky Broadband Essential: Available in Sky Network Areas only. Set up fee: £0 for new to Sky Broadband customers, £10 for existing Sky Broadband & Sky TV customers adding Sky Broadband Essential.Average download speed: 11Mbps. Average upload speed: 0.8Mb."
                    },
                    {
                        "type": "Text",
                        "text": "Sky Broadband Superfast: Available in Sky Fibre Areas only. Set up fee: £0 for new to Sky Broadband customers, £10 for existing Sky Fibre & Sky TV customers adding Sky Broadband Superfast, or £50 for existing non-Sky Fibre customers adding Sky Broadband Superfast.Average download speed:59Mb. Average upload speed: 18Mb. Speeds vary by location. You will receive the fastest Sky Fibre service available in your area."
                    },
                    {
                        "type": "Text",
                        "text": "Sky Broadband Boost: Available to Sky Broadband Essential or Superfast customers only. Remote line monitoring may involve up to 90 second daily outage. Sky Broadband Buddy app requires activation. Includes waiving surcharge for evening and weekend engineer visits. Sky Mobile customers will receive 2GB of data credited to their Sky Piggybank for each full outage of 30 mins or longer capped at three credits per calendar month and 18 credits in any 18 month period (allow 24 hours for credit to be applied)."
                    },
                    {
                        "type": "Text",
                        "text": "Sky Broadband Buddy: Sky Broadband Buddy app required on compatible iOS or Android devices (see sky.com/buddy for software and device requirements). Sky recommends that all devices connected to the internet are protected with anti-virus software at all times."
                    },
                    {
                        "type": "Text",
                        "text": "Speed Guarantee for Sky Broadband Superfast customers: Based on throughput speed. If the download speed to your Sky Hub drops below your Guaranteed Minimum Download Speed within the first 30 days of your service, we will give you your money back. Actual speeds may be lower. Speed check must be done using sky.com/speedguaranteehelp for more information"
                    },
                    {
                        "type": "Text",
                        "text": "Sky Broadband general: £9.95 router delivery charge applies. Speeds vary significantly by location. External factors such as internet congestion and home wiring can affect speed. Wi-Fi speeds vary by device and home entertainment. No traffic management policy for Sky Broadband. See sky.com/shop/terms-conditions/broadband for more details and our Usage Policies."
                    },
                    {
                        "type": "Text",
                        "text": "Sky subscribes to Ofcom's Voluntary Code of Practice on broadband speeds."
                    },
                    {
                        "type": "Text",
                        "text": "Sky Essentials: Not available to existing Sky TV, Broadband or Fibre customers. Sky Network areas only. Includes: Sky+ functionality (no Sky TV channel content): £6pm, Sky Broadband Essential (including line rental): £20pm & Sky Talk Anytime: £0pm. 18 month minimum term. 3 year price promise excludes non-inclusive call rates. Standard prices apply after 36 months: Currently Sky+ functionality £10pm, Sky Broadband Essential £25pm, & Sky Talk Anytime £10pm. If you remove any service, or change your Sky Talk pack, standard price will apply for the services you keep. £25 upfront fee; includes router delivery £9.95 and £15.05 for Sky+ Box with standard set up. Further terms apply. Sky Broadband: Average download speeds of 11Mbps. Average upload speeds of 0.8Mb. Speeds vary significantly by location. No traffic management policy for Sky Broadband in the home. External factors such as internet congestion can affect speed. See sky.com/shop/terms-conditions/broadband for more details and our Usage Policies. Sky Hub: Range may be affected by home environment.Sky Talk Anytime: Compatible line required otherwise £20 connection charge may apply. UK calls to 01, 02 & 03 and mobile numbers only (excludes Channel Islands, indirect access, dial-up internet and 070 numbers). Inclusive UK landline calls last up to an hour, then charged at 15.5ppm at any time of day or hang up and redial. Calls to 0845 and 0870 numbers are subject to Sky's Access Charge of 15ppm and the owning operator's Service Charge. Inclusive calls to UK Mobile (07) numbers last up to an hour, then are charged at 19.35p per minute during the day and 18p per minute during the evening, or hang up and redial. 070 Personal Numbering and 076 Paging charge-bands do not constitute UK Mobile. A flat charge of 2p per minute applies to geographic landline calls to Austria, Australia, Belgium, Canada, Cyprus, Czech Republic, Denmark, France, Germany, Greece, Hungary, Irish Republic, Italy, Luxembourg, Netherlands, New Zealand, Norway, Poland, Spain, Sweden, Switzerland and USA (also includes calls to mobiles in Canada and USA) irrespective of the length of the call. A 23p connection fee applies to all international calls. Subject to Acceptable and fair use policies apply - see sky.com/talk General Legals: Subject to status. Upfront payment may be required. Separate contracts apply to Sky TV, Sky Broadband/Fibre and Sky Talk. Non-standard set-up may cost extra. Weekend set up £15 extra. Prices may vary if you live in a flat. You must get any consents required (e.g. landlord’s). This offer isn’t available with any other offers. Calls to Sky cost 7ppm plus your provider’s access charge. Further terms apply. Correct at 24 May 2019."
                    }
                ]
            },
            {
                "type": "StructuredText",
                "name": "General & further terms",
                "contents": [
                    {
                        "type": "Text",
                        "text": "Subject to status. Upfront payment may be required. Prices may go up during your subscription. Non-standard set-up may cost extra. Prices may vary if you live in a flat. Sky functionality requires two satellite feeds. You must get any consents required (e.g. landlord's)."
                    },
                    {
                        "type": "Text",
                        "text": "UK, Channel Islands and Isle of Man residential customers only. These offers are not available with any other offers. Further terms apply. Correct at 14 May 2019."
                    },
                    {
                        "type": "Text",
                        "text": "Calls to Sky for non-Sky Talk customers cost 7p per minute plus your provider's access charge. Calls to 080 numbers are free. Calls to non-inclusive service numbers on a Sky Talk tariff will be charged 15p per minute access charge and a service charge from the owning operator."
                    }
                ]
            },
            {
                "type": "StructuredText",
                "name": "Copyrights",
                "contents": [
                    {
                        "type": "Text",
                        "text": "Paw Patrol© Spin Master PAW Productions Inc. ©2017 Viacom International Inc. ©Simon Emmett for Sky UK Limited ©Sky UK Ltd © 2019 Showtime ©Sky UK Limited"
                    }
                ]
            }
        ]
    }
}

function getOneOffCosts() {
    return {
        "contents": [
            {
                "type": "NamedPrice",
                "name": "Sky Q 1TB box Install Fee",
                "price": {
                    "value": 2000,
                    "currencyCode": "gbp"
                }
            },
            {
                "type": "NamedPrice",
                "name": "Broadband Hardware Delivery Charge",
                "price": {
                    "value": 995,
                    "currencyCode": "gbp"
                }
            },
            {
                "type": "NamedPrice",
                "name": "Broadband Activation Fee",
                "price": {
                    "value": 1000,
                    "currencyCode": "gbp"
                }
            },
            {
                "price": {
                    "value": 2000,
                    "currencyCode": "gbp"
                },
                "name": "Pay now",
                "type": "NamedPrice"
            },
            {
                "price": {
                    "value": 1995,
                    "currencyCode": "gbp"
                },
                "name": "Added to next bill",
                "type": "NamedPrice"
            }
        ],
        "name": "One off costs",
        "type": "StructuredText"
    }
}

function getMonthlyCosts() {
    return {
        "type": "StructuredText",
        "name": "Monthly costs",
        "contents": [
            {
                "type": "NamedPrice",
                "name": "Sky Entertainment",
                "price": {
                    "value": 2200,
                    "currencyCode": "gbp"
                }
            },
            {
                "type": "NamedPrice",
                "name": "Sky Broadband Essential",
                "price": {
                    "value": 2000,
                    "currencyCode": "gbp"
                }
            },
            {
                "type": "NamedPrice",
                "name": "Sky Broadband Boost",
                "price": {
                    "value": 250,
                    "currencyCode": "gbp"
                }
            },
            {
                "type": "NamedPrice",
                "name": "Sky Talk Line Rental",
                "price": {
                    "value": 0,
                    "currencyCode": "gbp"
                }
            },
            {
                "type": "NamedPrice",
                "name": "Sky Talk Anytime Extra",
                "price": {
                    "value": 500,
                    "currencyCode": "gbp"
                }
            },
            {
                "type": "NamedPrice",
                "name": "Smart Connectivity",
                "price": {
                    "value": 0,
                    "currencyCode": "gbp"
                }
            }
        ]
    }
}

const showModal = (detail) => new CustomEvent('show-modal', {detail});

export default (inputs = {}, outputs = {}, cache = {}, local = {}) => html`
<div>
    ${inputs.selectedBroadbandPackage || inputs.selectedTvPackages || inputs.selectedPhonePackage ?
        html`
        <div id="package-detail" class="summary__block ${cache.finalPrice ? 'summary__block--list' : ''}">
            <ul class="dim">
                ${inputs.selectedBroadbandPackage ? html`<li>Broadband: ${inputs.selectedBroadbandPackage.name}</li>` : ''}
                ${inputs.selectedTvPackages ? html`<li> TV: ${inputs.selectedTvPackages.map(_ => _.name).join(', ')}</li>` : ''}
                ${inputs.selectedPhonePackage ? html`<li> Phone: ${inputs.selectedPhonePackage.name}</li>` : ''}
                <li>
                    <span
                        class="popup-icon"
                        @click=${() => window.dispatchEvent(showModal({
                            name: '10% Vet fee excess',
                            contents: html`
                                <p class="dim">Lorem ipsum dolor sit amet, consectetur adipiscing elit. Fusce posuere erat elit, sed tincidunt velit venenatis ac. Vivamus vel nulla orci. Etiam mattis, mauris eget tristique blandit, arcu tellus condimentum nisl, eget dictum libero dolor in erat. Quisque placerat mattis maximus. Cras et fringilla lorem. Vivamus sed rutrum neque. Aliquam pulvinar sem eros, accumsan eleifend est finibus in. Ut et nisl vitae est condimentum faucibus. Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia Curae; Ut at ex at lacus varius aliquam.</p>
                                <p class="dim">Morbi orci metus, commodo sit amet suscipit ac, pharetra eu mauris. Morbi sagittis lacus vel lacus finibus mollis. Phasellus arcu velit, viverra a eros ac, semper fringilla lectus. Sed varius sodales sapien nec auctor. Nam eget ornare lectus. Proin vehicula, urna nec congue rutrum, nunc odio pharetra nibh, eu dictum justo ante ut risus. Ut vulputate rhoncus dolor, id pharetra nisl semper quis. Nam tristique molestie lacinia. Aliquam vestibulum gravida ex id consequat. Suspendisse quis porta libero, cursus ultrices enim.</p>
                            `})
                        )}>
                        <span class="clickable">10% Vet fee excess</span>
                    </span>
                </li>
            </ul>
        </div>` : ''
    }

    ${cache.finalPrice ?
        html`<div class="summary__block">
            <b class="large highlight">
                ${PriceDisplay(cache.finalPrice)}
            </b>
        </div>` :
        ''
    }

    <div class="summary__block summary__block--docs">
        <p><b>Documents</b></p>
        <ul class="dim">
            <li class="file-icon">Insurance product information</li>
            <li class="file-icon">Essential information</li>
            <li class="file-icon">Policy wording</li>
        </dim>
    </div>


    ${true ? html`
        <div class="summary__block summary__block--docs">
            <p><b>Other information</b></p>
            <ul class="dim">
                <li>
                    <span
                        class="popup-icon"
                        @click=${() => window.dispatchEvent(showModal(getTermsAndConditions()))}>
                        <span class="clickable">Here's the legal bit</span>
                    </span>
                </li>
                <li>
                    <span
                        class="popup-icon"
                        @click=${() => window.dispatchEvent(showModal(getOneOffCosts()))}>
                        <span class="clickable">One off costs</span>
                    </span>
                </li>
                <li>
                    <span
                        class="popup-icon"
                        @click=${() => window.dispatchEvent(showModal(getMonthlyCosts()))}>
                        <span class="clickable">Monthly costs</span>
                    </span>
                </li>

                ${
                    Object.values(outputs)
                        .filter(o => o.type === 'StructuredText')
                        .map(o => html`
                            <li>
                                <span
                                    class="popup-icon"
                                    @click=${() => window.dispatchEvent(showModal(o))}>
                                    <span class="clickable">${o.name}</span>
                                </span>
                            </li>`)
                }
            </ul>
        </div>` :
        ''
    }
</div>`;
