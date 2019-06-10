import { html } from '/web_modules/lit-html/lit-html.js';
import Modal from '@/src/builtin-templates/modal.js';

describe('Modal UI', () => {
    describe('Unhappy case', () => {
        it('renders empty when no args passed', () => {
            const result = Modal();
            expect(result).toBe('');
            expect(result.type).toBe(undefined);
        });

        it('renders empty when unsupported type of arg passed', () => {
            const result = Modal(`
                <p class="dim">Lorem ipsum dolor sit amet, consectetur adipiscing elit. Fusce posuere erat elit, sed tincidunt velit venenatis ac. Vivamus vel nulla orci. Etiam mattis, mauris eget tristique blandit, arcu tellus condimentum nisl, eget dictum libero dolor in erat. Quisque placerat mattis maximus. Cras et fringilla lorem. Vivamus sed rutrum neque. Aliquam pulvinar sem eros, accumsan eleifend est finibus in. Ut et nisl vitae est condimentum faucibus. Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia Curae; Ut at ex at lacus varius aliquam.</p>
                <p class="dim">Morbi orci metus, commodo sit amet suscipit ac, pharetra eu mauris. Morbi sagittis lacus vel lacus finibus mollis. Phasellus arcu velit, viverra a eros ac, semper fringilla lectus. Sed varius sodales sapien nec auctor. Nam eget ornare lectus. Proin vehicula, urna nec congue rutrum, nunc odio pharetra nibh, eu dictum justo ante ut risus. Ut vulputate rhoncus dolor, id pharetra nisl semper quis. Nam tristique molestie lacinia. Aliquam vestibulum gravida ex id consequat. Suspendisse quis porta libero, cursus ultrices enim.</p>
            `);

            expect(result).toBe('');
            expect(result.type).toBe(undefined);
        });
    });

    describe('Default use case: show any HTML', () => {
        it('renders template result', () => {
            const result = Modal(html`
                <p class="dim">Lorem ipsum dolor sit amet, consectetur adipiscing elit. Fusce posuere erat elit, sed tincidunt velit venenatis ac. Vivamus vel nulla orci. Etiam mattis, mauris eget tristique blandit, arcu tellus condimentum nisl, eget dictum libero dolor in erat. Quisque placerat mattis maximus. Cras et fringilla lorem. Vivamus sed rutrum neque. Aliquam pulvinar sem eros, accumsan eleifend est finibus in. Ut et nisl vitae est condimentum faucibus. Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia Curae; Ut at ex at lacus varius aliquam.</p>
                <p class="dim">Morbi orci metus, commodo sit amet suscipit ac, pharetra eu mauris. Morbi sagittis lacus vel lacus finibus mollis. Phasellus arcu velit, viverra a eros ac, semper fringilla lectus. Sed varius sodales sapien nec auctor. Nam eget ornare lectus. Proin vehicula, urna nec congue rutrum, nunc odio pharetra nibh, eu dictum justo ante ut risus. Ut vulputate rhoncus dolor, id pharetra nisl semper quis. Nam tristique molestie lacinia. Aliquam vestibulum gravida ex id consequat. Suspendisse quis porta libero, cursus ultrices enim.</p>
            `);

            expect(result).toMatchSnapshot({
                processor: expect.any(Object),
                strings: expect.any(Array),
                type: 'html',
                values: expect.any(Array)
            });
            expect(result.values[0]).toBe(undefined);
            expect(result.values[1]).not.toBe(undefined);
        });

        it('renders with title when the second arg is provided', () => {
            const result = Modal(html`
                <p class="dim">Lorem ipsum dolor sit amet, consectetur adipiscing elit. Fusce posuere erat elit, sed tincidunt velit venenatis ac. Vivamus vel nulla orci. Etiam mattis, mauris eget tristique blandit, arcu tellus condimentum nisl, eget dictum libero dolor in erat. Quisque placerat mattis maximus. Cras et fringilla lorem. Vivamus sed rutrum neque. Aliquam pulvinar sem eros, accumsan eleifend est finibus in. Ut et nisl vitae est condimentum faucibus. Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia Curae; Ut at ex at lacus varius aliquam.</p>
                <p class="dim">Morbi orci metus, commodo sit amet suscipit ac, pharetra eu mauris. Morbi sagittis lacus vel lacus finibus mollis. Phasellus arcu velit, viverra a eros ac, semper fringilla lectus. Sed varius sodales sapien nec auctor. Nam eget ornare lectus. Proin vehicula, urna nec congue rutrum, nunc odio pharetra nibh, eu dictum justo ante ut risus. Ut vulputate rhoncus dolor, id pharetra nisl semper quis. Nam tristique molestie lacinia. Aliquam vestibulum gravida ex id consequat. Suspendisse quis porta libero, cursus ultrices enim.</p>
            `, 'title');

            expect(result).toMatchSnapshot({
                processor: expect.any(Object),
                strings: expect.any(Array),
                type: 'html',
                values: expect.any(Array)
            });
            expect(result.values[0]).toBe('title');
            expect(result.values[1]).not.toBe(undefined);
        });
    });

    describe('Job output use case: show HTML', () => {
        it('renders with HTML contents', () => {
            const jobOutput = getOutput('eligibilityConditions');
            const result = Modal(jobOutput);

            expect(result).toMatchSnapshot({
                processor: expect.any(Object),
                strings: expect.any(Array),
                type: 'html',
                values: expect.any(Array)
            });
            expect(result.values[0]).toBe(jobOutput.name);
            expect(typeof result.values[1]).toBe('function');
        });
    });

    describe('Job output use case: show StructuredText as HTML', () => {
        it('renders with nested Text contents', () => {
            const jobOutput = getOutput('termsAndConditions');
            const result = Modal(jobOutput);

            expect(result).toMatchSnapshot({
                processor: expect.any(Object),
                strings: expect.any(Array),
                type: 'html',
                values: expect.any(Array)
            });
            expect(result.values[0]).toBe(jobOutput.name);
            expect(result.values[1].type).toBe('html');
        });

        it('renders with nested NamedPrice contents', () => {
            const jobOutput = getOutput('oneOffCosts');
            const result = Modal(jobOutput);

            expect(result).toMatchSnapshot({
                processor: expect.any(Object),
                strings: expect.any(Array),
                type: 'html',
                values: expect.any(Array)
            });
            expect(result.values[0]).toBe(jobOutput.name);
            expect(result.values[1].type).toBe('html');
        });

        it('renders with nested NamedText contents', () => {
            const result = Modal({
                type: 'StructuredText',
                name: 'NamedText test',
                contents: [
                    {
                        type: 'NamedText',
                        text: 'Lorem ipsum dolor sit amet',
                        name: 'Text Name'
                    }
                ]
            });

            expect(result).toMatchSnapshot({
                processor: expect.any(Object),
                strings: expect.any(Array),
                type: 'html',
                values: expect.any(Array)
            });
            expect(result.values[0]).toBe('NamedText test');
            expect(result.values[1].type).toBe('html');
        });

        it('renders with nested Link contents', () => {
            const result = Modal({
                type: 'StructuredText',
                name: 'Link test',
                contents: [
                    {
                        type: 'Link',
                        url: 'linkurl',
                        name: 'Link Name'
                    }
                ]
            });

            expect(result).toMatchSnapshot({
                processor: expect.any(Object),
                strings: expect.any(Array),
                type: 'html',
                values: expect.any(Array)
            });
            expect(result.values[0]).toBe('Link test');
            expect(result.values[1].type).toBe('html');
        });
    });
});

