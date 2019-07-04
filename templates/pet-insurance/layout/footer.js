export default function footer() {
    const footer = document.createElement('div');
    footer.className = 'footer';
    footer.innerHTML = '<small>© [Client name]</small>';

    return footer;
}
