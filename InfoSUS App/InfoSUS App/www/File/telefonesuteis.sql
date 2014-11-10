DROP TABLE mytable;
CREATE TABLE mytable(
  ID INTEGER(1) NOT NULL PRIMARY KEY 
, Name VARCHAR(40)
, PhoneNumber INTEGER(3)
, Description VARCHAR(128)
);
INSERT INTO mytable(ID,Name,PhoneNumber,Description) VALUES (1,'Serviço de Atendimento Móvel de Urgência',192,'Atendimento de Urgências Médicas do SAMU');
INSERT INTO mytable(ID,Name,PhoneNumber,Description) VALUES (2,'Corpo de Bombeiros',193,'Socorre vítimas de acidentes, faz resgates, salvamentos, atende a emergências médicas e auxilia em caso de incêndios.');
INSERT INTO mytable(ID,Name,PhoneNumber,Description) VALUES (3,'Salvamar',185,'Resgate de pessoas em perigo no mar.');
INSERT INTO mytable(ID,Name,PhoneNumber,Description) VALUES (4,'Disque Saúde',136,'Serviço de ouvidoria do SUS que informa sobre doenças e campanhas do Ministério da Saúde. Também recebe denúncias e reclamações.');
INSERT INTO mytable(ID,Name,PhoneNumber,Description) VALUES (5,'Centro de Atendimento à Mulher',180,'Serviço de ouvidoria que informa sobre doenças e campanhas do Ministério da Saúde. Também recebe denúncias e reclamações.');
