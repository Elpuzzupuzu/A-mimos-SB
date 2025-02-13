

const paypal = require ('paypal-rest-sdk');

paypal.configure({
    mode : 'sandbox',
    client_id : 'AdTbVoPnf0DeVTJad7H-nAkCeg2br3YwI7sPGkqc6ynfqY6_zwRsqc70ovaNJQ9v-wFs9r32MzRvNnKM',
    client_secret : 'EGbhrVn3Y6vdaa9eJ0ufKSAZpcVNTEtKxq9p7fqaTNYXdxkrM5r84JF4dVWXt3-6t5wEb7AsycPQhW15',
})


module.exports = paypal;