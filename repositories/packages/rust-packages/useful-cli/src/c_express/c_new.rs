
#[derive(clap::Args, Debug)]
#[command(
  about="새로운 express 프로젝트를 생성합니다.", 
  long_about = None
)]
pub struct CliArgs {
  /// 프로젝트명을 입력하세요.
  #[arg(short='n', long="name")]
  name: Option<String>,
}

pub fn run(args: &CliArgs) {
  println!("express new args {:?}", args);
}