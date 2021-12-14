#![feature(proc_macro_hygiene, decl_macro)]
use actix_web::{get, web, App, HttpResponse, HttpServer, Responder, Result};
use serde::{Serialize, Deserialize};
use actix_cors::Cors;
use std::collections::{HashMap};


#[derive(Debug, Serialize, Deserialize)]
struct DataStructure{
    id: String,
    gtype: String,
    pos: HashMap<String, i16>,
    rot: Vec<f64>,
    scale: HashMap<String, f64>,
    size:String,
    uuid:String
}


#[derive(Debug, Serialize, Deserialize)]
struct ReqData{
    post_data : Vec<DataStructure>
}


async fn echo(req_body:String) -> Result<String>{
    let req_data : ReqData = serde_json::from_str(&req_body).unwrap();
    let parse_data : Vec<DataStructure> = req_data.post_data;
    
    Ok(format!("{:#?}", parse_data))
}

#[derive(Deserialize)]
struct Info{
    name: String,
    age:i8
}
#[get("/echo/{name}/{age}")]
async fn get_info(info : web::Path<Info>)-> impl Responder {
    format!("welcome {}, who is {} years old", info.name, info.age)
}

async fn manual_hello() -> impl Responder {
    HttpResponse::Ok().body("Hey there!")
}

#[actix_web::main]
async fn main() -> std::io::Result<()> {

    HttpServer::new(move|| {
        App::new()
        .wrap(Cors::permissive())
             
            .service(get_info)
            .route("/echo",web::post().to(echo))
            .route("/hey", web::get().to(manual_hello)) //example of manual routing
    })
    .bind("127.0.0.1:8000")? //port
    .run()
    .await
}
