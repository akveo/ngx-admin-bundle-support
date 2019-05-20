import logging
from ..common import Common
from .controller import get_user_by_id, update_user
from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticated
from django.http import JsonResponse


logger = logging.getLogger(__name__)
common_methods = Common()


class UserView(APIView):
    permission_classes = (IsAuthenticated,)

    @staticmethod
    def get(request):
        user = get_user_by_id(request.user.id)

        return JsonResponse(_serialize_user(user))

    @staticmethod
    def put(request):
        user = get_user_by_id(request.user.id)

        data = common_methods.get_request_data(request)
        user.email = data['email']
        user.first_name = data['firstName']
        user.last_name = data['lastName']
        user.login = data['userName']
        user.age = data['age']
        user.street = data['address']['street']
        user.city = data['address']['city']
        user.zip = data['address']['zipCode']

        update_user(user)

        return JsonResponse(_serialize_user(user))


def _serialize_user(user):
    return {
        'id': user.id,
        'email': user.email,
        'firstName': user.first_name,
        'lastName': user.last_name,
        'userName': user.login,
        'age': user.age,
        'address': {
            'street': user.street,
            'city': user.city,
            'zipCode': user.zip,
        }
    }
