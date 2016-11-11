# from pvlogweb import db
# 
# class Inverter(db.Model):
#     id = db.Column(db.Integer, primary_key=True)
#     
# 
# class Phase(db.Model):
#     power   = db.Column(db.Integer, nullable=False)
#     voltage = db.Column(db.Integer)
#     current = db.Column(db.Integer)
# 
# class DcInput(db.Model):
#     power   = db.Column(db.Integer)
#     voltage = db.Column(db.Integer)
#     current = db.Column(db.Integer)
# 
# class SpotData:
#     power = db.Column(db.Integer, nullable=False)
#     frequency = db.Column(db.Integer)
#     
# 
# 
#     
#     
#     
#     
    
    
#             execQuery("CREATE TABLE settings(value VARCHAR(128) PRIMARY KEY,"
#              "data VARCHAR(128));");
#         execQuery("CREATE TABLE plant(name VARCHAR(32) PRIMARY KEY,"
#              "connection VARCHAR(32), con_param1 VARCHAR(32) NOT NULL, con_param2 VARCHAR(32),"
#              "protocol VARCHAR(32) NOT NULL, password VARCHAR(32));");
#         execQuery("CREATE TABLE logical_plant(name VARCHAR(32) PRIMARY KEY, longitude FLOAT NOT NULL, latitude FLOAT NOT NULL,"
#             "declination FLOAT NOT NULL, orientation FLOAT NOT NULL)");
#         execQuery("CREATE TABLE inverter(id INTEGER PRIMARY KEY,"
#              "name VARCHAR(32), plant VARCHAR(32) REFERENCES plant(name) NOT NULL,"
#              "logical_plant VARCHAR(32) NOT NULL REFERENCES logical_plant(name),"
#              "wattpeak INTEGER NOT NULL, total_power INTEGER, operation_time INTEGER,"
#              "phase_count INTEGER NOT NULL, tracker_count INTEGER NOT NULL,"
#              "feed_in_time INTEGER);");
#         execQuery("CREATE TABLE day_values(julian_day INTEGER NOT NULL,"
#             "inverter INTEGER NOT NULL REFERENCES inverter(id),"
#             "power INTEGER NOT NULL, PRIMARY KEY(julian_day, inverter));");
#         execQuery("CREATE TABLE errors(date INTEGER,"
#             "inverter INTEGER NOT NULL REFERENCES inverter(id),"
#             "message VARCHAR(500), error_code INTEGER);");
#         execQuery("CREATE TABLE ac_values(inverter INTEGER REFERENCES inverter(id) NOT NULL,"
#              "date INTEGER,  power INTEGER, frequency INTEGER,"
#              "PRIMARY KEY(inverter, date));");
#         execQuery("CREATE TABLE line(inverter INTEGER, date INTEGER, line SMALLINT,"
#              "power INTEGER, current INTEGER, voltage INTEGER,"
#              "PRIMARY KEY(inverter, date, line),"
#              "FOREIGN KEY(inverter, date) REFERENCES ac_values(inverter, date));");
#         execQuery("CREATE TABLE tracker(num INTEGER,"
#              "inverter INTEGER REFERENCES inverter(id), date INTEGER,"
#              "voltage INTEGER, current INTEGER, power INTEGER, PRIMARY KEY(num, inverter, date))");
# //        execQuery("CREATE TABLE month("