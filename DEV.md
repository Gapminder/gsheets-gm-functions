# Developer documentation

(Work-in-progress)

## Commands

`npm run deploy` - Deploy the scripts and menu actions to [GM Functions - Script development document with tests and examples](https://docs.google.com/spreadsheets/d/1nSt4xgHP3DLc0ryNNDp9AAj_68T3XPt2euZs0ycU1Gs/edit) and [GM Functions - Dataset Validation Example Dataset - v1](https://docs.google.com/spreadsheets/d/1okSzN1kABaNIq85RFz1QojRTEt9845zY6-RDvG_QOHk/edit).  

## Unsorted doc notes for devs

general:
https://developers.google.com/apps-script/guides/sheets/functions
debugging / troubleshooting:
https://developers.google.com/apps-script/guides/logging
performance tips:
https://www.benlcollins.com/spreadsheets/slow-google-sheets/
related to limitations in only able to use v3 data feeds and not v4 api in custom functions:
https://developers.google.com/sheets/api/guides/migration

Note: Custom functions can not reference named ranges in foreign spreadsheets


quotas related to custom functions
Custom function runtime	30 sec / execution

full list: https://developers.google.com/apps-script/guides/services/quotas

## Notes

The menu item "Validate this dataset spreadsheet" is only shown if the spreadsheet contains an "ABOUT" sheet and a named range called "dataset_id"
