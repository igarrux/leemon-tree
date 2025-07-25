#!/usr/bin/env node
import prompts from 'prompts';
import { cli } from './cli/cli.js';

const autoYes = process.env.LT_AUTO_YES === 'true';
if (autoYes) prompts.override({ action: 'yes-to-all', delete: true });
cli();
