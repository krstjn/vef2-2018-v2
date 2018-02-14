CREATE TABLE info(
    id serial PRIMARY KEY,
    dagsetning TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    nafn varchar(64) NOT NULL,
    netfang varchar(64) NOT NULL,
    ssn varchar(11) NOT NULL,
    fjoldi integer);