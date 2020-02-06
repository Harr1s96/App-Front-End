
# DevOps Wiki

## Prerequisites:
* AWS account, free tier at least
* Project on GitHub
* DockerHub account
* Functioning Jenkins and Nexus virtual machines with public IPv4 addresses

## Initial setup:
### Overview:
Note before starting:  This tutorial assumed you are using the EU-West region on AWS at London.  If you are not, some details may differ between this tutorial and your experiences.
1.  Create VPC and SubNets on AWS
2.  Create RDS on AWS
3.  Create Security Groups on AWS
4.  Create EC2 instances on AWS
5.  SSH into and then set up EC2 instances on AWS

### 1. Create VPC and SubNets on AWS:
1. Navigate to the VPC Dashboard on AWS, available [here](https://eu-west-2.console.aws.amazon.com/vpc/)
2. From here, navigate to Your VPCs in the left pane.  You should see a dashboard of VPCs, if you haven't touched this before the only one present will be default.
3.  Click the Create VPC button in blue.
4.  You will be asked to provide a name, IPv4 CIDR Block, IPv6 CIDR Block and Tenancy settings.
Use whatever name you feel is suitable.  For IPv4 CIDR Block, enter the numbers: 10.0.0.0/16
Leave the IPv6 option as "No IPv6 CIDR Block".  Tenancy can also be left on default.
5.  Click the Create button in blue at the bottom of the wizard; you should now be returned to the Dashboard with your new VPC being created.
6.  From here, navigate to Subnets in the left pane.
7.  Again there should be only the default Subnets if you have not touched this before.
8.  Once again, click the Create Subnet button in blue near the top of the dashboard.
9.  Give your subnet a suitable name, attach it to the VPC you created earlier, and then assign it to an availability zone.  For IPv4 CIDR Block, enter the numbers 10.0.1.0/24
10.  Repeat steps 7, 8 and 9 for each Subregion available to you but increment the IpV4 block as such: 10.0.1.0/24, 10.0.2.0/24, 10.0.3.0/24.

You should now have a VPC and three Subnets attached to it.

### 2.  Create RDS on AWS:
1.  Navigate to the RDS Dashboard on AWS, available [here](https://eu-west-2.console.aws.amazon.com/rds)
2.  Navigate to the Databases tab on the left pane.
3.  If you have not used this tool before, there should be no databases present. Create one by clicking the orange Create database button.
4.  You will be offered the choice of Standard Create and Easy Create, select Standard.
5.  Below this, options for the database type are presented.  Select MySQL and make sure you are using the latest version.  At the time of writing, this was MySQL 8.0.16.
6.  Scroll down to find Database settings.  Give your database a suitable name, master username and master password.  Make sure you do not lose this password.
7.  Scroll down to Connectivity, and ensure the dataase will be connected to the VPC you made earlier.
8.  Under Database authentication, select Password and IAM database authentication.
9.  All other options can be left as default.  Finish the creation process by clicking the create button.  You will be returned to the Dashboard and should see your new Database being created.  This wil take some time.

### 3.  Create Security Groups and IAM Roles on AWS:


### 4.  Create EC2 instances on AWS:
1.  Navigate to the EC2 Dashboard on AWS, available [here](https://eu-west-2.console.aws.amazon.com/ec2)
2.  We will be creating two EC2 instances during this tutorial, one for your frontend and one for your backend.  The remaining two of the four required will be created in a later stage.
3.  Navigate to the Instances Dashboard in the left pane, and click the Launch Instance button.
4.  Using Quick Start, scroll down to Ubuntu Server 18.04 LTS and click select.
5.  Unless stated otherwise, you can leave all settings as the default options.
6.  After choosing an instance type, click the next button to move onto Configure Instance Details.
7.  On this page, ensure you create only one instance.
8.  Under Network, choose your VPC and a SubNet.  For the backend, we recommend you choose the Subnet in eu-west-2a; and the subnet in eu-west-2b for your frontend.  Ensure your Instance will have a public IP auto-assigned.
9.  For your backend, ensure it is created with the IAM Role you created earlier to connect to your database.
10.  Navigate through the following stages until you reach Configure Security Groups.
11.  Click "Select an *existing* security group", and then choose the appropriate security groups you created before:  the backend security group for the back end instance.
12.  Finish by clicking the create and launch button.  You will be prompted to select a key pair or download a new one.  Choose to download a new key and give it a suitable name.  Keep this key secure as you will need it for later steps.
12.  Repeat the above steps from 3 to 11 for both a frontend and a backend instance.
13.  At the end of this section, you should have two instances shown in your EC2 Dashboard.  It is advised you give them a name in the dashboard to differentiate them.

### 5.  SSH into and then setup your EC2 instances on AWS:
1.  Navigate to the EC2 Dashboard on AWS, available [here](https://eu-west-2.console.aws.amazon.com/ec2)
2.  We will be configuring the Backend and Frontend instances created earlier.  The steps for both are largely the same.
3.  Navigate to the Instances Dashboard in the left pane, and select an instance.
4.  Then click the Connect button.  This will open a pop-up detailing how to connect to your instance.
5.  On your computer navigate to the key you downloaded earlier and open a terminal at that location.
6.  Copy and paste the line of code provided by AWS into your terminal, and run it.  It may take some time to connect.  If an error occurs, please see the FAQ below.
7.  You should now be connected to your instance.  We will be installing Docker onto the instance.  To do so, run the following commands:
<pre><code>curl https://get.docker.com | sudo bash
sudo systemctl start docker
sudo systemctl enable docker
sudo usermod -aG docker $USER</code></pre>
This will install Docker and ensure it runs whenever the instance stops and restarts.
8.  Disconnect from your instance typing the command: <pre><code>exit</code></pre>
Then reconnect to it and test that Docker is working correctly by typing the command:
<pre><code>docker --version</code></pre>
the result should be similar to
<pre><code>Docker version 19.03.5, build 633a0ea838</code></pre>
If this did not show, refer to the FAQ below.
9.  You should now have Docker installed on one EC2 instance.  Repeat the steps above to install it on both EC2 instances.
10.  You now need to write a script that executes whenever the Instance reboots.
11.  Type the following commands, replacing ScriptNameHere with a suitable name.
<pre><code>touch ScriptNameHere.sh
nano ScriptNameHere.sh</code></pre>
This will create and then edit a file of your chosen name.  Into this file copy and paste the following code.  If you have never used Nano before it is reccomended that you use the mouse to right-click and paste, or see this [guide](https://wiki.gentoo.org/wiki/Nano/Basics_Guide)
<pre><code>
#!/bin/bash
(docker stop back-end && docker rm back-end) || echo "No prior back-end"
docker system prune -f
docker pull YourDockerHubAccount/back-end
sleep 1m
docker container run --restart unless-stopped --name Back_End -p 9090:8081 -d b$
</code></pre>
12.  You now need to make this script execute on start up.  The following subguide will show you how:
Change ownership of the file to root by executing the following command:
<pre><code>sudo chown root ScriptNameHere.sh</code></pre>
Make the file executable by root and by group root with the command:
<pre><code>sudo chmod 755 ScriptNameHere.sh</code></pre>
Navigate to /etc and ensure there is a file called "rc.local", you may need to create it using <pre><code>touch rc.local</code></pre>
Edit this file and add the path to ScriptNameHere.sh to rc.local with the command
<pre><code>nano rc.local</code></pre>
It should look like:
<pre><code>
#!/bin/bash
home/ubuntu/startupscript.sh
</code></pre>
Make rc.local executable by root using
<pre><code>sudo chmod 755 rc.local</code></pre>
Finally, enable rc-local service using
<pre><code>sudo systemctl enable rc-local</code></pre>
and start it with
<pre><code>sudo systemctl start rc-local</code></pre>

13.  You should now have a script that executes on start up which pulls down a docker image and runs it in a docker container.
The guide above used the backend as an example with the Docker image being called "back-end".  The front end will run on port 9091:80 instead of 9090:8081.  The details of your docker image may vary.
Do not worry if this script does not run if the docker images have not yet been made.   This will be covered in the pipeline guide.

## Pipelines:
### Overview
In this section, we shall create pipelines for the development branches of backend and frontend.
The production, or master, pipelines can be created using a similar process.
For this section, you will need access to a functioning Nexus and Jenkins virtual machine.
1. Configure jenkins and use a jenkinsfile.
2. Setup the backend pipeline.
3. Setup the frontend pipeline.

### 1.  Configure jenkins and use a jenkinsfile.
1.  In the github for this project, you will find a jenkinsfile at the toplevel of the project file structure in the dev branch.
You will need to edit to work with your Docker Hub account.
The file will initially look like this:
<pre><code>
pipeline {
    agent any
    stages {
        stage('--- package and deploy to Nexus ---') {
            steps {
                sh "mvn clean package deploy"
            }
        }
        stage('-- build docker image --') {
            steps {
                sh "docker build -t back-end ."
            }
        }
        stage('-- deploy image to Docker Hub --') {
            steps {
                withDockerRegistry([credentialsId: "docker-credentials", url: ""]) {
                    sh 'docker tag back-end bigheck123/back-end'
                    sh 'docker push bigheck123/back-end'
                }
            }
        }
    }
}
</code></pre>
2.  You will need to alter only the stage labeled '-- deploy image to Docker Hub --'.
3.  You will need to replace bigheck123 with the name of your Docker Hub account.
4.  You will also need to add your Docker Hub credentials to jenkins and ensure it has the id docker-credentials.
5.  To do this, navigate to your Jenkins VM in your browser, and log in.  Click on the Credentials link on the left side of the page.
6.  At the bottom of the page, you should find a section labeled Stores Scoped to Jenkins.  Click on the Store labeled jenkins and (global).
7.  Now click on the "Global credentials (unrestricted)" option under System.
8.  Click the "Add Credentials" button and fill in your Docker Hub credentials.
Again, ensure the ID of these credentials is "docker-credentials"

### 2.  Setup the Pipeline
1.  From the homepage of jenkins, click on New Item.
2.  name your pipeline and select the pipeline option below.  Then click the OK button.
3.  Feel free to enter a description on the next page.  Check the following options in the General section:
* Discard old builds
* GitHub project
You will need to populate the input boxes.  We recommend you keep builds for at least 2 days and keep at least 2 builds.
You will need to put in the url for the GitHub project.
4.  In the build trigger section, you must check the following box:
* Poll SCM
In the text box, we recommend you enter following text: H/10 * * * *
You can schedule the pipeline to check for updates on Github more or less often.
5.  In the pipeline section, change the Defintion from "Pipeline script" to "Pipeline script from SCM".
This will produce more options to choose from.  Select GitHub in SCM, re-enter the GitHub url and specify the branch to use.
For this tutorial, specify "*/dev".
All other options can be left as default.
6.  Click the save and apply buttons, and then navigate to the homepage of jenkins again and ensure the new pipeline has been added.
7.  Repeat these steps for the frontend as well as the backend.  The GitHub url and branches will differ.




## FAQ:
### Question:  I tried connected to my instance and I got the error "Please login as ubuntu rather than the user root"
#### Answer:
The command AWS provided was likely of the form:
<pre><code>ssh -i "key.pem" root@ecX-XX-XX-XX-XX.eu-west-2.compute.amazonaws.com</code></pre>
Change the command from root@ec to ubuntu@ec2 and try the command again.


### Question:  I tried to run docker commands and got the error "Got permission denied while trying to connect to the Docker daemon socket!"
#### Answer:
This means the final command did not work.  Please try using the following command again:
 <pre><code>sudo usermod -aG docker $USER</code></pre>
 After running this command close the terminal and then reopen it and reconnect to your EC2 instance.  If it still does not work, please see the guide [How to install and use Docker on Ubuntu](https://www.hostinger.co.uk/tutorials/how-to-install-and-use-docker-on-ubuntu/)


### Question: i tried to run "curl https://get.docker.com | sudo bash" and was told curl was not installed?
####Answer:
Please install Curl using the command: <pre><code>sudo apt install curl</code></pre> and try the installation process again.


### Question:  I tried to run "curl httpdocker sudo bash" again and it still didn't work!
#### Answer:
Try to install Docker instead with
<pre><code>sudo apt install docker.io -y</code></pre>
Then follow the other steps in the installation guide


#### Question:  I tried to run Docker --version and got the error "Command 'docker' not found", please help!
#### Answer:
This means Docker did not install correctly.  Please repeat the docker installation instructions again.  If the problem persists, please consult this guide: [How to install and use Docker on Ubuntu](https://www.hostinger.co.uk/tutorials/how-to-install-and-use-docker-on-ubuntu/)
