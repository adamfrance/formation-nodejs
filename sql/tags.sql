-- Les étiquettes : un libellé obligatoire et unique
CREATE TABLE tags (
  id    SERIAL PRIMARY KEY,
  label VARCHAR(40) NOT NULL UNIQUE
);

INSERT INTO tags (label) VALUES ('travail'), ('maison');
SELECT * FROM tags ORDER BY id;
