#!/bin/bash
mv alphabet-list alphabet-list.$(date -I)
wget https://contrabee.com/api/alphabet-list
node hint.js
