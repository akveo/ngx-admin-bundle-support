import configparser
import logging
import marshmallow
from typing import Tuple, List
from functools import wraps

from werkzeug.local import LocalProxy
from flask import current_app, jsonify, request
from flask.wrappers import Response
from werkzeug.exceptions import HTTPException
from flask_jwt_extended import verify_jwt_in_request
from flask_jwt_extended.exceptions import JWTExtendedException
from jwt import PyJWTError

# logger object for all views to use
logger = LocalProxy(lambda: current_app.logger)
core_logger = logging.getLogger("core")


class Mixin:
    """Utility Base Class for SQLAlchemy Models.

    Adds `to_dict()` to easily serialize objects to dictionaries.
    """

    def to_dict(self) -> dict:
        d_out = dict((key, val) for key, val in self.__dict__.items())
        d_out.pop("_sa_instance_state", None)
        d_out["_id"] = d_out.pop("id", None)  # rename id key to interface with response
        return d_out


def init_jtw_security(app):
    @app.before_request
    def before_request():
        if request.endpoint and request.endpoint not in app.config['NO_AUTH_ENDPOINTS']:
            # Would need to add this function, it would basically do everything that the
            # jwt_required decorator does besides passing in a function and calling that
            # function if the jwt was valid. Then the actual jwt_required decorator could
            # use this same code behind the scenes to keep everything dry.
            try:
                verify_jwt_in_request()
            except JWTExtendedException as e:
                return create_response(message='Not authorized', status=401)
            except PyJWTError as e:
                return create_response(message='Not authorized', status=401)


def create_response(
        data: dict = None, status: int = 200, message: str = ""
) -> Tuple[Response, int]:
    """Wraps error response in a consistent format throughout the API.

    Format inspired by https://medium.com/@shazow/how-i-design-json-api-responses-71900f00f2db
    Modifications included:
    - make success a boolean since there's only 2 values
    - make message a single string since we will only use one message per response
    IMPORTANT: data must be a dictionary where:
    - the key is the name of the type of data
    - the value is the data itself
    :param data <str> optional data
    :param status <int> optional status code, defaults to 200
    :param message <str> optional message
    :returns tuple of Flask Response and int
    """
    if type(data) is not dict and data is not None:
        raise TypeError("Data should be a dictionary 😞")

    response = {"success": 200 <= status < 300, "message": message, "result": data}
    return jsonify(response), status


def serialize_list(items: List) -> List:
    """Serializes a list of SQLAlchemy Objects, exposing their attributes.

    :param items - List of Objects that inherit from Mixin
    :returns List of dictionaries
    """
    if not items or items is None:
        return []
    return [x.to_dict() for x in items]


# add specific Exception handlers before this, if needed
# More info at http://flask.pocoo.org/docs/1.0/patterns/apierrors/
def all_exception_handler(error: Exception) -> Tuple[Response, int]:
    """Catches and handles all exceptions, add more specific error Handlers.
    :param Exception
    :returns Tuple of a Flask Response and int
    """
    if isinstance(error, marshmallow.ValidationError):
        return create_response(message='Validation error', data=error.messages, status=400)
    if isinstance(error, HTTPException):
        return create_response(message=error.description, status=error.code)
    else:
        core_logger.error(error)
        return create_response(message=str(error), status=500)


def validate_json_body(schema, unknown=marshmallow.INCLUDE, partial=None):
    def decorator(f):
        @wraps(f)
        def wrapped(*args, **kwargs):
            data = request.get_json()
            schema().load(data, unknown=unknown, partial=partial)

            return f(*args, **kwargs)

        return wrapped

    return decorator
