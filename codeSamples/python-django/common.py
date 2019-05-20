import os
import logging
import json

logger = logging.getLogger(__name__)


class Config(object):
    @staticmethod
    def get_config():
        logging.debug('Start parsing configs...')
        _config = {}
        base_config_file = 'configs/base_config.json'
        with open(base_config_file) as file:
            _config = json.load(file)

        return _config


class Common(object):
    @staticmethod
    def touch(path):
        with open(path, 'w'):
            os.utime(path, None)

    @staticmethod
    def get_request_data(request):
        return request.data
