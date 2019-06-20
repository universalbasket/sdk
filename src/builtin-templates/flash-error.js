export default function(element, err) {
    console.error(err);

    if (!element) {
        return;
    }

    const message = (typeof err === 'string' ? err : 'Please check the items in red below.')
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;');

    return element.innerHTML = `
        <div class="flash-error">
            <p><b class="large">We’re sorry, something is missing or wrong.</b></p>
            <p>${message}</p>
        </div>
    `;
}

