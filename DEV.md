# Developer documentation

## Commands

`npm run test` - Run tests.  
`npm run deploy` - Deploy the scripts and menu actions to [GM Functions - Script development document with tests and examples](https://docs.google.com/spreadsheets/d/1nSt4xgHP3DLc0ryNNDp9AAj_68T3XPt2euZs0ycU1Gs/edit) and [GM Functions - Dataset Validation Example Dataset - v1](https://docs.google.com/spreadsheets/d/1okSzN1kABaNIq85RFz1QojRTEt9845zY6-RDvG_QOHk/edit).  

## Development workflow

* Check out the latest code
* Copy `.env.example` to `.env` and insert the current API key from https://console.cloud.google.com/apis/credentials/key/e4d64583-f488-47fb-81a8-eb1a7308cb2f?project=gsheets-gm-functions in it
* Run tests (a decent internet connection is necessary since many requests are made querying live data)
* Fix broken tests (sometimes live data changes which breaks tests)
* Fix/add features of interest
* Add and run tests
* Deploy the scripts

## Unsorted doc notes for devs

* General: https://developers.google.com/apps-script/guides/sheets/functions
* Debugging / troubleshooting: https://developers.google.com/apps-script/guides/logging
* Performance tips: https://www.benlcollins.com/spreadsheets/slow-google-sheets/
* Related to limitations in only able to use v3 data feeds and not v4 api in custom functions:
https://developers.google.com/sheets/api/guides/migration

Note: Custom functions can not reference named ranges in foreign spreadsheets

Quotas related to custom functions
 * Custom function runtime	30 sec / execution
 * Full list: https://developers.google.com/apps-script/guides/services/quotas
