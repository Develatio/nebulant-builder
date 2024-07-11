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
            "id": "44a18e0e-2b01-4a3f-8a8a-5eed1597a703",
            "magnet": "circle",
            "port": "dc7594d2-d30a-4ae2-b06f-6fc1e4f8943d"
          },
          "target": {
            "id": "a5618fb3-c370-4a92-bb31-18cb300c2a1c",
            "magnet": "circle",
            "port": "dedc8fb2-98b6-4d8b-8814-f19982a3e412"
          },
          "id": "0fab7235-86e3-4c8d-ab26-9f6158b1badd",
          "z": 15
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
            "id": "99737439-dde0-4a7f-ade2-926468d57a5b",
            "magnet": "circle",
            "port": "92415784-c918-40b0-973e-2818a217a969"
          },
          "target": {
            "id": "635644bd-cd3b-462f-b56f-0be255ad5a92",
            "magnet": "circle",
            "port": "3ca3763b-6a37-4453-beb2-ceb15e318b93"
          },
          "id": "8b472d54-d14a-4c65-9723-79bc481a5eee",
          "z": 16
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
                  "value": "AWS_SERVER"
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
                "id": "f2d77161-d79c-4ca2-9710-e13b7d3ceb31"
              },
              {
                "group": "out-ko",
                "attrs": {},
                "id": "ff7b3e78-a2a6-444c-9088-87394ffea33b"
              },
              {
                "group": "out-ok",
                "attrs": {},
                "id": "dc7594d2-d30a-4ae2-b06f-6fc1e4f8943d"
              }
            ]
          },
          "position": {
            "x": 2251,
            "y": 2474
          },
          "angle": 0,
          "id": "44a18e0e-2b01-4a3f-8a8a-5eed1597a703",
          "z": 24
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
                "id": "11ea315a-f5ac-4c58-b9c6-b73c822fcd72"
              },
              {
                "group": "out-ok",
                "attrs": {},
                "id": "f6822d80-a644-4c73-ada9-e28d58360f10"
              }
            ]
          },
          "position": {
            "x": 2405,
            "y": 2041
          },
          "angle": 0,
          "id": "7260943a-712a-4472-b6dd-afff61e743c3",
          "z": 41
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
            "id": "7260943a-712a-4472-b6dd-afff61e743c3",
            "magnet": "circle",
            "port": "f6822d80-a644-4c73-ada9-e28d58360f10"
          },
          "target": {
            "id": "7934c0e2-140a-4ee0-b1f7-3350ee816e3f",
            "magnet": "circle",
            "port": "c247e2b5-d49f-434a-92b5-bd1819c571fb"
          },
          "id": "c066f951-1f05-463f-813e-55d6eb7fbbdc",
          "z": 44
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
            "id": "7934c0e2-140a-4ee0-b1f7-3350ee816e3f",
            "magnet": "circle",
            "port": "880023e1-5c6f-4d45-b5d6-56d6a80e21c3"
          },
          "target": {
            "id": "99737439-dde0-4a7f-ade2-926468d57a5b",
            "magnet": "circle",
            "port": "86a86859-4218-4c03-be58-381d8dd81c85"
          },
          "id": "bcaf83a6-788e-49e9-a554-f57c94bd008a",
          "z": 45
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
            "id": "7260943a-712a-4472-b6dd-afff61e743c3",
            "magnet": "circle",
            "port": "f6822d80-a644-4c73-ada9-e28d58360f10"
          },
          "target": {
            "id": "44a18e0e-2b01-4a3f-8a8a-5eed1597a703",
            "magnet": "circle",
            "port": "f2d77161-d79c-4ca2-9710-e13b7d3ceb31"
          },
          "id": "db99158a-4e1d-42ae-bdc6-a4bd8f42927c",
          "z": 48
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
                  "value": "AWS_SERVER"
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
                "id": "86a86859-4218-4c03-be58-381d8dd81c85"
              },
              {
                "group": "out-ko",
                "attrs": {},
                "id": "8eeb7926-cf18-4328-8e4c-f994db6ba806"
              },
              {
                "group": "out-ok",
                "attrs": {},
                "id": "92415784-c918-40b0-973e-2818a217a969"
              }
            ]
          },
          "position": {
            "x": 2628,
            "y": 2482
          },
          "angle": 0,
          "id": "99737439-dde0-4a7f-ade2-926468d57a5b",
          "z": 50
        },
        {
          "type": "nebulant.rectangle.vertical.generic.Log",
          "data": {
            "id": "log",
            "version": "1.0.0",
            "provider": "generic",
            "settings": {
              "parameters": {
                "content": "El server es {{ AWS_SERVER }}"
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
                "id": "c247e2b5-d49f-434a-92b5-bd1819c571fb"
              },
              {
                "group": "out-ko",
                "attrs": {},
                "id": "e670eceb-7aef-440f-8765-6488d2502a5e"
              },
              {
                "group": "out-ok",
                "attrs": {},
                "id": "880023e1-5c6f-4d45-b5d6-56d6a80e21c3"
              }
            ]
          },
          "position": {
            "x": 2556,
            "y": 2250
          },
          "angle": 0,
          "id": "7934c0e2-140a-4ee0-b1f7-3350ee816e3f",
          "z": 51
        },
        {
          "type": "nebulant.rectangle.vertical.generic.Log",
          "data": {
            "id": "log",
            "version": "1.0.0",
            "provider": "generic",
            "settings": {
              "parameters": {
                "content": "El server es {{ AWS_SERVER }}"
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
                "id": "dedc8fb2-98b6-4d8b-8814-f19982a3e412"
              },
              {
                "group": "out-ko",
                "attrs": {},
                "id": "5aba2122-2e7f-4c9c-9adc-4cd82e81a114"
              },
              {
                "group": "out-ok",
                "attrs": {},
                "id": "bfe47c0b-915b-4459-a108-8dc0b339afa9"
              }
            ]
          },
          "position": {
            "x": 2197,
            "y": 2695
          },
          "angle": 0,
          "id": "a5618fb3-c370-4a92-bb31-18cb300c2a1c",
          "z": 52
        },
        {
          "type": "nebulant.rectangle.vertical.generic.Log",
          "data": {
            "id": "log",
            "version": "1.0.0",
            "provider": "generic",
            "settings": {
              "parameters": {
                "content": "El server es {{ AWS_SERVER }}"
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
                "id": "3ca3763b-6a37-4453-beb2-ceb15e318b93"
              },
              {
                "group": "out-ko",
                "attrs": {},
                "id": "133857ba-0a59-43fb-ab8b-f7548f333e9f"
              },
              {
                "group": "out-ok",
                "attrs": {},
                "id": "e7322527-16f2-4e08-8734-f64b18022e9c"
              }
            ]
          },
          "position": {
            "x": 2679,
            "y": 2717
          },
          "angle": 0,
          "id": "635644bd-cd3b-462f-b56f-0be255ad5a92",
          "z": 53
        }
      ]
    },
    "actions": [
      {
        "action_id": "44a18e0e-2b01-4a3f-8a8a-5eed1597a703",
        "provider": "aws",
        "version": "1.0.4",
        "action": "findone_instance",
        "output": "AWS_SERVER",
        "next_action": {
          "ok": [
            "a5618fb3-c370-4a92-bb31-18cb300c2a1c"
          ]
        },
        "debug_network": false
      },
      {
        "action_id": "7260943a-712a-4472-b6dd-afff61e743c3",
        "provider": "generic",
        "version": "1.0.1",
        "first_action": true,
        "action": "start",
        "next_action": {
          "ok": [
            "7934c0e2-140a-4ee0-b1f7-3350ee816e3f",
            "44a18e0e-2b01-4a3f-8a8a-5eed1597a703"
          ]
        },
        "debug_network": false
      },
      {
        "action_id": "99737439-dde0-4a7f-ade2-926468d57a5b",
        "provider": "aws",
        "version": "1.0.4",
        "action": "findone_instance",
        "output": "AWS_SERVER",
        "next_action": {
          "ok": [
            "635644bd-cd3b-462f-b56f-0be255ad5a92"
          ]
        },
        "debug_network": false
      },
      {
        "action_id": "7934c0e2-140a-4ee0-b1f7-3350ee816e3f",
        "provider": "generic",
        "version": "1.0.0",
        "action": "log",
        "parameters": {
          "content": "El server es {{ AWS_SERVER }}"
        },
        "next_action": {
          "ok": [
            "99737439-dde0-4a7f-ade2-926468d57a5b"
          ]
        },
        "debug_network": false
      },
      {
        "action_id": "a5618fb3-c370-4a92-bb31-18cb300c2a1c",
        "provider": "generic",
        "version": "1.0.0",
        "action": "log",
        "parameters": {
          "content": "El server es {{ AWS_SERVER }}"
        },
        "next_action": {},
        "debug_network": false
      },
      {
        "action_id": "635644bd-cd3b-462f-b56f-0be255ad5a92",
        "provider": "generic",
        "version": "1.0.0",
        "action": "log",
        "parameters": {
          "content": "El server es {{ AWS_SERVER }}"
        },
        "next_action": {},
        "debug_network": false
      }
    ],
    "min_cli_version": "0.0.1",
    "builder_version": "0.0.1"
  }
}
