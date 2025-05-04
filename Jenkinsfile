pipeline {
    agent any
    
    stages {
        stage('Checkout') {
            steps {
                checkout scm
            }
        }
        
        stage('Instalar Dependencias') {
            steps {
                sh 'npm install'
            }
        }
        
        stage('Ejecutar Pruebas') {
            steps {
                sh 'npm test -- --watchAll=false'
            }
        }
        
        stage('Construir') {
            steps {
                sh 'npm run build'
            }
        }
        
        stage('Construir Imagen Docker') {
            steps {
                sh 'docker build -t dog-breeds-frontend:${BUILD_NUMBER} .'
                sh 'docker tag dog-breeds-frontend:${BUILD_NUMBER} localhost:5000/dog-breeds-frontend:${BUILD_NUMBER}'
                sh 'docker tag dog-breeds-frontend:${BUILD_NUMBER} localhost:5000/dog-breeds-frontend:latest'
            }
        }
        
        stage('Subir al Registro') {
            steps {
                sh 'docker push localhost:5000/dog-breeds-frontend:${BUILD_NUMBER}'
                sh 'docker push localhost:5000/dog-breeds-frontend:latest'
            }
        }
        
        stage('Desplegar en QA') {
            when {
                branch 'develop'
            }
            steps {
                sh 'kubectl apply -f k8s/qa-deployment.yaml'
                sh 'kubectl set image deployment/frontend-qa frontend=localhost:5000/dog-breeds-frontend:${BUILD_NUMBER} -n qa'
            }
        }
        
        stage('Desplegar en Producción') {
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
