const pulumi = require("@pulumi/pulumi");
const azure = require("@pulumi/azure"); 
const vnet = require("./V-NET.js"); //Importing V-NET.js module
const peer=require("./peering.js"); //Importing peering module
const web=require("./webNSG.js");  //Importing webNSG module
const api=require("./apiNSG.js"); //Importing apiNSG module
const db=require("./dbNSG.js"); //Importing dbNSG module

const nsg1=new web.NSG("East US","PulumiRG","K1",1,"10.0.0.0/24","10.0.1.0/24","10.0.2.0/24"); //Calling construcror of NSG class in webNSG
const nsg2=new api.NSG("East US","PulumiRG","K2",2,"10.0.0.0/24","10.0.1.0/24","10.0.2.0/24"); //Calling construcror of NSG class in apiNSG
const nsg3=new db.NSG("East US","PulumiRG","K3",3,"10.0.0.0/24","10.0.1.0/24","10.0.2.0/24");  //Calling construcror of NSG class in dbNSG

//Getting the ids of the NSGs
const nsg1id=nsg1.nsgid;
const nsg2id=nsg2.nsgid;
const nsg3id=nsg3.nsgid;

//Creating the same set of NSG in different location i.e. West US
const nsg4=new web.NSG("West US","PulumiRG","K4",4,"15.0.0.0/24","15.0.1.0/24","15.0.2.0/24");
const nsg5=new api.NSG("West US","PulumiRG","K5",5,"15.0.0.0/24","15.0.1.0/24","15.0.2.0/24");
const nsg6=new db.NSG("West US","PulumiRG","K6",6,"15.0.0.0/24","15.0.1.0/24","15.0.2.0/24");

//Getting the ids of the NSGs in West US
const nsg4id=nsg4.nsgid;
const nsg5id=nsg5.nsgid;
const nsg6id=nsg6.nsgid;

//Creating the Vnet in East US with 3 subents and getting their id and name
let v1=new vnet.VNET("V1","East US","PulumiRG","10.0.0.0/16",nsg1id,nsg2id,nsg3id,"10.0.0.0/24","10.0.1.0/24","10.0.2.0/24",1);
const v1id=v1.vnetid;
const v1name=v1.vname;

//Creating the Vnet in West US with 3 subents and getting their id and name
let v2=new vnet.VNET("V2","West US","PulumiRG","15.0.0.0/16",nsg4id,nsg5id,nsg6id,"15.0.0.0/24","15.0.1.0/24","15.0.2.0/24",2);
const v2id=v2.vnetid; 
const v2name=v2.vname;

//Deploying peering between the Vnets Created
const p1= new peer.peering("V1toV2",v2id,v1name,"PulumiRG",1);
const p2= new peer.peering("V2toV1",v1id,v2name,"PulumiRG",2);