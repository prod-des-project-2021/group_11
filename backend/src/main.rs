#![feature(proc_macro_hygiene, decl_macro)]
use actix_web::{get, post, web, App, HttpResponse, HttpServer, Responder};


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
    println!("Hello");
    HttpResponse::Ok().body(req_body)
}

async fn manual_hello() -> impl Responder {
    HttpResponse::Ok().body("Hey there!")
}

#[actix_web::main]
async fn main() -> std::io::Result<()> {
    HttpServer::new(|| {
        App::new()
            .data(AppState{app_name:String::from("Actix-web")})
            .service(index) //example of attaching route
            .service(echo)
            .route("/hey", web::get().to(manual_hello)) //example of manual routing
    })
    .bind("127.0.0.1:8080")? //port
    .run()
    .await
}
