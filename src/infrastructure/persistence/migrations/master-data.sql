INSERT INTO product_types(id, name) 
VALUES
	(1, 'Consulta'),
	(2, 'Teleconsulta / Virtual');

INSERT INTO products(name, image_url, price, product_type_id) 
VALUES
	('Consulta Medicina General', 'https://pulsosalud.com/pe/wp-content/uploads/2023/06/consulta-medicina-general.webp', 80.00, 1),
	('Consulta Ginecológica', 'https://pulsosalud.com/pe/wp-content/uploads/2023/06/consulta-ginecologica.webp', 120.00, 1),
	('Consulta Neumología', 'https://pulsosalud.com/pe/wp-content/uploads/2023/06/5d59dff82f.jpg', 160.00, 1),
  ('Consulta Pediatría', 'https://pulsosalud.com/pe/wp-content/uploads/2023/06/p09.jpg', 90.00, 1),
  ('Teleconsulta Pediatría', 'https://pulsosalud.com/pe/wp-content/uploads/2023/06/8b9b612620.jpg', 65.00, 2),
  ('Consulta Geriatría', 'https://pulsosalud.com/pe/wp-content/uploads/2023/06/c79fe3fe16.jpg', 65.00, 1),
  ('Teleconsulta Geriatría', 'https://pulsosalud.com/pe/wp-content/uploads/2023/06/dabf4f5857.jpg', 45.00, 2),
  ('Consulta Cardiológica', 'https://pulsosalud.com/pe/wp-content/uploads/2023/06/f8ba16feb4.jpg', 125.00, 1),
  ('Consulta Traumatología', 'https://pulsosalud.com/pe/wp-content/uploads/2023/06/214b57d4c1.jpg', 135.00, 1),
  ('Consulta Psicológica', 'https://pulsosalud.com/pe/wp-content/uploads/2023/06/abd3f93753.jpg', 65.00, 1),
  ('Teleconsulta Psicológica', 'https://pulsosalud.com/pe/wp-content/uploads/2023/06/d29148665a.jpg', 45.00, 2),
  ('Consulta Medicina Interna', 'https://pulsosalud.com/pe/wp-content/uploads/2023/06/0338f85af5.jpg', 70.00, 1),
  ('Teleconsulta Medicina Interna', 'https://pulsosalud.com/pe/wp-content/uploads/2023/06/20a56af266-1.jpg', 60.00, 2),
  ('Consulta Medicina General a Domicilio', 'https://pulsosalud.com/pe/wp-content/uploads/2023/06/1cc039d36e.jpg', 120.00, 1),
  ('Consulta con Médico del Deporte', 'https://pulsosalud.com/pe/wp-content/uploads/2023/06/4178a88f7d.jpg', 95.00, 1);