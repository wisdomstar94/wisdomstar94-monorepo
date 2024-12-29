const VERSION: &str = env!("CARGO_PKG_VERSION");

#[derive(clap::Args, Debug)]
#[command(
  about="useful-cli 의 현재 version 을 표시합니다.", 
  long_about = None
)]
pub struct CliArgs {
  
}

pub fn run(_: &CliArgs) {
  println!("v{}", VERSION);
}