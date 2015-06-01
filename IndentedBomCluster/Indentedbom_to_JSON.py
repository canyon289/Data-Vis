'''
Program that converts indented BOM into D3 Child Parent Structure
'''
import IPython
import json

def indented_to_json(level_col, desc_col):
    '''
    Converts indented BOM into JSON per D3 Hierarchy convention
    Requires a BOM that starts with a Level 0
    '''

    level_desc_list = list(zip(Cell(2, level_col).vertical, Cell(2, desc_col).vertical))

    dict_list = []

    for level, desc in level_desc_list:
        print(level)
        desc = desc[:30]

        if len(dict_list) -1 < level:
            dict_list.append({"name":desc})

        elif len(dict_list) -1 >= level:
            dict_list = rollup_func(dict_list, level)
            dict_list.append({"name":desc})

    return rollup_func(dict_list)[0]


def rollup_func(dict_list, level=1):
    '''
    Rolls up dictionary list of levels
    '''
    while len(dict_list) > level:
        bottom_level_dict = dict_list.pop()
        dict_list[-1]["children"] = (dict_list[-1].get("children", [])) + [bottom_level_dict]

    return dict_list



with open("LargeTDS.json", 'w') as outfile:
    json.dump(indented_to_json("a", "c"), outfile, indent=4)
IPython.embed()
