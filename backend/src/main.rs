#![feature(proc_macro_hygiene, decl_macro)]
use actix_web::{get, web, App, HttpResponse, HttpServer, Responder, Result};
use actix_cors::Cors;
use serde_json::json;
use serde::Deserialize;


mod models {
    use serde::{Deserialize, Serialize};
    use std::collections::{HashMap};
    #[derive(Debug, Serialize, Deserialize)]
    pub struct DataStructure{
        pub id: String,
        pub gtype: String,
        pub pos: HashMap<String, i16>,
        pub rot: Vec<f64>,
        pub scale: HashMap<String, f64>,
        pub size:String,
        pub uuid:String
    }
    #[derive(Debug, Serialize, Deserialize)]
    pub struct ReqData{
        pub post_data : Vec<DataStructure>,
        pub map_id : i16
    }
}


mod errors {
    use actix_web::{HttpResponse, ResponseError};
    use deadpool_postgres::PoolError;
    use derive_more::{Display, From};
    use tokio_pg_mapper::Error as PGMError;
    use tokio_postgres::error::Error as PGError;

    #[derive(Display, From, Debug)]
    pub enum MyError {
        NotFound,
        PGError(PGError),
        PGMError(PGMError),
        PoolError(PoolError),
    }
    impl std::error::Error for MyError {}

    impl ResponseError for MyError {
        fn error_response(&self) -> HttpResponse {
            match *self {
                MyError::NotFound => HttpResponse::NotFound().finish(),
                MyError::PoolError(ref err) => {
                    HttpResponse::InternalServerError().body(err.to_string())
                }
                _ => HttpResponse::InternalServerError().finish(),
            }
        }
    }
}

mod db {
    use crate::{errors::MyError, models::ReqData};
    use deadpool_postgres::Client;
    use tokio_pg_mapper::FromTokioPostgresRow;

    pub async fn add_user(client: &Client, user_info: User) -> Result<User, MyError> {
        let _stmt = include_str!("../sql/add_user.sql");
        let _stmt = _stmt.replace("$table_fields", &User::sql_table_fields());
        let stmt = client.prepare(&_stmt).await.unwrap();

        client
            .query(
                &stmt,
                &[
                    &user_info.email,
                    &user_info.first_name,
                    &user_info.last_name,
                    &user_info.username,
                ],
            )
            .await?
            .iter()
            .map(|row| User::from_row_ref(row).unwrap())
            .collect::<Vec<User>>()
            .pop()
            .ok_or(MyError::NotFound) // more applicable for SELECTs
    }

    pub async fn add_map(client: &Client, map_info: ReqData) -> Result<ReqData, MyError> {

    }
}

mod handlers {
    use crate::{db, errors::MyError, models::User};
    use actix_web::{web, Error, HttpResponse};
    use deadpool_postgres::{Client, Pool};

    pub async fn add_user(
        user: web::Json<User>,
        db_pool: web::Data<Pool>,
    ) -> Result<HttpResponse, Error> {
        let user_info: User = user.into_inner();

        let client: Client = db_pool.get().await.map_err(MyError::PoolError)?;

        let new_user = db::add_user(&client, user_info).await?;

        Ok(HttpResponse::Ok().json(new_user))
    }
}


async fn echo(req_body:String) -> Result<String>{
    use crate::models::{ReqData,DataStructure};
    let req_data : ReqData = serde_json::from_str(&req_body).unwrap();
    let parse_data : Vec<DataStructure> = req_data.post_data;
    println!("{:#?}", parse_data);
    Ok(format!("{}", json!(parse_data)))
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


use dotenv::dotenv;
use tokio_postgres::NoTls;
use deadpool_postgres::Runtime;
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
