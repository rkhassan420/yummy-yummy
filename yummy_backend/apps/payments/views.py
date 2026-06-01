"""
Payment Views — Yummy-Yummy
POST /api/payments/initiate/          — JazzCash
POST /api/payments/webhook/           — JazzCash webhook
POST /api/payments/easypaisa/initiate/ — EasyPaisa
POST /api/payments/easypaisa/webhook/  — EasyPaisa webhook
POST /api/payments/cod/               — Cash on Delivery
GET  /api/payments/status/{order_id}/ — Check status
"""
import logging
from django.conf                import settings
from rest_framework             import status
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework.response    import Response
from rest_framework.views       import APIView

from apps.orders.models         import Order, OrderItem
from apps.cart.models           import Cart
from apps.orders.serializers    import OrderSerializer
from .models                    import Payment
from .jazzcash_service          import JazzCashService
from .easypaisa_service         import EasyPaisaService

logger = logging.getLogger(__name__)


# ── JazzCash ──────────────────────────────────────────────────────────────────

class InitiateJazzCashView(APIView):
    """POST /api/payments/initiate/"""
    permission_classes = [IsAuthenticated]

    def post(self, request):
        order_id = request.data.get('order_id')
        mobile   = request.data.get('mobile_number', '')

        if not order_id:
            return Response({'error': 'order_id is required.'}, status=400)

        try:
            order = Order.objects.get(pk=order_id, user=request.user)
        except Order.DoesNotExist:
            return Response({'error': 'Order not found.'}, status=404)

        if hasattr(order, 'payment') and order.payment.is_paid:
            return Response({'error': 'Order is already paid.'}, status=400)

        jc     = JazzCashService()
        params = jc.build_payment_params(
            order_id        = order.order_id,
            amount          = float(order.total_price),
            customer_mobile = mobile,
            description     = f'Yummy-Yummy Order {order.order_id}',
        )

        payment, _ = Payment.objects.update_or_create(
            order    = order,
            defaults = {
                'user':       request.user,
                'method':     'jazzcash',
                'status':     'pending',
                'amount':     order.total_price,
                'txn_ref_no': params['pp_TxnRefNo'],
            }
        )

        return Response({
            'payment_url': jc.payment_url,
            'params':      params,
            'payment_id':  payment.id,
        })


class JazzCashWebhookView(APIView):
    """POST /api/payments/webhook/"""
    permission_classes = [AllowAny]

    def post(self, request):
        data          = request.data
        response_code = data.get('pp_ResponseCode', '')
        txn_ref_no    = data.get('pp_TxnRefNo', '')

        jc      = JazzCashService()
        is_paid = jc.verify_webhook(data)

        try:
            payment = Payment.objects.select_related('order').get(txn_ref_no=txn_ref_no)
        except Payment.DoesNotExist:
            return Response({'error': 'Payment not found.'}, status=404)

        payment.response_code = response_code
        payment.response_msg  = data.get('pp_ResponseMessage', '')
        payment.jazzcash_txn  = data.get('pp_TxnID', '')
        payment.raw_response  = dict(data)
        payment.status        = 'paid' if is_paid else 'failed'
        payment.save()

        if is_paid:
            order        = payment.order
            order.status = 'preparing'
            order.save()
            return Response({'success': True, 'message': 'Payment successful!', 'order_id': order.order_id})

        return Response({
            'success': False,
            'message': jc.get_payment_status_message(response_code),
            'code':    response_code,
        }, status=400)


# ── EasyPaisa ─────────────────────────────────────────────────────────────────

