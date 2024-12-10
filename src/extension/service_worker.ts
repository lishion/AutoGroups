import { 
    GroupConfig 
} from './types'

import { assignAllGroup } from './groupUtils'

const groupConfigs: GroupConfig[] = [
    {
        "title": "google",
        "color": "red",
        "rules": [
            {
                "type": "url",
                "rule": "google\.com"
            }
        ]
    },
    {
        "title": "plugin",
        "color": "blue",
        "rules": [
            {
                "type": "url",
                "rule": "developer\.chrome\.com"
            }
        ]
    }
]

async function initGroup(){
    const tabs = await chrome.tabs.query({"url": "*://*/*"})
    await assignAllGroup(tabs, groupConfigs, {"color": "red", "title": "others"})
}

// initGroup().then(() => console.info("group success"))