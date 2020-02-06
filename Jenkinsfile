pipeline {
    agent any
    stages {
        stage('-- build docker image --') {
            steps {
                sh "docker build -t front-end ."
            }
        }
        stage('-- deploy image to Docker Hub --') {
            steps {
                withDockerRegistry([credentialsId: "docker-credentials", url: ""]) {
                    sh 'docker tag front-end bigheck123/front-end'
                    sh 'docker push bigheck123/front-end'
                }
            }
        }
        stage ('-- trigger test pipeline --') {
            steps {
                build job: 'selenium-pipeline'
            }
        }
    }
}
