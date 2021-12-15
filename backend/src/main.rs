#![feature(proc_macro_hygiene, decl_macro)]
use actix_web::{get, web, App, HttpResponse, HttpServer, Responder, Result, Error, HttpRequest};
use actix_cors::Cors;
use serde_json::json;
use serde::{ Deserialize};
mod sql;
use config::ConfigError;
use deadpool_postgres::{Client, Pool, PoolError, Runtime};
use dotenv::dotenv;
use tokio_pg_mapper::FromTokioPostgresRow;

#[derive(Debug, Deserialize)]
struct Config {
    pg: deadpool_postgres::Config,
}

impl Config {
    fn from_env() -> Result<Self, ConfigError> {
        let mut cfg = config::Config::new();
        cfg.merge(config::Environment::new().separator("__"))?;
        cfg.try_into()
    }
}
//custom error handling yoinked from example code, otherwize insert statements will scream at me
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

async fn echo(req_body:String) -> Result<String>{
    let req_data : sql::common::ReqData = serde_json::from_str(&req_body).unwrap();
    let parse_data : Vec<sql::common::DataStructure> = req_data.post_data;
    println!("{:#?}", parse_data);
    Ok(format!("{}", json!(parse_data)))
}

//db get users
async fn get_users(pool: &Pool) -> Result<Vec<sql::common::ResUser>, PoolError>{
    let client: Client = pool.get().await?;
    let stmt = client.prepare_cached("SELECT id, uname FROM users_t").await?; //sql query
    let rows = client.query(&stmt, &[]).await?;
    Ok(rows
        .into_iter()
        .map(|row| sql::common::ResUser {
            id: row.get(0),
            username: row.get(1),
        })
        .collect())
}
#[get("/echo")]
async fn get_info(db_pool : web::Data<Pool>)-> Result<HttpResponse, Error> {
    let users = get_users(&db_pool).await.unwrap();
    Ok(HttpResponse::Ok().json(users))
}

//add user
use crate::errors::MyError;
async fn add_user_db(client: &Client,user: sql::common::Users) ->Result<sql::common::Users, MyError>{
    let stmt = client.prepare_cached("insert into users_t (uname, password) values ($1,$2)").await?; //sql query
    client.query(&stmt, &[&user.username, &user.password]).await?
        .iter()
        .map( |row|sql::common::Users::from_row_ref(row).unwrap())
        .collect::<Vec<sql::common::Users>>()
        .pop()
        .ok_or(MyError::NotFound)
}

async fn add_user(req_body:String, db_pool:web::Data<Pool>) -> Result<HttpResponse, Error>{
    let req_data : sql::common::Users = serde_json::from_str(&req_body).unwrap();
    println!("{}, {}", req_data.username, req_data.password);

    let client : Client = db_pool.get().await.map_err(MyError::PoolError)?;
    let new_user = add_user_db(&client, req_data).await?;

    Ok(HttpResponse::Ok().json(new_user))
}

//random shit made earlier for get requests
async fn greet(req: HttpRequest) -> impl Responder {
    let name = req.match_info().get("name").unwrap_or("world");
    format!("hello, {}", &name)
}

async fn manual_hello() -> impl Responder {
    HttpResponse::Ok().body("Hey there!")
}
#[actix_web::main]
async fn main() -> std::io::Result<()> {
    dotenv().ok();
    let config = Config::from_env().unwrap();
    let pool = config
        .pg
        .create_pool(Some(Runtime::Tokio1), tokio_postgres::NoTls)
        .unwrap();
    HttpServer::new(move|| {
        App::new()
        .wrap(Cors::permissive())
            .app_data(web::Data::new(pool.clone()))
            .service(get_info)
            .route("/", web::get().to(greet))
            .route("/{name}", web::get().to(greet))
            .route("/echo",web::post().to(echo))
            .route("/addUser", web::post().to(add_user))
            .route("/hey", web::get().to(manual_hello)) //example of manual routing
    })
    .bind("127.0.0.1:8000")? //port
    .run()
    .await
}
