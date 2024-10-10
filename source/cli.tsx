#!/usr/bin/env node
import React from 'react';
import {render} from 'ink';
import Select from './commands/select.js';

const [, , command] = process.argv;

render(<Select command={command} />);
