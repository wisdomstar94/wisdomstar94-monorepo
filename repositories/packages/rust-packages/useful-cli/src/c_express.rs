use clap::{Args, Subcommand};
pub mod c_new;

#[derive(Args)]
pub struct ExpressCommand {
  #[clap(subcommand)]
  command: ExpressSubCommand,
}

#[derive(Subcommand)]
enum ExpressSubCommand {
  New(c_new::CliArgs),
}

pub fn run(express_command: &ExpressCommand) {
  match &express_command.command {
    ExpressSubCommand::New(cli_args) => c_new::run(cli_args),
  }
}