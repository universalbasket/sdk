const template = ({ filename, url, sdk }) => {
    return sdk.getJobFile(url)
        .then(blob => {
            const a = document.createElement('a');
            const href = URL.createObjectURL(blob);
            const linkText = document.createTextNode(filename);

            a.setAttribute('href', href);
            a.setAttribute('target', '_blank');
            a.setAttribute('class', 'summary__file-icon');
            a.appendChild(linkText);

            return a;
        });
};

export default template;

