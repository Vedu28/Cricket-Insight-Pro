import os
import json
import uuid
from datetime import datetime
from bson import ObjectId
from app.config import Config

# Try to connect to MongoDB
db_client = None
db = None
is_mock_db = False

# Local mock DB path
MOCK_DB_DIR = os.path.join(os.path.dirname(os.path.abspath(__file__)), "..", "data")
MOCK_DB_PATH = os.path.join(MOCK_DB_DIR, "mock_db.json")

class MockCollection:
    def __init__(self, db_instance, collection_name):
        self.db = db_instance
        self.name = collection_name

    def _get_data(self):
        return self.db._read_db().get(self.name, [])

    def _save_data(self, data):
        all_data = self.db._read_db()
        all_data[self.name] = data
        self.db._write_db(all_data)

    def _matches_query(self, doc, query):
        if not query:
            return True
        for key, value in query.items():
            # Support nested querying for simple paths like batting.runs_scored or scout_stats.consistency_score
            if '.' in key:
                parts = key.split('.')
                curr = doc
                matched = True
                for part in parts:
                    if isinstance(curr, dict) and part in curr:
                        curr = curr[part]
                    else:
                        matched = False
                        break
                if not matched or curr != value:
                    return False
                continue
            
            # Normal key matching
            if key not in doc:
                return False
            
            # Simple list lookup or equality
            doc_val = doc[key]
            if isinstance(value, dict):
                # Simple support for operations like $in, $gte, $lte
                for op, op_val in value.items():
                    if op == '$in':
                        if doc_val not in op_val:
                            return False
                    elif op == '$gte':
                        try:
                            if float(doc_val) < float(op_val):
                                return False
                        except:
                            return False
                    elif op == '$lte':
                        try:
                            if float(doc_val) > float(op_val):
                                return False
                        except:
                            return False
                    elif op == '$regex':
                        import re
                        try:
                            if not re.search(op_val, str(doc_val), re.IGNORECASE):
                                return False
                        except:
                            return False
            elif doc_val != value:
                return False
        return True

    def find(self, query=None, sort=None, limit=None):
        data = self._get_data()
        results = [doc for doc in data if self._matches_query(doc, query)]
        
        # Simple sorting support
        if sort:
            # sort is a list of tuples e.g. [('date', -1)]
            for field, order in reversed(sort):
                results.sort(key=lambda x: x.get(field, ""), reverse=(order == -1))
        
        if limit:
            results = results[:limit]
            
        return results

    def find_one(self, query=None):
        data = self._get_data()
        for doc in data:
            if self._matches_query(doc, query):
                return doc
        return None

    def insert_one(self, document):
        data = self._get_data()
        doc_copy = json.loads(json.dumps(document, default=str)) # Deep copy and serialize datetime
        if "_id" not in doc_copy:
            doc_copy["_id"] = str(uuid.uuid4())
        data.append(doc_copy)
        self._save_data(data)
        
        class InsertOneResult:
            def __init__(self, inserted_id):
                self.inserted_id = inserted_id
        return InsertOneResult(doc_copy["_id"])

    def update_one(self, query, update):
        data = self._get_data()
        modified_count = 0
        for doc in data:
            if self._matches_query(doc, query):
                # Support $set operator
                if "$set" in update:
                    for key, val in update["$set"].items():
                        # Support nested sets like scout_stats.consistency_score
                        if '.' in key:
                            parts = key.split('.')
                            curr = doc
                            for part in parts[:-1]:
                                if part not in curr or not isinstance(curr[part], dict):
                                    curr[part] = {}
                                curr = curr[part]
                            curr[parts[-1]] = val
                        else:
                            doc[key] = val
                    modified_count = 1
                    break
        if modified_count > 0:
            self._save_data(data)
            
        class UpdateResult:
            def __init__(self, modified_count):
                self.modified_count = modified_count
        return UpdateResult(modified_count)

    def delete_one(self, query):
        data = self._get_data()
        initial_len = len(data)
        data = [doc for doc in data if not self._matches_query(doc, query)]
        deleted_count = initial_len - len(data)
        if deleted_count > 0:
            self._save_data(data)
            
        class DeleteResult:
            def __init__(self, deleted_count):
                self.deleted_count = deleted_count
        return DeleteResult(deleted_count)

    def count_documents(self, query=None):
        data = self._get_data()
        if not query:
            return len(data)
        return sum(1 for doc in data if self._matches_query(doc, query))

