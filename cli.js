#!/usr/bin/env node
require('dotenv').config();

const pivotal = require('./dist/main.js');
pivotal.generate(process.env.API_TOKEN);