const outputs = {
    eligibilityConditions: {
        html: `<div><div><div>
            <p>
                This is the eligibility criteria you must meet in order to take out a Lorem Pet Insurance.
                If you cannot meet this eligibility criteria, please call our dedicated Lorem Pet Team who will be happy to help.
                Call us on <span>0000 000 000</span>.
            </p>
            <h3>Eligibility Criteria</h3>
            <p>You and your pet must meet the following conditions.</p>
            <h3>You</h3>
            <ul>
                <li><span>&gt;</span> Must be the owner and keeper of the pet.</li>
                <li><span>&gt;</span> Must be at least 18 years old.</li>
                <li><span>&gt;</span> Must live permanently at your home address.</li>
                <li><span>&gt;</span> Must live in the United Kingdom, Isle of Man or the Channel Islands.</li>
                <li><span>&gt;</span> Must never have had any pet policy covering this pet declared void or cancelled.</li>
            </ul>
            <h3>Your Pet</h3>
            <ul>
                <li><span>&gt;</span> Must be at least eight weeks old.</li>
                <li><span>&gt;</span> Must live with you at your home address.</li>
                <li><span>&gt;</span> Has not had complaints made about its behaviour.</li>
                <li><span>&gt;</span> Has not been the cause of an incident or legal action.</li>
                <li><span>&gt;</span> Has not been trained to attack, used for security or as a guard dog.</li>
                <li><span>&gt;</span> Is not used for commercial breeding (this means your pet has not been used for breeding more than two times in its life).</li>
                <li><span>&gt;</span> Has not been and is not used for racing.</li>
                <li><span>&gt;</span> Has not been and is not used for fighting.</li>
                <li><span>&gt;</span> Is not used as a business to make money or earn an income.</li>
                <li>
                    <span>&gt;</span> Is not (whether pedigree, cross breed or mixed breed) a Pit Bull, Japanese Tosa, Fila Braziliero, Dogo Argentino, American Bulldog, Wolf or Wolf Hybrid.
                    If your pets breed is not listed on our website we do not insure them unless you have contacted us and we have agreed to do so, please call <span>0000 000 0000</span>.
                </li>
            </ul>
        </div></div></div>`,
        name: 'eligibility conditions',
        type: 'HTML'
    },
    termsAndConditions: {
        'type': 'StructuredText',
        'name': 'Here\'s the legal bit',
        'contents': [
            {
                'type': 'StructuredText',
                'name': 'Lorem Broadband',
                'contents': [
                    {
                        'type': 'Text',
                        'text': 'New 18 month minimum terms and separate contracts for Lorem Broadband, Lorem Talk and Lorem Broadband Boost. Standard prices apply after 18 months (currently £25pm for Lorem Broadband Essential; £32pm for Lorem Broadband Superfast; £0-£12pm Lorem Talk; and £5pm for Lorem Broadband Boost.'
                    },
                    {
                        'type': 'Text',
                        'text': 'Lorem Broadband Essential: Available in Lorem Network Areas only. Set up fee: £0 for new to Lorem Broadband customers, £10 for existing Lorem Broadband & Lorem TV customers adding Lorem Broadband Essential.Average download speed: 11Mbps. Average upload speed: 0.8Mb.'
                    },
                    {
                        'type': 'Text',
                        'text': 'Lorem Broadband Superfast: Available in Lorem Fibre Areas only. Set up fee: £0 for new to Lorem Broadband customers, £10 for existing Lorem Fibre & Lorem TV customers adding Lorem Broadband Superfast, or £50 for existing non-Lorem Fibre customers adding Lorem Broadband Superfast.Average download speed:59Mb. Average upload speed: 18Mb. Speeds vary by location. You will receive the fastest Lorem Fibre service available in your area.'
                    },
                    {
                        'type': 'Text',
                        'text': 'Lorem Broadband Boost: Available to Lorem Broadband Essential or Superfast customers only. Remote line monitoring may involve up to 90 second daily outage. Lorem Broadband Buddy app requires activation. Includes waiving surcharge for evening and weekend engineer visits. Lorem Mobile customers will receive 2GB of data credited to their Lorem Piggybank for each full outage of 30 mins or longer capped at three credits per calendar month and 18 credits in any 18 month period (allow 24 hours for credit to be applied).'
                    },
                    {
                        'type': 'Text',
                        'text': 'Lorem Broadband Buddy: Lorem Broadband Buddy app required on compatible iOS or Android devices (see sky.com/buddy for software and device requirements). Lorem recommends that all devices connected to the internet are protected with anti-virus software at all times.'
                    },
                    {
                        'type': 'Text',
                        'text': 'Speed Guarantee for Lorem Broadband Superfast customers: Based on throughput speed. If the download speed to your Lorem Hub drops below your Guaranteed Minimum Download Speed within the first 30 days of your service, we will give you your money back. Actual speeds may be lower. Speed check must be done using sky.com/speedguaranteehelp for more information'
                    },
                    {
                        'type': 'Text',
                        'text': 'Lorem Broadband general: £9.95 router delivery charge applies. Speeds vary significantly by location. External factors such as internet congestion and home wiring can affect speed. Wi-Fi speeds vary by device and home entertainment. No traffic management policy for Lorem Broadband. See sky.com/shop/terms-conditions/broadband for more details and our Usage Policies.'
                    },
                    {
                        'type': 'Text',
                        'text': 'Lorem subscribes to Ofcom\'s Voluntary Code of Practice on broadband speeds.'
                    },
                    {
                        'type': 'Text',
                        'text': 'Lorem Essentials: Not available to existing Lorem TV, Broadband or Fibre customers. Lorem Network areas only. Includes: Lorem+ functionality (no Lorem TV channel content): £6pm, Lorem Broadband Essential (including line rental): £20pm & Lorem Talk Anytime: £0pm. 18 month minimum term. 3 year price promise excludes non-inclusive call rates. Standard prices apply after 36 months: Currently Lorem+ functionality £10pm, Lorem Broadband Essential £25pm, & Lorem Talk Anytime £10pm. If you remove any service, or change your Lorem Talk pack, standard price will apply for the services you keep. £25 upfront fee; includes router delivery £9.95 and £15.05 for Lorem+ Box with standard set up. Further terms apply. Lorem Broadband: Average download speeds of 11Mbps. Average upload speeds of 0.8Mb. Speeds vary significantly by location. No traffic management policy for Lorem Broadband in the home. External factors such as internet congestion can affect speed. See sky.com/shop/terms-conditions/broadband for more details and our Usage Policies. Lorem Hub: Range may be affected by home environment.Lorem Talk Anytime: Compatible line required otherwise £20 connection charge may apply. UK calls to 01, 02 & 03 and mobile numbers only (excludes Channel Islands, indirect access, dial-up internet and 070 numbers). Inclusive UK landline calls last up to an hour, then charged at 15.5ppm at any time of day or hang up and redial. Calls to 0845 and 0870 numbers are subject to Lorem\'s Access Charge of 15ppm and the owning operator\'s Service Charge. Inclusive calls to UK Mobile (07) numbers last up to an hour, then are charged at 19.35p per minute during the day and 18p per minute during the evening, or hang up and redial. 070 Personal Numbering and 076 Paging charge-bands do not constitute UK Mobile. A flat charge of 2p per minute applies to geographic landline calls to Austria, Australia, Belgium, Canada, Cyprus, Czech Republic, Denmark, France, Germany, Greece, Hungary, Irish Republic, Italy, Luxembourg, Netherlands, New Zealand, Norway, Poland, Spain, Sweden, Switzerland and USA (also includes calls to mobiles in Canada and USA) irrespective of the length of the call. A 23p connection fee applies to all international calls. Subject to Acceptable and fair use policies apply - see sky.com/talk General Legals: Subject to status. Upfront payment may be required. Separate contracts apply to Lorem TV, Lorem Broadband/Fibre and Lorem Talk. Non-standard set-up may cost extra. Weekend set up £15 extra. Prices may vary if you live in a flat. You must get any consents required (e.g. landlord’s). This offer isn’t available with any other offers. Calls to Lorem cost 7ppm plus your provider’s access charge. Further terms apply. Correct at 24 May 2019.'
                    }
                ]
            },
            {
                'type': 'StructuredText',
                'name': 'General & further terms',
                'contents': [
                    {
                        'type': 'Text',
                        'text': 'Subject to status. Upfront payment may be required. Prices may go up during your subscription. Non-standard set-up may cost extra. Prices may vary if you live in a flat. Lorem functionality requires two satellite feeds. You must get any consents required (e.g. landlord\'s).'
                    },
                    {
                        'type': 'Text',
                        'text': 'UK, Channel Islands and Isle of Man residential customers only. These offers are not available with any other offers. Further terms apply. Correct at 14 May 2019.'
                    },
                    {
                        'type': 'Text',
                        'text': 'Calls to Lorem for non-Lorem Talk customers cost 7p per minute plus your provider\'s access charge. Calls to 080 numbers are free. Calls to non-inclusive service numbers on a Lorem Talk tariff will be charged 15p per minute access charge and a service charge from the owning operator.'
                    }
                ]
            },
            {
                'type': 'StructuredText',
                'name': 'Copyrights',
                'contents': [
                    {
                        'type': 'Text',
                        'text': 'Paw Patrol© Spin Master PAW Productions Inc. ©2017 Viacom International Inc. ©Simon Emmett for Lorem UK Limited ©Lorem UK Ltd © 2019 Showtime ©Lorem UK Limited'
                    }
                ]
            }
        ]
    },
    oneOffCosts: {
        'name': 'One off costs',
        'type': 'StructuredText',
        'contents': [
            {
                'type': 'NamedPrice',
                'name': 'Lorem Q 1TB box Install Fee',
                'price': {
                    'value': 2000,
                    'currencyCode': 'gbp'
                }
            },
            {
                'type': 'NamedPrice',
                'name': 'Broadband Hardware Delivery Charge',
                'price': {
                    'value': 995,
                    'currencyCode': 'gbp'
                }
            },
            {
                'type': 'NamedPrice',
                'name': 'Broadband Activation Fee',
                'price': {
                    'value': 1000,
                    'currencyCode': 'gbp'
                }
            },
            {
                'price': {
                    'value': 2000,
                    'currencyCode': 'gbp'
                },
                'name': 'Pay now',
                'type': 'NamedPrice'
            },
            {
                'price': {
                    'value': 1995,
                    'currencyCode': 'gbp'
                },
                'name': 'Added to next bill',
                'type': 'NamedPrice'
            }
        ]
    }
};

function getOutput(key) {
    return Object.assign({}, outputs[key]);
}

