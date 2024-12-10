type TabRule = {
    type: "url",
    rule: string
}

type GroupConfig = {
    title: string,
    color: chrome.tabGroups.ColorEnum|'auto',
    rules: TabRule[]
}

type GeneralGroup = {
    id?: number|undefined,
    title: string|undefined,
    color: chrome.tabGroups.ColorEnum|undefined,
}

type Tab = chrome.tabs.Tab
type Group = chrome.tabGroups.TabGroup
type GroupColor = chrome.tabGroups.ColorEnum

export type {
    TabRule,
    GroupConfig,
    Tab,
    Group,
    GroupColor,
    GeneralGroup,
}