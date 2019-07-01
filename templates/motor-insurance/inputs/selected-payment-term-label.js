const labels = {
    'annual-card': 'Annual',
    'monthly-card': 'Monthly by credit/debit card',
    'monthly-directdebit': 'Monthly by direct debit',
    'monthly-directdebit-card': 'Monthly by direct debit'
};

export default function label(key) {
    return labels[key] || key;
}
