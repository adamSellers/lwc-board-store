# Salesforce Board Store

This app is a Snowboard store, built in Lightning Web Components!

## Dev, Build and Test

To build, do the following:-

First, grab the repo:

````bash
git clone https://github.com/adamSellers/lwc-board-store.git && cd lwc-board-store
````

Next, create yourself a shiny new scratch org in Salesforce DX

````bash
sfdx force:org:create -f config/project-scratch-def.json -a boards -s
````

Push the source

````bash
sfdx force:source:push
````

Update the permissions

````bash
sfdx force:user:permset:assign -n board_admin
````

Add the data

````bash
sfdx force:data:tree:import --plan boardData/board-export-Board__c-plan.json
````

Open the org and enjoy

````bash
sfdx force:org:open
````

**Optional**
Add a custom metadata type entry to the Tax_Rate__mdt object that specifies a tax rate and/or locale that you're interested in. Otherwise, the system will default to 10%.

## Resources

// TODO

## Description of Files and Directories

// TODO

## Issues

1. Tax calculation formulas are simplistic. These should be updated to include greater precision..
2. Needs a mechanism to reset filters, when a search is entered and filters are minimised then expanded again the search criteria remain (ie, items are filtered) but filters appear as first shown.
3. Add trigger test classes
4. Add order processed functionality
5. Include payment gateway options
