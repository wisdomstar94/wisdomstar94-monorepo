use clap::{Args, Subcommand};
pub mod c_del_node_modules_dist;

#[derive(Args)]
pub struct FsCommand {
  #[clap(subcommand)]
  command: FsSubCommand,
}

#[derive(Subcommand)]
enum FsSubCommand {
  #[clap(name = "del-node_modules-dist")]
  DelNodeModulesDist(c_del_node_modules_dist::CliArgs),
}

pub fn run(fs_command: &FsCommand) {
  match &fs_command.command {
    FsSubCommand::DelNodeModulesDist(cli_args) => c_del_node_modules_dist::run(cli_args),
  }
}