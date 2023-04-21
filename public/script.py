import json
import transon
from transon.docs import (
    get_all_docs,
    get_test_case_by_name,
)

import js

loads = json.loads


def dumps(value):
    return json.dumps(value, indent=2)


def template_loader(name: str):
    case = get_test_case_by_name(name)
    return transon.Transformer(
        case.template,
        template_loader=template_loader,
    )


def transform(template, data):
    try:
        template_data = loads(template)
        transformer = transon.Transformer(
            template_data,
            template_loader=template_loader,
        )
        input_data = loads(data)
        result = transformer.transform(input_data)
        return dumps(None if result is transformer.NO_CONTENT else result)
    except Exception as error:
        return repr(error)


js.init(dumps(get_all_docs()))
