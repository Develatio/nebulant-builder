{
  "name": "New blueprint",
  "description": "",
  "blueprint": {
    "diagram": {
      "cells": [
        {
          "type": "nebulant.link.Smart",
          "router": {
            "name": "manhattan",
            "args": {
              "padding": 20
            }
          },
          "connector": {
            "name": "rounded"
          },
          "source": {
            "id": "84d54eeb-4263-4993-85c8-56c2bde51cbb",
            "magnet": "circle",
            "port": "8382d214-0eb5-4906-84c2-799f0f6a15ef"
          },
          "target": {
            "id": "68f56e5a-714c-4640-afd2-cd8bd8fd84b2",
            "magnet": "circle",
            "port": "48b77612-d4f2-424c-9ab4-88d4c893db52"
          },
          "id": "27ce960f-2585-47e3-91dc-cd667d346274",
          "z": 8
        },
        {
          "type": "nebulant.link.Smart",
          "router": {
            "name": "manhattan",
            "args": {
              "padding": 20
            }
          },
          "connector": {
            "name": "rounded"
          },
          "source": {
            "id": "68f56e5a-714c-4640-afd2-cd8bd8fd84b2",
            "magnet": "circle",
            "port": "73b24296-9833-4f8b-b794-540dfb99869a"
          },
          "target": {
            "id": "9b7cb351-4999-47bb-9eb7-2bafae413e63",
            "magnet": "circle",
            "port": "4f450cea-8249-40b1-9b1f-a78fc999985c"
          },
          "id": "62ee6d55-6465-4aaa-950a-333f238f0dbd",
          "z": 13
        },
        {
          "type": "nebulant.link.Smart",
          "router": {
            "name": "manhattan",
            "args": {
              "padding": 20
            }
          },
          "connector": {
            "name": "rounded"
          },
          "source": {
            "id": "9b7cb351-4999-47bb-9eb7-2bafae413e63",
            "magnet": "circle",
            "port": "cdd0ec34-1130-494f-a1d9-73f9bc757f19"
          },
          "target": {
            "id": "c891a257-f113-4f3f-b217-9ede0c93f84c",
            "magnet": "circle",
            "port": "b488eadc-68eb-41c2-a3e3-427f958398ac"
          },
          "id": "c06634d0-a7ee-43da-a9a6-6283e96c7db6",
          "z": 17
        },
        {
          "type": "nebulant.link.Smart",
          "router": {
            "name": "manhattan",
            "args": {
              "padding": 20
            }
          },
          "connector": {
            "name": "rounded"
          },
          "source": {
            "id": "68f56e5a-714c-4640-afd2-cd8bd8fd84b2",
            "magnet": "circle",
            "port": "557022d1-6a9a-4928-8c74-5cb7472909e6"
          },
          "target": {
            "id": "c891a257-f113-4f3f-b217-9ede0c93f84c",
            "magnet": "circle",
            "port": "b488eadc-68eb-41c2-a3e3-427f958398ac"
          },
          "id": "65035c40-a003-41ad-b082-80911fbd1d92",
          "z": 18
        },
        {
          "type": "nebulant.link.Smart",
          "router": {
            "name": "manhattan",
            "args": {
              "padding": 20
            }
          },
          "connector": {
            "name": "rounded"
          },
          "source": {
            "id": "c891a257-f113-4f3f-b217-9ede0c93f84c",
            "magnet": "circle",
            "port": "d15b43e6-e6dd-4b96-b284-fdd80c3cecec"
          },
          "target": {
            "id": "c4826700-030c-4e76-999b-08d1722634a4",
            "magnet": "circle",
            "port": "0b26b184-fefc-40b3-b6ac-4a912a12d205"
          },
          "id": "120ff944-b788-4a24-88a3-dc9054e0f74e",
          "z": 146
        },
        {
          "type": "nebulant.rectangle.vertical.executionControl.Start",
          "data": {
            "id": "start",
            "version": "1.0.1",
            "provider": "execution-control",
            "settings": {
              "parameters": {
                "name": "Group",
                "color": "#7B64FF",
                "version": "1.0.0"
              }
            }
          },
          "size": {
            "width": 100,
            "height": 120
          },
          "ports": {
            "items": [
              {
                "group": "in",
                "attrs": {},
                "id": "081c75b8-c10c-41b9-81d7-637c44a614ac"
              },
              {
                "group": "out-ok",
                "attrs": {},
                "id": "75dae439-099e-44b7-aa1b-9bcfa3d27d6a"
              }
            ]
          },
          "position": {
            "x": 2060,
            "y": 2080
          },
          "angle": 0,
          "id": "ed0e3a01-ca3e-4e3b-b8bd-359162213ed4",
          "z": 160
        },
        {
          "type": "nebulant.link.Simple",
          "source": {
            "id": "ed0e3a01-ca3e-4e3b-b8bd-359162213ed4",
            "magnet": "circle",
            "port": "75dae439-099e-44b7-aa1b-9bcfa3d27d6a"
          },
          "target": {
            "id": "84d54eeb-4263-4993-85c8-56c2bde51cbb",
            "magnet": "circle",
            "port": "7f669cf8-28eb-4ebe-badf-636639a4ad5e"
          },
          "id": "dec2400a-2404-4741-8df5-7814bfbc3bc6",
          "z": 244
        },
        {
          "type": "nebulant.link.Simple",
          "source": {
            "id": "c4826700-030c-4e76-999b-08d1722634a4",
            "magnet": "circle",
            "port": "9ebefce4-7def-4de5-86f7-39283755f4bf"
          },
          "target": {
            "id": "3b9a791e-f7e3-43b3-8965-5ff8a3818489",
            "magnet": "circle",
            "port": "bcbcf200-4b20-47b3-a56e-e46abee583b0"
          },
          "id": "5d107729-c340-4021-9d6a-d7f6e1c3019e",
          "z": 264
        },
        {
          "type": "nebulant.rectangle.vertical.generic.Log",
          "data": {
            "id": "log",
            "version": "1.0.0",
            "provider": "generic",
            "settings": {
              "parameters": {
                "content": "Starting workflow"
              }
            }
          },
          "size": {
            "width": 100,
            "height": 120
          },
          "ports": {
            "items": [
              {
                "group": "in",
                "attrs": {},
                "id": "7f669cf8-28eb-4ebe-badf-636639a4ad5e"
              },
              {
                "group": "out-ko",
                "attrs": {},
                "id": "391ad9cf-b219-45f2-9bf8-2b2e2c526569"
              },
              {
                "group": "out-ok",
                "attrs": {},
                "id": "8382d214-0eb5-4906-84c2-799f0f6a15ef"
              }
            ]
          },
          "position": {
            "x": 2060,
            "y": 2240
          },
          "angle": 0,
          "id": "84d54eeb-4263-4993-85c8-56c2bde51cbb",
          "z": 266
        },
        {
          "type": "nebulant.rectangle.group.Group",
          "size": {
            "width": 100,
            "height": 120
          },
          "ports": {
            "groups": {
              "in": {
                "position": "top",
                "attrs": {
                  "circle": {
                    "magnet": "passive",
                    "stroke": "transparent",
                    "stroke-width": "25px",
                    "fill": "#57AEFF",
                    "r": 5
                  }
                }
              },
              "out-ko": {
                "position": {
                  "name": "absolute",
                  "args": {
                    "x": 0,
                    "y": "100%"
                  }
                },
                "attrs": {
                  "circle": {
                    "magnet": true,
                    "stroke": "transparent",
                    "stroke-width": "25px",
                    "fill": "#DD180E",
                    "link-color": "#DD180E",
                    "r": 5,
                    "filter": {
                      "name": "dropShadow",
                      "args": {
                        "dx": 5,
                        "dy": 5,
                        "blur": 3,
                        "opacity": 0.2
                      }
                    }
                  }
                }
              },
              "out-ok": {
                "position": {
                  "name": "absolute",
                  "args": {
                    "x": "100%",
                    "y": "100%"
                  }
                },
                "attrs": {
                  "circle": {
                    "magnet": true,
                    "stroke": "transparent",
                    "stroke-width": "25px",
                    "fill": "#15DA00",
                    "link-color": "#15DA00",
                    "r": 5,
                    "filter": {
                      "name": "dropShadow",
                      "args": {
                        "dx": 5,
                        "dy": 5,
                        "blur": 3,
                        "opacity": 0.2
                      }
                    }
                  }
                }
              }
            },
            "items": [
              {
                "group": "in",
                "attrs": {},
                "id": "0b26b184-fefc-40b3-b6ac-4a912a12d205"
              },
              {
                "group": "out-ko",
                "attrs": {},
                "id": "dd7a1527-0e97-4398-b1ce-647b726b8534"
              },
              {
                "group": "out-ok",
                "attrs": {},
                "id": "9ebefce4-7def-4de5-86f7-39283755f4bf"
              }
            ]
          },
          "data": {
            "collapsed": true,
            "colors-h": 313,
            "colors-s": 93,
            "colors-l": 50
          },
          "position": {
            "x": 2280,
            "y": 2880
          },
          "id": "c4826700-030c-4e76-999b-08d1722634a4",
          "z": 351,
          "embeds": [
            "d30fe000-f19d-414e-aa2a-7ae1638ca63d",
            "c1bff619-d501-4d14-974f-c713adbbe6f5",
            "960b8187-3530-48d8-afaf-b07861daf183",
            "308b4477-cc53-45b7-9a0e-a65daf51bd90",
            "4f351f42-6484-4ce9-bc83-6d8542076320",
            "971dac74-025f-4d3e-9e5c-2fa99908c852",
            "4cdee658-df80-4a40-a3e0-2b195679e307",
            "dcbde3f6-4971-47c5-8388-cf427fc45883",
            "dbc9d4d3-22cc-4846-8038-c95398e05794",
            "3810b967-af67-4b7d-ab47-165139fce21a",
            "df53deea-c731-40ed-b80c-5c98e422e5c4",
            "81e72cf0-4970-431e-85f6-ef4b3f3d033d"
          ]
        },
        {
          "type": "nebulant.link.Smart",
          "router": {
            "name": "manhattan",
            "args": {
              "padding": 20
            }
          },
          "connector": {
            "name": "rounded"
          },
          "source": {
            "id": "81e72cf0-4970-431e-85f6-ef4b3f3d033d",
            "magnet": "circle",
            "port": "4e8532b1-177a-4a1a-85ad-0dc59f86a374"
          },
          "target": {
            "id": "df53deea-c731-40ed-b80c-5c98e422e5c4",
            "magnet": "circle",
            "port": "e99264c5-48b0-4e6d-b38d-1c7bafb4bfb9"
          },
          "id": "d30fe000-f19d-414e-aa2a-7ae1638ca63d",
          "z": 352,
          "parent": "c4826700-030c-4e76-999b-08d1722634a4"
        },
        {
          "type": "nebulant.link.Smart",
          "router": {
            "name": "manhattan",
            "args": {
              "padding": 20
            }
          },
          "connector": {
            "name": "rounded"
          },
          "source": {
            "id": "dcbde3f6-4971-47c5-8388-cf427fc45883",
            "magnet": "circle",
            "port": "2530509d-e202-4d60-a0f4-7de3f45b3296"
          },
          "target": {
            "id": "81e72cf0-4970-431e-85f6-ef4b3f3d033d",
            "magnet": "circle",
            "port": "4fc32125-5bb4-48b1-bc31-7cdfa716c4a4"
          },
          "id": "c1bff619-d501-4d14-974f-c713adbbe6f5",
          "z": 353,
          "parent": "c4826700-030c-4e76-999b-08d1722634a4"
        },
        {
          "type": "nebulant.link.Smart",
          "router": {
            "name": "manhattan",
            "args": {
              "padding": 20
            }
          },
          "connector": {
            "name": "rounded"
          },
          "source": {
            "id": "dbc9d4d3-22cc-4846-8038-c95398e05794",
            "magnet": "circle",
            "port": "dc3152ff-4215-46c7-a498-2ca0b388afd1"
          },
          "target": {
            "id": "dcbde3f6-4971-47c5-8388-cf427fc45883",
            "magnet": "circle",
            "port": "3d8ef708-fede-4897-8695-418411a95e9d"
          },
          "id": "960b8187-3530-48d8-afaf-b07861daf183",
          "z": 354,
          "parent": "c4826700-030c-4e76-999b-08d1722634a4"
        },
        {
          "type": "nebulant.link.Smart",
          "router": {
            "name": "manhattan",
            "args": {
              "padding": 20
            }
          },
          "connector": {
            "name": "rounded"
          },
          "source": {
            "id": "3810b967-af67-4b7d-ab47-165139fce21a",
            "magnet": "circle",
            "port": "df084a63-9b27-4486-a590-29c13d88002b"
          },
          "target": {
            "id": "dbc9d4d3-22cc-4846-8038-c95398e05794",
            "magnet": "circle",
            "port": "2c6b9d1e-2fdf-4e22-b4c3-9bcb16a138a7"
          },
          "id": "308b4477-cc53-45b7-9a0e-a65daf51bd90",
          "z": 355,
          "parent": "c4826700-030c-4e76-999b-08d1722634a4"
        },
        {
          "type": "nebulant.link.Static",
          "source": {
            "port": "fe17e5ff-c609-49cd-8dc4-0e0807941465",
            "id": "df53deea-c731-40ed-b80c-5c98e422e5c4"
          },
          "target": {
            "port": "9ebefce4-7def-4de5-86f7-39283755f4bf",
            "id": "c4826700-030c-4e76-999b-08d1722634a4"
          },
          "id": "4f351f42-6484-4ce9-bc83-6d8542076320",
          "z": 356,
          "parent": "c4826700-030c-4e76-999b-08d1722634a4"
        },
        {
          "type": "nebulant.link.Static",
          "source": {
            "port": "94812989-1938-44e9-920b-a76ce0b80b28",
            "id": "df53deea-c731-40ed-b80c-5c98e422e5c4"
          },
          "target": {
            "port": "dd7a1527-0e97-4398-b1ce-647b726b8534",
            "id": "c4826700-030c-4e76-999b-08d1722634a4"
          },
          "id": "971dac74-025f-4d3e-9e5c-2fa99908c852",
          "z": 357,
          "parent": "c4826700-030c-4e76-999b-08d1722634a4"
        },
        {
          "type": "nebulant.link.Static",
          "source": {
            "port": "0b26b184-fefc-40b3-b6ac-4a912a12d205",
            "id": "c4826700-030c-4e76-999b-08d1722634a4"
          },
          "target": {
            "port": "97f76354-c891-4ebc-bdc1-420123f6230b",
            "id": "3810b967-af67-4b7d-ab47-165139fce21a"
          },
          "id": "4cdee658-df80-4a40-a3e0-2b195679e307",
          "z": 358,
          "parent": "c4826700-030c-4e76-999b-08d1722634a4"
        },
        {
          "type": "nebulant.rectangle.vertical.generic.DownloadFiles",
          "data": {
            "id": "download-files",
            "version": "1.0.0",
            "provider": "generic",
            "settings": {
              "parameters": {
                "paths": [],
                "port": 22,
                "password": "",
                "passphrase": "",
                "privkey": "",
                "privkeyPath": "",
                "username": "",
                "source": [],
                "_credentials": "privkeyPath"
              }
            }
          },
          "size": {
            "width": 100,
            "height": 120
          },
          "ports": {
            "items": [
              {
                "group": "in",
                "attrs": {},
                "id": "3d8ef708-fede-4897-8695-418411a95e9d"
              },
              {
                "group": "out-ko",
                "attrs": {},
                "id": "3a704105-0fb0-478d-8af2-561a0126b44d"
              },
              {
                "group": "out-ok",
                "attrs": {},
                "id": "2530509d-e202-4d60-a0f4-7de3f45b3296"
              }
            ]
          },
          "position": {
            "x": 2320,
            "y": 3280
          },
          "angle": 0,
          "id": "dcbde3f6-4971-47c5-8388-cf427fc45883",
          "z": 359,
          "parent": "c4826700-030c-4e76-999b-08d1722634a4"
        },
        {
          "type": "nebulant.rectangle.vertical.generic.Log",
          "data": {
            "id": "log",
            "version": "1.0.0",
            "provider": "generic",
            "settings": {
              "parameters": {
                "content": ""
              }
            }
          },
          "size": {
            "width": 100,
            "height": 120
          },
          "ports": {
            "items": [
              {
                "group": "in",
                "attrs": {},
                "id": "2c6b9d1e-2fdf-4e22-b4c3-9bcb16a138a7"
              },
              {
                "group": "out-ko",
                "attrs": {},
                "id": "d0fd666c-6ff7-4bf6-bdfe-051a95939688"
              },
              {
                "group": "out-ok",
                "attrs": {},
                "id": "dc3152ff-4215-46c7-a498-2ca0b388afd1"
              }
            ]
          },
          "position": {
            "x": 2320,
            "y": 3100
          },
          "angle": 0,
          "id": "dbc9d4d3-22cc-4846-8038-c95398e05794",
          "z": 360,
          "parent": "c4826700-030c-4e76-999b-08d1722634a4"
        },
        {
          "type": "nebulant.rectangle.vertical.executionControl.Start",
          "data": {
            "id": "start",
            "version": "1.0.1",
            "provider": "execution-control",
            "settings": {
              "parameters": {
                "name": "Install software",
                "color": "#7B64FF",
                "version": "1.0.0"
              }
            }
          },
          "size": {
            "width": 100,
            "height": 120
          },
          "ports": {
            "items": [
              {
                "group": "in",
                "attrs": {},
                "id": "97f76354-c891-4ebc-bdc1-420123f6230b"
              },
              {
                "group": "out-ok",
                "attrs": {},
                "id": "df084a63-9b27-4486-a590-29c13d88002b"
              }
            ]
          },
          "position": {
            "x": 2320,
            "y": 2920
          },
          "angle": 0,
          "id": "3810b967-af67-4b7d-ab47-165139fce21a",
          "z": 361,
          "parent": "c4826700-030c-4e76-999b-08d1722634a4"
        },
        {
          "type": "nebulant.rectangle.vertical.executionControl.End",
          "data": {
            "id": "end",
            "version": "1.0.0",
            "provider": "execution-control",
            "settings": {
              "parameters": {}
            }
          },
          "size": {
            "width": 100,
            "height": 120
          },
          "ports": {
            "items": [
              {
                "group": "in",
                "attrs": {},
                "id": "e99264c5-48b0-4e6d-b38d-1c7bafb4bfb9"
              },
              {
                "group": "out-ko",
                "attrs": {},
                "id": "94812989-1938-44e9-920b-a76ce0b80b28"
              },
              {
                "group": "out-ok",
                "attrs": {},
                "id": "fe17e5ff-c609-49cd-8dc4-0e0807941465"
              }
            ]
          },
          "position": {
            "x": 2325,
            "y": 3660
          },
          "angle": 0,
          "id": "df53deea-c731-40ed-b80c-5c98e422e5c4",
          "z": 362,
          "parent": "c4826700-030c-4e76-999b-08d1722634a4"
        },
        {
          "type": "nebulant.rectangle.vertical.generic.RunCommand",
          "data": {
            "id": "run-command",
            "version": "1.0.8",
            "provider": "generic",
            "settings": {
              "outputs": {
                "result": {
                  "hasID": false,
                  "waiters": [],
                  "async": false,
                  "capabilities": [],
                  "provider": "generic",
                  "subtype": "",
                  "type": "http_response",
                  "value": "RunCommand_Result"
                }
              },
              "parameters": {
                "upload_to_remote_target": true,
                "vars_targets": [],
                "vars": [],
                "port": 22,
                "password": "",
                "passphrase": "",
                "privkey": "",
                "privkeyPath": "",
                "username": "",
                "scriptParameters": "",
                "scriptName": "",
                "script": "",
                "command": "",
                "pass_to_entrypoint_as_single_param": false,
                "entrypoint": "",
                "target": [
                  "local"
                ],
                "_custom_entrypoint": false,
                "_type": "command",
                "_credentials": "privkeyPath"
              }
            }
          },
          "size": {
            "width": 100,
            "height": 120
          },
          "ports": {
            "items": [
              {
                "group": "in",
                "attrs": {},
                "id": "4fc32125-5bb4-48b1-bc31-7cdfa716c4a4"
              },
              {
                "group": "out-ko",
                "attrs": {},
                "id": "86222a17-23a0-4113-8431-1127e2856d9b"
              },
              {
                "group": "out-ok",
                "attrs": {},
                "id": "4e8532b1-177a-4a1a-85ad-0dc59f86a374"
              }
            ]
          },
          "position": {
            "x": 2325,
            "y": 3460
          },
          "angle": 0,
          "id": "81e72cf0-4970-431e-85f6-ef4b3f3d033d",
          "z": 363,
          "parent": "c4826700-030c-4e76-999b-08d1722634a4"
        },
        {
          "type": "nebulant.rectangle.vertical.generic.Log",
          "data": {
            "id": "log",
            "version": "1.0.0",
            "provider": "generic",
            "settings": {
              "parameters": {
                "content": "Ending workflow"
              }
            }
          },
          "size": {
            "width": 100,
            "height": 120
          },
          "ports": {
            "items": [
              {
                "group": "in",
                "attrs": {},
                "id": "bcbcf200-4b20-47b3-a56e-e46abee583b0"
              },
              {
                "group": "out-ko",
                "attrs": {},
                "id": "3717b2ab-dbd8-481b-8dd2-fbb8fead61b1"
              },
              {
                "group": "out-ok",
                "attrs": {},
                "id": "8b821534-9ea0-4ae0-84d9-ff567a6d28a9"
              }
            ]
          },
          "position": {
            "x": 2420,
            "y": 3020
          },
          "angle": 0,
          "id": "3b9a791e-f7e3-43b3-8965-5ff8a3818489",
          "z": 364
        },
        {
          "type": "nebulant.rectangle.vertical.aws.RunInstance",
          "data": {
            "id": "run-instance",
            "version": "1.0.5",
            "provider": "aws",
            "settings": {
              "outputs": {
                "result": {
                  "hasID": true,
                  "waiters": [
                    "WaitUntilInstanceExists",
                    "WaitUntilInstanceRunning",
                    "WaitUntilInstanceStatusOk"
                  ],
                  "async": false,
                  "capabilities": [
                    "ip"
                  ],
                  "provider": "aws",
                  "subtype": "ec2_instance",
                  "type": "cloud_object",
                  "value": "AWS_EC2_1"
                }
              },
              "parameters": {
                "_EbsDeleteOnTermination": true,
                "_publicIp": [
                  "default"
                ],
                "SubnetId": [],
                "SecurityGroupIds": [],
                "DisableApiTermination": false,
                "MinCount": 1,
                "MaxCount": 1,
                "KeyName": [],
                "InstanceType": [
                  "t3.nano"
                ],
                "ImageId": [],
                "_InstanceName": "",
                "TagSpecifications": [],
                "VolumeType": [
                  "gp3"
                ],
                "Size": 10,
                "Throughput": 125,
                "Iops": 3000
              }
            }
          },
          "size": {
            "width": 100,
            "height": 120
          },
          "ports": {
            "items": [
              {
                "group": "in",
                "attrs": {},
                "id": "4f450cea-8249-40b1-9b1f-a78fc999985c"
              },
              {
                "group": "out-ko",
                "attrs": {},
                "id": "6cd4490f-6bc7-489a-a620-f8880367ae4a"
              },
              {
                "group": "out-ok",
                "attrs": {},
                "id": "cdd0ec34-1130-494f-a1d9-73f9bc757f19"
              }
            ]
          },
          "position": {
            "x": 1900,
            "y": 2580
          },
          "angle": 0,
          "id": "9b7cb351-4999-47bb-9eb7-2bafae413e63",
          "z": 365
        },
        {
          "type": "nebulant.rectangle.vertical.aws.FindVolume",
          "data": {
            "id": "find-volume",
            "version": "1.0.1",
            "provider": "aws",
            "settings": {
              "outputs": {
                "result": {
                  "hasID": true,
                  "waiters": [],
                  "async": false,
                  "capabilities": [],
                  "provider": "aws",
                  "subtype": "ec2_ebs",
                  "type": "cloud_object",
                  "value": "AWS_EBS"
                }
              },
              "parameters": {
                "VolumeIds": [],
                "_VolumeName": "",
                "_activeTab": "filters",
                "Filters": []
              }
            }
          },
          "size": {
            "width": 100,
            "height": 120
          },
          "ports": {
            "items": [
              {
                "group": "in",
                "attrs": {},
                "id": "b488eadc-68eb-41c2-a3e3-427f958398ac"
              },
              {
                "group": "out-ko",
                "attrs": {},
                "id": "41051d48-e0b7-452e-bc9a-a12e162f76cd"
              },
              {
                "group": "out-ok",
                "attrs": {},
                "id": "d15b43e6-e6dd-4b96-b284-fdd80c3cecec"
              }
            ]
          },
          "position": {
            "x": 2080,
            "y": 2740
          },
          "angle": 0,
          "id": "c891a257-f113-4f3f-b217-9ede0c93f84c",
          "z": 366
        },
        {
          "type": "nebulant.rectangle.vertical.aws.FindInstance",
          "data": {
            "id": "find-instance",
            "version": "1.0.4",
            "provider": "aws",
            "settings": {
              "outputs": {
                "result": {
                  "hasID": true,
                  "waiters": [],
                  "async": false,
                  "capabilities": [
                    "ip"
                  ],
                  "provider": "aws",
                  "subtype": "ec2_instance",
                  "type": "cloud_object",
                  "value": "AWS_EC2"
                }
              },
              "parameters": {
                "InstanceIds": [],
                "_InstanceName": "",
                "_activeTab": "filters",
                "Filters": []
              }
            }
          },
          "size": {
            "width": 100,
            "height": 120
          },
          "ports": {
            "items": [
              {
                "group": "in",
                "attrs": {},
                "id": "48b77612-d4f2-424c-9ab4-88d4c893db52"
              },
              {
                "group": "out-ko",
                "attrs": {},
                "id": "73b24296-9833-4f8b-b794-540dfb99869a"
              },
              {
                "group": "out-ok",
                "attrs": {},
                "id": "557022d1-6a9a-4928-8c74-5cb7472909e6"
              }
            ]
          },
          "position": {
            "x": 2060,
            "y": 2420
          },
          "angle": 0,
          "id": "68f56e5a-714c-4640-afd2-cd8bd8fd84b2",
          "z": 367
        }
      ]
    },
    "actions": [
      {
        "action_id": "ed0e3a01-ca3e-4e3b-b8bd-359162213ed4",
        "provider": "generic",
        "version": "1.0.1",
        "first_action": true,
        "action": "start",
        "next_action": {
          "ok": [
            "84d54eeb-4263-4993-85c8-56c2bde51cbb"
          ]
        },
        "debug_network": false
      },
      {
        "action_id": "84d54eeb-4263-4993-85c8-56c2bde51cbb",
        "provider": "generic",
        "version": "1.0.0",
        "action": "log",
        "parameters": {
          "content": "Starting workflow"
        },
        "next_action": {
          "ok": [
            "68f56e5a-714c-4640-afd2-cd8bd8fd84b2"
          ]
        },
        "debug_network": false
      },
      {
        "action_id": "dcbde3f6-4971-47c5-8388-cf427fc45883",
        "provider": "generic",
        "version": "1.0.0",
        "action": "download_files",
        "parameters": {
          "port": 22
        },
        "next_action": {
          "ok": [
            "81e72cf0-4970-431e-85f6-ef4b3f3d033d"
          ]
        },
        "debug_network": false
      },
      {
        "action_id": "dbc9d4d3-22cc-4846-8038-c95398e05794",
        "provider": "generic",
        "version": "1.0.0",
        "action": "log",
        "next_action": {
          "ok": [
            "dcbde3f6-4971-47c5-8388-cf427fc45883"
          ]
        },
        "debug_network": false
      },
      {
        "action_id": "3810b967-af67-4b7d-ab47-165139fce21a",
        "provider": "generic",
        "version": "1.0.1",
        "first_action": true,
        "action": "start",
        "next_action": {
          "ok": [
            "dbc9d4d3-22cc-4846-8038-c95398e05794"
          ]
        },
        "debug_network": false
      },
      {
        "action_id": "df53deea-c731-40ed-b80c-5c98e422e5c4",
        "provider": "generic",
        "version": "1.0.0",
        "action": "noop",
        "next_action": {},
        "debug_network": false
      },
      {
        "action_id": "81e72cf0-4970-431e-85f6-ef4b3f3d033d",
        "provider": "generic",
        "version": "1.0.8",
        "action": "run_script",
        "parameters": {
          "target": "local"
        },
        "output": "RunCommand_Result",
        "next_action": {
          "ok": [
            "df53deea-c731-40ed-b80c-5c98e422e5c4"
          ]
        },
        "debug_network": false
      },
      {
        "action_id": "3b9a791e-f7e3-43b3-8965-5ff8a3818489",
        "provider": "generic",
        "version": "1.0.0",
        "action": "log",
        "parameters": {
          "content": "Ending workflow"
        },
        "next_action": {},
        "debug_network": false
      },
      {
        "action_id": "9b7cb351-4999-47bb-9eb7-2bafae413e63",
        "provider": "aws",
        "version": "1.0.5",
        "action": "run_instance",
        "parameters": {
          "DisableApiTermination": false,
          "InstanceType": "t3.nano",
          "MaxCount": 1,
          "MinCount": 1,
          "TagSpecifications": [
            {
              "ResourceType": "instance",
              "Tags": [
                {
                  "Key": "Name"
                }
              ]
            }
          ],
          "_waiters": [
            "WaitUntilInstanceExists",
            "WaitUntilInstanceRunning",
            "WaitUntilInstanceStatusOk"
          ],
          "BlockDeviceMappings": [
            {
              "DeviceName": "/dev/xvda",
              "Ebs": {
                "DeleteOnTermination": true,
                "Iops": 3000,
                "VolumeSize": 10,
                "Throughput": 125,
                "VolumeType": "gp3"
              }
            }
          ]
        },
        "output": "AWS_EC2_1",
        "next_action": {
          "ok": [
            "c891a257-f113-4f3f-b217-9ede0c93f84c"
          ]
        },
        "debug_network": false
      },
      {
        "action_id": "c891a257-f113-4f3f-b217-9ede0c93f84c",
        "provider": "aws",
        "version": "1.0.1",
        "action": "findone_volume",
        "output": "AWS_EBS",
        "next_action": {},
        "debug_network": false
      },
      {
        "action_id": "68f56e5a-714c-4640-afd2-cd8bd8fd84b2",
        "provider": "aws",
        "version": "1.0.4",
        "action": "findone_instance",
        "output": "AWS_EC2",
        "next_action": {
          "ok": [
            "c891a257-f113-4f3f-b217-9ede0c93f84c"
          ],
          "ko": [
            "9b7cb351-4999-47bb-9eb7-2bafae413e63"
          ]
        },
        "debug_network": false
      }
    ],
    "min_cli_version": "0.0.1",
    "builder_version": "0.0.1"
  }
}
