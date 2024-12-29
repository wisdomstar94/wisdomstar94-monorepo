use clap::{Parser, Subcommand};
pub mod c_express;
pub mod c_fs;
pub mod c_version;

#[derive(Parser)] // requires `derive` feature
#[command(name = "useful-cli")]
#[command(bin_name = "useful-cli")]
#[command(about = "useful-cli 는 여러 유용한 cli 기능을 제공합니다.")]
struct Cli {
  #[clap(subcommand)]
  command: SubCommands
}

#[derive(Subcommand)]
enum SubCommands {
  #[clap(name = "express")]
  Express(c_express::ExpressCommand),
  #[clap(name = "fs")]
  Fs(c_fs::FsCommand),
  #[clap(name = "version")]
  Version(c_version::CliArgs)
}

pub async fn run() {
  let parse_cli = Cli::parse();
  match &parse_cli.command {
    SubCommands::Express(express_command) => c_express::run(express_command).await,
    SubCommands::Fs(fs_command) => c_fs::run(fs_command),
    SubCommands::Version(args) => c_version::run(args),
  }
}