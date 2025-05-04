pipeline {
    agent any
    
    stages {
        stage('Checkout') {
            steps {
                checkout scm
            }
        }
        
        stage('Install Dependencies') {
            steps {
                sh 'npm install'
            }
        }
        
        stage('Run Tests') {
            steps {
                sh 'npm test -- --watchAll=false'
            }
        }
        
        stage('Build') {
            steps {
                sh 'npm run build'
            }
        }
        
        stage('Build Docker Image') {
            steps {
                sh 'docker build -t dog-breeds-frontend:${BUILD_NUMBER} .'
                sh 'docker tag dog-breeds-frontend:${BUILD_NUMBER} localhost:5000/dog-breeds-frontend:${BUILD_NUMBER}'
                sh 'docker tag dog-breeds-frontend:${BUILD_NUMBER} localhost:5000/dog-breeds-frontend:latest'
            }
        }
        
        stage('Push to Registry') {
            steps {
                sh 'docker push localhost:5000/dog-breeds-frontend:${BUILD_NUMBER}'
                sh 'docker push localhost:5000/dog-breeds-frontend:latest'
            }
        }
        
        stage('Deploy to QA') {
            when {
                branch 'develop'
            }
            steps {
                sh 'kubectl apply -f k8s/qa-deployment.yaml'
                sh 'kubectl set image deployment/frontend-qa frontend=localhost:5000/dog-breeds-frontend:${BUILD_NUMBER} -n qa'
            }
        }
        
        stage('Deploy to Production') {
            when {
                branch 'main'
            }
            steps {
                sh 'kubectl apply -f k8s/prod-deployment.yaml'
                sh 'kubectl set image deployment/frontend-prod frontend=localhost:5000/dog-breeds-frontend:${BUILD_NUMBER} -n production'
            }
        }
    }
    
    post {
        always {
            cleanWs()
        }
    }
}