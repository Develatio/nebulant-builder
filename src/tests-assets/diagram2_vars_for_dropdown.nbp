{
  "name": "New blueprint",
  "description": "",
  "blueprint": {
    "diagram": {
      "cells": [
        {
          "type": "nebulant.rectangle.vertical.executionControl.Start",
          "data": {
            "id": "start",
            "version": "1.0.5",
            "provider": "execution-control",
            "settings": {
              "parameters": {
                "name": "Group",
                "color": "#7B64FF",
                "version": "1.0.0",
                "description": "",
                "group_settings_enabled": false,
                "text_color": "#000000",
                "input_parameters": []
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
                "id": "d500bf5a-960e-4b9f-89af-ff7378d2a3e7"
              },
              {
                "group": "out-ok",
                "attrs": {},
                "id": "5be40c05-225e-4f17-98fa-6b6be74c1e4a"
              }
            ]
          },
          "position": {
            "x": 1480,
            "y": 600
          },
          "angle": 0,
          "id": "5a31c36f-427d-4cae-b4fe-27a3762a59be",
          "z": 457
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
                    "ssh"
                  ],
                  "provider": "aws",
                  "subtype": "ec2_instance",
                  "type": "cloud_object",
                  "value": "AWS_EC2_1"
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
                "id": "06bf53a2-eb05-4312-b4f0-8bf54bada3b7"
              },
              {
                "group": "out-ko",
                "attrs": {},
                "id": "dd08263e-686f-4477-baa2-7bea08d3d5a2"
              },
              {
                "group": "out-ok",
                "attrs": {},
                "id": "ab71dff1-d16d-4763-bad0-e176c8f9caf3"
              }
            ]
          },
          "position": {
            "x": 1380,
            "y": 820
          },
          "angle": 0,
          "id": "5e188073-dcb6-44e7-862e-6acea35d0198",
          "z": 468
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
            "id": "5e188073-dcb6-44e7-862e-6acea35d0198",
            "magnet": "circle",
            "port": "dd08263e-686f-4477-baa2-7bea08d3d5a2"
          },
          "target": {
            "id": "9ccdc79d-f13a-4d8c-8d77-a4cc9de417ae",
            "magnet": "circle",
            "port": "43ae1cef-2a6f-4f62-a673-915dc059743d"
          },
          "id": "6e4c6f2e-8a85-4ab9-8b0a-438a6eddcd54",
          "z": 470
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
                    "ssh"
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
                "id": "65fd7b0b-f264-47f3-aeef-9feabaf7ca87"
              },
              {
                "group": "out-ko",
                "attrs": {},
                "id": "01b4e835-68a4-4fc9-b5f4-eeb9860e0b89"
              },
              {
                "group": "out-ok",
                "attrs": {},
                "id": "9a97980b-2141-484e-aca0-ed29d88bf0a5"
              }
            ]
          },
          "position": {
            "x": 1233,
            "y": 823
          },
          "angle": 0,
          "id": "56ae61b6-34c2-40c2-a522-15645bdce92a",
          "z": 471
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
            "id": "56ae61b6-34c2-40c2-a522-15645bdce92a",
            "magnet": "circle",
            "port": "9a97980b-2141-484e-aca0-ed29d88bf0a5"
          },
          "target": {
            "id": "9ccdc79d-f13a-4d8c-8d77-a4cc9de417ae",
            "magnet": "circle",
            "port": "43ae1cef-2a6f-4f62-a673-915dc059743d"
          },
          "id": "d1d9a442-cc74-48e4-887c-61865561032c",
          "z": 472
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
            "id": "5a31c36f-427d-4cae-b4fe-27a3762a59be",
            "magnet": "circle",
            "port": "5be40c05-225e-4f17-98fa-6b6be74c1e4a"
          },
          "target": {
            "id": "56ae61b6-34c2-40c2-a522-15645bdce92a",
            "magnet": "circle",
            "port": "65fd7b0b-f264-47f3-aeef-9feabaf7ca87"
          },
          "id": "11dd16aa-48ed-4ef3-b6f5-e07386f77b60",
          "z": 473
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
            "id": "5a31c36f-427d-4cae-b4fe-27a3762a59be",
            "magnet": "circle",
            "port": "5be40c05-225e-4f17-98fa-6b6be74c1e4a"
          },
          "target": {
            "id": "5e188073-dcb6-44e7-862e-6acea35d0198",
            "magnet": "circle",
            "port": "06bf53a2-eb05-4312-b4f0-8bf54bada3b7"
          },
          "id": "9ebf04ff-ac37-4e68-9c9f-e5c8a5f056c0",
          "z": 474
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
                    "ssh"
                  ],
                  "provider": "aws",
                  "subtype": "ec2_instance",
                  "type": "cloud_object",
                  "value": "AWS_EC2_2"
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
                  "m1.small"
                ],
                "ImageId": [
                  ""
                ],
                "_InstanceName": "maquina",
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
                "id": "ba08ad74-c058-49db-b661-db64cbe5abf2"
              },
              {
                "group": "out-ko",
                "attrs": {},
                "id": "b055437c-9af5-4253-8337-127030fd92e7"
              },
              {
                "group": "out-ok",
                "attrs": {},
                "id": "54480d39-f33e-4cb8-bca6-d5c937ee8e51"
              }
            ]
          },
          "position": {
            "x": 1606,
            "y": 830.25
          },
          "angle": 0,
          "id": "6681ed4c-3416-49ae-9f5f-f20154baddbf",
          "z": 478
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
            "id": "5a31c36f-427d-4cae-b4fe-27a3762a59be",
            "magnet": "circle",
            "port": "5be40c05-225e-4f17-98fa-6b6be74c1e4a"
          },
          "target": {
            "id": "6681ed4c-3416-49ae-9f5f-f20154baddbf",
            "magnet": "circle",
            "port": "ba08ad74-c058-49db-b661-db64cbe5abf2"
          },
          "id": "9009956f-25d3-4069-9b8c-406dc28d77e5",
          "z": 479
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
                  "value": "AWS_EBS_1"
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
                "id": "c1f69d7b-074f-4226-a6f8-e3730f6cb45c"
              },
              {
                "group": "out-ko",
                "attrs": {},
                "id": "1156b65b-19c1-48af-8a87-7faf50786479"
              },
              {
                "group": "out-ok",
                "attrs": {},
                "id": "4f8d975d-fbc6-491f-b82d-d73ecb35a184"
              }
            ]
          },
          "position": {
            "x": 1603,
            "y": 1034
          },
          "angle": 0,
          "id": "52ced5b7-51aa-459d-accc-0a528253399c",
          "z": 481
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
            "id": "6681ed4c-3416-49ae-9f5f-f20154baddbf",
            "magnet": "circle",
            "port": "54480d39-f33e-4cb8-bca6-d5c937ee8e51"
          },
          "target": {
            "id": "52ced5b7-51aa-459d-accc-0a528253399c",
            "magnet": "circle",
            "port": "c1f69d7b-074f-4226-a6f8-e3730f6cb45c"
          },
          "id": "1502e2de-3340-40a3-831a-e8dba9530829",
          "z": 482
        },
        {
          "type": "nebulant.rectangle.vertical.executionControl.JoinThreads",
          "data": {
            "id": "join-threads",
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
                "id": "38b63f1a-5a36-48aa-bb68-b608af127595"
              },
              {
                "group": "out-ok",
                "attrs": {},
                "id": "031b5365-2a7d-4f5c-80f1-0ee81e97d583"
              }
            ]
          },
          "position": {
            "x": 1454,
            "y": 1247
          },
          "angle": 0,
          "id": "9198ae8c-c5e7-4b31-9708-248da42db33a",
          "z": 487
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
            "id": "52ced5b7-51aa-459d-accc-0a528253399c",
            "magnet": "circle",
            "port": "4f8d975d-fbc6-491f-b82d-d73ecb35a184"
          },
          "target": {
            "id": "9198ae8c-c5e7-4b31-9708-248da42db33a",
            "magnet": "circle",
            "port": "38b63f1a-5a36-48aa-bb68-b608af127595"
          },
          "id": "89a28e16-b029-4ea6-88e7-a4473774e195",
          "z": 488
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
            "id": "9ccdc79d-f13a-4d8c-8d77-a4cc9de417ae",
            "magnet": "circle",
            "port": "3dbb0a44-ee75-45e6-9010-9532f8a3d1c9"
          },
          "target": {
            "id": "9198ae8c-c5e7-4b31-9708-248da42db33a",
            "magnet": "circle",
            "port": "38b63f1a-5a36-48aa-bb68-b608af127595"
          },
          "id": "60a18574-07bb-485b-bfc9-0e67959e9b01",
          "z": 488
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
            "id": "9ccdc79d-f13a-4d8c-8d77-a4cc9de417ae",
            "magnet": "circle",
            "port": "533b21e7-b6d4-43c2-97d6-682601241607"
          },
          "target": {
            "id": "9368b105-a9a8-46b6-a9c7-70f083844041",
            "magnet": "circle",
            "port": "9ffb585b-3de8-4087-9179-b3e454279074"
          },
          "id": "0306d936-bf69-40e1-810d-f1ede8c7bdce",
          "z": 493
        },
        {
          "type": "nebulant.rectangle.vertical.aws.DetachVolume",
          "data": {
            "id": "detach-volume",
            "version": "1.0.0",
            "provider": "aws",
            "settings": {
              "parameters": {
                "InstanceId": [],
                "_MultiAttached": false,
                "VolumeId": [],
                "Force": false
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
                "id": "ff5552bf-ae9b-42f4-8ea4-abcaf4c4796a"
              },
              {
                "group": "out-ko",
                "attrs": {},
                "id": "5ad2eec8-0ee7-483d-b5d0-7197d15aabef"
              },
              {
                "group": "out-ok",
                "attrs": {},
                "id": "65547cad-5f90-470c-8d9e-908797206b88"
              }
            ]
          },
          "position": {
            "x": 1671,
            "y": 1262
          },
          "angle": 0,
          "id": "14cc0f30-ae7e-4d5c-a095-fd4674ba9daa",
          "z": 499
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
            "id": "52ced5b7-51aa-459d-accc-0a528253399c",
            "magnet": "circle",
            "port": "1156b65b-19c1-48af-8a87-7faf50786479"
          },
          "target": {
            "id": "14cc0f30-ae7e-4d5c-a095-fd4674ba9daa",
            "magnet": "circle",
            "port": "ff5552bf-ae9b-42f4-8ea4-abcaf4c4796a"
          },
          "id": "8c4dd069-290c-415b-9098-3b08bccacd84",
          "z": 500
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
            "id": "5a31c36f-427d-4cae-b4fe-27a3762a59be",
            "magnet": "circle",
            "port": "5be40c05-225e-4f17-98fa-6b6be74c1e4a"
          },
          "target": {
            "id": "c0719f9b-bbd0-4912-9dc2-c28adc1a9ccf",
            "magnet": "circle",
            "port": "da06304b-936b-4cd0-9c14-1db7d2068e63"
          },
          "id": "94701b3f-b961-4993-acda-8561f0351819",
          "z": 503
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
            "id": "c0719f9b-bbd0-4912-9dc2-c28adc1a9ccf",
            "magnet": "circle",
            "port": "90800333-a0bb-4829-b7b9-cf2de7948597"
          },
          "target": {
            "id": "62db931a-159c-444f-81e7-34dd2780f0b8",
            "magnet": "circle",
            "port": "f7520664-a438-4cab-9a30-fdb5edf7a0a8"
          },
          "id": "caac4c0b-7922-4c37-a9b3-9a8ce5b5bd8a",
          "z": 507
        },
        {
          "type": "nebulant.rectangle.vertical.generic.HttpRequest",
          "data": {
            "id": "http-request",
            "version": "1.0.0",
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
                  "value": "HTTP-Response"
                }
              },
              "parameters": {
                "body_binary": "",
                "body_raw": "",
                "body_x_www_form_urlencoded": [],
                "body_form_data": [],
                "body_content_type_header": "text",
                "body_type": "none",
                "headers": [
                  {
                    "enabled": true,
                    "name": "Cache-Control",
                    "value": "no-cache"
                  },
                  {
                    "enabled": true,
                    "name": "Accept",
                    "value": "*/*"
                  },
                  {
                    "enabled": true,
                    "name": "Accept-Encoding",
                    "value": "gzip, deflate, br"
                  },
                  {
                    "enabled": true,
                    "name": "Connection",
                    "value": "keep-alive"
                  },
                  {
                    "enabled": true,
                    "name": "User-Agent",
                    "value": "Nebulant"
                  }
                ],
                "parameters": [],
                "endpoint": "",
                "http_verb": "GET"
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
                "id": "f7520664-a438-4cab-9a30-fdb5edf7a0a8"
              },
              {
                "group": "out-ko",
                "attrs": {},
                "id": "94e30219-8737-4c3f-befc-1d3cbed22bab"
              },
              {
                "group": "out-ok",
                "attrs": {},
                "id": "e245509f-8889-4b1f-a3d8-a1103b63d98e"
              }
            ]
          },
          "position": {
            "x": 1880,
            "y": 1140
          },
          "angle": 0,
          "id": "62db931a-159c-444f-81e7-34dd2780f0b8",
          "z": 511
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
            "id": "62db931a-159c-444f-81e7-34dd2780f0b8",
            "magnet": "circle",
            "port": "e245509f-8889-4b1f-a3d8-a1103b63d98e"
          },
          "target": {
            "id": "f045f1fc-8608-4238-8ae7-d249612ccfa1",
            "magnet": "circle",
            "port": "cad25c31-9413-4f41-a66b-c1a2c6849a4b"
          },
          "id": "5e60bc1b-957c-45e6-b22d-fcf1c643ae35",
          "z": 515
        },
        {
          "type": "nebulant.rectangle.vertical.generic.Log",
          "data": {
            "id": "log",
            "version": "1.0.0",
            "provider": "generic",
            "settings": {
              "parameters": {
                "content": "{{GENERIC_VAR1}}"
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
                "id": "cad25c31-9413-4f41-a66b-c1a2c6849a4b"
              },
              {
                "group": "out-ko",
                "attrs": {},
                "id": "79b8fb86-d069-49e0-9d66-8a6fd7a9e456"
              },
              {
                "group": "out-ok",
                "attrs": {},
                "id": "45d93355-0f0e-4ec1-ac0c-3adc54508f97"
              }
            ]
          },
          "position": {
            "x": 1880,
            "y": 1340
          },
          "angle": 0,
          "id": "f045f1fc-8608-4238-8ae7-d249612ccfa1",
          "z": 519
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
            "id": "9368b105-a9a8-46b6-a9c7-70f083844041",
            "magnet": "circle",
            "port": "8b070e34-8202-406f-a3fb-887108eff144"
          },
          "target": {
            "id": "a77c400f-79cf-4947-9515-fbb29ba3c4c4",
            "magnet": "circle",
            "port": "0de31c5e-9d71-4a6a-ad42-0a474de40acd"
          },
          "id": "654554f6-3ea8-4f0f-bc17-d3caace70e5c",
          "z": 523
        },
        {
          "type": "nebulant.rectangle.vertical.generic.DefineVariables",
          "data": {
            "id": "define-variables",
            "version": "1.0.0",
            "provider": "generic",
            "settings": {
              "parameters": {
                "permanent": false,
                "files": [],
                "vars": [
                  {
                    "name": "GENERIC_VAR1",
                    "value": "value1"
                  },
                  {
                    "name": "GENERIC_VAR2",
                    "value": "value2"
                  }
                ]
              },
              "outputs": {
                "GENERIC_VAR2": {
                  "hasID": false,
                  "waiters": [],
                  "async": false,
                  "capabilities": [],
                  "provider": "generic",
                  "subtype": "",
                  "type": "user variable",
                  "value": "GENERIC_VAR2"
                },
                "GENERIC_VAR1": {
                  "hasID": false,
                  "waiters": [],
                  "async": false,
                  "capabilities": [],
                  "provider": "generic",
                  "subtype": "",
                  "type": "user variable",
                  "value": "GENERIC_VAR1"
                }
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
                "id": "da06304b-936b-4cd0-9c14-1db7d2068e63"
              },
              {
                "group": "out-ko",
                "attrs": {},
                "id": "9bfb3a46-e61c-4e99-ad18-d3d61b0887b4"
              },
              {
                "group": "out-ok",
                "attrs": {},
                "id": "90800333-a0bb-4829-b7b9-cf2de7948597"
              }
            ]
          },
          "position": {
            "x": 1870,
            "y": 915
          },
          "angle": 0,
          "id": "c0719f9b-bbd0-4912-9dc2-c28adc1a9ccf",
          "z": 526
        },
        {
          "type": "nebulant.rectangle.vertical.aws.AttachVolume",
          "data": {
            "id": "attach-volume",
            "version": "1.0.0",
            "provider": "aws",
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
                "id": "9ffb585b-3de8-4087-9179-b3e454279074"
              },
              {
                "group": "out-ko",
                "attrs": {},
                "id": "9feaf3fe-7757-4f30-87d5-6f34ce1a1584"
              },
              {
                "group": "out-ok",
                "attrs": {},
                "id": "8b070e34-8202-406f-a3fb-887108eff144"
              }
            ]
          },
          "position": {
            "x": 1159,
            "y": 1230
          },
          "angle": 0,
          "id": "9368b105-a9a8-46b6-a9c7-70f083844041",
          "z": 527
        },
        {
          "type": "nebulant.rectangle.vertical.aws.CreateVolume",
          "data": {
            "id": "create-volume",
            "version": "1.0.0",
            "provider": "aws",
            "settings": {
              "outputs": {
                "result": {
                  "hasID": true,
                  "waiters": [
                    "WaitUntilVolumeAvailable"
                  ],
                  "async": false,
                  "capabilities": [],
                  "provider": "aws",
                  "subtype": "ec2_ebs",
                  "type": "cloud_object",
                  "value": "AWS_EBS"
                }
              },
              "parameters": {
                "Encrypted": false,
                "AvailabilityZone": [
                  "us-east-1a"
                ],
                "_VolumeName": "disco",
                "TagSpecifications": [],
                "VolumeType": [
                  "gp2"
                ],
                "Size": 10,
                "Throughput": 125,
                "Iops": 100
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
                "id": "43ae1cef-2a6f-4f62-a673-915dc059743d"
              },
              {
                "group": "out-ko",
                "attrs": {},
                "id": "533b21e7-b6d4-43c2-97d6-682601241607"
              },
              {
                "group": "out-ok",
                "attrs": {},
                "id": "3dbb0a44-ee75-45e6-9010-9532f8a3d1c9"
              }
            ]
          },
          "position": {
            "x": 1280,
            "y": 1041
          },
          "angle": 0,
          "id": "9ccdc79d-f13a-4d8c-8d77-a4cc9de417ae",
          "z": 528
        },
        {
          "type": "nebulant.rectangle.vertical.generic.Log",
          "data": {
            "id": "log",
            "version": "1.0.0",
            "provider": "generic",
            "settings": {
              "parameters": {
                "content": "{{AWS_EBS}}"
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
                "id": "0de31c5e-9d71-4a6a-ad42-0a474de40acd"
              },
              {
                "group": "out-ko",
                "attrs": {},
                "id": "d722843a-edb1-4e0f-a253-923fa9aa5770"
              },
              {
                "group": "out-ok",
                "attrs": {},
                "id": "8bc27b34-8cde-4cb2-9c08-7ff0e31751e6"
              }
            ]
          },
          "position": {
            "x": 1320,
            "y": 1440
          },
          "angle": 0,
          "id": "a77c400f-79cf-4947-9515-fbb29ba3c4c4",
          "z": 529
        }
      ],
      "x": 2499.5,
      "y": 2500
    },
    "actions": [
      {
        "action_id": "5a31c36f-427d-4cae-b4fe-27a3762a59be",
        "provider": "generic",
        "version": "1.0.5",
        "first_action": true,
        "action": "start",
        "next_action": {
          "ok": [
            "56ae61b6-34c2-40c2-a522-15645bdce92a",
            "5e188073-dcb6-44e7-862e-6acea35d0198",
            "6681ed4c-3416-49ae-9f5f-f20154baddbf",
            "c0719f9b-bbd0-4912-9dc2-c28adc1a9ccf"
          ]
        },
        "debug_network": false
      },
      {
        "action_id": "5e188073-dcb6-44e7-862e-6acea35d0198",
        "provider": "aws",
        "version": "1.0.4",
        "action": "findone_instance",
        "output": "AWS_EC2_1",
        "next_action": {
          "ko": [
            "9ccdc79d-f13a-4d8c-8d77-a4cc9de417ae"
          ]
        },
        "debug_network": false
      },
      {
        "action_id": "56ae61b6-34c2-40c2-a522-15645bdce92a",
        "provider": "aws",
        "version": "1.0.4",
        "action": "findone_instance",
        "output": "AWS_EC2",
        "next_action": {
          "ok": [
            "9ccdc79d-f13a-4d8c-8d77-a4cc9de417ae"
          ]
        },
        "debug_network": false
      },
      {
        "action_id": "6681ed4c-3416-49ae-9f5f-f20154baddbf",
        "provider": "aws",
        "version": "1.0.5",
        "action": "run_instance",
        "parameters": {
          "DisableApiTermination": false,
          "InstanceType": "m1.small",
          "MaxCount": 1,
          "MinCount": 1,
          "TagSpecifications": [
            {
              "ResourceType": "instance",
              "Tags": [
                {
                  "Key": "Name",
                  "Value": "maquina"
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
        "output": "AWS_EC2_2",
        "next_action": {
          "ok": [
            "52ced5b7-51aa-459d-accc-0a528253399c"
          ]
        },
        "debug_network": false
      },
      {
        "action_id": "52ced5b7-51aa-459d-accc-0a528253399c",
        "provider": "aws",
        "version": "1.0.1",
        "action": "findone_volume",
        "output": "AWS_EBS_1",
        "next_action": {
          "ok": [
            "9198ae8c-c5e7-4b31-9708-248da42db33a"
          ],
          "ko": [
            "14cc0f30-ae7e-4d5c-a095-fd4674ba9daa"
          ]
        },
        "debug_network": false
      },
      {
        "action_id": "9198ae8c-c5e7-4b31-9708-248da42db33a",
        "provider": "generic",
        "version": "1.0.0",
        "action": "join_threads",
        "next_action": {},
        "debug_network": false
      },
      {
        "action_id": "14cc0f30-ae7e-4d5c-a095-fd4674ba9daa",
        "provider": "aws",
        "version": "1.0.0",
        "action": "detach_volume",
        "parameters": {
          "Force": false
        },
        "next_action": {},
        "debug_network": false
      },
      {
        "action_id": "62db931a-159c-444f-81e7-34dd2780f0b8",
        "provider": "generic",
        "version": "1.0.0",
        "action": "http_request",
        "parameters": {
          "http_verb": "GET",
          "headers": [
            {
              "enabled": true,
              "name": "Cache-Control",
              "value": "no-cache"
            },
            {
              "enabled": true,
              "name": "Accept",
              "value": "*/*"
            },
            {
              "enabled": true,
              "name": "Accept-Encoding",
              "value": "gzip, deflate, br"
            },
            {
              "enabled": true,
              "name": "Connection",
              "value": "keep-alive"
            },
            {
              "enabled": true,
              "name": "User-Agent",
              "value": "Nebulant"
            }
          ],
          "body_type": "none"
        },
        "output": "HTTP-Response",
        "next_action": {
          "ok": [
            "f045f1fc-8608-4238-8ae7-d249612ccfa1"
          ]
        },
        "debug_network": false
      },
      {
        "action_id": "f045f1fc-8608-4238-8ae7-d249612ccfa1",
        "provider": "generic",
        "version": "1.0.0",
        "action": "log",
        "parameters": {
          "content": "{{GENERIC_VAR1}}"
        },
        "next_action": {},
        "debug_network": false
      },
      {
        "action_id": "c0719f9b-bbd0-4912-9dc2-c28adc1a9ccf",
        "provider": "generic",
        "version": "1.0.0",
        "action": "define_variables",
        "parameters": {
          "vars": {
            "GENERIC_VAR1": "value1",
            "GENERIC_VAR2": "value2"
          }
        },
        "next_action": {
          "ok": [
            "62db931a-159c-444f-81e7-34dd2780f0b8"
          ]
        },
        "debug_network": false
      },
      {
        "action_id": "9368b105-a9a8-46b6-a9c7-70f083844041",
        "provider": "aws",
        "version": "1.0.0",
        "action": "attach_volume",
        "next_action": {
          "ok": [
            "a77c400f-79cf-4947-9515-fbb29ba3c4c4"
          ]
        },
        "debug_network": false
      },
      {
        "action_id": "9ccdc79d-f13a-4d8c-8d77-a4cc9de417ae",
        "provider": "aws",
        "version": "1.0.0",
        "action": "create_volume",
        "parameters": {
          "AvailabilityZone": "us-east-1a",
          "Encrypted": false,
          "VolumeSize": 10,
          "VolumeType": "gp2",
          "TagSpecifications": [
            {
              "ResourceType": "volume",
              "Tags": [
                {
                  "Key": "Name",
                  "Value": "disco"
                }
              ]
            }
          ],
          "_waiters": [
            "WaitUntilVolumeAvailable"
          ]
        },
        "output": "AWS_EBS",
        "next_action": {
          "ok": [
            "9198ae8c-c5e7-4b31-9708-248da42db33a"
          ],
          "ko": [
            "9368b105-a9a8-46b6-a9c7-70f083844041"
          ]
        },
        "debug_network": false
      },
      {
        "action_id": "a77c400f-79cf-4947-9515-fbb29ba3c4c4",
        "provider": "generic",
        "version": "1.0.0",
        "action": "log",
        "parameters": {
          "content": "{{AWS_EBS}}"
        },
        "next_action": {},
        "debug_network": false
      }
    ],
    "min_cli_version": "0.0.1",
    "builder_version": "1.0.1",
    "diagram_version": "1.0.1"
  }
}
