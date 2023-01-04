# 개발환경
- ubuntu 버전 : 22.04.1
- node 버전 : 14.20.0
- npm 버전 : 8.15.0
- redis 버전 : 6.0.16
- MySQL 버전 : 8.0.31

<br/>

# 필요 자원
## 1. Email
- 회원가입 시 Email 검증을 위한 인증번호 발송 시 필요

## 2. 서버 컴퓨터(클라우드 서버로 대체 가능)
- 서버를 운영하기 위해서 필요함.

## 3. Intercome의 app_id
- 채팅상담 서비스를 운영하기 위해서 필요함.

<br/>

# 환경설정
## 1. .env 파일 생성  
- NODE_ENV
    - node.js의 실행환경을 알려준다.
- ACCESS_MAXAGE
    - 아무 행동이 없을 경우 로그인 지속가능시간(분)
- salt
    - 비밀번호 해싱 salt값(임의의 문자열)  
- stretching_num
    - 비밀번호 해싱 stretching값(임의의 수)  
- UPLOADFILES_ROOT
    - 업로드 경로(앱경로 기준)
- FILE_MAX_SIZE
    - 업로드 파일 크기 제한(MB)
예시
```Shell:.env
NODE_ENV=development  
ACCESS_MAXAGE=240  
SECRET_KEY=VQWNEO8Hb&o*INOPAV  
salt=nywegor  
stretching_num=7853  
UPLOADFILES_ROOT=uploads  
FILE_MAX_SIZE=10  
```
## 2. config/config.json 생성  
예시
```json
{  
  "NODE_ENV값": {  
    "username": "YourUserId",  
    "password": "YourPassword",  
    "database": "DatabaseName",  
    "host": "127.0.0.1",  
    "dialect": "mysql"  
  }  
}
```
## 3. config/system.json 생성  
예시
```json
{
    "emailService": "gmail",
    "emailUserid": "YourEmailId",
    "emailPassword": "YourEmailAppPassword",
    "systemEmailName": "BeautyWorks"
}
```
## 4. 스키마 생성  
- ```npm start```명령어를 써서 서버를 처음 실행시키면 자동으로 테이블과 속성이 생성된다.

<br/>

# 서버 운용
## 1. nginx
- ### 설치
    - [설치 참조 링크](http://nginx.org/en/linux_packages.html#instructions)

<br/>

- ### 서비스 설정
    - ```'/etc/nginx/sites-avilable/임의의_파일명'```을 생성
    - ```'/etc/nginx/sites-enabled/'```에 위에 파일로 링크 생성
        - ```sudo ln -s /etc/nginx/sites-available/임의의_파일명```

#### **파일 내용**
```
server {  
    listen 80;  
    server_name 서버 IP or 도메인주소;  

    location / {  
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header Host $http_host;
        proxy_set_header X-NginX-Proxy true;
        proxy_pass http://127.0.0.1:node포트번호/;  
    }  
}
```

<br/>

- ## 환경설정
```'/etc/nginx/nginx.conf'``` 파일에서 파일 업로드 크기 제한 해제  
(기본 값은 1MB이다.)  
```Shell:nginx.conf  
http{   
    client_max_body_size 0; // 이 부분 추가  
    ...  
}
```

파일 업로드에 60초이상 걸린다면 시간제한도 풀어줘야 한다.  

```Shell:nginx.conf  
http{   
    client_max_body_size 0;  
    client_body_timeout 7d; // 이 부분 추가  
    ...  
}
```    

<br/>

## 2. pm2
- ### 설치
    - ```npm i -g pm2``` 명령어를 사용하여 설치.

<br/>

- ### 환경설정
    - ```pm2 init simple``` 명령어를 사용하여 ```ecosystem.config.js```파일 생성  
#### **ecosystem.config.js 파일 내용**
```js
module.exports = {
  apps : [{
    name   : "app",
    script : "./bin/www",
          error_file:"./logs/err.log",  // 에러스택경로
          out_file:"./logs/app.log",    // 로그파일경로
        
        // 클러스터 모드로 작동
          exce_mode:"cluster",
          instances:0,
  }]
}
```
- ### 로그관리
    - ```pm2 install pm2-logrotate```명령어를 사용하여 설정파일 생성
    - 명령어를 사용하여 로그 관리 방법을 설정한다.
    - 로그관리 설정 명령어 형식
        - ```pm2 set pm2-logrotate:설정키 값```  

<br/>

- ### 설정키 종류
    - ```rotateModule``` (default : true) - pm2모듈의 로그를 회전시킬지 여부  
    - ```max_size``` (default : 10M) - 로그파일의 크기가 이 값을 넘을 경우 새로운 로그 파일 생성한다. (값에 단위를 넣을 수 있다.)  
        - 설정값 예) 10G, 10M, 10K, ...
    - ```retain``` (default : 30) - 남겨둘 로그파일의 개수
    - ```compress``` (default : false) - gzip압축 여부
    - ```dateFormat``` (default : YYYY-MM-DD_HH-mm-ss) - 로그파일명에 쓰일 파일명 포맷
    - ```TZ``` (default : system time) - 로그파일을 저장할 때 사용할 timezone설정
    - ```workerInterval``` (default : 30) - 로그의 파일크기를 체크하는 시간간격(초)
    - ```rotateInterval``` (default : '0 0 * * *') - node-schedule을 통해 관리된다.
        - '초(0-59;생략가능) 분(0-59) 시(0-23) 일(1-31) 월(1-12) 주요일(0-7; 0 또는 7은 일요일)'
        - 기본값은 매 0시 0분마다 강제로 로테이션시킨다.
        - *은 모든 값을 얘기한다.
        - */n 을 통해 n값마다 로테이션되게 할 수 있다.
        - ex
            - ```pm2 set pm2-logrotate:rotateInterval '*/1 * * * *'``` 이 명령어를 사용하면 매 분마다 강제로 로테이션하게 된다.
        