/* @refresh reload */
import { render } from 'solid-js/web';

import './index.css';
import { MonacoEditor} from 'solid-monaco';
import { Component } from 'solid-js';
import { Button, Paper, Select, Stack, TextField, MenuItem, FormControl, InputLabel } from '@suid/material';
// import { Box, FormControl, InputLabel, MenuItem, Select } from "@suid/material";
import GroupRuleConfig from './component/GroupRuleConfig'

const root = document.getElementById('root');

if (import.meta.env.DEV && !(root instanceof HTMLElement)) {
  throw new Error(
    'Root element not found. Did you forget to add it to your index.html? Or maybe the id attribute got misspelled?',
  );
}

const App: Component = () => {

  const handleMount = (monaco: any, editor: any) => {
    // Use monaco and editor instances here
      console.log("mount")
      monaco.languages.json.jsonDefaults.setDiagnosticsOptions({
        validate: true, // 启用验证
        allowComments: false
    });
  };


  return (
    <>
      <GroupRuleConfig></GroupRuleConfig>
    </>
  )
}

render(() => <App />, root!);
