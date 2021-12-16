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
use uuid::Uuid;

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
//get map data from db
async fn get_map_data_db(pool: &Pool, map_id:&Uuid) -> Result<Vec<sql::common::MapData>, PoolError> {
    let client: Client = pool.get().await?;
    let stmt = client.prepare_cached("SELECT map_id, user_id, map::text FROM maps_t where map_id = $1").await?; //sql query
    let rows = client.query(&stmt, &[&map_id]).await?;
    Ok(rows
        .into_iter()
        .map(|row| sql::common::MapData {
            map_id: row.get(0),
            user_id: row.get(1),
            map: row.get(2),
        })
        .collect())
}

#[get("/map/{map_id}")]
async fn get_map_data(db_pool : web::Data<Pool>, req: HttpRequest)-> Result<HttpResponse, Error> {
    let map_id =Uuid::parse_str(req.match_info().get("map_id").unwrap()).unwrap();
    let map = get_map_data_db(&db_pool, &map_id).await.unwrap();
    let res_data: Vec<sql::common::ReqData> = map.into_iter().map(|item|
        sql::common::ReqData{
            map_id: item.map_id, 
            user_id: item.user_id,
            post_data: serde_json::from_str(&item.map).unwrap()
        }
    ).collect();
    Ok(HttpResponse::Ok().json(res_data))
}

async fn get_all_map_data_db(pool: &Pool) -> Result<Vec<sql::common::MapData>, PoolError> {
    let client: Client = pool.get().await?;
    let stmt = client.prepare_cached("SELECT  map_id, user_id, map::text FROM maps_t").await?; //sql query
    let rows = client.query(&stmt, &[]).await?;
    Ok(rows
        .into_iter()
        .map(|row| sql::common::MapData {
            map_id: row.get(0),
            user_id: row.get(1),
            map: row.get(2),
        })
        .collect())
}

#[get("/maps")]
async fn get_all_maps(db_pool : web::Data<Pool>)->Result<HttpResponse, Error> {
    let map = get_all_map_data_db(&db_pool).await.unwrap();

    //this bit here builds a propre json structure for frotend
    let res_data: Vec<sql::common::ReqData> = map.into_iter().map(|item|
        sql::common::ReqData{
            map_id: item.map_id, 
            user_id: item.user_id,
            post_data: serde_json::from_str(&item.map).unwrap()
        }
    ).collect();
    Ok(HttpResponse::Ok().json(res_data))
}


//insert map data into db
async fn add_map_db(client:&Client, map:sql::common::MapData) ->Result<sql::common::MapData, MyError>{
    let stmt = client.prepare_cached("insert into maps_t select (data::maps_t).* from(values ($1,$2,$3)) as data").await?; //sql query
    client.query(&stmt, &[&map.map_id, &map.user_id.to_string(), &map.map]).await?
        .iter()
        .map( |row|sql::common::MapData::from_row_ref(row).unwrap())
        .collect::<Vec<sql::common::MapData>>()
        .pop()
        .ok_or(MyError::NotFound)
}

async fn add_map(db_pool : web::Data<Pool>, req_body:String)->Result<HttpResponse, Error>{
    let req_data : sql::common::ReqData = serde_json::from_str(&req_body).unwrap();
    let data_to_db =sql::common::MapData{map_id: req_data.map_id, user_id:req_data.user_id, map:json!(req_data.post_data).to_string()};
    let client : Client = db_pool.get().await.map_err(MyError::PoolError)?;
    let new_map = add_map_db(&client, data_to_db).await.unwrap();
    println!("{:#?}", new_map);
    Ok(HttpResponse::Ok().json(new_map))
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
            .service(get_all_maps)
            .service(get_info)
            .service(get_map_data)
            .route("/", web::get().to(greet))
            .route("/{name}", web::get().to(greet))
            .route("/echo",web::post().to(echo))
            .route("/addUser", web::post().to(add_user))
            .route("/hey", web::get().to(manual_hello)) //example of manual routing
            .route("/newmap",web::post().to(add_map))
    })
    .bind("127.0.0.1:8000")? //port
    .run()
    .await
}
