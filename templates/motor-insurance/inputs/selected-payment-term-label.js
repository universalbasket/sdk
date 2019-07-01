function label(key) {
    return {
        'annual-card': 'Annual',
        'monthly-card': 'Monthly by credit/debit card',
        'monthly-directdebit': 'Monthly by direct debit',
        'monthly-directdebit-card': 'Monthly by direct debit'
    }[key];
}

export default label;
