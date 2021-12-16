
use serde::{Serialize, Deserialize};
use uuid::Uuid;
use std::collections::HashMap;
use tokio_pg_mapper_derive::PostgresMapper;


//set user data
#[derive(Debug, Serialize, Deserialize, PostgresMapper)]
#[pg_mapper(table="users_t")]
pub struct Users {
    pub username: String,
    pub password: String,
}
//get user data
#[derive(Debug, Serialize, Deserialize, PostgresMapper)]
#[pg_mapper(table="users_t")]
pub struct ResUser{
    pub id: i32,
    pub username: String,
}
//basic mesh struct needed for creating/saving meshes from frontend
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

//response to get_map_data
#[derive(Debug, Serialize, Deserialize)]
pub struct ReqData{
    pub post_data : Vec<DataStructure>,
    pub map_id : Uuid,
    pub user_id: i32
}
//use this to query and set map data
#[derive(Debug, Serialize, Deserialize, PostgresMapper)]
#[pg_mapper(table="maps_t")]
pub struct MapData{
    pub map_id : Uuid,
    pub user_id: i32,
    pub map : String,
}