class InitiateEasyPaisaView(APIView):
    """POST /api/payments/easypaisa/initiate/"""
    permission_classes = [IsAuthenticated]

    def post(self, request):
        order_id = request.data.get('order_id')
        mobile   = request.data.get('mobile_number', '')

        if not order_id:
            return Response({'error': 'order_id is required.'}, status=400)

        try:
            order = Order.objects.get(pk=order_id, user=request.user)
        except Order.DoesNotExist:
            return Response({'error': 'Order not found.'}, status=404)

        if hasattr(order, 'payment') and order.payment.is_paid:
            return Response({'error': 'Order is already paid.'}, status=400)

        ep     = EasyPaisaService()
        params = ep.build_payment_params(
            order_id        = order.order_id,
            amount          = float(order.total_price),
            customer_mobile = mobile,
            description     = f'Yummy-Yummy Order {order.order_id}',
        )

        payment, _ = Payment.objects.update_or_create(
            order    = order,
            defaults = {
                'user':        request.user,
                'method':      'easypaisa',
                'status':      'pending',
                'amount':      order.total_price,
                'ep_order_ref': params['orderRefNum'],
            }
        )

        return Response({
            'payment_url': ep.payment_url,
            'params':      params,
            'payment_id':  payment.id,
        })


class EasyPaisaWebhookView(APIView):
    """POST /api/payments/easypaisa/webhook/"""
    permission_classes = [AllowAny]

    def post(self, request):
        data          = request.data
        response_code = data.get('responseCode', '')
        order_ref     = data.get('orderRefNum', '')

        ep      = EasyPaisaService()
        is_paid = ep.verify_webhook(data)

        try:
            payment = Payment.objects.select_related('order').get(ep_order_ref=order_ref)
        except Payment.DoesNotExist:
            return Response({'error': 'Payment not found.'}, status=404)

        payment.response_code = response_code
        payment.response_msg  = data.get('responseDesc', '')
        payment.ep_txn_ref    = data.get('transactionId', '')
        payment.raw_response  = dict(data)
        payment.status        = 'paid' if is_paid else 'failed'
        payment.save()

        if is_paid:
            order        = payment.order
            order.status = 'preparing'
            order.save()
            return Response({'success': True, 'message': 'Payment successful!', 'order_id': order.order_id})

        return Response({
            'success': False,
            'message': ep.get_payment_status_message(response_code),
            'code':    response_code,
        }, status=400)


# ── COD ───────────────────────────────────────────────────────────────────────

class CashOnDeliveryView(APIView):
    """POST /api/payments/cod/"""
    permission_classes = [IsAuthenticated]

    def post(self, request):
        address = request.data.get('address', '').strip()
        if len(address) < 10:
            return Response({'error': 'Please enter a valid delivery address.'}, status=400)

        try:
            cart = Cart.objects.get(user=request.user)
        except Cart.DoesNotExist:
            return Response({'error': 'Cart is empty.'}, status=400)

        cart_items = cart.items.all()
        if not cart_items.exists():
            return Response({'error': 'Cart is empty.'}, status=400)

        order = Order.objects.create(
            user          = request.user,
            customer_name = request.user.full_name or request.user.email,
            address       = address,
            total_price   = cart.grand_total,
            status        = 'pending',
        )
        OrderItem.objects.bulk_create([
            OrderItem(order=order, dish_name=i.name, image=i.image, price=i.price, qty=i.qty)
            for i in cart_items
        ])
        Payment.objects.create(
            order=order, user=request.user,
            method='cod', status='pending', amount=cart.grand_total,
        )
        cart_items.delete()

        try:
            from apps.authentication.email_service import send_order_confirmation_email
            send_order_confirmation_email(request.user, order)
        except Exception as e:
            logger.warning(f'Could not send order email: {e}')

        return Response({'message': 'Order placed! Pay on delivery.', 'order': OrderSerializer(order).data}, status=201)


# ── Status ────────────────────────────────────────────────────────────────────

class PaymentStatusView(APIView):
    """GET /api/payments/status/{order_id}/"""
    permission_classes = [IsAuthenticated]

    def get(self, request, order_id):
        try:
            order   = Order.objects.get(pk=order_id, user=request.user)
            payment = order.payment
            return Response({
                'order_id':     order.order_id,
                'order_status': order.status,
                'payment': {
                    'method':       payment.method,
                    'status':       payment.status,
                    'amount':       payment.amount,
                    'txn_ref_no':   payment.txn_ref_no,
                    'ep_order_ref': payment.ep_order_ref,
                    'response_msg': payment.response_msg,
                }
            })
        except Order.DoesNotExist:
            return Response({'error': 'Order not found.'}, status=404)
        except Payment.DoesNotExist:
            return Response({'error': 'No payment found.'}, status=404)