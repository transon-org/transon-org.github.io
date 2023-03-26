import {IDocsData} from './types'

export const mockedDocs: IDocsData = {
    "doc": "Transformer class interpolates template with input data.\nFormat of output is defined by template.\nInput is used to fill values into template placeholders.\n\n```python\ntransformer = Transformer(template)\noutput_data = transformer.transform(input_data)\n```\n\nTemplate could be any JSON structure. It will be reflected as is in output except of `rules` structures.\nRules are json objects with special attribute named `$` (this is called marker and can be changed).\nIf the rule has nested template the same applies to it as well. For example\n\n```json\n{\n    \"test\": {\n        \"$\": \"map\",\n        \"item\": [\n            {\n                \"x\": {\n                    \"$\": item\n                }\n            }\n        ]\n    }\n}\n```\n\nAt the top level output will just copy template `{\"test\": ...}`.\nThen the `map` rule will be applied to the input executing sub-template, defined by `item` attribute,\nfor each item in input collection.\nLet's assume that our input is `[1, 2, 3]`.\nInner template contains another rule `{\"$\": \"item\"}` which points to value of items of the input.\nSo the final result will be:\n\n```json\n    {\n    \"test\": [\n        [{\"x\": 1}],\n        [{\"x\": 2}],\n        [{\"x\": 3}],\n    ]\n}\n```\n\nNote that each item preserves its template definition (including list around object).\n\nAll rules are pluggable. There is a list of rules available out of the box.\nHowever, you can easily add your own rules with their own attributes.\n\n```python\n@Transformer.register_rule('my_rule')\ndef my_rule(t: Transformer, template, context: Context):\n    ...\n```\n\nYou can also inherit `Transformer` class and add rules to subclass to avoid functionality collision.\n\n```python\nclass Transformer1(Transformer):\n    pass\n\nclass Transformer2(Transformer):\n    pass\n\n@Transformer1.register_rule('my_rule')\ndef my_rule1(t: Transformer, template, context: Context):\n    ...\n\n@Transformer2.register_rule('my_rule')\ndef my_rule2(t: Transformer, template, context: Context):\n    ...\n```\n\nNote that `my_rule` can be used with both transformers but may behave differently.",
    "rules": [
        {
            "rule": {
                "name": "this",
                "doc": "Returns the value stored in current transformation context.\nThe root context has the value equals to input of transformation.\nEach operation creates new context with value of its result."
            },
            "examples": [
                {
                    "name": "ExprSimpleValues1",
                    "doc": "TODO: Describe",
                    "template": {
                        "$": "expr",
                        "op": "+",
                        "values": [
                            {
                                "$": "this"
                            },
                            "_suffix"
                        ]
                    },
                    "data": "value",
                    "result": "value_suffix"
                },
                {
                    "name": "ExprSimpleValues2",
                    "doc": "TODO: Describe",
                    "template": {
                        "$": "expr",
                        "op": "+",
                        "values": [
                            "prefix_",
                            {
                                "$": "this"
                            }
                        ]
                    },
                    "data": "value",
                    "result": "prefix_value"
                },
                {
                    "name": "JoinWithStaticNoOverrides",
                    "doc": "TODO: Describe",
                    "template": {
                        "$": "join",
                        "items": [
                            {
                                "a": "default"
                            },
                            {
                                "$": "this"
                            }
                        ]
                    },
                    "data": {
                        "a": "b",
                        "c": "d"
                    },
                    "result": {
                        "a": "b",
                        "c": "d"
                    }
                },
                {
                    "name": "JoinWithStaticWithOverrides",
                    "doc": "TODO: Describe",
                    "template": {
                        "$": "join",
                        "items": [
                            {
                                "a": "default"
                            },
                            {
                                "$": "this"
                            }
                        ]
                    },
                    "data": {
                        "c": "d",
                        "e": "f"
                    },
                    "result": {
                        "a": "default",
                        "c": "d",
                        "e": "f"
                    }
                }
            ],
            "params": []
        },
        {
            "rule": {
                "name": "parent",
                "doc": "Returns the value stored in previous context."
            },
            "examples": [
                {
                    "name": "ExprSimpleMonads2",
                    "doc": "TODO: Describe",
                    "template": {
                        "$": "chain",
                        "funcs": [
                            "prefix_",
                            {
                                "$": "expr",
                                "op": "+",
                                "value": {
                                    "$": "parent"
                                }
                            }
                        ]
                    },
                    "data": "value",
                    "result": "prefix_value"
                },
                {
                    "name": "ExprMonadsComplex",
                    "doc": "TODO: Describe",
                    "template": {
                        "$": "chain",
                        "funcs": [
                            {
                                "$": "chain",
                                "funcs": [
                                    {
                                        "$": "attr",
                                        "name": "a"
                                    },
                                    {
                                        "$": "expr",
                                        "op": "*",
                                        "value": {
                                            "$": "this"
                                        }
                                    }
                                ]
                            },
                            {
                                "$": "expr",
                                "op": "+",
                                "value": {
                                    "$": "chain",
                                    "funcs": [
                                        {
                                            "$": "parent"
                                        },
                                        {
                                            "$": "attr",
                                            "name": "b"
                                        },
                                        {
                                            "$": "expr",
                                            "op": "*",
                                            "value": {
                                                "$": "this"
                                            }
                                        }
                                    ]
                                }
                            }
                        ]
                    },
                    "data": {
                        "a": 3,
                        "b": 4
                    },
                    "result": 25
                }
            ],
            "params": []
        },
        {
            "rule": {
                "name": "item",
                "doc": "Works inside `map` operation when iterating over lists.\nReturns current item."
            },
            "examples": [
                {
                    "name": "MapListToList",
                    "doc": "TODO: Describe",
                    "template": {
                        "$": "chain",
                        "funcs": [
                            {
                                "$": "join",
                                "items": [
                                    {
                                        "$": "attr",
                                        "name": "first"
                                    },
                                    {
                                        "$": "attr",
                                        "name": "second"
                                    }
                                ]
                            },
                            {
                                "$": "map",
                                "item": {
                                    "value": {
                                        "$": "item"
                                    }
                                }
                            }
                        ]
                    },
                    "data": {
                        "first": [
                            1,
                            2,
                            3
                        ],
                        "second": [
                            4,
                            5,
                            6
                        ]
                    },
                    "result": [
                        {
                            "value": 1
                        },
                        {
                            "value": 2
                        },
                        {
                            "value": 3
                        },
                        {
                            "value": 4
                        },
                        {
                            "value": 5
                        },
                        {
                            "value": 6
                        }
                    ]
                },
                {
                    "name": "NoContentForMappingList",
                    "doc": "TODO: Describe",
                    "template": {
                        "$": "chain",
                        "funcs": [
                            [
                                {
                                    "$": "attr",
                                    "name": "x"
                                },
                                {
                                    "$": "get",
                                    "name": "nope"
                                },
                                {
                                    "$": "attr",
                                    "name": "y"
                                }
                            ],
                            {
                                "$": "map",
                                "items": [
                                    {
                                        "$": "index"
                                    },
                                    {
                                        "$": "item"
                                    }
                                ]
                            }
                        ]
                    },
                    "data": {
                        "x": "xxx",
                        "y": "yyy"
                    },
                    "result": [
                        0,
                        "xxx",
                        1,
                        2,
                        "yyy"
                    ]
                },
                {
                    "name": "NoContentForMappingDict",
                    "doc": "TODO: Describe",
                    "template": {
                        "$": "chain",
                        "funcs": [
                            [
                                {
                                    "key": {
                                        "$": "attr",
                                        "name": "x"
                                    },
                                    "value": {
                                        "$": "get",
                                        "name": "nope"
                                    }
                                },
                                {
                                    "key": {
                                        "$": "get",
                                        "name": "nope"
                                    },
                                    "value": {
                                        "$": "attr",
                                        "name": "y"
                                    }
                                },
                                {
                                    "key": {
                                        "$": "attr",
                                        "name": "x"
                                    },
                                    "value": {
                                        "$": "attr",
                                        "name": "y"
                                    }
                                }
                            ],
                            {
                                "$": "map",
                                "key": {
                                    "$": "attr",
                                    "name": "key"
                                },
                                "value": {
                                    "$": "attr",
                                    "name": "value"
                                }
                            }
                        ]
                    },
                    "data": {
                        "x": "xxx",
                        "y": "yyy"
                    },
                    "result": {
                        "xxx": "yyy"
                    }
                }
            ],
            "params": []
        },
        {
            "rule": {
                "name": "key",
                "doc": "Works inside `map` operation when iterating over dicts.\nReturns the key of current element."
            },
            "examples": [
                {
                    "name": "MapDictToList",
                    "doc": "TODO: Describe",
                    "template": {
                        "$": "map",
                        "item": {
                            "key": {
                                "$": "key"
                            },
                            "value": {
                                "$": "value"
                            }
                        }
                    },
                    "data": {
                        "a": 1,
                        "b": 2,
                        "c": 3
                    },
                    "result": [
                        {
                            "key": "a",
                            "value": 1
                        },
                        {
                            "key": "b",
                            "value": 2
                        },
                        {
                            "key": "c",
                            "value": 3
                        }
                    ]
                },
                {
                    "name": "MapDictToDictItems",
                    "doc": "TODO: Describe",
                    "template": {
                        "$": "map",
                        "key": {
                            "$": "value"
                        },
                        "value": {
                            "$": "key"
                        }
                    },
                    "data": {
                        "a": "d",
                        "b": "e",
                        "c": "f"
                    },
                    "result": {
                        "d": "a",
                        "e": "b",
                        "f": "c"
                    }
                },
                {
                    "name": "MapDictToListItems",
                    "doc": "TODO: Describe",
                    "template": {
                        "$": "map",
                        "items": [
                            {
                                "$": "key"
                            },
                            {
                                "$": "value"
                            }
                        ]
                    },
                    "data": {
                        "a": 1,
                        "b": 2,
                        "c": 3
                    },
                    "result": [
                        "a",
                        1,
                        "b",
                        2,
                        "c",
                        3
                    ]
                }
            ],
            "params": []
        },
        {
            "rule": {
                "name": "index",
                "doc": "Works inside `map` operation.\nReturns 0-based index of iteration."
            },
            "examples": [
                {
                    "name": "FormatWithValue",
                    "doc": "TODO: Describe",
                    "template": {
                        "$": "map",
                        "item": {
                            "$": "format",
                            "pattern": "{x}-{y}",
                            "value": {
                                "x": {
                                    "$": "this"
                                },
                                "y": {
                                    "$": "expr",
                                    "op": "+",
                                    "values": [
                                        {
                                            "$": "index"
                                        },
                                        1
                                    ]
                                }
                            }
                        }
                    },
                    "data": [
                        "a",
                        "b",
                        "c"
                    ],
                    "result": [
                        "a-1",
                        "b-2",
                        "c-3"
                    ]
                },
                {
                    "name": "NoContentForMappingList",
                    "doc": "TODO: Describe",
                    "template": {
                        "$": "chain",
                        "funcs": [
                            [
                                {
                                    "$": "attr",
                                    "name": "x"
                                },
                                {
                                    "$": "get",
                                    "name": "nope"
                                },
                                {
                                    "$": "attr",
                                    "name": "y"
                                }
                            ],
                            {
                                "$": "map",
                                "items": [
                                    {
                                        "$": "index"
                                    },
                                    {
                                        "$": "item"
                                    }
                                ]
                            }
                        ]
                    },
                    "data": {
                        "x": "xxx",
                        "y": "yyy"
                    },
                    "result": [
                        0,
                        "xxx",
                        1,
                        2,
                        "yyy"
                    ]
                },
                {
                    "name": "NoContentForMappingDict",
                    "doc": "TODO: Describe",
                    "template": {
                        "$": "chain",
                        "funcs": [
                            [
                                {
                                    "key": {
                                        "$": "attr",
                                        "name": "x"
                                    },
                                    "value": {
                                        "$": "get",
                                        "name": "nope"
                                    }
                                },
                                {
                                    "key": {
                                        "$": "get",
                                        "name": "nope"
                                    },
                                    "value": {
                                        "$": "attr",
                                        "name": "y"
                                    }
                                },
                                {
                                    "key": {
                                        "$": "attr",
                                        "name": "x"
                                    },
                                    "value": {
                                        "$": "attr",
                                        "name": "y"
                                    }
                                }
                            ],
                            {
                                "$": "map",
                                "key": {
                                    "$": "attr",
                                    "name": "key"
                                },
                                "value": {
                                    "$": "attr",
                                    "name": "value"
                                }
                            }
                        ]
                    },
                    "data": {
                        "x": "xxx",
                        "y": "yyy"
                    },
                    "result": {
                        "xxx": "yyy"
                    }
                }
            ],
            "params": []
        },
        {
            "rule": {
                "name": "value",
                "doc": "Works inside `map` operation when iterating over dicts.\nReturns the value of current element."
            },
            "examples": [
                {
                    "name": "MapDictToList",
                    "doc": "TODO: Describe",
                    "template": {
                        "$": "map",
                        "item": {
                            "key": {
                                "$": "key"
                            },
                            "value": {
                                "$": "value"
                            }
                        }
                    },
                    "data": {
                        "a": 1,
                        "b": 2,
                        "c": 3
                    },
                    "result": [
                        {
                            "key": "a",
                            "value": 1
                        },
                        {
                            "key": "b",
                            "value": 2
                        },
                        {
                            "key": "c",
                            "value": 3
                        }
                    ]
                },
                {
                    "name": "MapDictToDictItems",
                    "doc": "TODO: Describe",
                    "template": {
                        "$": "map",
                        "key": {
                            "$": "value"
                        },
                        "value": {
                            "$": "key"
                        }
                    },
                    "data": {
                        "a": "d",
                        "b": "e",
                        "c": "f"
                    },
                    "result": {
                        "d": "a",
                        "e": "b",
                        "f": "c"
                    }
                },
                {
                    "name": "MapDictToListItems",
                    "doc": "TODO: Describe",
                    "template": {
                        "$": "map",
                        "items": [
                            {
                                "$": "key"
                            },
                            {
                                "$": "value"
                            }
                        ]
                    },
                    "data": {
                        "a": 1,
                        "b": 2,
                        "c": 3
                    },
                    "result": [
                        "a",
                        1,
                        "b",
                        2,
                        "c",
                        3
                    ]
                }
            ],
            "params": []
        },
        {
            "rule": {
                "name": "set",
                "doc": "Stores in the context value under given name.\nYou can presume that as variable assignment.\nVariable will be accessible under that name in all underlying contexts."
            },
            "examples": [
                {
                    "name": "AttrDynamicReferenceMultipleNames",
                    "doc": "Gets a list of values discovered in nested input structure of dicts with paths defined in input data.\nList of paths may include any number of paths of any depth.",
                    "template": {
                        "$": "chain",
                        "funcs": [
                            {
                                "$": "set",
                                "name": "root"
                            },
                            {
                                "$": "attr",
                                "name": "paths"
                            },
                            {
                                "$": "map",
                                "item": {
                                    "$": "chain",
                                    "funcs": [
                                        {
                                            "$": "get",
                                            "name": "root"
                                        },
                                        {
                                            "$": "attr",
                                            "names": {
                                                "$": "item"
                                            }
                                        }
                                    ]
                                }
                            }
                        ]
                    },
                    "data": {
                        "a": {
                            "b": {
                                "c": 1,
                                "d": 2
                            },
                            "e": {
                                "f": 3,
                                "g": 4
                            }
                        },
                        "paths": [
                            [
                                "a",
                                "b",
                                "d"
                            ],
                            [
                                "a",
                                "b",
                                "c"
                            ],
                            [
                                "a",
                                "e",
                                "g"
                            ],
                            [
                                "a",
                                "e",
                                "f"
                            ]
                        ]
                    },
                    "result": [
                        2,
                        1,
                        4,
                        3
                    ]
                }
            ],
            "params": [
                {
                    "param": {
                        "name": "name",
                        "doc": "Name of the variable. Can be dynamic."
                    },
                    "examples": []
                }
            ]
        },
        {
            "rule": {
                "name": "get",
                "doc": "Returns the value stored under given name.\nValue may be stored in current context or in any previous contexts."
            },
            "examples": [
                {
                    "name": "AttrDynamicReferenceMultipleNames",
                    "doc": "Gets a list of values discovered in nested input structure of dicts with paths defined in input data.\nList of paths may include any number of paths of any depth.",
                    "template": {
                        "$": "chain",
                        "funcs": [
                            {
                                "$": "set",
                                "name": "root"
                            },
                            {
                                "$": "attr",
                                "name": "paths"
                            },
                            {
                                "$": "map",
                                "item": {
                                    "$": "chain",
                                    "funcs": [
                                        {
                                            "$": "get",
                                            "name": "root"
                                        },
                                        {
                                            "$": "attr",
                                            "names": {
                                                "$": "item"
                                            }
                                        }
                                    ]
                                }
                            }
                        ]
                    },
                    "data": {
                        "a": {
                            "b": {
                                "c": 1,
                                "d": 2
                            },
                            "e": {
                                "f": 3,
                                "g": 4
                            }
                        },
                        "paths": [
                            [
                                "a",
                                "b",
                                "d"
                            ],
                            [
                                "a",
                                "b",
                                "c"
                            ],
                            [
                                "a",
                                "e",
                                "g"
                            ],
                            [
                                "a",
                                "e",
                                "f"
                            ]
                        ]
                    },
                    "result": [
                        2,
                        1,
                        4,
                        3
                    ]
                },
                {
                    "name": "NoContentForAttr",
                    "doc": "TODO: Describe",
                    "template": {
                        "$": "chain",
                        "funcs": [
                            {
                                "$": "get",
                                "name": "foo"
                            },
                            {
                                "$": "attr",
                                "name": "bar"
                            }
                        ]
                    },
                    "data": "value",
                    "result": null
                },
                {
                    "name": "NoContentForObjectKey",
                    "doc": "TODO: Describe",
                    "template": {
                        "$": "object",
                        "key": {
                            "$": "get",
                            "name": "foo"
                        },
                        "value": "bar"
                    },
                    "data": "value",
                    "result": {}
                },
                {
                    "name": "NoContentForObjectValue",
                    "doc": "TODO: Describe",
                    "template": {
                        "$": "object",
                        "key": "foo",
                        "value": {
                            "$": "get",
                            "name": "bar"
                        }
                    },
                    "data": "value",
                    "result": {}
                },
                {
                    "name": "NoContentForMappingList",
                    "doc": "TODO: Describe",
                    "template": {
                        "$": "chain",
                        "funcs": [
                            [
                                {
                                    "$": "attr",
                                    "name": "x"
                                },
                                {
                                    "$": "get",
                                    "name": "nope"
                                },
                                {
                                    "$": "attr",
                                    "name": "y"
                                }
                            ],
                            {
                                "$": "map",
                                "items": [
                                    {
                                        "$": "index"
                                    },
                                    {
                                        "$": "item"
                                    }
                                ]
                            }
                        ]
                    },
                    "data": {
                        "x": "xxx",
                        "y": "yyy"
                    },
                    "result": [
                        0,
                        "xxx",
                        1,
                        2,
                        "yyy"
                    ]
                },
                {
                    "name": "NoContentForMappingDict",
                    "doc": "TODO: Describe",
                    "template": {
                        "$": "chain",
                        "funcs": [
                            [
                                {
                                    "key": {
                                        "$": "attr",
                                        "name": "x"
                                    },
                                    "value": {
                                        "$": "get",
                                        "name": "nope"
                                    }
                                },
                                {
                                    "key": {
                                        "$": "get",
                                        "name": "nope"
                                    },
                                    "value": {
                                        "$": "attr",
                                        "name": "y"
                                    }
                                },
                                {
                                    "key": {
                                        "$": "attr",
                                        "name": "x"
                                    },
                                    "value": {
                                        "$": "attr",
                                        "name": "y"
                                    }
                                }
                            ],
                            {
                                "$": "map",
                                "key": {
                                    "$": "attr",
                                    "name": "key"
                                },
                                "value": {
                                    "$": "attr",
                                    "name": "value"
                                }
                            }
                        ]
                    },
                    "data": {
                        "x": "xxx",
                        "y": "yyy"
                    },
                    "result": {
                        "xxx": "yyy"
                    }
                }
            ],
            "params": [
                {
                    "param": {
                        "name": "name",
                        "doc": "Name of the variable. Can be dynamic."
                    },
                    "examples": []
                }
            ]
        },
        {
            "rule": {
                "name": "attr",
                "doc": "TODO: Describe"
            },
            "examples": [],
            "params": [
                {
                    "param": {
                        "name": "name",
                        "doc": "TODO: Describe"
                    },
                    "examples": [
                        {
                            "name": "AttrSimpleFixedName",
                            "doc": "Gets value from input `dict` by the name of attribute defined in template as constant value.",
                            "template": {
                                "$": "attr",
                                "name": "a"
                            },
                            "data": {
                                "a": 1
                            },
                            "result": 1
                        },
                        {
                            "name": "AttrDynamicReferenceName1",
                            "doc": "Gets value from input `dict` by the name of attribute defined in different attribute of input data.",
                            "template": {
                                "$": "attr",
                                "name": {
                                    "$": "attr",
                                    "name": "name"
                                }
                            },
                            "data": {
                                "a": 1,
                                "b": 2,
                                "name": "a"
                            },
                            "result": 1
                        },
                        {
                            "name": "AttrDynamicReferenceName2",
                            "doc": "Gets value from input `dict` by the name of attribute defined in different attribute of input data.",
                            "template": {
                                "$": "attr",
                                "name": {
                                    "$": "attr",
                                    "name": "name"
                                }
                            },
                            "data": {
                                "a": 1,
                                "b": 2,
                                "name": "b"
                            },
                            "result": 2
                        },
                        {
                            "name": "MapListsToDict",
                            "doc": "TODO: Describe",
                            "template": {
                                "$": "chain",
                                "funcs": [
                                    {
                                        "$": "zip",
                                        "items": [
                                            {
                                                "$": "attr",
                                                "name": "keys"
                                            },
                                            {
                                                "$": "attr",
                                                "name": "values"
                                            }
                                        ]
                                    },
                                    {
                                        "$": "map",
                                        "key": {
                                            "$": "attr",
                                            "name": 0
                                        },
                                        "value": {
                                            "$": "attr",
                                            "name": 1
                                        }
                                    }
                                ]
                            },
                            "data": {
                                "keys": [
                                    "a",
                                    "b",
                                    "c"
                                ],
                                "values": [
                                    1,
                                    2,
                                    3
                                ]
                            },
                            "result": {
                                "a": 1,
                                "b": 2,
                                "c": 3
                            }
                        },
                        {
                            "name": "NoContentForAttr",
                            "doc": "TODO: Describe",
                            "template": {
                                "$": "chain",
                                "funcs": [
                                    {
                                        "$": "get",
                                        "name": "foo"
                                    },
                                    {
                                        "$": "attr",
                                        "name": "bar"
                                    }
                                ]
                            },
                            "data": "value",
                            "result": null
                        }
                    ]
                },
                {
                    "param": {
                        "name": "names",
                        "doc": "TODO: Describe"
                    },
                    "examples": [
                        {
                            "name": "AttrSimpleFixedNames",
                            "doc": "Gets a list of values with 4 elements discovered in nested input structure of dicts with paths defined in template.",
                            "template": [
                                {
                                    "$": "attr",
                                    "names": [
                                        "a",
                                        "b",
                                        "c"
                                    ]
                                },
                                {
                                    "$": "attr",
                                    "names": [
                                        "a",
                                        "b",
                                        "d"
                                    ]
                                },
                                {
                                    "$": "attr",
                                    "names": [
                                        "a",
                                        "e",
                                        "f"
                                    ]
                                },
                                {
                                    "$": "attr",
                                    "names": [
                                        "a",
                                        "e",
                                        "g"
                                    ]
                                }
                            ],
                            "data": {
                                "a": {
                                    "b": {
                                        "c": 1,
                                        "d": 2
                                    },
                                    "e": {
                                        "f": 3,
                                        "g": 4
                                    }
                                }
                            },
                            "result": [
                                1,
                                2,
                                3,
                                4
                            ]
                        },
                        {
                            "name": "AttrDynamicReferenceNames",
                            "doc": "Gets value from nested input structure of dicts with paths defined in different attribute of input data.",
                            "template": {
                                "$": "attr",
                                "names": {
                                    "$": "attr",
                                    "name": "path"
                                }
                            },
                            "data": {
                                "a": {
                                    "b": {
                                        "c": 1,
                                        "d": 2
                                    },
                                    "e": {
                                        "f": 3,
                                        "g": 4
                                    }
                                },
                                "path": [
                                    "a",
                                    "e",
                                    "f"
                                ]
                            },
                            "result": 3
                        },
                        {
                            "name": "AttrDynamicReferenceMultipleNames",
                            "doc": "Gets a list of values discovered in nested input structure of dicts with paths defined in input data.\nList of paths may include any number of paths of any depth.",
                            "template": {
                                "$": "chain",
                                "funcs": [
                                    {
                                        "$": "set",
                                        "name": "root"
                                    },
                                    {
                                        "$": "attr",
                                        "name": "paths"
                                    },
                                    {
                                        "$": "map",
                                        "item": {
                                            "$": "chain",
                                            "funcs": [
                                                {
                                                    "$": "get",
                                                    "name": "root"
                                                },
                                                {
                                                    "$": "attr",
                                                    "names": {
                                                        "$": "item"
                                                    }
                                                }
                                            ]
                                        }
                                    }
                                ]
                            },
                            "data": {
                                "a": {
                                    "b": {
                                        "c": 1,
                                        "d": 2
                                    },
                                    "e": {
                                        "f": 3,
                                        "g": 4
                                    }
                                },
                                "paths": [
                                    [
                                        "a",
                                        "b",
                                        "d"
                                    ],
                                    [
                                        "a",
                                        "b",
                                        "c"
                                    ],
                                    [
                                        "a",
                                        "e",
                                        "g"
                                    ],
                                    [
                                        "a",
                                        "e",
                                        "f"
                                    ]
                                ]
                            },
                            "result": [
                                2,
                                1,
                                4,
                                3
                            ]
                        }
                    ]
                }
            ]
        },
        {
            "rule": {
                "name": "object",
                "doc": "TODO: Describe"
            },
            "examples": [
                {
                    "name": "JoinManyDynamicDicts",
                    "doc": "TODO: Describe",
                    "template": {
                        "$": "join",
                        "items": {
                            "$": "join",
                            "items": [
                                {
                                    "$": "map",
                                    "item": {
                                        "$": "object",
                                        "key": {
                                            "$": "attr",
                                            "name": "key"
                                        },
                                        "value": {
                                            "$": "attr",
                                            "name": "value"
                                        }
                                    }
                                },
                                {
                                    "$": "map",
                                    "item": {
                                        "$": "object",
                                        "key": {
                                            "$": "attr",
                                            "name": "value"
                                        },
                                        "value": {
                                            "$": "attr",
                                            "name": "key"
                                        }
                                    }
                                }
                            ]
                        }
                    },
                    "data": [
                        {
                            "key": "a",
                            "value": "b"
                        },
                        {
                            "key": "c",
                            "value": "d"
                        }
                    ],
                    "result": {
                        "a": "b",
                        "b": "a",
                        "c": "d",
                        "d": "c"
                    }
                }
            ],
            "params": [
                {
                    "param": {
                        "name": "key",
                        "doc": "TODO: Describe"
                    },
                    "examples": [
                        {
                            "name": "NoContentForObjectKey",
                            "doc": "TODO: Describe",
                            "template": {
                                "$": "object",
                                "key": {
                                    "$": "get",
                                    "name": "foo"
                                },
                                "value": "bar"
                            },
                            "data": "value",
                            "result": {}
                        }
                    ]
                },
                {
                    "param": {
                        "name": "value",
                        "doc": "TODO: Describe"
                    },
                    "examples": [
                        {
                            "name": "NoContentForObjectValue",
                            "doc": "TODO: Describe",
                            "template": {
                                "$": "object",
                                "key": "foo",
                                "value": {
                                    "$": "get",
                                    "name": "bar"
                                }
                            },
                            "data": "value",
                            "result": {}
                        }
                    ]
                }
            ]
        },
        {
            "rule": {
                "name": "map",
                "doc": "TODO: Describe"
            },
            "examples": [],
            "params": [
                {
                    "param": {
                        "name": "item",
                        "doc": "TODO: Describe"
                    },
                    "examples": [
                        {
                            "name": "AttrDynamicReferenceMultipleNames",
                            "doc": "Gets a list of values discovered in nested input structure of dicts with paths defined in input data.\nList of paths may include any number of paths of any depth.",
                            "template": {
                                "$": "chain",
                                "funcs": [
                                    {
                                        "$": "set",
                                        "name": "root"
                                    },
                                    {
                                        "$": "attr",
                                        "name": "paths"
                                    },
                                    {
                                        "$": "map",
                                        "item": {
                                            "$": "chain",
                                            "funcs": [
                                                {
                                                    "$": "get",
                                                    "name": "root"
                                                },
                                                {
                                                    "$": "attr",
                                                    "names": {
                                                        "$": "item"
                                                    }
                                                }
                                            ]
                                        }
                                    }
                                ]
                            },
                            "data": {
                                "a": {
                                    "b": {
                                        "c": 1,
                                        "d": 2
                                    },
                                    "e": {
                                        "f": 3,
                                        "g": 4
                                    }
                                },
                                "paths": [
                                    [
                                        "a",
                                        "b",
                                        "d"
                                    ],
                                    [
                                        "a",
                                        "b",
                                        "c"
                                    ],
                                    [
                                        "a",
                                        "e",
                                        "g"
                                    ],
                                    [
                                        "a",
                                        "e",
                                        "f"
                                    ]
                                ]
                            },
                            "result": [
                                2,
                                1,
                                4,
                                3
                            ]
                        },
                        {
                            "name": "ChainWithAttr",
                            "doc": "Searching for values in nested structure with sequence of `attr` operations chained together.",
                            "template": {
                                "$": "map",
                                "item": {
                                    "key": {
                                        "$": "chain",
                                        "funcs": [
                                            {
                                                "$": "item"
                                            },
                                            {
                                                "$": "attr",
                                                "name": "a"
                                            },
                                            {
                                                "$": "attr",
                                                "name": "b"
                                            },
                                            {
                                                "$": "attr",
                                                "name": "c"
                                            }
                                        ]
                                    },
                                    "value": {
                                        "$": "chain",
                                        "funcs": [
                                            {
                                                "$": "item"
                                            },
                                            {
                                                "$": "attr",
                                                "name": "d"
                                            },
                                            {
                                                "$": "attr",
                                                "name": "e"
                                            },
                                            {
                                                "$": "attr",
                                                "name": "f"
                                            }
                                        ]
                                    }
                                }
                            },
                            "data": [
                                {
                                    "a": {
                                        "b": {
                                            "c": 1
                                        }
                                    },
                                    "d": {
                                        "e": {
                                            "f": 2
                                        }
                                    }
                                },
                                {
                                    "a": {
                                        "b": {
                                            "c": 3
                                        }
                                    },
                                    "d": {
                                        "e": {
                                            "f": 4
                                        }
                                    }
                                }
                            ],
                            "result": [
                                {
                                    "key": 1,
                                    "value": 2
                                },
                                {
                                    "key": 3,
                                    "value": 4
                                }
                            ]
                        },
                        {
                            "name": "FormatFromSingleValue",
                            "doc": "TODO: Describe",
                            "template": {
                                "$": "map",
                                "item": {
                                    "$": "format",
                                    "pattern": "{:.03f}"
                                }
                            },
                            "data": [
                                0.5,
                                0.3333333333333333,
                                0.25,
                                0.2,
                                0.16666666666666666,
                                0.14285714285714285,
                                0.125,
                                0.1111111111111111
                            ],
                            "result": [
                                "0.500",
                                "0.333",
                                "0.250",
                                "0.200",
                                "0.167",
                                "0.143",
                                "0.125",
                                "0.111"
                            ]
                        },
                        {
                            "name": "FormatFromDict",
                            "doc": "TODO: Describe",
                            "template": {
                                "$": "map",
                                "item": {
                                    "$": "format",
                                    "pattern": "{name}-{index}"
                                }
                            },
                            "data": [
                                {
                                    "name": "a",
                                    "index": 1
                                },
                                {
                                    "name": "b",
                                    "index": 2
                                },
                                {
                                    "name": "c",
                                    "index": 3
                                }
                            ],
                            "result": [
                                "a-1",
                                "b-2",
                                "c-3"
                            ]
                        },
                        {
                            "name": "FormatFromList",
                            "doc": "TODO: Describe",
                            "template": {
                                "$": "map",
                                "item": {
                                    "$": "format",
                                    "pattern": "{0}-{1}"
                                }
                            },
                            "data": [
                                [
                                    "a",
                                    1
                                ],
                                [
                                    "b",
                                    2
                                ],
                                [
                                    "c",
                                    3
                                ]
                            ],
                            "result": [
                                "a-1",
                                "b-2",
                                "c-3"
                            ]
                        },
                        {
                            "name": "FormatWithValue",
                            "doc": "TODO: Describe",
                            "template": {
                                "$": "map",
                                "item": {
                                    "$": "format",
                                    "pattern": "{x}-{y}",
                                    "value": {
                                        "x": {
                                            "$": "this"
                                        },
                                        "y": {
                                            "$": "expr",
                                            "op": "+",
                                            "values": [
                                                {
                                                    "$": "index"
                                                },
                                                1
                                            ]
                                        }
                                    }
                                }
                            },
                            "data": [
                                "a",
                                "b",
                                "c"
                            ],
                            "result": [
                                "a-1",
                                "b-2",
                                "c-3"
                            ]
                        },
                        {
                            "name": "JoinManyDynamicDicts",
                            "doc": "TODO: Describe",
                            "template": {
                                "$": "join",
                                "items": {
                                    "$": "join",
                                    "items": [
                                        {
                                            "$": "map",
                                            "item": {
                                                "$": "object",
                                                "key": {
                                                    "$": "attr",
                                                    "name": "key"
                                                },
                                                "value": {
                                                    "$": "attr",
                                                    "name": "value"
                                                }
                                            }
                                        },
                                        {
                                            "$": "map",
                                            "item": {
                                                "$": "object",
                                                "key": {
                                                    "$": "attr",
                                                    "name": "value"
                                                },
                                                "value": {
                                                    "$": "attr",
                                                    "name": "key"
                                                }
                                            }
                                        }
                                    ]
                                }
                            },
                            "data": [
                                {
                                    "key": "a",
                                    "value": "b"
                                },
                                {
                                    "key": "c",
                                    "value": "d"
                                }
                            ],
                            "result": {
                                "a": "b",
                                "b": "a",
                                "c": "d",
                                "d": "c"
                            }
                        },
                        {
                            "name": "MapListToList",
                            "doc": "TODO: Describe",
                            "template": {
                                "$": "chain",
                                "funcs": [
                                    {
                                        "$": "join",
                                        "items": [
                                            {
                                                "$": "attr",
                                                "name": "first"
                                            },
                                            {
                                                "$": "attr",
                                                "name": "second"
                                            }
                                        ]
                                    },
                                    {
                                        "$": "map",
                                        "item": {
                                            "value": {
                                                "$": "item"
                                            }
                                        }
                                    }
                                ]
                            },
                            "data": {
                                "first": [
                                    1,
                                    2,
                                    3
                                ],
                                "second": [
                                    4,
                                    5,
                                    6
                                ]
                            },
                            "result": [
                                {
                                    "value": 1
                                },
                                {
                                    "value": 2
                                },
                                {
                                    "value": 3
                                },
                                {
                                    "value": 4
                                },
                                {
                                    "value": 5
                                },
                                {
                                    "value": 6
                                }
                            ]
                        },
                        {
                            "name": "MapDictToList",
                            "doc": "TODO: Describe",
                            "template": {
                                "$": "map",
                                "item": {
                                    "key": {
                                        "$": "key"
                                    },
                                    "value": {
                                        "$": "value"
                                    }
                                }
                            },
                            "data": {
                                "a": 1,
                                "b": 2,
                                "c": 3
                            },
                            "result": [
                                {
                                    "key": "a",
                                    "value": 1
                                },
                                {
                                    "key": "b",
                                    "value": 2
                                },
                                {
                                    "key": "c",
                                    "value": 3
                                }
                            ]
                        }
                    ]
                },
                {
                    "param": {
                        "name": "items",
                        "doc": "TODO: Describe"
                    },
                    "examples": [
                        {
                            "name": "MapDictToListItems",
                            "doc": "TODO: Describe",
                            "template": {
                                "$": "map",
                                "items": [
                                    {
                                        "$": "key"
                                    },
                                    {
                                        "$": "value"
                                    }
                                ]
                            },
                            "data": {
                                "a": 1,
                                "b": 2,
                                "c": 3
                            },
                            "result": [
                                "a",
                                1,
                                "b",
                                2,
                                "c",
                                3
                            ]
                        },
                        {
                            "name": "NoContentForMappingList",
                            "doc": "TODO: Describe",
                            "template": {
                                "$": "chain",
                                "funcs": [
                                    [
                                        {
                                            "$": "attr",
                                            "name": "x"
                                        },
                                        {
                                            "$": "get",
                                            "name": "nope"
                                        },
                                        {
                                            "$": "attr",
                                            "name": "y"
                                        }
                                    ],
                                    {
                                        "$": "map",
                                        "items": [
                                            {
                                                "$": "index"
                                            },
                                            {
                                                "$": "item"
                                            }
                                        ]
                                    }
                                ]
                            },
                            "data": {
                                "x": "xxx",
                                "y": "yyy"
                            },
                            "result": [
                                0,
                                "xxx",
                                1,
                                2,
                                "yyy"
                            ]
                        },
                        {
                            "name": "NoContentForMappingDict",
                            "doc": "TODO: Describe",
                            "template": {
                                "$": "chain",
                                "funcs": [
                                    [
                                        {
                                            "key": {
                                                "$": "attr",
                                                "name": "x"
                                            },
                                            "value": {
                                                "$": "get",
                                                "name": "nope"
                                            }
                                        },
                                        {
                                            "key": {
                                                "$": "get",
                                                "name": "nope"
                                            },
                                            "value": {
                                                "$": "attr",
                                                "name": "y"
                                            }
                                        },
                                        {
                                            "key": {
                                                "$": "attr",
                                                "name": "x"
                                            },
                                            "value": {
                                                "$": "attr",
                                                "name": "y"
                                            }
                                        }
                                    ],
                                    {
                                        "$": "map",
                                        "key": {
                                            "$": "attr",
                                            "name": "key"
                                        },
                                        "value": {
                                            "$": "attr",
                                            "name": "value"
                                        }
                                    }
                                ]
                            },
                            "data": {
                                "x": "xxx",
                                "y": "yyy"
                            },
                            "result": {
                                "xxx": "yyy"
                            }
                        }
                    ]
                },
                {
                    "param": {
                        "name": "key",
                        "doc": "TODO: Describe"
                    },
                    "examples": [
                        {
                            "name": "MapDictToDictItems",
                            "doc": "TODO: Describe",
                            "template": {
                                "$": "map",
                                "key": {
                                    "$": "value"
                                },
                                "value": {
                                    "$": "key"
                                }
                            },
                            "data": {
                                "a": "d",
                                "b": "e",
                                "c": "f"
                            },
                            "result": {
                                "d": "a",
                                "e": "b",
                                "f": "c"
                            }
                        },
                        {
                            "name": "MapListsToDict",
                            "doc": "TODO: Describe",
                            "template": {
                                "$": "chain",
                                "funcs": [
                                    {
                                        "$": "zip",
                                        "items": [
                                            {
                                                "$": "attr",
                                                "name": "keys"
                                            },
                                            {
                                                "$": "attr",
                                                "name": "values"
                                            }
                                        ]
                                    },
                                    {
                                        "$": "map",
                                        "key": {
                                            "$": "attr",
                                            "name": 0
                                        },
                                        "value": {
                                            "$": "attr",
                                            "name": 1
                                        }
                                    }
                                ]
                            },
                            "data": {
                                "keys": [
                                    "a",
                                    "b",
                                    "c"
                                ],
                                "values": [
                                    1,
                                    2,
                                    3
                                ]
                            },
                            "result": {
                                "a": 1,
                                "b": 2,
                                "c": 3
                            }
                        }
                    ]
                },
                {
                    "param": {
                        "name": "value",
                        "doc": "TODO: Describe"
                    },
                    "examples": [
                        {
                            "name": "MapDictToDictItems",
                            "doc": "TODO: Describe",
                            "template": {
                                "$": "map",
                                "key": {
                                    "$": "value"
                                },
                                "value": {
                                    "$": "key"
                                }
                            },
                            "data": {
                                "a": "d",
                                "b": "e",
                                "c": "f"
                            },
                            "result": {
                                "d": "a",
                                "e": "b",
                                "f": "c"
                            }
                        },
                        {
                            "name": "MapListsToDict",
                            "doc": "TODO: Describe",
                            "template": {
                                "$": "chain",
                                "funcs": [
                                    {
                                        "$": "zip",
                                        "items": [
                                            {
                                                "$": "attr",
                                                "name": "keys"
                                            },
                                            {
                                                "$": "attr",
                                                "name": "values"
                                            }
                                        ]
                                    },
                                    {
                                        "$": "map",
                                        "key": {
                                            "$": "attr",
                                            "name": 0
                                        },
                                        "value": {
                                            "$": "attr",
                                            "name": 1
                                        }
                                    }
                                ]
                            },
                            "data": {
                                "keys": [
                                    "a",
                                    "b",
                                    "c"
                                ],
                                "values": [
                                    1,
                                    2,
                                    3
                                ]
                            },
                            "result": {
                                "a": 1,
                                "b": 2,
                                "c": 3
                            }
                        }
                    ]
                }
            ]
        },
        {
            "rule": {
                "name": "zip",
                "doc": "TODO: Describe"
            },
            "examples": [
                {
                    "name": "MapListsToDict",
                    "doc": "TODO: Describe",
                    "template": {
                        "$": "chain",
                        "funcs": [
                            {
                                "$": "zip",
                                "items": [
                                    {
                                        "$": "attr",
                                        "name": "keys"
                                    },
                                    {
                                        "$": "attr",
                                        "name": "values"
                                    }
                                ]
                            },
                            {
                                "$": "map",
                                "key": {
                                    "$": "attr",
                                    "name": 0
                                },
                                "value": {
                                    "$": "attr",
                                    "name": 1
                                }
                            }
                        ]
                    },
                    "data": {
                        "keys": [
                            "a",
                            "b",
                            "c"
                        ],
                        "values": [
                            1,
                            2,
                            3
                        ]
                    },
                    "result": {
                        "a": 1,
                        "b": 2,
                        "c": 3
                    }
                }
            ],
            "params": [
                {
                    "param": {
                        "name": "items",
                        "doc": "TODO: Describe"
                    },
                    "examples": []
                }
            ]
        },
        {
            "rule": {
                "name": "file",
                "doc": "TODO: Describe"
            },
            "examples": [],
            "params": [
                {
                    "param": {
                        "name": "name",
                        "doc": "TODO: Describe"
                    },
                    "examples": []
                },
                {
                    "param": {
                        "name": "content",
                        "doc": "TODO: Describe"
                    },
                    "examples": []
                }
            ]
        },
        {
            "rule": {
                "name": "join",
                "doc": "TODO: Describe"
            },
            "examples": [
                {
                    "name": "JoinWithStaticNoOverrides",
                    "doc": "TODO: Describe",
                    "template": {
                        "$": "join",
                        "items": [
                            {
                                "a": "default"
                            },
                            {
                                "$": "this"
                            }
                        ]
                    },
                    "data": {
                        "a": "b",
                        "c": "d"
                    },
                    "result": {
                        "a": "b",
                        "c": "d"
                    }
                },
                {
                    "name": "JoinWithStaticWithOverrides",
                    "doc": "TODO: Describe",
                    "template": {
                        "$": "join",
                        "items": [
                            {
                                "a": "default"
                            },
                            {
                                "$": "this"
                            }
                        ]
                    },
                    "data": {
                        "c": "d",
                        "e": "f"
                    },
                    "result": {
                        "a": "default",
                        "c": "d",
                        "e": "f"
                    }
                },
                {
                    "name": "JoinTwoDictsNoCommonKeys",
                    "doc": "TODO: Describe",
                    "template": {
                        "$": "join",
                        "items": [
                            {
                                "$": "attr",
                                "name": "first"
                            },
                            {
                                "$": "attr",
                                "name": "second"
                            }
                        ]
                    },
                    "data": {
                        "first": {
                            "a": 1,
                            "b": 2
                        },
                        "second": {
                            "c": 3,
                            "d": 4
                        }
                    },
                    "result": {
                        "a": 1,
                        "b": 2,
                        "c": 3,
                        "d": 4
                    }
                },
                {
                    "name": "JoinTwoDictsWithCommonKeys",
                    "doc": "TODO: Describe",
                    "template": {
                        "$": "join",
                        "items": [
                            {
                                "$": "attr",
                                "name": "first"
                            },
                            {
                                "$": "attr",
                                "name": "second"
                            }
                        ]
                    },
                    "data": {
                        "first": {
                            "a": 1,
                            "b": 2,
                            "c": 5
                        },
                        "second": {
                            "c": 3,
                            "d": 4
                        }
                    },
                    "result": {
                        "a": 1,
                        "b": 2,
                        "c": 3,
                        "d": 4
                    }
                },
                {
                    "name": "JoinTwoStrings",
                    "doc": "TODO: Describe",
                    "template": {
                        "$": "join",
                        "items": [
                            {
                                "$": "attr",
                                "name": "first"
                            },
                            {
                                "$": "attr",
                                "name": "second"
                            }
                        ]
                    },
                    "data": {
                        "first": "hello ",
                        "second": "world!"
                    },
                    "result": "hello world!"
                },
                {
                    "name": "JoinManyDynamicDicts",
                    "doc": "TODO: Describe",
                    "template": {
                        "$": "join",
                        "items": {
                            "$": "join",
                            "items": [
                                {
                                    "$": "map",
                                    "item": {
                                        "$": "object",
                                        "key": {
                                            "$": "attr",
                                            "name": "key"
                                        },
                                        "value": {
                                            "$": "attr",
                                            "name": "value"
                                        }
                                    }
                                },
                                {
                                    "$": "map",
                                    "item": {
                                        "$": "object",
                                        "key": {
                                            "$": "attr",
                                            "name": "value"
                                        },
                                        "value": {
                                            "$": "attr",
                                            "name": "key"
                                        }
                                    }
                                }
                            ]
                        }
                    },
                    "data": [
                        {
                            "key": "a",
                            "value": "b"
                        },
                        {
                            "key": "c",
                            "value": "d"
                        }
                    ],
                    "result": {
                        "a": "b",
                        "b": "a",
                        "c": "d",
                        "d": "c"
                    }
                },
                {
                    "name": "MapListToList",
                    "doc": "TODO: Describe",
                    "template": {
                        "$": "chain",
                        "funcs": [
                            {
                                "$": "join",
                                "items": [
                                    {
                                        "$": "attr",
                                        "name": "first"
                                    },
                                    {
                                        "$": "attr",
                                        "name": "second"
                                    }
                                ]
                            },
                            {
                                "$": "map",
                                "item": {
                                    "value": {
                                        "$": "item"
                                    }
                                }
                            }
                        ]
                    },
                    "data": {
                        "first": [
                            1,
                            2,
                            3
                        ],
                        "second": [
                            4,
                            5,
                            6
                        ]
                    },
                    "result": [
                        {
                            "value": 1
                        },
                        {
                            "value": 2
                        },
                        {
                            "value": 3
                        },
                        {
                            "value": 4
                        },
                        {
                            "value": 5
                        },
                        {
                            "value": 6
                        }
                    ]
                }
            ],
            "params": [
                {
                    "param": {
                        "name": "items",
                        "doc": "TODO: Describe"
                    },
                    "examples": []
                },
                {
                    "param": {
                        "name": "sep",
                        "doc": "TODO: Describe"
                    },
                    "examples": []
                }
            ]
        },
        {
            "rule": {
                "name": "chain",
                "doc": "TODO: Describe"
            },
            "examples": [
                {
                    "name": "AttrDynamicReferenceMultipleNames",
                    "doc": "Gets a list of values discovered in nested input structure of dicts with paths defined in input data.\nList of paths may include any number of paths of any depth.",
                    "template": {
                        "$": "chain",
                        "funcs": [
                            {
                                "$": "set",
                                "name": "root"
                            },
                            {
                                "$": "attr",
                                "name": "paths"
                            },
                            {
                                "$": "map",
                                "item": {
                                    "$": "chain",
                                    "funcs": [
                                        {
                                            "$": "get",
                                            "name": "root"
                                        },
                                        {
                                            "$": "attr",
                                            "names": {
                                                "$": "item"
                                            }
                                        }
                                    ]
                                }
                            }
                        ]
                    },
                    "data": {
                        "a": {
                            "b": {
                                "c": 1,
                                "d": 2
                            },
                            "e": {
                                "f": 3,
                                "g": 4
                            }
                        },
                        "paths": [
                            [
                                "a",
                                "b",
                                "d"
                            ],
                            [
                                "a",
                                "b",
                                "c"
                            ],
                            [
                                "a",
                                "e",
                                "g"
                            ],
                            [
                                "a",
                                "e",
                                "f"
                            ]
                        ]
                    },
                    "result": [
                        2,
                        1,
                        4,
                        3
                    ]
                },
                {
                    "name": "ChainWithAttr",
                    "doc": "Searching for values in nested structure with sequence of `attr` operations chained together.",
                    "template": {
                        "$": "map",
                        "item": {
                            "key": {
                                "$": "chain",
                                "funcs": [
                                    {
                                        "$": "item"
                                    },
                                    {
                                        "$": "attr",
                                        "name": "a"
                                    },
                                    {
                                        "$": "attr",
                                        "name": "b"
                                    },
                                    {
                                        "$": "attr",
                                        "name": "c"
                                    }
                                ]
                            },
                            "value": {
                                "$": "chain",
                                "funcs": [
                                    {
                                        "$": "item"
                                    },
                                    {
                                        "$": "attr",
                                        "name": "d"
                                    },
                                    {
                                        "$": "attr",
                                        "name": "e"
                                    },
                                    {
                                        "$": "attr",
                                        "name": "f"
                                    }
                                ]
                            }
                        }
                    },
                    "data": [
                        {
                            "a": {
                                "b": {
                                    "c": 1
                                }
                            },
                            "d": {
                                "e": {
                                    "f": 2
                                }
                            }
                        },
                        {
                            "a": {
                                "b": {
                                    "c": 3
                                }
                            },
                            "d": {
                                "e": {
                                    "f": 4
                                }
                            }
                        }
                    ],
                    "result": [
                        {
                            "key": 1,
                            "value": 2
                        },
                        {
                            "key": 3,
                            "value": 4
                        }
                    ]
                },
                {
                    "name": "ExprSimpleMonads2",
                    "doc": "TODO: Describe",
                    "template": {
                        "$": "chain",
                        "funcs": [
                            "prefix_",
                            {
                                "$": "expr",
                                "op": "+",
                                "value": {
                                    "$": "parent"
                                }
                            }
                        ]
                    },
                    "data": "value",
                    "result": "prefix_value"
                },
                {
                    "name": "ExprMonadsComplex",
                    "doc": "TODO: Describe",
                    "template": {
                        "$": "chain",
                        "funcs": [
                            {
                                "$": "chain",
                                "funcs": [
                                    {
                                        "$": "attr",
                                        "name": "a"
                                    },
                                    {
                                        "$": "expr",
                                        "op": "*",
                                        "value": {
                                            "$": "this"
                                        }
                                    }
                                ]
                            },
                            {
                                "$": "expr",
                                "op": "+",
                                "value": {
                                    "$": "chain",
                                    "funcs": [
                                        {
                                            "$": "parent"
                                        },
                                        {
                                            "$": "attr",
                                            "name": "b"
                                        },
                                        {
                                            "$": "expr",
                                            "op": "*",
                                            "value": {
                                                "$": "this"
                                            }
                                        }
                                    ]
                                }
                            }
                        ]
                    },
                    "data": {
                        "a": 3,
                        "b": 4
                    },
                    "result": 25
                },
                {
                    "name": "MapListToList",
                    "doc": "TODO: Describe",
                    "template": {
                        "$": "chain",
                        "funcs": [
                            {
                                "$": "join",
                                "items": [
                                    {
                                        "$": "attr",
                                        "name": "first"
                                    },
                                    {
                                        "$": "attr",
                                        "name": "second"
                                    }
                                ]
                            },
                            {
                                "$": "map",
                                "item": {
                                    "value": {
                                        "$": "item"
                                    }
                                }
                            }
                        ]
                    },
                    "data": {
                        "first": [
                            1,
                            2,
                            3
                        ],
                        "second": [
                            4,
                            5,
                            6
                        ]
                    },
                    "result": [
                        {
                            "value": 1
                        },
                        {
                            "value": 2
                        },
                        {
                            "value": 3
                        },
                        {
                            "value": 4
                        },
                        {
                            "value": 5
                        },
                        {
                            "value": 6
                        }
                    ]
                },
                {
                    "name": "MapListsToDict",
                    "doc": "TODO: Describe",
                    "template": {
                        "$": "chain",
                        "funcs": [
                            {
                                "$": "zip",
                                "items": [
                                    {
                                        "$": "attr",
                                        "name": "keys"
                                    },
                                    {
                                        "$": "attr",
                                        "name": "values"
                                    }
                                ]
                            },
                            {
                                "$": "map",
                                "key": {
                                    "$": "attr",
                                    "name": 0
                                },
                                "value": {
                                    "$": "attr",
                                    "name": 1
                                }
                            }
                        ]
                    },
                    "data": {
                        "keys": [
                            "a",
                            "b",
                            "c"
                        ],
                        "values": [
                            1,
                            2,
                            3
                        ]
                    },
                    "result": {
                        "a": 1,
                        "b": 2,
                        "c": 3
                    }
                },
                {
                    "name": "NoContentForAttr",
                    "doc": "TODO: Describe",
                    "template": {
                        "$": "chain",
                        "funcs": [
                            {
                                "$": "get",
                                "name": "foo"
                            },
                            {
                                "$": "attr",
                                "name": "bar"
                            }
                        ]
                    },
                    "data": "value",
                    "result": null
                }
            ],
            "params": [
                {
                    "param": {
                        "name": "funcs",
                        "doc": "TODO: Describe"
                    },
                    "examples": []
                }
            ]
        },
        {
            "rule": {
                "name": "expr",
                "doc": "TODO: Describe"
            },
            "examples": [],
            "params": [
                {
                    "param": {
                        "name": "op",
                        "doc": "TODO: Describe"
                    },
                    "examples": [
                        {
                            "name": "ExprUnary1",
                            "doc": "TODO: Describe",
                            "template": {
                                "$": "expr",
                                "op": "!"
                            },
                            "data": true,
                            "result": false
                        },
                        {
                            "name": "ExprUnary2",
                            "doc": "TODO: Describe",
                            "template": {
                                "$": "expr",
                                "op": "not"
                            },
                            "data": false,
                            "result": true
                        }
                    ]
                },
                {
                    "param": {
                        "name": "value",
                        "doc": "TODO: Describe"
                    },
                    "examples": [
                        {
                            "name": "ExprSimpleMonads1",
                            "doc": "TODO: Describe",
                            "template": {
                                "$": "expr",
                                "op": "+",
                                "value": "_suffix"
                            },
                            "data": "value",
                            "result": "value_suffix"
                        },
                        {
                            "name": "ExprSimpleMonads2",
                            "doc": "TODO: Describe",
                            "template": {
                                "$": "chain",
                                "funcs": [
                                    "prefix_",
                                    {
                                        "$": "expr",
                                        "op": "+",
                                        "value": {
                                            "$": "parent"
                                        }
                                    }
                                ]
                            },
                            "data": "value",
                            "result": "prefix_value"
                        },
                        {
                            "name": "ExprMonadsComplex",
                            "doc": "TODO: Describe",
                            "template": {
                                "$": "chain",
                                "funcs": [
                                    {
                                        "$": "chain",
                                        "funcs": [
                                            {
                                                "$": "attr",
                                                "name": "a"
                                            },
                                            {
                                                "$": "expr",
                                                "op": "*",
                                                "value": {
                                                    "$": "this"
                                                }
                                            }
                                        ]
                                    },
                                    {
                                        "$": "expr",
                                        "op": "+",
                                        "value": {
                                            "$": "chain",
                                            "funcs": [
                                                {
                                                    "$": "parent"
                                                },
                                                {
                                                    "$": "attr",
                                                    "name": "b"
                                                },
                                                {
                                                    "$": "expr",
                                                    "op": "*",
                                                    "value": {
                                                        "$": "this"
                                                    }
                                                }
                                            ]
                                        }
                                    }
                                ]
                            },
                            "data": {
                                "a": 3,
                                "b": 4
                            },
                            "result": 25
                        }
                    ]
                },
                {
                    "param": {
                        "name": "values",
                        "doc": "TODO: Describe"
                    },
                    "examples": [
                        {
                            "name": "ExprSimpleValues1",
                            "doc": "TODO: Describe",
                            "template": {
                                "$": "expr",
                                "op": "+",
                                "values": [
                                    {
                                        "$": "this"
                                    },
                                    "_suffix"
                                ]
                            },
                            "data": "value",
                            "result": "value_suffix"
                        },
                        {
                            "name": "ExprSimpleValues2",
                            "doc": "TODO: Describe",
                            "template": {
                                "$": "expr",
                                "op": "+",
                                "values": [
                                    "prefix_",
                                    {
                                        "$": "this"
                                    }
                                ]
                            },
                            "data": "value",
                            "result": "prefix_value"
                        },
                        {
                            "name": "ExprValuesComplex",
                            "doc": "TODO: Describe",
                            "template": {
                                "$": "expr",
                                "op": "+",
                                "values": [
                                    {
                                        "$": "expr",
                                        "op": "*",
                                        "values": [
                                            {
                                                "$": "attr",
                                                "name": "a"
                                            },
                                            {
                                                "$": "attr",
                                                "name": "a"
                                            }
                                        ]
                                    },
                                    {
                                        "$": "expr",
                                        "op": "*",
                                        "values": [
                                            {
                                                "$": "attr",
                                                "name": "b"
                                            },
                                            {
                                                "$": "attr",
                                                "name": "b"
                                            }
                                        ]
                                    }
                                ]
                            },
                            "data": {
                                "a": 3,
                                "b": 4
                            },
                            "result": 25
                        }
                    ]
                }
            ]
        },
        {
            "rule": {
                "name": "convert",
                "doc": "TODO: Describe"
            },
            "examples": [
                {
                    "name": "ConvertNoParameters",
                    "doc": "TODO: Describe",
                    "template": {
                        "$": "convert",
                        "name": "str"
                    },
                    "data": 123,
                    "result": "123"
                }
            ],
            "params": [
                {
                    "param": {
                        "name": "name",
                        "doc": "TODO: Describe"
                    },
                    "examples": []
                },
                {
                    "param": {
                        "name": "value",
                        "doc": "TODO: Describe"
                    },
                    "examples": [
                        {
                            "name": "ConvertValue",
                            "doc": "TODO: Describe",
                            "template": {
                                "$": "convert",
                                "name": "str",
                                "value": {
                                    "$": "this"
                                }
                            },
                            "data": 123,
                            "result": "123"
                        }
                    ]
                },
                {
                    "param": {
                        "name": "values",
                        "doc": "TODO: Describe"
                    },
                    "examples": [
                        {
                            "name": "ConvertValues",
                            "doc": "TODO: Describe",
                            "template": {
                                "$": "convert",
                                "name": "int",
                                "values": [
                                    {
                                        "$": "this"
                                    },
                                    16
                                ]
                            },
                            "data": "FF",
                            "result": 255
                        }
                    ]
                }
            ]
        },
        {
            "rule": {
                "name": "format",
                "doc": "TODO: Describe"
            },
            "examples": [
                {
                    "name": "FormatFromSingleValue",
                    "doc": "TODO: Describe",
                    "template": {
                        "$": "map",
                        "item": {
                            "$": "format",
                            "pattern": "{:.03f}"
                        }
                    },
                    "data": [
                        0.5,
                        0.3333333333333333,
                        0.25,
                        0.2,
                        0.16666666666666666,
                        0.14285714285714285,
                        0.125,
                        0.1111111111111111
                    ],
                    "result": [
                        "0.500",
                        "0.333",
                        "0.250",
                        "0.200",
                        "0.167",
                        "0.143",
                        "0.125",
                        "0.111"
                    ]
                },
                {
                    "name": "FormatFromDict",
                    "doc": "TODO: Describe",
                    "template": {
                        "$": "map",
                        "item": {
                            "$": "format",
                            "pattern": "{name}-{index}"
                        }
                    },
                    "data": [
                        {
                            "name": "a",
                            "index": 1
                        },
                        {
                            "name": "b",
                            "index": 2
                        },
                        {
                            "name": "c",
                            "index": 3
                        }
                    ],
                    "result": [
                        "a-1",
                        "b-2",
                        "c-3"
                    ]
                },
                {
                    "name": "FormatFromList",
                    "doc": "TODO: Describe",
                    "template": {
                        "$": "map",
                        "item": {
                            "$": "format",
                            "pattern": "{0}-{1}"
                        }
                    },
                    "data": [
                        [
                            "a",
                            1
                        ],
                        [
                            "b",
                            2
                        ],
                        [
                            "c",
                            3
                        ]
                    ],
                    "result": [
                        "a-1",
                        "b-2",
                        "c-3"
                    ]
                }
            ],
            "params": [
                {
                    "param": {
                        "name": "pattern",
                        "doc": "TODO: Describe"
                    },
                    "examples": []
                },
                {
                    "param": {
                        "name": "value",
                        "doc": "TODO: Describe"
                    },
                    "examples": [
                        {
                            "name": "FormatWithValue",
                            "doc": "TODO: Describe",
                            "template": {
                                "$": "map",
                                "item": {
                                    "$": "format",
                                    "pattern": "{x}-{y}",
                                    "value": {
                                        "x": {
                                            "$": "this"
                                        },
                                        "y": {
                                            "$": "expr",
                                            "op": "+",
                                            "values": [
                                                {
                                                    "$": "index"
                                                },
                                                1
                                            ]
                                        }
                                    }
                                }
                            },
                            "data": [
                                "a",
                                "b",
                                "c"
                            ],
                            "result": [
                                "a-1",
                                "b-2",
                                "c-3"
                            ]
                        }
                    ]
                }
            ]
        }
    ]
}
