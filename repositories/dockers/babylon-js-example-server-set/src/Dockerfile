FROM ubuntu:24.04

RUN apt update -y

# 필요 패키지 설치
RUN (echo 5; echo 68) | apt install -y vim-gtk3 net-tools build-essential curl libnss3-tools git coturn

# node.js v22 설치를 위한 준비
RUN curl -sL https://deb.nodesource.com/setup_22.x | bash --

# node.js 설치
RUN apt install nodejs -y

# corepack 활성화 및 yarn 을 최신 버전으로 설정
RUN corepack enable
RUN corepack prepare yarn@stable --activate

# 레포 구동을 위한 concurrently 패키지 전역 설치
RUN npm i -g pm2 concurrently

# git clone 받을 폴더 생성
RUN mkdir /home/projects

# 해동 폴더로 이동
WORKDIR /home/projects

# 모노레포 clone 받기
RUN git clone https://github.com/wisdomstar94/wisdomstar94-monorepo.git

# 해당 폴더로 이동
WORKDIR /home/projects/wisdomstar94-monorepo

# yarn install 및 필요 레포 빌드하기
RUN yarn install
RUN yarn monorepo-libraries:build
RUN yarn pack:build:step1
RUN yarn pack:build:step2
RUN yarn pack:build:step3

# .env.local 파일 생성
RUN cp ./.env.development ./.env.local

# coturn 설정
RUN cp /etc/turnserver.conf /etc/turnserver.conf.orignal
COPY ./turnserver.conf /etc/turnserver.conf

# 호스트와 바인딩 되어야 할 포트 명시
EXPOSE 3000 3040 3478 5349

# 컨테이너 구동시 자동으로 실행할 커맨드 입력
CMD ["concurrently", "yarn @wisdomstar94/babylon-js-example dev", "yarn @wisdomstar94/babylon-js-example-socket dev", "coturn start"]
