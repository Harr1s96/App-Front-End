pipeline {
    agent any
    stages {
        stage('-- build docker image --') {
            steps {
                sh "docker build -t front-end:prod ."
            }
        }
        stage('-- deploy image to Docker Hub --') {
            steps {
                withDockerRegistry([credentialsId: "docker-credentials", url: ""]) {
                    sh 'docker tag front-end:prod bigheck123/front-end:prod'
                    sh 'docker push bigheck123/front-end:prod'
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
