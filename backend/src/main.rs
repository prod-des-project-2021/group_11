#![feature(proc_macro_hygiene, decl_macro)]
use std::time::SystemTime;
use rocket::*;

#[get("/")]
fn index() -> &'static str {
    "Hello, world!"

}
#[get("/lol")]
fn handler(){
    let time = SystemTime::now();
    println!("{:?}", time)
}


fn main() {
    rocket::ignite().mount("/", routes![index])
    .mount("/", routes![handler])
    .launch();
}
