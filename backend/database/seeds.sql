-- Initial seed data for testing
-- Note: Insert auth.users first via Supabase Dashboard

-- Knowledge Base Examples (For RAG)
INSERT INTO knowledge_base (content, metadata) VALUES 
('The PM-Kisan Samman Nidhi scheme provides an annual income support of Rs. 6,000 to all landholding farmers families in the country.', '{"category": "Govt Scheme", "source": "PM-Kisan Official"}'),
('For Wheat cultivation, the ideal sowing time is early November. Nitrogen should be applied in three doses: at sowing, first irrigation, and second irrigation.', '{"category": "Crop Guidelines", "crop": "Wheat"}'),
('Drip irrigation is recommended for areas with water scarcity to improve water-use efficiency by up to 90%.', '{"category": "Best Practice", "topic": "Irrigation"}');
