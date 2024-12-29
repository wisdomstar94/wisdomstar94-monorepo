use clap::{Args, Subcommand};
pub mod c_new;

#[derive(Args)]
#[command(
  about="express 관련 명령어를 제공합니다.", 
  long_about = None
)]
pub struct ExpressCommand {
  #[clap(subcommand)]
  command: ExpressSubCommand,
}

#[derive(Subcommand)]
enum ExpressSubCommand {
  #[clap(name = "new")]
  New(c_new::CliArgs),
}

pub async fn run(express_command: &ExpressCommand) {
  match &express_command.command {
    ExpressSubCommand::New(cli_args) => c_new::run(cli_args).await,
  }
}