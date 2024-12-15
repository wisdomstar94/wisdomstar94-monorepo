use clap::{Parser, Subcommand};
pub mod c_express;

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
  Express(c_express::ExpressCommand)
}

pub fn run() {
  let parse_cli = Cli::parse();
  match &parse_cli.command {
    SubCommands::Express(express_command) => c_express::run(express_command),
  }
}