export default {
    cache: [
        {
            key: 'outputKey',
            sourceInputKeys: ['inputKey1', 'inputKey2']
        }
    ],
    pages: [
        {
            name: 'pageName',
            route: '/page-route',
            title: 'Page Title for Progress bar',
            sections: [
                { name: 'sectionNameSameAsTemplateFileName', waitFor: ['dataType.sourceKey'] }
            ]
        }
    ],
    layout: [
        { name: 'header', selector: '#header' },
        { name: 'summary',  selector: '#summary' },
        { name: 'main', selector: '#main', mainTarget: true },
        { name: 'footer', selector: '#footer' }
    ],
    data: {
        serverUrlPath: 'https://url-of-your-server/create-job-using-js-sdk',
        initialInputs: {},
        local: {
            inputA: 'you can put hard-coded inputs or outputs'
        }
    }
}