class MockDatabase:
    def __init__(self, file_path):
        self.file_path = file_path
        if not os.path.exists(MOCK_DB_DIR):
            os.makedirs(MOCK_DB_DIR)
        if not os.path.exists(self.file_path):
            self._write_db({})

    def _read_db(self):
        try:
            with open(self.file_path, 'r') as f:
                return json.load(f)
        except Exception:
            return {}

    def _write_db(self, data):
        with open(self.file_path, 'w') as f:
            json.dump(data, f, indent=2, default=str)

    def __getitem__(self, name):
        return MockCollection(self, name)

    def list_collection_names(self):
        return list(self._read_db().keys())

class MongoCollectionWrapper:
    def __init__(self, real_collection):
        self.real_collection = real_collection

    def _convert_query(self, query):
        if not query or not isinstance(query, dict):
            return query
        new_query = {}
        for k, v in query.items():
            if k == "_id" and isinstance(v, str):
                try:
                    new_query[k] = ObjectId(v)
                except Exception:
                    new_query[k] = v
            elif isinstance(v, dict):
                new_query[k] = self._convert_query(v)
            else:
                new_query[k] = v
        return new_query

    def find(self, query=None, *args, **kwargs):
        converted_query = self._convert_query(query)
        return self.real_collection.find(converted_query, *args, **kwargs)

    def find_one(self, query=None, *args, **kwargs):
        converted_query = self._convert_query(query)
        return self.real_collection.find_one(converted_query, *args, **kwargs)

    def insert_one(self, document, *args, **kwargs):
        if isinstance(document, dict) and "_id" in document and isinstance(document["_id"], str):
            try:
                document = dict(document)
                document["_id"] = ObjectId(document["_id"])
            except Exception:
                pass
        return self.real_collection.insert_one(document, *args, **kwargs)

    def update_one(self, query, update, *args, **kwargs):
        converted_query = self._convert_query(query)
        return self.real_collection.update_one(converted_query, update, *args, **kwargs)

    def delete_one(self, query, *args, **kwargs):
        converted_query = self._convert_query(query)
        return self.real_collection.delete_one(converted_query, *args, **kwargs)

    def delete_many(self, query, *args, **kwargs):
        converted_query = self._convert_query(query)
        return self.real_collection.delete_many(converted_query, *args, **kwargs)

    def count_documents(self, query=None, *args, **kwargs):
        if query is None:
            query = {}
        converted_query = self._convert_query(query)
        return self.real_collection.count_documents(converted_query, *args, **kwargs)

class MongoDatabaseWrapper:
    def __init__(self, real_db):
        self.real_db = real_db

    def __getitem__(self, name):
        return MongoCollectionWrapper(self.real_db[name])

    def list_collection_names(self):
        return self.real_db.list_collection_names()

try:
    import pymongo
    print("Connecting to MongoDB at:", Config.MONGO_URI)
    db_client = pymongo.MongoClient(Config.MONGO_URI, serverSelectionTimeoutMS=2000)
    # Check connection
    db_client.server_info()
    db = MongoDatabaseWrapper(db_client[Config.DB_NAME])
    print(f"Successfully connected to MongoDB: database '{Config.DB_NAME}' active (wrapped).")
except Exception as e:
    print(f"MongoDB connection failed: {e}")
    print("Falling back to local persistent JSON Database at:", MOCK_DB_PATH)
    db = MockDatabase(MOCK_DB_PATH)
    is_mock_db = True

def get_db():
    return db

