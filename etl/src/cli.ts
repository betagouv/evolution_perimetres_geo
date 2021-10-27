#!/usr/bin/env node
import { prepare, run, defaultConfig } from '.';

const migrator = prepare(defaultConfig);
run(migrator);
