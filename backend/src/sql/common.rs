use serde::{Serialize, Deserialize};
use std::collections::HashMap;
use tokio_pg_mapper_derive::PostgresMapper;

#[derive(Debug, Serialize, Deserialize, PostgresMapper)]
#[pg_mapper(table="users-t")]
pub struct Users {
    pub username: String,
    pub password: String,
}

#[derive(Debug, Serialize, Deserialize)]
pub struct ResUser{
    pub id: i64,
    pub username: String,
}

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