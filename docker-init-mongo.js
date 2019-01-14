db.createCollection('users');
db.users.createIndex({'email':1});
db.users.createIndex({'provider':1, 'providerid':1}, { unique: true });
db.users.createIndex({'nickname':'text'}, { unique: true });
db.users.insertOne({'_id':'u1', 'email':'user1@test', 'providerid': '1', 'nickname': 'jack12', 'provider': 'test'});
db.users.insertOne({'_id':'u2', 'email':'user2@test', 'providerid': '2', 'nickname': 'John3', 'provider': 'google'});

db.createCollection('tags');
db.tags.createIndex({'name': 1}, { unique: true });
db.tags.insertOne({'name':'bedframe'});
db.tags.insertOne({'name':'table'});
db.tags.insertOne({'name':'chairs'});
db.tags.insertOne({'name':'tyres'});
db.tags.insertOne({'name':'bicycle'});
db.tags.insertOne({'name':'furniture'});
db.tags.insertOne({'name':'shed'});
db.tags.insertOne({'name':'fence'});
db.tags.insertOne({'name':'plants'});
db.tags.insertOne({'name':'pots'});
db.tags.insertOne({'name':'drawers'});

db.createCollection('things');
db.things.createIndex({'tags': 1});
db.things.createIndex({'location': '2dsphere'});
db.things.createIndex({'user': 1});
db.things.createIndex({'availability': 1});
db.things.createIndex({'status': 1});
db.things.insertOne({'_id': 't1','location': {'coordinates': [144.97845,-37.807177],'type': 'Point'},'tags': ['table','chairs'],'images': ['test1_1.jpg','test1_2.jpg'],'updates': [{'user': 'u1','usernickname': 'user1','what': 'create'}],'availability': 'medium','status': 'live','type': 'pickup','user': 'u1','usernickname': 'user1'});

db.createCollection('conversations');
db.conversations.createIndex({'userids': 1});
