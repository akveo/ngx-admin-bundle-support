from flask import Blueprint, request, jsonify
from api.core import validate_json_body
from marshmallow import Schema, fields
from flask_jwt_extended import create_access_token

from api.core import create_response
from ..user import services as user_services
from .services import send_password_reset_link, reset_user_password

bp = Blueprint('auth', __name__, url_prefix='/auth')


class LoginSchema(Schema):
    email = fields.Email(required=True)
    password = fields.String(required=True)


@bp.route('/login', methods=['POST'])
@validate_json_body(LoginSchema)
def signin():
    data = request.get_json()
    email = data['email']
    password = data['password']

    u = user_services.get_user_by_email(email)

    if user_services.check_password(u, password):
        return jsonify({
            'token': create_access_token(identity=u.id),
        })
    else:
        return create_response(message='Email or password incorrect', status=401)


class SignUpSchema(Schema):
    email = fields.Email(required=True)
    password = fields.String(required=True)
    fullName = fields.String(required=True)


@bp.route('/sign-up', methods=['POST'])
@validate_json_body(SignUpSchema)
def sign_up():
    data = request.get_json()
    email = data['email']
    password = data['password']
    fullname = data['fullName']

    if user_services.check_user_exists(email):
        return create_response(message='User with this email already exists', status=400)

    user_services.create_user(email, password, fullname)

    return create_response(status=200, message='Success')


class RequestPassSchema(Schema):
    email = fields.Email(required=True)


@bp.route('/request-pass', methods=['POST'])
@validate_json_body(RequestPassSchema)
def request_pass():
    data = request.get_json()
    email = data['email']
    try:
        send_password_reset_link(email)
    except ValueError as e:
        return create_response(message=str(e), status=400)

    return create_response(status=200, message='Email sent')


class ResetPassSchema(Schema):
    password = fields.String(required=True)
    reset_password_token = fields.String(required=True)


@bp.route('/reset-pass', methods=['POST'])
@validate_json_body(ResetPassSchema)
def reset_pass():
    data = request.get_json()
    password = data['password']
    reset_password_token = data['reset_password_token']

    reset_user_password(reset_password_token, password)
    return create_response(status=200, message='Password reset successful')


@bp.route('/sign-out', methods=['POST'])
def sign_out():
    data = request.get_json()

    return create_response(status=200, message='Logged out')
