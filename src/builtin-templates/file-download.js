export default function fileDownloadTemplate({ filename, name, url }, sdk) {
    const container = document.createElement('span');
    const placeholder = document.createElement('p');
    const anchor = document.createElement('a');

    anchor.target = '_blank';
    anchor.rel = 'noopener';
    anchor.className = 'summary__file-icon';
    anchor.appendChild(document.createTextNode(name || filename));

    placeholder.textContent = 'Preparing a download link...';
    container.appendChild(placeholder);

    sdk.getJobFile(url).then(
        blob => {
            anchor.href = URL.createObjectURL(blob);
            container.replaceChild(anchor, placeholder);
        },
        error => {
            console.error('Error downloading file:', error.stack);
            placeholder.textContent = 'Error downloading file.';
        }
    );

    return container;
}
