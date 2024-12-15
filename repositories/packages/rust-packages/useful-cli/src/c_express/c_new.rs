use rust_utils::working_dir::get_working_dir_path_buf;

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

pub fn run(args: &CliArgs) {
  println!("express new args {:?}", args);
  
  let working_dir_path_buf = get_working_dir_path_buf().unwrap();
  println!("working_dir_path_buf {:?}", working_dir_path_buf);
} 