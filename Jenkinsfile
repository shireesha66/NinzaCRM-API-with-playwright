pipeline {
    agent any

    environment {
        NODE_HOME = '/usr/local/bin'
        MAVEN_HOME = '/opt/homebrew/Cellar/maven/3.9.11/libexec'
        JAVA_HOME = '/opt/homebrew/Cellar/openjdk@21/21.0.9/libexec/openjdk.jdk/Contents/Home'
        PATH = "${NODE_HOME}:${MAVEN_HOME}/bin:${JAVA_HOME}/bin:${env.PATH}"
    }

    triggers {
        cron('H 2 * * *')  // nightly at ~2 AM
    }

    stages {
        stage('Checkout Code') {
            steps {
                git branch: 'main', url: 'https://github.com/shireesha66/NinzaCRM-API-with-playwright.git'
            }
        }

        stage('Install Dependencies') {
            steps {
                sh 'npm install'
            }
        }

        stage('Run Playwright Tests') {
            steps {
                sh 'npx playwright test --reporter=html'
            }
        }

        stage('Publish Report') {
    steps {
        publishHTML(target: [
            reportDir: 'playwright-report',
            reportFiles: 'index.html',
            reportName: 'Playwright Test Report',
            keepAll: true,  // keeps report from every build
            alwaysLinkToLastBuild: true,
            allowMissing: false
        ])
    }
}


    post {
        always {
            archiveArtifacts artifacts: 'playwright-report/**/*', fingerprint: true
            //junit '**/playwright-report/test-results/*.xml'
        }
    }
        
