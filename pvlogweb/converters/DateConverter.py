from werkzeug.routing import BaseConverter
from datetime import datetime

class DateConverter(BaseConverter):
    '''
    Converters date to string and string to date
    '''

    def to_python(self, date_string):
        return datetime.strptime(date_string, "%Y-%m-%d").date()
    
    def to_url(self, date):
        return date.strftime('%Y-%m-%d')
        