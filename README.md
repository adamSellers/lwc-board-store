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


## Resources
// TODO


## Description of Files and Directories

// TODO


## Issues

// TODO


