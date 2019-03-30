# Salesforce Board Store
This app is a Snowboard store, built in Lightning Web Components! 

## Dev, Build and Test
To build, do the following:-

First, grab the repo:
````
git clone https://github.com/adamSellers/lwc-board-store.git && cd lwc-board-store
````

Next, create yourself a shiny new scratch org in Salesforce DX
````
sfdx force:org:create -f config/project-scratch.json -a boards -s
````

Push the source
````
sfdx force:source:push
````

Update the permissions
````
sfdx force:user:permset:assign -n board_admin
````

Add the data
````
sfdx force:data:tree:import --plan boardData/board-export-Board__c-plan.json
````


Open the org and enjoy
````
sfdx force:org:open
````

** Optional ** 
Add a custom metadata type entry to the Tax_Rate__mdt object that specifies a tax rate and/or locale that you're interested in. Otherwise, the system will default to 10%. 


## Resources
// TODO


## Description of Files and Directories

// TODO


## Issues

1. Tax calculation formulas are simplistic. These should be updated to include greater precision..


