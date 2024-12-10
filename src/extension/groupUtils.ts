import type {
    TabRule,
    Tab,
    Group,
    GroupConfig,
    GroupColor,
    GeneralGroup
} from './types'

import {
    NON_GROUP
} from './constants'

function tabGetter(tab: Tab, type: TabRule['type']): string {
    if(type == 'url'){
        return tab.url ?? ''
    }
    return ''
}

function tabMatcher(tab: Tab, rule: TabRule): boolean {
    const attr = tabGetter(tab, rule.type)
    return attr == rule.rule || new RegExp(rule.rule).test(attr)
}

function findTargetGroup(tab: Tab, configs: GroupConfig[]): GroupConfig | undefined{
    return configs.find(config => config.rules.find(rule => tabMatcher(tab, rule))) 
}

async function findGroupByTitle(groupTitle: string): Promise<chrome.tabGroups.TabGroup | undefined>{
    const groups = await chrome.tabGroups.query({title: groupTitle})
    if(groups.length >= 1){
        return groups[0]
    }
    return undefined
}

async function createOrAssignToGroup(tabIds: number[], group: GeneralGroup): Promise<number> {
    const {id, color, title} = group
    if(id){
        return await chrome.tabs.group({
            groupId: id,
            tabIds: tabIds
        })
    } 
    const groupId = await chrome.tabs.group({tabIds: tabIds})
    await chrome.tabGroups.update(groupId, {title, color})
    return groupId
}

function combineGroup(existedGroup: Group | undefined, configedGroup: GroupConfig): GeneralGroup{
    if(existedGroup){
        const {id, title, color} = existedGroup
        return {id, title, color}
    }
    return {id: undefined, color: configedGroup.color, title: configedGroup.title}
}

async function assignGroup(tab: Tab, configs: GroupConfig[]){
    const groupConfig = findTargetGroup(tab, configs)
    if(groupConfig){
        const group = await findGroupByTitle(groupConfig.title)
        createOrAssignToGroup([tab.id!], combineGroup(group, groupConfig))
    }
}

async function assignAllGroup(tabs: Tab[], configs: GroupConfig[], otherGroup: GeneralGroup){
    const groups = Object.fromEntries(configs.map( c => ([c.title, c])))
    const groupedTabs = new Map<string, Set<number>>()
    tabs.filter(t => t.id)
        .forEach(tab => {
            const groupTitle = findTargetGroup(tab, configs)?.title ?? NON_GROUP
            if(!groupedTabs.has(groupTitle)){
                groupedTabs.set(groupTitle, new Set())
            }
            groupedTabs.get(groupTitle)!.add(tab.id!)
        })
    await Promise.all(
        groupedTabs
            .entries()
            .map(([title, ids]) => {
                findGroupByTitle(title)
                    .then(group => {
                        const groupConfig = groups[title]
                        if(title != NON_GROUP){
                            createOrAssignToGroup([...ids], combineGroup(group, groupConfig))
                        }else{
                            createOrAssignToGroup([...ids], {title: "others", color: "red"})
                        }
                    })
            })
    )
}

export {
    assignAllGroup
}

