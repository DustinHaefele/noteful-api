
ALTER TABLE noteful_notes
  ADD COLUMN 
  date_modified TIMESTAMP DEFAULT now();