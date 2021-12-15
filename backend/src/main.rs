#![feature(proc_macro_hygiene, decl_macro)]
use actix_web::{get, post, web, App, HttpResponse, HttpServer, Responder};
use serde::Deserialize;
use actix_cors::Cors;

struct AppState{
    app_name: String,
}


#[get("/")]
async fn index(data: web::Data<AppState>) -> String {
    let app_name = &data.app_name; // <- get app_name
    format!("Hello {}!", app_name) // <- response with app_name
}


#[post("/echo")] //decorator determins method and path
async fn echo(req_body: String) -> impl Responder {
    println!("Hello {}!", req_body);
    HttpResponse::Ok().body(req_body)
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
    HttpServer::new(|| {
        App::new()
        .wrap(Cors::permissive())
            .data(AppState{app_name:String::from("Actix-web")})
            .service(index) //example of attaching route
            .service(echo)
            .service(get_info)
            .route("/hey", web::get().to(manual_hello)) //example of manual routing
    })
    .bind("127.0.0.1:8000")? //port
    .run()
    .await
}
