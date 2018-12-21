# UI for Pastoral Visit Manager

### 1. Requirements
1. Node 8.6.0+ https://nodejs.org/en/
2. Npm 5.3.0+
3. Angular Cli 1.6.1+

### 2. Running at localhost:

Install angular CLI globally (if not installed):

`npm install -g @angular/cli`

Run the following commands in main directory:

`npm install`

`ng serve --open`




--------------------------------
To deploy on ghpages:

`ng build --prod --output-path frontend --base-href “https://bartoszskwara.github.io/pastoral-visit-manager-frontend/"`


`ngh --dir=dist/frontend`
