"""
EasyPaisa Payment Integration — Yummy-Yummy
File: apps/payments/easypaisa_service.py

EasyPaisa uses MPIN-based Mobile Account transactions.
Credentials from: https://sandbox.easypaisa.com.pk
"""
import hashlib
import hmac
import datetime
import logging
import uuid
import requests
from django.conf import settings

logger = logging.getLogger(__name__)


class EasyPaisaService:

    SANDBOX_URL = 'https://easypaystg.easypaisa.com.pk/easypay/Index.jsf'
    LIVE_URL    = 'https://easypay.easypaisa.com.pk/easypay/Index.jsf'

    # EasyPaisa MA (Mobile Account) direct API
    SANDBOX_MA_URL = 'https://easypaystg.easypaisa.com.pk/tpl/MerchantPaymentRequest'
    LIVE_MA_URL    = 'https://easypay.easypaisa.com.pk/tpl/MerchantPaymentRequest'

    def __init__(self):
        self.store_id      = settings.EASYPAISA_STORE_ID
        self.account_num   = settings.EASYPAISA_ACCOUNT_NUM
        self.hash_key      = settings.EASYPAISA_HASH_KEY
        self.is_sandbox    = getattr(settings, 'EASYPAISA_SANDBOX', True)
        self.return_url    = settings.EASYPAISA_RETURN_URL
        self.payment_url   = self.SANDBOX_URL if self.is_sandbox else self.LIVE_URL
        self.ma_url        = self.SANDBOX_MA_URL if self.is_sandbox else self.LIVE_MA_URL

    def _generate_hash(self, params: dict) -> str:
        """
        EasyPaisa hash: sort keys alphabetically, join values with &,
        then HMAC-SHA256 with hash_key.
        """
        sorted_vals = '&'.join(
            str(params[k]) for k in sorted(params.keys())
            if k != 'hash'
        )
        return hmac.new(
            self.hash_key.encode('utf-8'),
            sorted_vals.encode('utf-8'),
            hashlib.sha256
        ).hexdigest()

    def build_payment_params(self, order_id: str, amount: float,
                              customer_mobile: str = '', description: str = '') -> dict:
        """
        Build EasyPaisa redirect payment params.
        """
        amount_str  = f'{float(amount):.2f}'
        order_ref   = f'EP{order_id.replace("-","")[:16]}'
        txn_time    = datetime.datetime.now().strftime('%Y%m%d%H%M%S')
        expiry      = (datetime.datetime.now() + datetime.timedelta(hours=1)).strftime('%Y%m%d%H%M%S')

        params = {
            'storeId':          self.store_id,
            'amount':           amount_str,
            'postBackURL':      self.return_url,
            'orderRefNum':      order_ref,
            'expiryDate':       expiry,
            'autoRedirect':     '0',
            'storeIdForWeb':    self.store_id,
            'timeStamp':        txn_time,
            'mobileNum':        customer_mobile,
            'emailAddr':        '',
            'merchantHashedReq': '',
        }

        params['merchantHashedReq'] = self._generate_hash(params)
        return params

    def verify_webhook(self, post_data: dict) -> bool:
        """Verify EasyPaisa webhook response hash and status."""
        received_hash  = post_data.get('hash', '')
        response_code  = post_data.get('responseCode', '')
        calculated     = self._generate_hash(post_data)

        if not hmac.compare_digest(received_hash, calculated):
            logger.warning('EasyPaisa webhook: invalid hash')
            return False

        return response_code == '0000'

    def get_payment_status_message(self, response_code: str) -> str:
        messages = {
            '0000': 'Payment successful',
            '0001': 'Transaction declined',
            '0002': 'Insufficient balance',
            '0003': 'Invalid mobile account',
            '0005': 'Transaction already processed',
            '0007': 'Transaction expired',
            '0008': 'Invalid OTP',
            '0009': 'Mobile account blocked',
        }
        return messages.get(response_code, f'Payment failed (code: {response_code})')