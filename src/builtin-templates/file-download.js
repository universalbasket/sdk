// TODO fix getJobFile of undefined

// function template({ filename, name, url, sdk }) {
//     const linkText = document.createTextNode(name || filename);
//     let blob;

//     try {
//         blob = sdk.getJobFile(url);
//     } catch (e) {
//         console.warn(e);
//         return linkText;
//     }

//     const a = document.createElement('a');
//     const href = URL.createObjectURL(blob);

//     a.setAttribute('href', href);
//     a.setAttribute('target', '_blank');
//     a.setAttribute('class', 'summary__file-icon');
//     a.appendChild(linkText);

//     return a;
// };

function template({ filename, name, url }) {
    const linkText = document.createTextNode(name || filename);
    const a = document.createElement('a');
    const href = url;

    a.setAttribute('href', href);
    a.setAttribute('target', '_blank');
    a.setAttribute('class', 'summary__file-icon');
    a.appendChild(linkText);

    return a;
}

export default template;

