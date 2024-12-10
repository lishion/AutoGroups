import { Component, For, Index, createSignal } from "solid-js";

import type { GroupConfig, TabRule } from '../extension/types'
import * as v from 'valibot';
import { createForm, Form, Field, FieldArray, SubmitHandler} from '@modular-forms/solid';
import { Button, Paper, Select, Stack, TextField, MenuItem, FormControl, InputLabel } from '@suid/material';
import { config } from "process";

import {v4 as uuidv4} from 'uuid'
 

type TabRuleForm = TabRule & {
    id: string
}

type  GroupConfigFormType = Omit<GroupConfig, 'rules'> & {
    id: string,
    rules: TabRuleForm[]
}



const GroupRuleConfig: Component = (props: any) => {
    const [configs, setConfigs] = createSignal<GroupConfigFormType[]>([]);

    function update(id: string, updateValue: Partial<GroupConfigFormType>){
        const newConfigs = configs().map(c => {
            if(c.id == id){
                return {...c, ...updateValue} 
            }
            return c
        })
        setConfigs(newConfigs)
    }

    function addRule(ruleId: string, rule: TabRuleForm, index?: string){
        const newConfigs = configs().map(c => {
            if(c.id == ruleId){
                let newRule = [...c.rules, rule]
                if(index){
                    console.info(index)
                    newRule = c.rules.map(val => val.id == index ? rule: val)
                }
                return {...c, rules: newRule} 
            }
            return c
        })
        console.info(newConfigs)
        setConfigs(newConfigs)
    }


    function deleteRule(ruleId: string, index: string){
        const newConfigs = configs().map(c => {
            if(c.id == ruleId){
                return {...c, rules: c.rules.filter(val => val.id !== index)} 
            }
            return c
        })
        console.info(newConfigs)
        setConfigs(newConfigs)
    }


    function deleteGroup(ruleId: string){
        const newConfigs = configs().filter(c => c.id !== ruleId)
        console.info(newConfigs)
        setConfigs(newConfigs)
    }

    return (
        <>
            <Index each={configs()}>
                {(item) => (
                    <Stack direction={'column'} gap={1}>
                        <span>分组设置</span>
                        <Stack direction={'row'} gap={3}>
                            <TextField
                                label='名称'
                                onChange={(event) => update(item().id, {title: event.target.value})}
                                value={item().title}
                            >
                                        分组名称</TextField>
                            <FormControl>
                                <InputLabel id="color-select-label">颜色</InputLabel>
                                <Select
                                    labelId="color-select-label"
                                    id="color-select"
                                    value={item().color}
                                    label="颜色"
                                    onChange={(props) => update(item().id, {color: props.target.value})}
                                >
                                    <MenuItem value="grey">grey</MenuItem>
                                    <MenuItem value="blue">blue</MenuItem>
                                    <MenuItem value="red">red</MenuItem>
                                    <MenuItem value="yellow">yellow</MenuItem>
                                    <MenuItem value="green">green</MenuItem>
                                    <MenuItem value="pink">pink</MenuItem>
                                    <MenuItem value="purple">purple</MenuItem>
                                    <MenuItem value="cyan">cyan</MenuItem>
                                    <MenuItem value="orange">orange</MenuItem>
                                    <MenuItem value="auto">auto</MenuItem>
                                </Select>
                            </FormControl>
                            <Button onClick={() => deleteGroup(item().id)}>删除</Button>
                        </Stack>
                        <span>规则</span>
                        
                        <Index each={item().rules}>
                            {
                                (ruleItem) => {
                                    return (
                                        <Stack direction={'row'}>
                                            <TextField 
                                                    onChange={(e) => addRule(item().id, {...ruleItem(), rule: e.target.value}, ruleItem().id)} 
                                                    variant='standard' 
                                                    value={ruleItem().rule}
                                                >
                                                    分组规则
                                                </TextField>
                                            <Button onClick={() => deleteRule(item().id, ruleItem().id)}>删除</Button>
                                         </Stack>
                                    )
                                }
                            }
                        </Index>
                        <Button onClick={() => addRule(item().id, {type: 'url', rule: '', id: uuidv4()})}>新增规则</Button>
                    </Stack>
                )}
            </Index>
            <Button variant='text'
                onClick={() => {
                    setConfigs(
                        [
                            ...configs(),
                            {
                                title: '',
                                color: 'auto',
                                rules: [{
                                    type: 'url',
                                    rule: '',
                                    id: uuidv4()
                                }],
                                id: uuidv4()
                            }
                        ]
                    )
                }}>新增分组</Button>
        </>
    )
}

export default GroupRuleConfig;