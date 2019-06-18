function template(type) {
    switch (type) {
    case 'vat':
        return 'VAT';

    case 'total-now':
        return 'pay now';

    case 'total-later':
    case 'total-later-supplier':
        return 'pay later';

    case 'total-overall':
    case 'total-overall-supplier':
        return 'TOTAL';

    case 'others':
        return '';

    default:
        return type.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
    }
}

export default template;
