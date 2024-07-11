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
                "id": "4a0585b2-85fd-4b3d-94cb-50412fb9a562"
              },
              {
                "group": "out-ok",
                "attrs": {},
                "id": "1a867f21-7427-4fd6-8473-732da96f1533"
              }
            ]
          },
          "position": {
            "x": 2460,
            "y": 2280
          },
          "angle": 0,
          "id": "a7819b53-308b-475f-9c7c-eda3d21b546a",
          "z": 1
        }
      ]
    },
    "actions": [
      {
        "action_id": "a7819b53-308b-475f-9c7c-eda3d21b546a",
        "provider": "generic",
        "version": "1.0.1",
        "first_action": true,
        "action": "start",
        "next_action": {},
        "debug_network": false
      }
    ],
    "min_cli_version": "0.0.1",
    "builder_version": "0.0.1"
  }
}
