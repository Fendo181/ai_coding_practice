import json
import zipfile
import io

project_data = {
    "targets": [
        {
            "isStage": True,
            "name": "Stage",
            "variables": {
                "var_time": ["残り時間", 30],
                "var_score": ["スコア", 0],
                "var_prev": ["前回の時間", 0],
                "var_interval": ["カット間隔", 0]
            },
            "lists": {},
            "broadcasts": {
                "msg_cut": "蕎麦を切った",
                "msg_end": "ゲーム終了"
            },
            "blocks": {
                "stage_start": {"opcode": "event_whenflagclicked", "next": "stage_set_time", "parent": None, "topLevel": True},
                "stage_set_time": {"opcode": "data_setvariableto", "next": "stage_loop", "parent": "stage_start", "inputs": {"VALUE": [1, [4, "30"]]}, "fields": {"VARIABLE": ["残り時間", "var_time"]}},
                "stage_loop": {"opcode": "control_repeat", "next": "stage_broadcast_end", "parent": "stage_set_time", "inputs": {"TIMES": [1, [4, "30"]], "SUBSTACK": [2, "stage_wait"]}},
                "stage_wait": {"opcode": "control_wait", "next": "stage_change_time", "parent": "stage_loop", "inputs": {"DURATION": [1, [4, "1"]]}},
                "stage_change_time": {"opcode": "data_changevariableby", "next": None, "parent": "stage_wait", "inputs": {"VALUE": [1, [4, "-1"]]}, "fields": {"VARIABLE": ["残り時間", "var_time"]}},
                "stage_broadcast_end": {"opcode": "event_broadcastandwait", "next": "stage_stop", "parent": "stage_loop", "inputs": {"BROADCAST_INPUT": [1, "msg_end"]}},
                "stage_stop": {"opcode": "control_stop", "next": None, "parent": "stage_broadcast_end", "fields": {"STOP_OPTION": ["all"]}}
            },
            "comments": {}, "currentCostume": 0,
            "costumes": [{"assetId": "cd21514d0531fdffb22204e0ec5ed84a", "name": "背景1", "bitmapResolution": 1, "md5ext": "cd21514d0531fdffb22204e0ec5ed84a.svg", "dataFormat": "svg", "rotationCenterX": 240, "rotationCenterY": 180}],
            "sounds": [], "volume": 100, "layerOrder": 0
        },
        {
            "isStage": False, "name": "包丁", "variables": {}, "lists": {}, "broadcasts": {},
            "blocks": {
                "knife_click": {"opcode": "event_whenthisspriteclicked", "next": "knife_down", "parent": None, "topLevel": True},
                "knife_down": {"opcode": "looks_switchcostumeto", "next": "knife_send", "parent": "knife_click", "inputs": {"COSTUME": [1, "costume_down_ref"]}},
                "costume_down_ref": {"opcode": "looks_costume", "parent": "knife_down", "fields": {"COSTUME": ["ふりおろした", None]}},
                "knife_send": {"opcode": "event_broadcast", "next": "knife_wait", "parent": "knife_down", "inputs": {"BROADCAST_INPUT": [1, "msg_cut"]}},
                "knife_wait": {"opcode": "control_wait", "next": "knife_up", "parent": "knife_send", "inputs": {"DURATION": [1, [4, "0.1"]]}},
                "knife_up": {"opcode": "looks_switchcostumeto", "next": None, "parent": "knife_wait", "inputs": {"COSTUME": [1, "costume_up_ref"]}},
                "costume_up_ref": {"opcode": "looks_costume", "parent": "knife_up", "fields": {"COSTUME": ["あがっている", None]}}
            },
            "comments": {}, "visible": True, "x": 0, "y": 50, "size": 100, "direction": 90, "draggable": False, "rotationStyle": "all around", "layerOrder": 2,
            "costumes": [
                {"assetId": "26002f26a117316738f712c75a2a2253", "name": "あがっている", "bitmapResolution": 1, "md5ext": "26002f26a117316738f712c75a2a2253.svg", "dataFormat": "svg", "rotationCenterX": 47, "rotationCenterY": 9},
                {"assetId": "9e14c33f2023b7b51e0892f392945e4e", "name": "ふりおろした", "bitmapResolution": 1, "md5ext": "9e14c33f2023b7b51e0892f392945e4e.svg", "dataFormat": "svg", "rotationCenterX": 47, "rotationCenterY": 39}
            ],
            "sounds": [], "volume": 100
        },
        {
            "isStage": False, "name": "判定", "variables": {}, "lists": {}, "broadcasts": {},
            "blocks": {
                "judge_start": {"opcode": "event_whenflagclicked", "next": "judge_set_score", "parent": None, "topLevel": True},
                "judge_set_score": {"opcode": "data_setvariableto", "next": "judge_reset_timer", "parent": "judge_start", "inputs": {"VALUE": [1, [4, "0"]]}, "fields": {"VARIABLE": ["スコア", "var_score"]}},
                "judge_reset_timer": {"opcode": "sensing_resettimer", "next": "judge_set_prev", "parent": "judge_set_score"},
                "judge_set_prev": {"opcode": "data_setvariableto", "next": None, "parent": "judge_reset_timer", "inputs": {"VALUE": [1, [4, "0"]]}, "fields": {"VARIABLE": ["前回の時間", "var_prev"]}},

                "judge_cut": {"opcode": "event_whenbroadcastreceived", "next": "judge_calc", "parent": None, "fields": {"BROADCAST_OPTION": ["蕎麦を切った", "msg_cut"]}, "topLevel": True},
                "judge_calc": {"opcode": "data_setvariableto", "next": "judge_update_prev", "parent": "judge_cut", "inputs": {"VALUE": [2, "calc_sub"]}, "fields": {"VARIABLE": ["カット間隔", "var_interval"]}},
                "calc_sub": {"opcode": "operator_subtract", "parent": "judge_calc", "inputs": {"NUM1": [3, "timer_val1"], "NUM2": [3, "prev_val1"]}},
                "timer_val1": {"opcode": "sensing_timer", "shadow": True},
                "prev_val1": {"opcode": "data_variable", "fields": {"VARIABLE": ["前回の時間", "var_prev"]}, "shadow": True},
                "judge_update_prev": {"opcode": "data_setvariableto", "next": "judge_if", "parent": "judge_calc", "inputs": {"VALUE": [3, "timer_val2"]}, "fields": {"VARIABLE": ["前回の時間", "var_prev"]}},
                "timer_val2": {"opcode": "sensing_timer", "shadow": True},

                "judge_if": {"opcode": "control_if_else", "next": None, "parent": "judge_update_prev", "inputs": {"CONDITION": [2, "cond_perfect"], "SUBSTACK": [2, "say_perfect"], "SUBSTACK2": [2, "if_fast"]}},
                "cond_perfect": {"opcode": "operator_and", "parent": "judge_if", "inputs": {"OPERAND1": [2, "cond_gt"], "OPERAND2": [2, "cond_lt"]}},
                "cond_gt": {"opcode": "operator_gt", "parent": "cond_perfect", "inputs": {"OPERAND1": [3, "int_val1"], "OPERAND2": [1, [4, "0.4"]]}},
                "cond_lt": {"opcode": "operator_lt", "parent": "cond_perfect", "inputs": {"OPERAND1": [3, "int_val2"], "OPERAND2": [1, [4, "0.6"]]}},
                "int_val1": {"opcode": "data_variable", "fields": {"VARIABLE": ["カット間隔", "var_interval"]}, "shadow": True},
                "int_val2": {"opcode": "data_variable", "fields": {"VARIABLE": ["カット間隔", "var_interval"]}, "shadow": True},
                "say_perfect": {"opcode": "looks_sayforsecs", "next": "add_100", "parent": "judge_if", "inputs": {"MESSAGE": [1, [10, "Perfect! 美しい蕎麦だ！"]], "SECS": [1, [4, "0.5"]]}},
                "add_100": {"opcode": "data_changevariableby", "parent": "say_perfect", "inputs": {"VALUE": [1, [4, "100"]]}, "fields": {"VARIABLE": ["スコア", "var_score"]}},

                "if_fast": {"opcode": "control_if_else", "parent": "judge_if", "inputs": {"CONDITION": [2, "cond_fast"], "SUBSTACK": [2, "say_fast"], "SUBSTACK2": [2, "say_slow"]}},
                "cond_fast": {"opcode": "operator_lt", "parent": "if_fast", "inputs": {"OPERAND1": [3, "int_val3"], "OPERAND2": [1, [4, "0.4"]]}},
                "int_val3": {"opcode": "data_variable", "fields": {"VARIABLE": ["カット間隔", "var_interval"]}, "shadow": True},
                "say_fast": {"opcode": "looks_sayforsecs", "next": "add_10", "parent": "if_fast", "inputs": {"MESSAGE": [1, [10, "早すぎ！"]], "SECS": [1, [4, "0.5"]]}},
                "add_10": {"opcode": "data_changevariableby", "parent": "say_fast", "inputs": {"VALUE": [1, [4, "10"]]}, "fields": {"VARIABLE": ["スコア", "var_score"]}},
                "say_slow": {"opcode": "looks_sayforsecs", "next": "add_10_2", "parent": "if_fast", "inputs": {"MESSAGE": [1, [10, "遅すぎ！"]], "SECS": [1, [4, "0.5"]]}},
                "add_10_2": {"opcode": "data_changevariableby", "parent": "say_slow", "inputs": {"VALUE": [1, [4, "10"]]}, "fields": {"VARIABLE": ["スコア", "var_score"]}}
            },
            "comments": {}, "visible": True, "x": 170, "y": 120, "size": 100, "direction": 90, "draggable": False, "rotationStyle": "all around", "layerOrder": 3,
            "costumes": [{"assetId": "bcf454acf82e4504149f7ffe07081dbc", "name": "判定員", "bitmapResolution": 1, "md5ext": "bcf454acf82e4504149f7ffe07081dbc.svg", "dataFormat": "svg", "rotationCenterX": 48, "rotationCenterY": 50}],
            "sounds": [], "volume": 100
        },
        {
            "isStage": False, "name": "蕎麦の生地", "variables": {}, "lists": {}, "broadcasts": {},
            "blocks": {
                "dough_start": {"opcode": "event_whenflagclicked", "next": "dough_go", "parent": None, "topLevel": True},
                "dough_go": {"opcode": "motion_gotoxy", "next": "dough_forever", "parent": "dough_start", "inputs": {"X": [1, [4, "240"]], "Y": [1, [4, "-50"]]}},
                "dough_forever": {"opcode": "control_forever", "parent": "dough_go", "inputs": {"SUBSTACK": [2, "dough_move"]}},
                "dough_move": {"opcode": "motion_changexby", "next": "dough_check", "parent": "dough_forever", "inputs": {"DX": [1, [4, "-10"]]}},
                "dough_check": {"opcode": "control_if", "parent": "dough_move", "inputs": {"CONDITION": [2, "dough_lt"], "SUBSTACK": [2, "dough_reset"]}},
                "dough_lt": {"opcode": "operator_lt", "parent": "dough_check", "inputs": {"OPERAND1": [3, "dough_x"], "OPERAND2": [1, [4, "-240"]]}},
                "dough_x": {"opcode": "motion_xposition", "shadow": True},
                "dough_reset": {"opcode": "motion_setx", "parent": "dough_check", "inputs": {"X": [1, [4, "240"]]}}
            },
            "comments": {}, "visible": True, "x": -10, "y": -50, "size": 100, "direction": 90, "draggable": False, "rotationStyle": "all around", "layerOrder": 1,
            "costumes": [{"assetId": "5c68f294025a183578b8f2d575778848", "name": "生地", "bitmapResolution": 1, "md5ext": "5c68f294025a183578b8f2d575778848.svg", "dataFormat": "svg", "rotationCenterX": 180, "rotationCenterY": 25}],
            "sounds": [], "volume": 100
        }
    ],
    "monitors": [
        {"id": "var_time", "mode": "default", "opcode": "data_variable", "params": {"VARIABLE": "残り時間"}, "spriteName": None, "value": 30, "width": 0, "height": 0, "x": 5, "y": 5, "visible": True},
        {"id": "var_score", "mode": "large", "opcode": "data_variable", "params": {"VARIABLE": "スコア"}, "spriteName": None, "value": 0, "width": 0, "height": 0, "x": 5, "y": 32, "visible": True}
    ],
    "extensions": [],
    "meta": {"semver": "3.0.0", "vm": "0.2.0"}
}

