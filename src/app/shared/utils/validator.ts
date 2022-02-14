import { PropertyGroup, FormProperty } from '@delon/form';


/**
 * 用于检查两次输入必须一致的检查器
 * @param value
 * @param otherProperty
 * @param formProperty
 * @param form
 * @param errorMessage
 */
export function inputConfirm(value: any, otherProperty:string,form: PropertyGroup,errorMessage?:string)  {
    return !form.value||form.value[otherProperty] === value? [] : [{ keyword: 'inputConfirm', message: errorMessage||'两次输入必须一致!'}];
}

var value={"cmd": "state",
    "data":  {
    "Fan": {
            "cc": 1,
            "bb": 3,
            "aa": 4
    }
},
"time": 139634392
    };
var template = {
    "item": [

        {
            "name": "group",
            "node_id": "Fan",
            "section": [
                {
                    "dataType": {
                        "type": "int"
                    },
                    "default": 0,
                    "id": "aa",
                    "name": "nameaa"
                },
                {
                    "dataType": {
                        "type": "int"
                    },
                    "default": 0,
                    "id": "bb",
                    "name": "namebb"
                },
                {
                    "dataType": {
                        "type": "int"
                    },
                    "default": 0,
                    "id": "cc",
                    "name": "namecc"
                }
            ]
        }
    ]
};
export function test(value,template) {
    let data = value.data;
    let map=template.item.map(node => {
        let idMap = {};
        node.section.forEach((s,index) => {
            idMap[s.id] = index;
        });
        return {[node.node_id]: Object.assign(node,{idMap})};
    }).reduce((previousValue, currentValue) => Object.assign(previousValue, currentValue), {});

    Object.keys(data).forEach(key => {
        let node = map[key];
        if (node){
            Object.keys(node.idMap).forEach(id=>{
                let defaultValue = data[id];
                if (defaultValue!==undefined&&defaultValue!==null){
                    node.section[node.idMap[id]]['default'] = defaultValue;
                }
            })
            delete node.idMap;
        }
    });
    return template;
}