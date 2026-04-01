* Steps to import and deploy to github and cloud using docker


1 - Create nodeJs app locally

* Github setup

1- Create private repo in github website

2- save repo address : https://github.com/janeset/github-cloud-app.git 

3- Create a github login token (Github.com > Setting > DeveloperSettings > Personal Access Token > Generate new token > Classic token > repo permission)
    - token: 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


4- back to your teminal, where the repo is saved locally run "git init" the github repo
    4.1 - git init 

    // add remote repo from git
    4.2 - https://[Github_Username]:[Github_Token]@[Github_RepoName]
        - username: janeset
        - repo: github.com/janeset/github-cloud-app.git
        - token: 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

        - https://janeset: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@github.com/janeset/github-cloud-app.git
    
    4.3 - type in terminal
        git remote add origin https://janeset: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@github.com/janeset/github-cloud-app.git 

5- add files and commit
    git add .
    git commit -m"first commit"

6- create main branch 
    git branch -M main

7- git push into main
    git push -u origin main


# deploy to Google Cloud Platform (GCP)
- NOTE:  ensure the user you are using has admin rights!!!

1- open terminal collection in your CloudVM using SSH

2- clone repo from github (main branch) using the token
    git clone --branch main  https://janeset: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@github.com/janeset/github-cloud-app.git 

3- change directory to your repo
    cd <repo name>

4- create dockerfile (using nano or pico (sudo apt install alpine-pico)) to run applation using docker
    > pico Dockerfile
    * pico editor will open on terminal, add the content of the file *

    FROM alpine
    RUN apk add --update nodejs npm
    COPY . /src
    WORKDIR /src
    EXPOSE 3000
    ENTRYPOINT ["node", "./app.js"]

    > save (ctrl+O (Letter oh) + enter, ctrl + X)
    > cat Dockerfile (View file content)

5- create the docker image of our app using the script
    > docker image build -t cloud-app-test-image:1 .

6- build the docker container from the img and run it
    > docker container run -d --name cloud-app-test-container --publish 80:3000 cloud-app-test-image:1

7- check docker containers and status
    > docker ps -a

8- go to your cloudVM, and visit the IP, this should show the app running

9- stop your container 
    > docker stop cloud-app-test-container

10- turn off your vm and you're done!