assets = {
    "cd21514d0531fdffb22204e0ec5ed84a.svg": b'<svg width="480" height="360" xmlns="http://www.w3.org/2000/svg"><rect width="480" height="360" fill="#ffffff"/></svg>',
    "26002f26a117316738f712c75a2a2253.svg": b'<svg xmlns="http://www.w3.org/2000/svg" width="94" height="18"><path fill="#606060" d="M0 0h84l10 9-10 9H0z"/><path fill="#c0c0c0" d="M1 1h82.5l9 8-9 8H1z"/></svg>',
    "9e14c33f2023b7b51e0892f392945e4e.svg": b'<svg xmlns="http://www.w3.org/2000/svg" width="94" height="78"><g transform="translate(0 30)"><path fill="#606060" d="M0 0h84l10 9-10 9H0z"/><path fill="#c0c0c0" d="M1 1h82.5l9 8-9 8H1z"/></g></svg>',
    "bcf454acf82e4504149f7ffe07081dbc.svg": b'<svg xmlns="http://www.w3.org/2000/svg" width="97" height="100"><circle cx="48" cy="50" r="40" fill="#FFAB19"/></svg>',
    "5c68f294025a183578b8f2d575778848.svg": b'<svg xmlns="http://www.w3.org/2000/svg" width="360" height="50"><rect width="360" height="50" fill="#f0e6d2" stroke="#d3c0a5" stroke-width="2"/></svg>'
}

with zipfile.ZipFile('digital_soba.sb3', 'w', zipfile.ZIP_DEFLATED) as zf:
    zf.writestr('project.json', json.dumps(project_data))
    for name, data in assets.items():
        zf.writestr(name, data)

print("✅ digital_soba.sb3 が生成されました！")
