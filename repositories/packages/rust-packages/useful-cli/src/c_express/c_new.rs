use std::{env, fs};

use commander::functions::run_command::run_command;
use downloader::structs::{file_name_options::FileNameOptions, http_file_downloader::HttpFileDownloader};
use file_manager::structs::file_content_controller::FileContentController;
use flater::functions::unpack::unpack_tar_gz;
use rust_utils::working_dir::get_working_dir_path_buf;

const VERSION: &str = env!("CARGO_PKG_VERSION");

pub fn get_template_download_url() -> String {
  let url = format!("https://github.com/wisdomstar94/wisdomstar94-monorepo/releases/download/useful-cli-v{}/express-ts-template.tar.gz", VERSION);
  url
}

#[derive(clap::Args, Debug)]
#[command(
  about="새로운 express 프로젝트를 생성합니다.", 
  long_about = None
)]
pub struct CliArgs {
  /// (required) 프로젝트명을 입력하세요.
  #[arg(short='n', long="name")]
  name: String,
}

pub async fn run(args: &CliArgs) {
  println!("express new args {:?}", args);
  let project_name = &args.name;

  let working_dir_path_buf = get_working_dir_path_buf().expect("[480cb48a-85c0-4215-9c23-2c59a4c02f43] working dir 경로를 불러오지 못했습니다!");
  let project_dir_path_buf = working_dir_path_buf.join(project_name);
  let template_download_url = get_template_download_url();

  println!("downloading... template [{}]", template_download_url);
  
  let template_tar_gz_file_path = HttpFileDownloader::default().download(
    &project_dir_path_buf, 
    template_download_url.as_str(),
    FileNameOptions::UseRemoteFileName(String::from("no_named"))
  ).await.expect("[fe6eafe1-bc59-4d01-ac88-952bf3f602dc] 템플릿을 다운로드 받는 도중 에러가 발생하였습니다.");

  println!("downloaded! template [{}]", template_download_url);

  unpack_tar_gz(&template_tar_gz_file_path, &project_dir_path_buf).expect("[e9db964c-1381-4258-882d-760a7e30bac6] 템플릿 파일을 압축 해제하는 도중 에러가 발생하였습니다.");
  fs::remove_file(&template_tar_gz_file_path).expect("[0a6707bc-f401-457b-a544-85999e63f96c] 템플릿 압축 파일을 삭제 하는 도중 에러가 발생하였습니다.");

  let package_json_file_path = project_dir_path_buf.join("package.json");
  FileContentController::new(package_json_file_path)
    .change(|file_content| {
        file_content.replacen("@wisdomstar94/express-ts-template", &project_name, 1)
    })
    .commit()
    .expect("[6e5da07e-2d95-4557-80cb-af0179ef7d9e] package.json 파일 내용 수정 도중 에러가 발생하였습니다.")
  ;

  let project_dir_path_str = project_dir_path_buf.to_str().expect("[151e8f4f-172b-46dd-a92c-5e42c8e10505] project_dir 경로 변환 도중 에러가 발생하였습니다.");
  if env::consts::OS == "windows" {
    let bat_file_path_buf = project_dir_path_buf.join("useful-cli-temp.bat");
    let bat_file_path = bat_file_path_buf.as_path();
    let mut bat_file_content = String::new();
    bat_file_content.push_str(format!("pushd {}\n", project_dir_path_str).as_str());
    bat_file_content.push_str("npm i\n");
    bat_file_content.push_str("popd");

    let bat_file_content_euc_kr = encoding_rs::EUC_KR.encode(bat_file_content.as_str());
    fs::write(bat_file_path, bat_file_content_euc_kr.0).expect("[15d794e5-b2eb-4fc7-85e0-bd40fc3df2fd] 파일 작성 도중 에러가 발생하였습니다.");
    println!("npm installing...");
    run_command(
      &bat_file_path.to_str().expect("[451008db-acd6-4ff1-8316-0b681c1ffbfc] 임시로 생성된 bat 파일에 대한 경로를 가져오는 도중 에러가 발생하였습니다.")
    ).expect("[fa33773f-dc8c-433c-ac46-19695b52373b] 임시로 생성된 bat 파일을 실행에 실패하였습니다.");
    fs::remove_file(bat_file_path).expect("[60012c18-c004-4c58-a2b7-6db39c12fccf] 임시로 생성된 bat 파일을 삭제하는 도중 에러가 발생하였습니다.");
  } else {
    println!("npm installing...");
    let command = format!("npm install --prefix {}", project_dir_path_str);
    run_command(command.as_str()).expect("[7cb583bb-b68b-4282-b555-1c4dda35f8ef] npm install 명령어를 실행하는 도중 에러가 발생하였습니다.");
  }
} 