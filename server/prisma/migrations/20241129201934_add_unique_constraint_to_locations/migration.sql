 ALTER TABLE "locations" ADD CONSTRAINT "unique_street_latitude_longitude" UNIQUE ("street", "latitude", "longitude");