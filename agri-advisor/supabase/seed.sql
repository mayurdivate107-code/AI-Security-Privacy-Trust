-- ==============================================================================
-- seed.sql
-- Verified Seed Data for Agricultural Knowledge Center
-- ==============================================================================

INSERT INTO public.knowledge_articles (title, slug, category, excerpt, content, language, is_published)
VALUES
(
    'Optimal Kharif Crop Selection Principles for Black and Alluvial Soils',
    'optimal-kharif-crop-selection-principles',
    'Crop Selection',
    'Strategic considerations for selecting high-yielding crops in Kharif season based on soil drainage, rainfall onset, and seedbed preparation.',
    'Selecting the appropriate crop for the Kharif monsoon season determines over 60% of overall seasonal productivity. In heavy Black Cotton soils (Vertisols), crops requiring high moisture retention such as Cotton, Soybean, and Pigeon Pea thrive. However, poor drainage can cause waterlogging; raised bed planting (Furrow Irrigated Raised Bed - FIRB) is recommended. In Alluvial soils (Inceptisols), Paddy, Maize, and Green Gram respond well to balanced moisture. Ensure seed treatment with Trichoderma viride (4g/kg) and Rhizobium bio-inoculant before sowing.',
    'en',
    true
),
(
    'Understanding Soil pH and Nutrient Availability Dynamics',
    'soil-ph-and-nutrient-availability-dynamics',
    'Soil Health',
    'How acidic, neutral, and alkaline soil conditions directly regulate the chemical uptake of primary (NPK) and micronutrients.',
    'Soil pH fundamentally governs the availability of plant nutrients. At pH levels below 6.0 (acidic soils), Phosphorus bonds strongly with Iron and Aluminum, rendering it insoluble. In addition, Calcium and Magnesium deficiencies frequently emerge. Applying agricultural limestone (calcium carbonate) neutralizes acidity. Conversely, at pH above 7.8 (alkaline/calcareous soils), Micronutrients like Zinc, Iron, and Manganese become immobilized. For alkaline soils, gypsum and organic composting help stabilize soil reaction.',
    'en',
    true
),
(
    'Precision Nitrogen Management and Basal Fertigation',
    'precision-nitrogen-management-and-basal-fertigation',
    'Fertilizer Management',
    'Scientific split application schedules for Nitrogen to minimize leaching, volatilization losses, and maximize nutrient use efficiency.',
    'Nitrogen is exceptionally mobile in soil solution. Applying full season nitrogen as a single basal dose leads to up to 50% loss via ammonia volatilization and nitrate leaching. The recommended best practice is a 3-split strategy: 25% at basal/sowing, 50% during active vegetative growth or tillering, and 25% at panicle initiation or pre-flowering. Neem-coated urea substantially retards nitrification, ensuring sustained release throughout critical growth stages.',
    'en',
    true
),
(
    'Drip Irrigation Scheduling and Soil Moisture Thresholds',
    'drip-irrigation-scheduling-and-soil-moisture-thresholds',
    'Irrigation',
    'Calculating crop water requirements using evapotranspiration benchmarks and soil tensiometers for 40% water savings.',
    'Drip irrigation delivers water directly to the crop root zone at low pressure, cutting evaporation and weed competition by up to 50%. The key to effective scheduling is matching irrigation volume to crop evapotranspiration (ETc = ETo × Kc). During early vegetative stages, maintain soil moisture at 70-80% of field capacity. Use tensiometers installed at 15cm and 30cm depths to prevent saturation or drought stress.',
    'en',
    true
),
(
    'Integrated Pest Management (IPM) Protocols for Stem Borers and Aphids',
    'integrated-pest-management-ipm-protocols',
    'Pest Management',
    'Multi-tiered pest suppression combining yellow sticky traps, pheromone lures, biological parasitoids, and selective green chemistry.',
    'Integrated Pest Management (IPM) emphasizes biological and cultural suppression before resorting to chemical insecticides. For sucking pests like aphids, thrips, and whiteflies, install yellow and blue sticky traps at canopy height (15-20 traps/acre). For lepidopteran pests like stem borers and armyworms, install sex pheromone traps (5 traps/acre). Apply 5% Neem Seed Kernel Extract (NSKE) or Beauveria bassiana early before economic threshold levels are breached.',
    'en',
    true
),
(
    'Early Diagnostic Signatures of Fungal and Bacterial Leaf Blights',
    'early-diagnostic-signatures-of-leaf-blights',
    'Crop Diseases',
    'Visual distinction between fungal concentric rings and water-soaked bacterial lesions for timely intervention.',
    'Differentiating fungal from bacterial infections is essential for selecting the correct remedy. Fungal leaf spots typically feature concentric rings (target board pattern), dry brown margins, and visible dark fungal spores or pycnidia. Bacterial blights, in contrast, initiate as translucent, water-soaked, angular lesions bounded by leaf veins, often exuding bacterial ooze during humid mornings. Fungal spots respond to copper or triazole fungicides; bacterial blights require copper hydroxide combined with validamycin or systemic bactericides.',
    'en',
    true
),
(
    'On-Farm Vermicomposting and Bio-Fertilizer Consortium Integration',
    'on-farm-vermicomposting-and-bio-fertilizer-consortium',
    'Organic Farming',
    'Step-by-step methodology to produce nutrient-dense vermicast using agricultural residue and Eisenia fetida earthworms.',
    'Vermicompost converts organic agricultural residues into stabilized, nutrient-rich soil humus. Using the epigeic earthworm Eisenia fetida, cow dung combined with dried straw (1:1 ratio) undergoes thermophilic breakdown followed by earthworm digestion over 45-60 days. The resultant vermicast contains 1.5-2.5% Nitrogen, 1.0-1.5% Phosphorus, and rich beneficial microflora. Inoculating with Azotobacter and Phosphate Solubilizing Bacteria (PSB) accelerates nutrient availability.',
    'en',
    true
),
(
    'Crop Rotation Strategies for Sustained Soil Microbiome Health',
    'crop-rotation-strategies-for-sustained-soil-microbiome',
    'Sustainable Agriculture',
    'Breaking weed and pest reproductive cycles while naturally restoring atmospheric nitrogen through legume intercropping.',
    'Monocropping depletes specific soil nutrient strata and fosters pathogen reservoirs. Rotating heavy cereal feeders (Maize, Wheat) with deep-rooted nitrogen-fixing legumes (Chickpea, Green Gram, Cowpea) fixes 40-80 kg/ha of atmospheric nitrogen naturally while breaking soil-borne fungal spores. Rotating tap-root crops with fibrous-root crops also enhances soil aggregate stability and minimizes soil compaction.',
    'en',
    true
)
ON CONFLICT (slug) DO UPDATE SET
    title = EXCLUDED.title,
    content = EXCLUDED.content,
    excerpt = EXCLUDED.excerpt,
    updated_at = NOW();
