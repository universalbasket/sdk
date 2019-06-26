const template = ({
    filename,
    name,
    url,
    sdk = { getJobFile: () => { throw new Error('fix me'); } }
}) => {
    const linkText = document.createTextNode(name || filename);
    let blob;

    try {
        blob = sdk.getJobFile(url);
    } catch (e) {
        console.warn(e);
        return linkText;
    }

    const a = document.createElement('a');
    const href = URL.createObjectURL(blob);

    a.setAttribute('href', href);
    a.setAttribute('target', '_blank');
    a.setAttribute('class', 'summary__file-icon');
    a.appendChild(linkText);

    return a;
};

export default template;

