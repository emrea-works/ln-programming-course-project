var express = require('express');
var router = express.Router();
const BTCPAY_PRIV_KEY = "";
const BTCPAY_MERCHANT_KEY = "";

// Initialize the client
const btcpay = require('btcpay')
const keypair = btcpay.crypto.load_keypair(new Buffer.from(BTCPAY_PRIV_KEY, 'hex'));
const client = new btcpay.BTCPayClient(
  'https://lightning.filipmartinsson.com', 
  keypair, { merchant: BTCPAY_MERCHANT_KEY }
);


/* get & verify invoice. */
router.get('/:id', async function(req, res, next) {
	var invoiceId = req.params.id;
	client.get_invoice(invoiceId)
		.then(invoice => {
			if(invoice.status == "complete" || invoice.status == "paid"){
				res.end("<html>Thank you</html>");
			} else {
				res.end("<html>Not paid</html>");
			}
		}).catch(err => console.leog(err));
});

/* Create invoice. */
// POST -> /invoice
router.post('/', function(req, res, next) {
	var dollarAmount = req.body.amount;
	client.create_invoice({ 
    price: dollarAmount, 
    currency: "USD", 
    notificationURL: "https://mydomain.com/webhook"
  }).then(function(){
			console.log(invoice);
			res.render("loading", { invoiceId: invoice.id });
		})
		.catch(error => console.log(error));
});

// POST -> /invoice/webhook
router.post('/webhook', function(req, res, next){
  // deliver product
});

module.exports = router;
