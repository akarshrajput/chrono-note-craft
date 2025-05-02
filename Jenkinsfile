pipeline {
    agent any

    stages {
        stage('Clone Repository') {
            steps {
                git branch: 'main', url: 'https://github.com/akarshrajput/chrono-note-craft.git'
            }
        }

        stage('Build Docker Image') {
            steps {
                script {
                    dockerImage = docker.build("my-notes-app")
                }
            }
        }

        stage('Run Container') {
            steps {
                script {
                    dockerImage.run("-p 4173:4173")
                }
            }
        }
    }
}