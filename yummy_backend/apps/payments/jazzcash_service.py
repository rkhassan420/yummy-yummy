"""
JazzCash Payment Integration — Yummy-Yummy
File: apps/payments/jazzcash_service.py

HOW IT WORKS:
1. Customer clicks "Pay with JazzCash" in checkout
2. Frontend calls POST /api/payments/initiate/  with order details
3. Django builds a signed JazzCash request (HMAC-SHA256)
4. Returns a form URL + params to frontend
5. Frontend redirects customer to JazzCash payment page
6. After payment, JazzCash calls our webhook POST /api/payments/webhook/
7. We verify signature, update order status to 'paid'
8. Customer is redirected back to our success/failure page

CREDENTIALS:
- Get from: https://sandbox.jazzcash.com.pk (sandbox for testing)
- Live: https://payments.jazzcash.com.pk
"""
import hashlib
import hmac
import datetime
import logging
from django.conf import settings

logger = logging.getLogger(__name__)


class JazzCashService:
    """Handles all JazzCash Mobile Account / Card payment operations"""

    SANDBOX_URL = 'https://sandbox.jazzcash.com.pk/CustomerPortal/transactionmanagement/merchantform/'
    LIVE_URL    = 'https://payments.jazzcash.com.pk/CustomerPortal/transactionmanagement/merchantform/'

    def __init__(self):
        self.merchant_id   = settings.JAZZCASH_MERCHANT_ID
        self.password      = settings.JAZZCASH_PASSWORD
        self.integrity_salt = settings.JAZZCASH_INTEGRITY_SALT
        self.is_sandbox    = getattr(settings, 'JAZZCASH_SANDBOX', True)
        self.return_url    = settings.JAZZCASH_RETURN_URL
        self.payment_url   = self.SANDBOX_URL if self.is_sandbox else self.LIVE_URL

    def _get_expiry(self, minutes=30):
        """Transaction expiry — 30 min from now"""
        exp = datetime.datetime.now() + datetime.timedelta(minutes=minutes)
        return exp.strftime('%Y%m%d%H%M%S')

    def _get_txn_datetime(self):
        return datetime.datetime.now().strftime('%Y%m%d%H%M%S')

    def _generate_hash(self, params: dict) -> str:
        """
        JazzCash HMAC-SHA256 hash generation.
        Sort all params alphabetically, join with &, prepend integrity salt.
        """
        # Remove pp_SecureHash from params if present
        sorted_params = {k: v for k, v in sorted(params.items()) if k != 'pp_SecureHash'}

        # Build string: IntegritySalt&key1=val1&key2=val2...
        hash_string = self.integrity_salt + '&' + '&'.join(
            f'{k}={v}' for k, v in sorted_params.items()
        )

        # HMAC-SHA256
        hashed = hmac.new(
            self.integrity_salt.encode('utf-8'),
            hash_string.encode('utf-8'),
            hashlib.sha256
        ).hexdigest()

        logger.debug(f'JazzCash hash string: {hash_string}')
        return hashed

    def build_payment_params(self, order_id: str, amount: float,
                              customer_mobile: str = '', description: str = '') -> dict:
        """
        Build all required JazzCash payment parameters.
        Returns dict of params to send to JazzCash payment page.
        """
        # Amount in paisas (multiply by 100, no decimal)
        amount_paisas = str(int(float(amount) * 100))

        txn_ref_no  = f'T{order_id.replace("-", "")[:18]}'  # max 20 chars
        txn_datetime = self._get_txn_datetime()
        expiry       = self._get_expiry(30)

        params = {
            'pp_Version':           '1.1',
            'pp_TxnType':           'MWALLET',
            'pp_Language':          'EN',
            'pp_MerchantID':        self.merchant_id,
            'pp_SubMerchantID':     '',
            'pp_Password':          self.password,
            'pp_BankID':            'TBANK',
            'pp_ProductID':         'RETL',
            'pp_TxnRefNo':          txn_ref_no,
            'pp_Amount':            amount_paisas,
            'pp_TxnCurrency':       'PKR',
            'pp_TxnDateTime':       txn_datetime,
            'pp_BillReference':     f'ORDER{order_id}',
            'pp_Description':       description or f'Yummy-Yummy Order {order_id}',
            'pp_TxnExpiryDateTime': expiry,
            'pp_ReturnURL':         self.return_url,
            'pp_SecureHash':        '',
            'ppmpf_1':              customer_mobile,
            'ppmpf_2':              '',
            'ppmpf_3':              '',
            'ppmpf_4':              '',
            'ppmpf_5':              '',
        }

        # Add secure hash
        params['pp_SecureHash'] = self._generate_hash(params)
        return params

    def verify_webhook(self, post_data: dict) -> bool:
        """
        Verify JazzCash webhook signature.
        Call this when JazzCash posts back to our return URL.
        Returns True if signature is valid and payment succeeded.
        """
        received_hash = post_data.get('pp_SecureHash', '')
        response_code = post_data.get('pp_ResponseCode', '')

        # Recalculate hash
        calculated_hash = self._generate_hash(post_data)

        if not hmac.compare_digest(received_hash, calculated_hash):
            logger.warning('JazzCash webhook: invalid hash')
            return False

        # 000 = success
        if response_code != '000':
            logger.info(f'JazzCash payment not successful: code={response_code}')
            return False

        return True

    def get_payment_status_message(self, response_code: str) -> str:
        """Human-readable message for JazzCash response codes"""
        messages = {
            '000': 'Payment successful',
            '001': 'Invalid credentials',
            '101': 'Transaction declined',
            '111': 'Insufficient balance',
            '121': 'OTP expired',
            '122': 'Invalid OTP',
            '124': 'Mobile account blocked',
            '200': 'Invalid transaction',
            '400': 'Transaction already processed',
            '401': 'Transaction hash mismatch',
            '402': 'Transaction expired',
            '500': 'Internal server error',
            '503': 'Service unavailable',
        }
        return messages.get(response_code, f'Unknown error (code: {response_code})')