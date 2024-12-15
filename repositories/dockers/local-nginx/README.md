# local-nginx

## 로컬의 hosts 파일 수정하기

### mac os 인 경우

1. `sudo vim /private/etc/hosts` 으로 파일을 열고 아래 내용을 추가 한 후 저장하기

```
127.0.0.1      local-project1.sample.com
127.0.0.1      local-project2.sample.com
127.0.0.1      local-project3.sample.com
...
```

2. `dscacheutil -flushcache` 으로 변경사항 반영하기

### windows os 인 경우

1. 메모장을 관리자 권한으로 실행
2. 파일 열기 후 `C:\\Windows\\System32\\Drivers\\etc\\hosts` 파일을 선택하여 메모장에 로드
3. 아래 내용을 추가 한 후 저장하기

```
127.0.0.1      local-project1.sample.com
127.0.0.1      local-project2.sample.com
127.0.0.1      local-project3.sample.com
...
```

<br />

## package.json 스크립트 설명

| 스크립트           | 설명                                                                          |
| ------------------ | ----------------------------------------------------------------------------- |
| mkcert-install:mac | mkcert 를 설치하는 명령어입니다. (mac 전용)                                   |
| mkcert-install:win | mkcert 를 설치하는 명령어입니다. (window 전용)                                |
| cert               | 로컬에 인증기관 등록 및 인증서 발행을 위한 명령어입니다.                      |
| clear              | 기존에 local-nginx 와 관련된 도커 컨테이너 및 이미지를 삭제하는 명령어입니다. |
| build              | local-nginx 이미지를 빌드하는 명령어입니다.                                   |
| start              | local-nginx 컨테이너를 실행하는 명령어입니다.                                 |

## 스크립트 실행 권장 순서

1. `yarn @wisdomstar94/local-nginx mkcert-install:mac` 또는 `yarn @wisdomstar94/local-nginx mkcert-install:win`
2. `yarn @wisdomstar94/local-nginx cert`
3. `yarn @wisdomstar94/local-nginx clear`
4. `yarn @wisdomstar94/local-nginx build`
5. `yarn @wisdomstar94/local-nginx start`
