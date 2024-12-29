use std::io::{self, Write};

pub fn prompt(message: &str, debug_uuid: &str) -> String {
  print!("{}", message);
  io::stdout().flush().expect(format!("[{}] error!", debug_uuid).as_str());
  
  let mut input = String::new();
  io::stdin().read_line(&mut input).expect(format!("[{}] error!", debug_uuid).as_str());
  input.trim().to_string()
}