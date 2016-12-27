class CommunicationError(Exception):
    status_code = 400

    def __init__(self, message):
        Exception.__init__(self)
        self.message = message

#     def to_dict(self):
#         rv = dict(self.payload or ())
#         rv['message'] = self.message
#         return rv