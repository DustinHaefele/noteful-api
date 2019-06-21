
ALTER TABLE noteful_notes
  ADD COLUMN 
  date_moddified TIMESTAMP DEFAULT now();