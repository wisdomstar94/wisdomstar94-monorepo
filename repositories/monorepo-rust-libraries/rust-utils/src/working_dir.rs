use std::{env, path::PathBuf};

pub fn get_working_dir_path_buf() -> Result<PathBuf, std::io::Error> {
  env::current_dir()
}