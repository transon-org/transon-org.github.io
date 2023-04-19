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
        input_data = loads(data)
        result = transformer.transform(input_data)
        return dumps(None if result is transformer.NO_CONTENT else result)
    except Exception as error:
        return repr(error)

js.init(dumps(get_all_docs()))
