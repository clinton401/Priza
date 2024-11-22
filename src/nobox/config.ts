import  {  Config,  getFunctions,  getSchemaCreator  }  from  "nobox-client";

const token = import.meta.env.VITE_REACT_NOBOX_TOKEN;
const endpoint = import.meta.env.VITE_REACT_NOBOX_ENDPOINT;
export const config: Config = {
endpoint,
project:  "prenza", 
token
};

export const createRowSchema = getSchemaCreator(config, { type: "rowed" });

export const createKeyGroupSchema = getSchemaCreator(config, { type: "key-group" });

export  const  Nobox  =  getFunctions(config);