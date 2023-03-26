import json
import transon
from transon.docs import get_all_docs

import js

loads = json.loads

def dumps(value):
    return json.dumps(value, indent=2)

def transform(template, data):
    try:
        transformer = transon.Transformer(loads(template))
        return dumps(transformer.transform(loads(data)))
    except Exception as error:
        return repr(error)

js.init(dumps(get_all_docs()))
