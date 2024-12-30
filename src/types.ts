type TabRule = {
  type: 'url'
  rule: string
}

type GroupColor = chrome.tabGroups.ColorEnum | 'auto'

type GroupConfig = {
  title: string
  color: GroupColor
  rules: TabRule[]
}

type GeneralGroup = {
  id?: number | undefined
  title: string | undefined
  color: GroupColor | undefined
}

type Tab = chrome.tabs.Tab
type Group = chrome.tabGroups.TabGroup
type GroupedTabs = {
  name: string,
  id: number,
  color?: chrome.tabGroups.ColorEnum,
  tabs: {
    id: number,
    title: string,
    url: string,
    lastAccessed?: number,
    comment?: string,
  }[]
}
export type { TabRule, GroupConfig, Tab, Group, GroupColor, GeneralGroup, GroupedTabs }
