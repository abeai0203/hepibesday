UPDATE products SET 
  name = 'Selimut Pemberat Premium (Weighted Blanket)',
  description = 'Selimut berat premium untuk rehat dan tidur yang paling lena.'
WHERE id = 'p1';

UPDATE products SET 
  name = 'Dompet Kulit Minimalis',
  description = 'Design yang nipis, kemas, dan sangat sesuai untuk letak barang penting.'
WHERE id = 'p2';

UPDATE products SET 
  name = 'Set Diffuser Aromaterapi',
  description = 'Wujudkan suasana tenang dan wangi kat rumah dengan minyak pati.'
WHERE id = 'p3';

UPDATE products SET 
  name = 'Mesin Kopi Premium',
  description = 'Untuk kepuasan minum kopi macam kat kafe tiap-tiap pagi.'
WHERE id = 'p4';

UPDATE products SET 
  name = 'Smartwatch Fitness',
  description = 'Senang nak track kesihatan dan aktiviti sukan.'
WHERE id = 'p5';

-- Update reasons
UPDATE product_zodiac_tags SET reason = 'Taurus memang suka benda yang selesa dan premium. Selimut berat ni bagi feeling pelukan hangat yang dorang suka.' WHERE product_id = 'p1' AND zodiac_sign = 'Taurus';
UPDATE product_zodiac_tags SET reason = 'Cancer ni jenis homebody yang suka rasa selamat. Ni memang hadiah terbaik nak suruh dorang duduk berehat kat rumah.' WHERE product_id = 'p1' AND zodiac_sign = 'Cancer';
UPDATE product_zodiac_tags SET reason = 'Sangat praktikal dan tahan lasak. Capricorn akan suka gila dompet yang tak serabut dan nampak elegan macam ni.' WHERE product_id = 'p2' AND zodiac_sign = 'Capricorn';
UPDATE product_zodiac_tags SET reason = 'Virgo suka benda yang tersusun dan cekap. Dompet nipis ni pastikan barang-barang dorang sentiasa kemas.' WHERE product_id = 'p2' AND zodiac_sign = 'Virgo';
UPDATE product_zodiac_tags SET reason = 'Pisces ada jiwa yang sensitif dan spiritual. Diffuser ni bantu dorang buat "sanctuary" untuk tenangkan diri.' WHERE product_id = 'p3' AND zodiac_sign = 'Pisces';
UPDATE product_zodiac_tags SET reason = 'Libra sangat hargai kecantikan dan keharmonian. Diffuser ni akan naikkan lagi seri rumah dorang.' WHERE product_id = 'p3' AND zodiac_sign = 'Libra';
UPDATE product_zodiac_tags SET reason = 'Aries sentiasa perlukan tenaga untuk kekal aktif. Kopi yang sedap pagi-pagi memang "boost" terbaik untuk dorang.' WHERE product_id = 'p4' AND zodiac_sign = 'Aries';
UPDATE product_zodiac_tags SET reason = 'Leo suka gaya hidup eksklusif. Dorang pasti bangga hidangkan kopi premium untuk tetamu kat rumah.' WHERE product_id = 'p4' AND zodiac_sign = 'Leo';
UPDATE product_zodiac_tags SET reason = 'Sagittarius ni tak reti duduk diam! Smartwatch bantu dorang "track" semua adventure dorang yang tak putus-putus.' WHERE product_id = 'p5' AND zodiac_sign = 'Sagittarius';
UPDATE product_zodiac_tags SET reason = 'Gemini suka gajet dan benda-benda trending. Dorang gerenti seronok godek semua feature kat smartwatch ni.' WHERE product_id = 'p5' AND zodiac_sign = 'Gemini';
