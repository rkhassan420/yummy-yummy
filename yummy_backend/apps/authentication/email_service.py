"""
Email Service — Yummy-Yummy
Central service for all transactional emails.
Place this file at: apps/authentication/email_service.py
"""
from django.core.mail     import EmailMultiAlternatives
from django.template.loader import render_to_string
from django.utils.html    import strip_tags
from django.conf          import settings
from django.utils         import timezone
import logging

logger = logging.getLogger(__name__)

def _send(subject, to_email, html_content):
    """Internal helper — sends an HTML email with plain-text fallback."""
    try:
        plain_text = strip_tags(html_content)
        msg = EmailMultiAlternatives(
            subject    = subject,
            body       = plain_text,
            from_email = settings.DEFAULT_FROM_EMAIL,
            to         = [to_email],
        )
        msg.attach_alternative(html_content, 'text/html')
        msg.send(fail_silently=False)
        logger.info(f'Email sent to {to_email}: {subject}')
        return True
    except Exception as e:
        logger.error(f'Failed to send email to {to_email}: {e}')
        return False


def send_otp_email(customer, otp_code):
    """
    Send a beautiful OTP email for password reset.
    Template: templates/emails/otp_email.html
    """
    expiry   = getattr(settings, 'OTP_EXPIRY_MINUTES', 10)
    exp_time = timezone.localtime(
        timezone.now() + timezone.timedelta(minutes=expiry)
    ).strftime('%I:%M %p')   # e.g. "03:45 PM"

    context = {
        'first_name':      customer.first_name,
        'otp_code':        otp_code,
        'expiry_minutes':  expiry,
        'expires_at':      exp_time,
        'steps': [
            'Go back to the Yummy-Yummy password reset page',
            'Enter this 6-digit OTP code in the verification field',
            'Create your new password',
        ],
    }

    html = render_to_string('emails/otp_email.html', context)
    return _send(
        subject   = f'🔐 Your OTP Code: {otp_code} — Yummy-Yummy',
        to_email  = customer.email,
        html_content = html,
    )


def send_welcome_email(customer):
    """
    Send a welcome email after successful registration.
    Template: templates/emails/welcome_email.html
    """
    context = {
        'first_name':   customer.first_name,
        'frontend_url': getattr(settings, 'FRONTEND_URL', 'http://localhost:5173'),
        'features': [
            {'icon': '🍕', 'title': 'Browse 500+ Dishes',    'desc': 'From breakfast to midnight snacks'},
            {'icon': '⚡', 'title': 'Fast Delivery',          'desc': 'Average 30-minute delivery'},
            {'icon': '📦', 'title': 'Track Your Orders',      'desc': 'Real-time status updates'},
            {'icon': '💳', 'title': 'Easy Payments',          'desc': 'Multiple payment options'},
        ],
    }
    html = render_to_string('emails/welcome_email.html', context)
    return _send(
        subject      = f'🎉 Welcome to Yummy-Yummy, {customer.first_name}!',
        to_email     = customer.email,
        html_content = html,
    )


def send_order_confirmation_email(customer, order):
    """
    Send order confirmation after successful checkout.
    """
    items_html = ''.join([
        f'<tr><td style="padding:8px 0;border-bottom:1px solid #f1f5f9;font-size:14px;color:#374151;">'
        f'{item.dish_name} × {item.qty}</td>'
        f'<td style="padding:8px 0;border-bottom:1px solid #f1f5f9;font-size:14px;'
        f'color:#374151;text-align:right;">Rs. {int(item.price * item.qty):,}</td></tr>'
        for item in order.items.all()
    ])

    html = f"""
    <!DOCTYPE html><html><body style="font-family:Arial,sans-serif;background:#f8fafc;padding:40px 20px;">
    <table width="560" cellpadding="0" cellspacing="0" align="center"
           style="background:#fff;border-radius:20px;overflow:hidden;box-shadow:0 4px 24px rgba(0,0,0,0.08);">
      <tr>
        <td style="background:linear-gradient(135deg,#0f172a,#064e3b);padding:32px 40px;text-align:center;">
          <h1 style="margin:0;color:#fff;font-size:24px;">Order Confirmed! ✅</h1>
          <p style="margin:6px 0 0;color:rgba(255,255,255,0.6);font-size:14px;">
            {order.order_id}
          </p>
        </td>
      </tr>
      <tr>
        <td style="padding:32px 40px;">
          <p style="margin:0 0 20px;color:#64748b;font-size:15px;line-height:1.6;">
            Hi <strong style="color:#0f172a;">{customer.first_name}</strong>, your order has been placed
            successfully and is being prepared! 🍳
          </p>
          <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:20px;">
            <tr>
              <td style="font-size:13px;font-weight:600;color:#374151;text-transform:uppercase;
                         letter-spacing:0.5px;padding-bottom:8px;">Order Items</td>
            </tr>
            {items_html}
            <tr>
              <td style="padding-top:12px;font-weight:700;color:#0f172a;font-size:15px;">
                Delivery Fee
              </td>
              <td style="padding-top:12px;font-weight:700;color:#0f172a;font-size:15px;text-align:right;">
                Rs. 200
              </td>
            </tr>
            <tr>
              <td style="padding-top:8px;font-weight:800;color:#22c55e;font-size:18px;">
                Grand Total
              </td>
              <td style="padding-top:8px;font-weight:800;color:#22c55e;font-size:18px;text-align:right;">
                Rs. {int(order.total_price):,}
              </td>
            </tr>
          </table>
          <div style="background:#f8fafc;border-radius:12px;padding:16px;margin-bottom:20px;">
            <p style="margin:0 0 6px;font-size:13px;font-weight:600;color:#374151;">
              📍 Delivery Address
            </p>
            <p style="margin:0;font-size:14px;color:#64748b;">{order.address}</p>
          </div>
          <p style="margin:0;font-size:13px;color:#94a3b8;text-align:center;">
            Estimated delivery: <strong style="color:#0f172a;">30–45 minutes</strong>
          </p>
        </td>
      </tr>
      <tr>
        <td style="background:#f8fafc;border-top:1px solid #e2e8f0;padding:20px 40px;text-align:center;">
          <p style="margin:0;font-size:12px;color:#94a3b8;">
            © 2026 Yummy-Yummy · support@Yummy-Yummy.com
          </p>
        </td>
      </tr>
    </table>
    </body></html>
    """
    return _send(
        subject      = f'✅ Order Confirmed — {order.order_id} | Yummy-Yummy',
        to_email     = customer.email,
        html_content = html,
    )