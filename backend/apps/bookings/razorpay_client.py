"""Minimal Razorpay REST client (stdlib only) — orders + signature verify."""
import base64
import hashlib
import hmac
import json
from urllib.error import HTTPError, URLError
from urllib.request import Request, urlopen


class RazorpayConfigError(Exception):
    pass


class RazorpayAPIError(Exception):
    def __init__(self, message, status=None, body=None):
        super().__init__(message)
        self.status = status
        self.body = body


def _auth_header(key_id: str, key_secret: str) -> str:
    raw = f'{key_id}:{key_secret}'.encode('utf-8')
    return 'Basic ' + base64.b64encode(raw).decode('ascii')


def create_order(
    key_id: str,
    key_secret: str,
    *,
    amount_paise: int,
    currency: str,
    receipt: str,
    notes: dict,
    timeout: int = 45,
) -> dict:
    payload = {
        'amount': amount_paise,
        'currency': currency,
        'receipt': receipt,
        'notes': {str(k): str(v) for k, v in notes.items()},
    }
    data = json.dumps(payload).encode('utf-8')
    req = Request(
        'https://api.razorpay.com/v1/orders',
        data=data,
        headers={
            'Content-Type': 'application/json',
            'Authorization': _auth_header(key_id, key_secret),
        },
        method='POST',
    )
    try:
        with urlopen(req, timeout=timeout) as resp:
            return json.loads(resp.read().decode('utf-8'))
    except HTTPError as e:
        try:
            body = e.read().decode('utf-8')
        except Exception:
            body = ''
        raise RazorpayAPIError(f'Razorpay order error: {e.code}', status=e.code, body=body) from e
    except URLError as e:
        raise RazorpayAPIError(f'Razorpay network error: {e!s}') from e


def fetch_order(key_id: str, key_secret: str, order_id: str, timeout: int = 30) -> dict:
    req = Request(
        f'https://api.razorpay.com/v1/orders/{order_id}',
        headers={'Authorization': _auth_header(key_id, key_secret)},
        method='GET',
    )
    try:
        with urlopen(req, timeout=timeout) as resp:
            return json.loads(resp.read().decode('utf-8'))
    except HTTPError as e:
        if e.code == 404:
            raise RazorpayAPIError('Order not found', status=404) from e
        try:
            body = e.read().decode('utf-8')
        except Exception:
            body = ''
        raise RazorpayAPIError(f'Razorpay fetch error: {e.code}', status=e.code, body=body) from e
    except URLError as e:
        raise RazorpayAPIError(f'Razorpay network error: {e!s}') from e


def verify_payment_signature(order_id: str, payment_id: str, signature: str, key_secret: str) -> bool:
    message = f'{order_id}|{payment_id}'.encode('utf-8')
    digest = hmac.new(key_secret.encode('utf-8'), message, hashlib.sha256).hexdigest()
    return hmac.compare_digest(digest, signature)
