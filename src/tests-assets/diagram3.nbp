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
          "z": 703
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
          "z": 764
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
          "z": 765
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
          "z": 886
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
            "id": "d10fbad1-b185-4777-9c5a-20355d422c70",
            "magnet": "circle",
            "port": "c9a3a2c5-2a68-4223-a5aa-9cb2b2ebe0fe"
          },
          "target": {
            "id": "49977903-432d-4b60-afc6-688c78531af8",
            "magnet": "circle",
            "port": "d6d70316-7e94-43f5-b697-d2a9026bc714"
          },
          "id": "e4a431af-7cc2-43b2-8fc3-d0322fd1e981",
          "z": 889
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
            "id": "49977903-432d-4b60-afc6-688c78531af8",
            "magnet": "circle",
            "port": "e34f1242-a491-413b-8c78-561ccf7462da"
          },
          "target": {
            "id": "d770737d-9c25-4ee7-a32d-3e28173fea21",
            "magnet": "circle",
            "port": "a564b2da-4481-4a22-9145-b4795cdd21fd"
          },
          "id": "63c314d9-b29d-42ca-8b11-fd382b104557",
          "z": 890
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
            "id": "14cc0f30-ae7e-4d5c-a095-fd4674ba9daa",
            "magnet": "circle",
            "port": "65547cad-5f90-470c-8d9e-908797206b88"
          },
          "target": {
            "id": "fa1fb6f6-7462-4841-aab7-d9ecb84484e1",
            "magnet": "circle",
            "port": "6405f786-c277-4c84-ad00-755404eefc0b"
          },
          "id": "4062e034-52e9-4923-afef-df911b035d22",
          "z": 986
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
            "id": "fa1fb6f6-7462-4841-aab7-d9ecb84484e1",
            "magnet": "circle",
            "port": "64c2bf94-b680-4428-9c3f-413a2b540a2d"
          },
          "target": {
            "id": "d10fbad1-b185-4777-9c5a-20355d422c70",
            "magnet": "circle",
            "port": "4d2b4104-e541-4fd3-b4e3-ab943e753756"
          },
          "id": "654ea3de-b412-4757-9625-c074b8dd93e6",
          "z": 988
        },
        {
          "type": "nebulant.rectangle.vertical.generic.Log",
          "data": {
            "id": "log",
            "version": "1.0.0",
            "provider": "generic",
            "settings": {
              "parameters": {
                "content": "{{GENERIC_VAR_INSIDE_GROUP1}} and {{GENERIC_VAR_OUTSIDE_GROUP1}}"
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
                "id": "6405f786-c277-4c84-ad00-755404eefc0b"
              },
              {
                "group": "out-ko",
                "attrs": {},
                "id": "3bf5054d-ec40-469f-9388-9e2403194589"
              },
              {
                "group": "out-ok",
                "attrs": {},
                "id": "64c2bf94-b680-4428-9c3f-413a2b540a2d"
              }
            ]
          },
          "position": {
            "x": 1580,
            "y": 1440
          },
          "angle": 0,
          "id": "fa1fb6f6-7462-4841-aab7-d9ecb84484e1",
          "z": 1050
        },
        {
          "type": "nebulant.rectangle.vertical.generic.Log",
          "data": {
            "id": "log",
            "version": "1.0.0",
            "provider": "generic",
            "settings": {
              "parameters": {
                "content": "{{GENERIC_VAR_INSIDE_GROUP1}}, {{GENERIC_VAR_INSIDE_GROUP2}}, {{AWS_EBS_1}} and {{GENERIC_VAR_OUTSIDE_GROUP1}}"
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
                "id": "a564b2da-4481-4a22-9145-b4795cdd21fd"
              },
              {
                "group": "out-ko",
                "attrs": {},
                "id": "e2bdd0b3-6185-480b-8f4f-0229fdd837cd"
              },
              {
                "group": "out-ok",
                "attrs": {},
                "id": "d0498959-e6ee-4b6f-a320-5377ae55e1f2"
              }
            ]
          },
          "position": {
            "x": 1540,
            "y": 2000
          },
          "angle": 0,
          "id": "d770737d-9c25-4ee7-a32d-3e28173fea21",
          "z": 1080
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
                    "name": "GENERIC_VAR_OUTSIDE_GROUP1",
                    "value": "john"
                  },
                  {
                    "name": "GENERIC_VAR_OUTSIDE_GROUP2",
                    "value": "doe"
                  }
                ]
              },
              "outputs": {
                "GENERIC_VAR_OUTSIDE_GROUP2": {
                  "hasID": false,
                  "waiters": [],
                  "async": false,
                  "capabilities": [],
                  "provider": "generic",
                  "subtype": "",
                  "type": "user variable",
                  "value": "GENERIC_VAR_OUTSIDE_GROUP2"
                },
                "GENERIC_VAR_OUTSIDE_GROUP1": {
                  "hasID": false,
                  "waiters": [],
                  "async": false,
                  "capabilities": [],
                  "provider": "generic",
                  "subtype": "",
                  "type": "user variable",
                  "value": "GENERIC_VAR_OUTSIDE_GROUP1"
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
                "id": "d6d70316-7e94-43f5-b697-d2a9026bc714"
              },
              {
                "group": "out-ko",
                "attrs": {},
                "id": "c76e85e0-655f-42a8-94c9-2f12334aa190"
              },
              {
                "group": "out-ok",
                "attrs": {},
                "id": "e34f1242-a491-413b-8c78-561ccf7462da"
              }
            ]
          },
          "position": {
            "x": 1500,
            "y": 1820
          },
          "angle": 0,
          "id": "49977903-432d-4b60-afc6-688c78531af8",
          "z": 1095
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
                    "link-color": "#57AEFF",
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
                    "r": 5
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
                    "r": 5
                  }
                }
              }
            },
            "items": [
              {
                "group": "in",
                "attrs": {},
                "id": "4d2b4104-e541-4fd3-b4e3-ab943e753756"
              },
              {
                "group": "out-ko",
                "attrs": {},
                "id": "eb62388e-d493-490a-a70c-4796e3106f67"
              },
              {
                "group": "out-ok",
                "attrs": {},
                "id": "c9a3a2c5-2a68-4223-a5aa-9cb2b2ebe0fe"
              }
            ]
          },
          "data": {
            "collapsed": true
          },
          "position": {
            "x": 1720,
            "y": 1620
          },
          "id": "d10fbad1-b185-4777-9c5a-20355d422c70",
          "z": 1096,
          "embeds": [
            "be45e925-0355-43a9-8245-c2cd69406af4",
            "1ac82588-f535-4e5f-bef6-4271253d9636",
            "b678dd13-d6d0-4893-af3b-bfafeb19c536",
            "4ea4790f-6ffb-456c-b26a-1a00afa95678",
            "ecea5686-40c7-44ee-9884-c300235cfbe8",
            "9da0a0b6-bdae-409e-8009-8a13d924183d",
            "62b96926-7aca-40ce-bb36-e687f63cf863",
            "11ca25a9-ce35-407d-b6cf-3b9628ac16f0",
            "59c461b7-b133-440d-8e4b-23acd415da7f",
            "951887c5-939c-4c57-b1a0-bf85f534a7c4",
            "315d501b-2ee7-4180-8821-835cf69c4277",
            "936cbab3-db7b-4bf6-b0d6-4597a5f4ba9f",
            "96705cd4-ca92-4d39-94f5-e3b24bd818e7"
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
            "id": "96705cd4-ca92-4d39-94f5-e3b24bd818e7",
            "magnet": "circle",
            "port": "fecc2411-a465-48d3-a01f-fff0136902aa"
          },
          "target": {
            "id": "936cbab3-db7b-4bf6-b0d6-4597a5f4ba9f",
            "magnet": "circle",
            "port": "c78ff3c0-644f-4aad-99b0-e760650a29d5"
          },
          "id": "be45e925-0355-43a9-8245-c2cd69406af4",
          "z": 1097,
          "parent": "d10fbad1-b185-4777-9c5a-20355d422c70"
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
            "id": "951887c5-939c-4c57-b1a0-bf85f534a7c4",
            "magnet": "circle",
            "port": "affdfe36-dc55-483a-b1a2-dbcba38219fb"
          },
          "target": {
            "id": "96705cd4-ca92-4d39-94f5-e3b24bd818e7",
            "magnet": "circle",
            "port": "1f439518-ebbd-4821-b83d-ce0886797406"
          },
          "id": "1ac82588-f535-4e5f-bef6-4271253d9636",
          "z": 1098,
          "parent": "d10fbad1-b185-4777-9c5a-20355d422c70"
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
            "id": "936cbab3-db7b-4bf6-b0d6-4597a5f4ba9f",
            "magnet": "circle",
            "port": "1f9de5a4-204f-43d9-beeb-96694b72737d"
          },
          "target": {
            "id": "315d501b-2ee7-4180-8821-835cf69c4277",
            "magnet": "circle",
            "port": "2d36aeb6-d96f-4bca-acc4-e7d616101c95"
          },
          "id": "b678dd13-d6d0-4893-af3b-bfafeb19c536",
          "z": 1099,
          "parent": "d10fbad1-b185-4777-9c5a-20355d422c70"
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
            "id": "59c461b7-b133-440d-8e4b-23acd415da7f",
            "magnet": "circle",
            "port": "6818b9da-5e70-4785-8134-f90ba7e91fb1"
          },
          "target": {
            "id": "936cbab3-db7b-4bf6-b0d6-4597a5f4ba9f",
            "magnet": "circle",
            "port": "c78ff3c0-644f-4aad-99b0-e760650a29d5"
          },
          "id": "4ea4790f-6ffb-456c-b26a-1a00afa95678",
          "z": 1100,
          "parent": "d10fbad1-b185-4777-9c5a-20355d422c70"
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
            "id": "951887c5-939c-4c57-b1a0-bf85f534a7c4",
            "magnet": "circle",
            "port": "affdfe36-dc55-483a-b1a2-dbcba38219fb"
          },
          "target": {
            "id": "59c461b7-b133-440d-8e4b-23acd415da7f",
            "magnet": "circle",
            "port": "154ac26a-0292-4fb2-857f-956c41cf90b8"
          },
          "id": "ecea5686-40c7-44ee-9884-c300235cfbe8",
          "z": 1101,
          "parent": "d10fbad1-b185-4777-9c5a-20355d422c70"
        },
        {
          "type": "nebulant.link.Static",
          "source": {
            "port": "e2f050ac-9ac2-44ee-be42-cfb1b5f7233f",
            "id": "315d501b-2ee7-4180-8821-835cf69c4277"
          },
          "target": {
            "port": "c9a3a2c5-2a68-4223-a5aa-9cb2b2ebe0fe",
            "id": "d10fbad1-b185-4777-9c5a-20355d422c70"
          },
          "id": "9da0a0b6-bdae-409e-8009-8a13d924183d",
          "z": 1102,
          "parent": "d10fbad1-b185-4777-9c5a-20355d422c70"
        },
        {
          "type": "nebulant.link.Static",
          "source": {
            "port": "0ec5a72b-b686-482a-ab7c-cccacc338466",
            "id": "315d501b-2ee7-4180-8821-835cf69c4277"
          },
          "target": {
            "port": "eb62388e-d493-490a-a70c-4796e3106f67",
            "id": "d10fbad1-b185-4777-9c5a-20355d422c70"
          },
          "id": "62b96926-7aca-40ce-bb36-e687f63cf863",
          "z": 1103,
          "parent": "d10fbad1-b185-4777-9c5a-20355d422c70"
        },
        {
          "type": "nebulant.link.Static",
          "source": {
            "port": "4d2b4104-e541-4fd3-b4e3-ab943e753756",
            "id": "d10fbad1-b185-4777-9c5a-20355d422c70"
          },
          "target": {
            "port": "528a35ec-2115-41eb-a9f4-a2e51df6b947",
            "id": "951887c5-939c-4c57-b1a0-bf85f534a7c4"
          },
          "id": "11ca25a9-ce35-407d-b6cf-3b9628ac16f0",
          "z": 1104,
          "parent": "d10fbad1-b185-4777-9c5a-20355d422c70"
        },
        {
          "type": "nebulant.rectangle.vertical.generic.UploadFiles",
          "data": {
            "id": "upload-files",
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
                "target": [],
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
                "id": "154ac26a-0292-4fb2-857f-956c41cf90b8"
              },
              {
                "group": "out-ko",
                "attrs": {},
                "id": "f24a95ec-3dbd-4d08-92b3-a38f98c93eb0"
              },
              {
                "group": "out-ok",
                "attrs": {},
                "id": "6818b9da-5e70-4785-8134-f90ba7e91fb1"
              }
            ]
          },
          "position": {
            "x": 1760,
            "y": 1830
          },
          "angle": 0,
          "id": "59c461b7-b133-440d-8e4b-23acd415da7f",
          "z": 1105,
          "parent": "d10fbad1-b185-4777-9c5a-20355d422c70"
        },
        {
          "type": "nebulant.rectangle.vertical.executionControl.Start",
          "data": {
            "id": "start",
            "version": "1.0.5",
            "provider": "execution-control",
            "settings": {
              "parameters": {
                "input_parameters": [],
                "description": "",
                "color": "#7986cb",
                "text_color": "#000000",
                "version": "1.0.0",
                "name": "Group",
                "group_settings_enabled": true
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
                "id": "528a35ec-2115-41eb-a9f4-a2e51df6b947"
              },
              {
                "group": "out-ok",
                "attrs": {},
                "id": "affdfe36-dc55-483a-b1a2-dbcba38219fb"
              }
            ]
          },
          "position": {
            "x": 1860,
            "y": 1660
          },
          "angle": 0,
          "id": "951887c5-939c-4c57-b1a0-bf85f534a7c4",
          "z": 1106,
          "parent": "d10fbad1-b185-4777-9c5a-20355d422c70"
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
                "id": "2d36aeb6-d96f-4bca-acc4-e7d616101c95"
              },
              {
                "group": "out-ko",
                "attrs": {},
                "id": "0ec5a72b-b686-482a-ab7c-cccacc338466"
              },
              {
                "group": "out-ok",
                "attrs": {},
                "id": "e2f050ac-9ac2-44ee-be42-cfb1b5f7233f"
              }
            ]
          },
          "position": {
            "x": 1860,
            "y": 2140
          },
          "angle": 0,
          "id": "315d501b-2ee7-4180-8821-835cf69c4277",
          "z": 1107,
          "parent": "d10fbad1-b185-4777-9c5a-20355d422c70"
        },
        {
          "type": "nebulant.rectangle.vertical.generic.Log",
          "data": {
            "id": "log",
            "version": "1.0.0",
            "provider": "generic",
            "settings": {
              "parameters": {
                "content": "{{GENERIC_VAR_INSIDE_GROUP1}}, {{AWS_EBS_1}}, and {{GENERIC_VAR_OUTSIDE_GROUP2}}"
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
                "id": "c78ff3c0-644f-4aad-99b0-e760650a29d5"
              },
              {
                "group": "out-ko",
                "attrs": {},
                "id": "0f8125a8-f9c7-4637-8c6d-5d27b941e03f"
              },
              {
                "group": "out-ok",
                "attrs": {},
                "id": "1f9de5a4-204f-43d9-beeb-96694b72737d"
              }
            ]
          },
          "position": {
            "x": 1860,
            "y": 1980
          },
          "angle": 0,
          "id": "936cbab3-db7b-4bf6-b0d6-4597a5f4ba9f",
          "z": 1108,
          "parent": "d10fbad1-b185-4777-9c5a-20355d422c70"
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
                    "name": "GENERIC_VAR_INSIDE_GROUP1",
                    "value": "foo"
                  },
                  {
                    "name": "GENERIC_VAR_INSIDE_GROUP2",
                    "value": "bar"
                  }
                ]
              },
              "outputs": {
                "GENERIC_VAR_INSIDE_GROUP2": {
                  "hasID": false,
                  "waiters": [],
                  "async": false,
                  "capabilities": [],
                  "provider": "generic",
                  "subtype": "",
                  "type": "user variable",
                  "value": "GENERIC_VAR_INSIDE_GROUP2"
                },
                "GENERIC_VAR_INSIDE_GROUP1": {
                  "hasID": false,
                  "waiters": [],
                  "async": false,
                  "capabilities": [],
                  "provider": "generic",
                  "subtype": "",
                  "type": "user variable",
                  "value": "GENERIC_VAR_INSIDE_GROUP1"
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
                "id": "1f439518-ebbd-4821-b83d-ce0886797406"
              },
              {
                "group": "out-ko",
                "attrs": {},
                "id": "19bc8f95-fac8-43f0-842e-5bd69216d5df"
              },
              {
                "group": "out-ok",
                "attrs": {},
                "id": "fecc2411-a465-48d3-a01f-fff0136902aa"
              }
            ]
          },
          "position": {
            "x": 1980,
            "y": 1820
          },
          "angle": 0,
          "id": "96705cd4-ca92-4d39-94f5-e3b24bd818e7",
          "z": 1109,
          "parent": "d10fbad1-b185-4777-9c5a-20355d422c70"
        }
      ],
      "x": 2499.5,
      "y": 2500,
      "zoom": 0.8
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
        "action_id": "9198ae8c-c5e7-4b31-9708-248da42db33a",
        "provider": "generic",
        "version": "1.0.0",
        "action": "join_threads",
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
      },
      {
        "action_id": "14cc0f30-ae7e-4d5c-a095-fd4674ba9daa",
        "provider": "aws",
        "version": "1.0.0",
        "action": "detach_volume",
        "parameters": {
          "Force": false
        },
        "next_action": {
          "ok": [
            "fa1fb6f6-7462-4841-aab7-d9ecb84484e1"
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
        "action_id": "fa1fb6f6-7462-4841-aab7-d9ecb84484e1",
        "provider": "generic",
        "version": "1.0.0",
        "action": "log",
        "parameters": {
          "content": "{{GENERIC_VAR_INSIDE_GROUP1}} and {{GENERIC_VAR_OUTSIDE_GROUP1}}"
        },
        "next_action": {},
        "debug_network": false
      },
      {
        "action_id": "d770737d-9c25-4ee7-a32d-3e28173fea21",
        "provider": "generic",
        "version": "1.0.0",
        "action": "log",
        "parameters": {
          "content": "{{GENERIC_VAR_INSIDE_GROUP1}}, {{GENERIC_VAR_INSIDE_GROUP2}}, {{AWS_EBS_1}} and {{GENERIC_VAR_OUTSIDE_GROUP1}}"
        },
        "next_action": {},
        "debug_network": false
      },
      {
        "action_id": "49977903-432d-4b60-afc6-688c78531af8",
        "provider": "generic",
        "version": "1.0.0",
        "action": "define_variables",
        "parameters": {
          "vars": {
            "GENERIC_VAR_OUTSIDE_GROUP1": "john",
            "GENERIC_VAR_OUTSIDE_GROUP2": "doe"
          }
        },
        "next_action": {
          "ok": [
            "d770737d-9c25-4ee7-a32d-3e28173fea21"
          ]
        },
        "debug_network": false
      },
      {
        "action_id": "59c461b7-b133-440d-8e4b-23acd415da7f",
        "provider": "generic",
        "version": "1.0.0",
        "action": "upload_files",
        "parameters": {
          "port": 22
        },
        "next_action": {
          "ok": [
            "936cbab3-db7b-4bf6-b0d6-4597a5f4ba9f"
          ]
        },
        "debug_network": false
      },
      {
        "action_id": "951887c5-939c-4c57-b1a0-bf85f534a7c4",
        "provider": "generic",
        "version": "1.0.5",
        "first_action": true,
        "action": "start",
        "next_action": {
          "ok": [
            "96705cd4-ca92-4d39-94f5-e3b24bd818e7",
            "59c461b7-b133-440d-8e4b-23acd415da7f"
          ]
        },
        "debug_network": false
      },
      {
        "action_id": "315d501b-2ee7-4180-8821-835cf69c4277",
        "provider": "generic",
        "version": "1.0.0",
        "action": "noop",
        "next_action": {},
        "debug_network": false
      },
      {
        "action_id": "936cbab3-db7b-4bf6-b0d6-4597a5f4ba9f",
        "provider": "generic",
        "version": "1.0.0",
        "action": "log",
        "parameters": {
          "content": "{{GENERIC_VAR_INSIDE_GROUP1}}, {{AWS_EBS_1}}, and {{GENERIC_VAR_OUTSIDE_GROUP2}}"
        },
        "next_action": {
          "ok": [
            "315d501b-2ee7-4180-8821-835cf69c4277"
          ]
        },
        "debug_network": false
      },
      {
        "action_id": "96705cd4-ca92-4d39-94f5-e3b24bd818e7",
        "provider": "generic",
        "version": "1.0.0",
        "action": "define_variables",
        "parameters": {
          "vars": {
            "GENERIC_VAR_INSIDE_GROUP1": "foo",
            "GENERIC_VAR_INSIDE_GROUP2": "bar"
          }
        },
        "next_action": {
          "ok": [
            "936cbab3-db7b-4bf6-b0d6-4597a5f4ba9f"
          ]
        },
        "debug_network": false
      }
    ],
    "min_cli_version": "0.0.1",
    "builder_version": "1.0.1",
    "diagram_version": "1.0.1"
  }
}
