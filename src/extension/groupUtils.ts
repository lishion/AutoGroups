import type { TabRule, Tab, Group, GroupConfig, GeneralGroup } from '../types'

import { NON_GROUP } from './constants'

function tabGetter(tab: Tab, type: TabRule['type']): string {
  if (type == 'url') {
    return tab.url ?? ''
  }
  return ''
}

function tabMatcher(tab: Tab, rule: TabRule): boolean {
  const attr = tabGetter(tab, rule.type)
  return attr.includes(rule.rule) || new RegExp(rule.rule).test(attr)
}

function findGroupToAssign(tab: Tab, configs: GroupConfig[]): GroupConfig | undefined {
  return configs.find((config) => config.rules.find((rule) => tabMatcher(tab, rule)))
}

async function findGroupByTitle(
  groupTitle: string,
): Promise<chrome.tabGroups.TabGroup | undefined> {
  const groups = await chrome.tabGroups.query({ title: groupTitle })
  if (groups.length >= 1) {
    return groups[0]
  }
  return undefined
}

async function assignToGroup(tabs: Tab[], group: GeneralGroup): Promise<number> {
  const { id, color, title } = group
  // if group is already exist
  if (id) {
    // only process tabs not in target group
    const needGroupIds = tabs.filter((t) => t.groupId !== id).map((t) => t.id!)
    return await chrome.tabs.group({
      groupId: id,
      tabIds: needGroupIds,
    })
  }
  const groupId = await chrome.tabs.group({ tabIds: tabs.map((t) => t.id!) })
  const updateArgs = color !== 'auto' ? { title, color } : { title }
  await chrome.tabGroups.update(groupId, updateArgs)
  return groupId
}

function combineGroup(existedGroup: Group | undefined, configedGroup: GroupConfig): GeneralGroup {
  if (existedGroup) {
    const { id, title, color } = existedGroup
    return { id, title, color }
  }
  return { id: undefined, color: configedGroup.color, title: configedGroup.title }
}

async function assignGroup(tab: Tab, configs: GroupConfig[]) {
  const groupConfig = findGroupToAssign(tab, configs)
  if (groupConfig) {
    const existedGroup = await findGroupByTitle(groupConfig.title)
    assignToGroup([tab], combineGroup(existedGroup, groupConfig))
  }
}

async function findAllGroups(tabs: Tab[], configs: GroupConfig[]) {
  const groupedTabs = new Map<string, Set<Tab>>()
  tabs
    .filter((t) => t.id)
    .forEach((tab) => {
      // put all tab that not hit any rule to one group keye by NON_GROUP
      const groupTitle = findGroupToAssign(tab, configs)?.title ?? NON_GROUP
      if (!groupedTabs.has(groupTitle)) {
        groupedTabs.set(groupTitle, new Set())
      }
      groupedTabs.get(groupTitle)!.add(tab)
    })
  return groupedTabs
}

async function assignAllGroup(tabs: Tab[], configs: GroupConfig[]) {
  const groups = Object.fromEntries(configs.map((c) => [c.title, c]))
  const groupedTabs = new Map<string, Set<Tab>>()
  tabs
    .filter((t) => t.id)
    .forEach((tab) => {
      // put all tab that not hit any rule to one group keye by NON_GROUP
      const groupTitle = findGroupToAssign(tab, configs)?.title ?? NON_GROUP
      if (!groupedTabs.has(groupTitle)) {
        groupedTabs.set(groupTitle, new Set())
      }
      groupedTabs.get(groupTitle)!.add(tab)
    })
  await Promise.all(
    groupedTabs.entries().map(([title, tabs]) => {
      findGroupByTitle(title).then((group) => {
        const groupConfig = groups[title]
        if (title != NON_GROUP) {
          assignToGroup([...tabs], combineGroup(group, groupConfig))
        } else {
          assignToGroup([...tabs], { title: 'others', color: 'red' })
        }
      })
    }),
  )
}

export { assignAllGroup, findAllGroups }
