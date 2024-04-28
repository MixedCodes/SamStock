DROP DATABASE IF EXISTS samstock;
CREATE DATABASE IF NOT EXISTS samstock DEFAULT CHARACTER SET utf8 COLLATE utf8_unicode_ci;
USE samstock;

-- DML
CREATE TABLE IF NOT EXISTS account (
	acc_id INT NOT NULL AUTO_INCREMENT,
    acc_fname VARCHAR(35) NOT NULL,
    acc_lname VARCHAR(35) NOT NULL,
    acc_email VARCHAR(255) NOT NULL,
    acc_address VARCHAR(255) NOT NULL,
    CONSTRAINT pk_acc PRIMARY KEY (acc_id)
);

CREATE TABLE IF NOT EXISTS login_information (
	login_id INT NOT NULL AUTO_INCREMENT,
    login_username VARCHAR(20) NOT NULL,
    login_password VARCHAR (20) NOT NULL,
    is_super BOOLEAN,
    last_login DATETIME,
    acc_id INT NOT NULL,
    CONSTRAINT pk_login PRIMARY KEY (login_id),
    CONSTRAINT fk_login_acc FOREIGN KEY (acc_id) REFERENCES account(acc_id) ON DELETE CASCADE
);
   
CREATE TABLE IF NOT EXISTS brand (
	brand_id INT NOT NULL AUTO_INCREMENT,
    brand_name VARCHAR(35) NOT NULL,
    CONSTRAINT pk_brand PRIMARY KEY (brand_id)
);   

CREATE TABLE IF NOT EXISTS category (
	category_id INT NOT NULL AUTO_INCREMENT,
    category_name VARCHAR(35) NOT NULL,
    CONSTRAINT pk_category PRIMARY KEY (category_id)
);   

CREATE TABLE IF NOT EXISTS category_image (
	category_id INT NOT NULL AUTO_INCREMENT,
    category_image VARCHAR(511) NOT NULL,
    CONSTRAINT pk_category_image FOREIGN KEY (category_id) REFERENCES category(category_id) ON DELETE CASCADE
); 

CREATE TABLE IF NOT EXISTS size (
	size_id INT NOT NULL AUTO_INCREMENT,
    size_name VARCHAR(7) NOT NULL,
    CONSTRAINT pk_size PRIMARY KEY (size_id)
);   
   
CREATE TABLE IF NOT EXISTS product (
	prod_id INT NOT NULL AUTO_INCREMENT,
    prod_name VARCHAR(70) NOT NULL,
    prod_gender CHAR(1) NOT NULL,
    prod_price DECIMAL(10, 2) NOT NULL,
    prod_image VARCHAR(511) NOT NULL,
    prod_desc VARCHAR(511) NOT NULL,
    brand_id INT NOT NULL,
    category_id INT NOT NULL,
    CONSTRAINT pk_product PRIMARY KEY (prod_id),
    CONSTRAINT fk_product_brand FOREIGN KEY (brand_id) REFERENCES brand(brand_id) ON DELETE CASCADE,
    CONSTRAINT fk_prouct_category FOREIGN KEY (category_id) REFERENCES category(category_id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS product_item (
	prod_id INT NOT NULL,
    size_id INT NOT NULL,
    quantity INT NOT NULL,
    sku VARCHAR(12),
    CONSTRAINT pk_prouct_item PRIMARY KEY (prod_id, size_id),
    CONSTRAINT fk_product_item_product FOREIGN KEY (prod_id) REFERENCES product(prod_id) ON DELETE CASCADE,
    CONSTRAINT fk_product_item_size FOREIGN KEY (size_id) REFERENCES size(size_id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS manage_account (
	super_id INT,
    acc_id INT,
    action VARCHAR(50) NOT NULL,
    action_date DATE NOT NULL,
    action_change VARCHAR(50)
    -- CONSTRAINT fk_manage_account_super FOREIGN KEY (super_id) REFERENCES account(acc_id) ON DELETE SET NULL,
	-- CONSTRAINT fk_manage_account_account FOREIGN KEY (acc_id) REFERENCES account(acc_id) ON DELETE SET NULL
);

CREATE TABLE IF NOT EXISTS manage_product (
	super_id INT,
    prod_id INT,
    action VARCHAR(50) NOT NULL,
    action_date DATE NOT NULL,
    action_change VARCHAR(100)
    -- CONSTRAINT fk_manage_product_super FOREIGN KEY (super_id) REFERENCES account(acc_id) ON DELETE SET NULL,
    -- CONSTRAINT fk_manage_product_product FOREIGN KEY (prod_id) REFERENCES product(prod_id) ON DELETE SET NULL
);

-- DDL
INSERT INTO account(acc_id, acc_fname, acc_lname, acc_email, acc_address) VALUES 
(1, 'Veerapat', 'Sangputngeontana', 'veerapat.san@gmail.com', '46/267 TangSin, Salaya, Nakhon Pathom, Thailand'),
(2, 'Patiparn', 'Tangmongkolpaisan', 'patiparn.tan@gmail.com', '74/27 China Town, Bangkok, Thailand'),
(3, 'Anecha', 'Prasobvittaya', 'anecha.pra@gmail.com', '2/78 Wat Ling Kob, Lop Buri, Thailand'),
(4, 'Natchanon', 'Sinsub', 'natchanon.sin@gmail.com', '35 Shinosuke, Osaka, Japan'),
(5, 'Wongpan', 'Wongmethakul', 'wongpan.won@gmail.com', '1 Abatacum, Kingston, Jamaica'),
(6, 'Samuel', 'Eto', 'samuel.eto@gmail.com', '23/353 Wongwein-Yai, Bagkok, Thailand'),
(7, 'Anita', 'Maxwynn', 'anita.max@gmail.com', '4 london Streets, London, England'),
(8, 'Drake', 'Longleg', 'drake.lon@gmail.com', '57 Sanfan, Miami, USA'),
(9, 'Somchai', 'Wong', 'somchai.wong@gmail.com', '25/397 Ong-Pha, Nakhon Pathom, Thailand'),
(10, 'Bangon', 'Metagul', 'bangon.met@gmail.com', '27/6 Kruborn, Bangkok, Thailand');
    
INSERT INTO login_information(login_id, login_username, login_password, is_super, last_login, acc_id) VALUES 
(1, 'super', '1', TRUE, '2024-03-26 10:15:00', 1),
(2, 'notsuper', '1', FALSE, '2024-03-25 08:30:00', 2),
(3, 'siantalentjadd', 'sianicondolonely', FALSE, '2024-03-24 12:45:00', 3),
(4, 'besttoriko', 'kaiyang5star', FALSE, '2024-03-23 14:20:00', 4),
(5, 'samzalolpedro12', 'robloxgirllover', TRUE, '2024-03-17 11:20:00', 5),
(6, 'samuel123', 'samuel123456', FALSE, '2024-03-26 10:15:00', 6),
(7, 'anitamaxx', 'alterego', TRUE, '2024-03-25 08:30:00', 7),
(8, 'drakelongleg', 'godplan88', FALSE, '2024-03-24 12:45:00', 8),
(9, 'somchaiwong', 'somchai1212', FALSE, '2024-03-23 14:20:00', 9),
(10, 'bangonlovesam', 'lovesamsui', TRUE, '2024-03-17 11:20:00', 10);

INSERT INTO brand (brand_id, brand_name) VALUES 
(1, 'Nike'),
(2, 'Adidas'),
(3, 'Birkenstock'),
(4, 'Palm Angels'),
(5, 'Burberry'),
(6, 'Crocs'),
(7, 'Chanel'),
(8, 'Alexander McQueen'),
(9, 'Gucci'),
(10, 'Hermes'),
(11, 'Bottega Veneta'),
(12, 'Balenciaga'),
(13, 'Dr. Martens');
    
INSERT INTO category(category_id, category_name) VALUES 
(1, 'Sneakers'),
(2, 'Sports'),
(3, 'Dressed'),
(4, 'Sandals');
    
INSERT INTO category_image(category_id, category_image) VALUES 
(1, 'https://imgix.bustle.com/uploads/image/2021/10/6/ecfa70b5-f784-43c5-adb9-46b20ef2848c-img_1230.JPG?w=2000&h=1090&fit=crop&crop=focalpoint&fp-x=0.632&fp-y=0.753&blend=000000&blendAlpha=45&blendMode=normal'),
(1, 'https://www.snkrsprints.com/cdn/shop/files/Shopify_Banner_2.jpg?v=1672004662&width=1500'),
(1, 'https://mir-s3-cdn-cf.behance.net/projects/404/6c1669170450969.Y3JvcCwxOTk5LDE1NjQsMCwyMTc.jpg'),
(2, 'https://www.themanual.com/wp-content/uploads/sites/9/2020/08/adidas.jpg?fit=800%2C800&p=1'),
(2, 'https://static.nike.com/a/images/f_auto,cs_srgb/w_1920,c_limit/tpqid8vgfey6m4ke86te/nike-joyride.jpg'),
(2, 'https://elle.in/wp-content/uploads/2023/09/Nike-Pegasus-40-Road-Running_1320x717_crop_center.webp'),
(3, 'https://languageshoes.com/wp-content/uploads/2021/12/Loafers-1-min-scaled.jpg'),
(3, 'https://peachflores.com/cdn/shop/collections/Loafers_banner.jpg?v=1677056678'),
(3, 'https://kongbrothers.com/wp-content/uploads/2023/06/Knight-Website-Banner.jpg'),
(4, 'https://www.teva.com/on/demandware.static/-/Sites/default/dw21a94740/teva-us/images/slot/home/2024/03/S24_NavTiles_M_Sandals.jpeg'),
(4, 'https://storage.googleapis.com/forklift/page/picture/6417acfe057e1300014a043c/Groove_Landing_page_banner.png'),
(4, 'https://storage.googleapis.com/forklift/store_category/picture/6417ad83057e1300014a043e/sandals_banner.jpg');

INSERT INTO size(size_id, size_name) VALUES 
(1, 'UK 3'),
(2, 'UK 3.5'),
(3, 'UK 4'),
(4, 'UK 4.5'),
(5, 'UK 5'),
(6, 'UK 5.5'),
(7, 'UK 6'),
(8, 'UK 6.5'),
(9, 'UK 7'),
(10, 'UK 7.5'),
(11, 'UK 8'),
(12, 'UK 8.5'),
(13, 'UK 9'),
(14, 'UK 9.5'),
(15, 'UK 10'),
(16, 'UK 10.5'),
(17, 'UK 11'),
(18, 'UK 11.5'),
(19, 'UK 12'),
(20, 'UK 12.5');
    
INSERT INTO product (prod_id, prod_name, prod_desc, brand_id, category_id, prod_gender, prod_price, prod_image) VALUES 
(1, 'Travis Scott x Fragment', "A collaborative take on the Air Jordan 1 Low between La Flame and Japanese designer Hiroshi Fujiwara through his company Fragment. The sneaker draws inspiration from the 1985 sample 'Air Jordan 1 Royal Press' with its white and blue leather.",
1, 1,'M', 49900, 'https://images.stockx.com/images/Air-Jordan-1-Low-fragment-design-x-Travis-Scott-Product.jpg?fit=fill&bg=FFFFFF&w=700&h=500&fm=webp&auto=compress&q=90&dpr=2&trim=color&updated_at=1629307046'),
(2, "Air Jordan 1 Low x Travis Scott 'Sail and Ridgerock'", "The collab features a brown nubuck upper that’s offset by white leather overlay panels. The shoe’s standout detail is the sail reverse Swoosh branding on the lateral side and 'Cactus Jack' branding stamped on the tongue and medial side. The look is completed with a sail midsole and a brown outsole.",
1, 1,'M', 29900, 'https://images.stockx.com/360/Air-Jordan-1-Retro-Low-OG-SP-Travis-Scott-Reverse-Mocha/Images/Air-Jordan-1-Retro-Low-OG-SP-Travis-Scott-Reverse-Mocha/Lv2/img01.jpg?fm=webp&auto=compress&w=480&dpr=2&updated_at=1662135192&h=320&q=60'),
(3, 'Nike Dunk Low', "Created for the hardwood but taken to the streets, the Nike Dunk Low Retro returns with crisp overlays and original team colours. This basketball icon channels '80s vibes with premium leather in the upper that looks good and breaks in even better. Modern footwear technology helps bring the comfort into the 21st century.",
1, 1,'M', 6900, 'https://images.stockx.com/images/Nike-Dunk-Low-Retro-White-Black-2021-Product.jpg?fit=fill&bg=FFFFFF&w=700&h=500&fm=webp&auto=compress&q=90&dpr=2&trim=color&updated_at=1633027409'),
(4, 'Jordan 4 Retro Travis Scott Cactus Jack', "Crafted with premium materials, including suede and mesh, these shoes offer durability and comfort. With its signature Cactus Jack branding, bold color accents, and Air cushioning, this limited edition release is a must-have for sneaker enthusiasts and collectors alike.",
1, 1,'M', 34900, 'https://images.stockx.com/images/Air-Jordan-4-Retro-Travis-Scott-Cactus-Jack-Product.jpg?fit=fill&bg=FFFFFF&w=700&h=500&fm=webp&auto=compress&q=90&dpr=2&trim=color&updated_at=1682532259'),
(5, 'Nike Dunk Low UNC', "the Nike Dunk Low GS ‘University Blue’ features a leather upper in a color-blocked design redolent of the shoe’s collegiate hardwood roots. A crisp white base is contrasted by a pastel blue finish on the shoe’s eyestay, Swoosh, and heel and forefoot overlays.",
1, 1,'W', 5900, 'https://images.stockx.com/images/Nike-Dunk-Low-UNC-2021-GS-Product.jpg?fit=fill&bg=FFFFFF&w=1200&h=857&fm=webp&auto=compress&dpr=2&trim=color&updated_at=1621444894&q=60'),
(6, 'Nike Air Force 1 Low Supreme Box Logo White', "The contrast of the monochromatic white leather shoe and the signature Supreme red box logo on the lateral heel creates a sleek, polished sneaker.",
1, 1, 'M', 9900, 'https://images.stockx.com/images/Nike-Air-Force-1-Low-Supreme-Box-Logo-White-Product.jpg?fit=fill&bg=FFFFFF&w=700&h=500&fm=webp&auto=compress&q=90&dpr=2&trim=color&updated_at=1689747933'),
(7, 'Adidas Yeezy Boost 350 Zebra', "The adidas Yeezy Boost 350 V2 Zebra is known as one of the most renowned colorways in the Yeezy line. It features a white and black marbled Primeknit upper with a white side-stripe and red 'SPLY-350' text. At the base, a cushioned Boost sole provides comfort and support.",
2, 1, 'M', 19900, 'https://images.stockx.com/images/adidas-Yeezy-Boost-350-V2-Zebra-Product.jpg?fit=fill&bg=FFFFFF&w=1200&h=857&fm=webp&auto=compress&dpr=2&trim=color&updated_at=1703165200&q=60'),
(8, 'Adidas Yeezy Boost 350 Blue Tint', "In a similar pattern to the renowned adidas Yeezy Boost 350 V2 Zebra, the adidas Yeezy Boost 350 V2 Blue Tint features a marbled grey Primeknit upper with a light grey side stripe that is decorated with bright red SPLY-350 text. At the base, a Blue Tint semi-translucent Boost sole adds cushioning and support.",
2, 1, 'M', 16900, 'https://images.stockx.com/images/adidas-Yeezy-Boost-350-V2-Blue-Tint-Product.jpg?fit=fill&bg=FFFFFF&w=1200&h=857&fm=webp&auto=compress&dpr=2&trim=color&updated_at=1703859855&q=60'),
(9, 'Adidas Yeezy Boost 350 Black Red ', "The adidas Yeezy Boost 350 V2 Black Red is one of the first original colorways to drop after the silouhette’s debut in 2016. Despite its original 2017 release, the 350 V2 Black Red restocked in 2020, giving fans a second chance at grabbing a pair at retail.",
2, 1, 'M', 29000, 'https://images.stockx.com/images/adidas-Yeezy-Boost-350-V2-Core-Black-Red-2017-Product.jpg?fit=fill&bg=FFFFFF&w=1200&h=857&fm=webp&auto=compress&dpr=2&trim=color&updated_at=1704290365&q=60'),
(10, 'Adidas Yeezt Boost 350 Feozen Yellow', "The Semi Frozen Yellow adidas Yeezy Boost 350 V2 was rumored as early as May of 2017-some blogs even claimed they would be mostly glow-in-the-dark-but it was when photos of Kanye West wearing them first surfaced on the web later in the year that confirmed the release. This colorway steps outside of the comfort zone of previous 350 Yeezy sneaker releases, which have remained subtle and mostly neutral primary colors and bright accents.",
2, 1, 'M', 13900, 'https://images.stockx.com/360/adidas-Yeezy-Boost-350-V2-Semi-Frozen-Yellow/Images/adidas-Yeezy-Boost-350-V2-Semi-Frozen-Yellow/Lv2/img01.jpg?fm=webp&auto=compress&w=480&dpr=2&updated_at=1708039627&h=320&q=60'),
(11, 'Nike Revolution 7 Black', "We loaded the Revolution 7 with the sort of soft cushioning and support that might change your running world. Stylish as ever, comfortable when the rubber meets the road and performance-driven for your desired pace, it's an evolution of a fan favourite that offers a soft, smooth ride.",
1, 2,'M', 5900, 'https://images.stockx.com/images/Nike-Flex-Experience-RN-7-Black.jpg?fit=fill&bg=FFFFFF&w=480&h=320&fm=webp&auto=compress&dpr=2&trim=color&updated_at=1642460009&q=60'),
(12, 'Nike Revolution 7 Light Armoury Blue', "We loaded the Revolution 7 with the sort of soft cushioning and support that might change your running world. Stylish as ever, comfortable when the rubber meets the road and performance-driven for your desired pace, it's an evolution of a fan favourite that offers a soft, smooth ride.",
1, 2,'M', 4900, 'https://images.stockx.com/images/Nike-Revolution-5-Ozone-Blue.jpg?fit=fill&bg=FFFFFF&w=480&h=320&fm=jpg&auto=compress&dpr=2&trim=color&updated_at=1626899807&q=60'),
(13, 'Nike Vaporfly 3 Volt', 'Catch ‘em if you can. Giving you race-day speed to conquer any distance, the Nike Vaporfly 3 is made for the chasers, the racers, the elevated pacers who can’t turn down the thrill of the pursuit. We reworked the leader of the super shoe pack and tuned the engine underneath to help you chase personal bests from a 10K to marathon. From elite runners to those new to racing, this versatile road-racing workhorse is for those who see speed as a gateway to more miles and more seemingly uncatchable highs.',
1, 2,'M', 6900, 'https://images.stockx.com/images/Nike-ZoomX-Vaporfly-3-Ekiden-Pack.jpg?fit=fill&bg=FFFFFF&w=700&h=500&fm=webp&auto=compress&q=90&dpr=2&trim=color&updated_at=1705057346?height=78&width=78'),
(14, 'Adidas Pure Boost Go White Mystery Ink', "Built to handle curbs, corners and uneven sidewalks, these natural running shoes have an expanded landing zone and a heel plate for added stability. A lightweight and stretchy knit upper supports your native stride. Energised cushioning works with the flexible outsole to give you a smooth and comfortable ride.",
2, 2, 'W', 6900, 'https://images.stockx.com/images/adidas-Pure-Boost-Go-Running-White-Mystery-Ink-W.png?fit=fill&bg=FFFFFF&w=700&h=500&fm=webp&auto=compress&q=90&dpr=2&trim=color&updated_at=1626898980'),
(15, 'Adidas Futurecraft 4D White Ash Green', "The Ash Green adidas Futurecraft 4D features an upper crafted from Primeknit material, which offers breathability and flexibility. The shoe's midsole features adidas' 4D printing technology with a lattice-like structure, providing responsive cushioning, impact reduction, and stability. The shoe's outsole is made of Continental rubber, offering traction and durability. The sneaker's design is finished off with adidas Three Stripes branding on the lateral sides and tongue.",
2, 2, 'M', 13900, 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSa_BScCuoBCHge6Ipk8qt0RWQVBaG572ns9wYc1tR61Q&s'),
(16, 'Adidas AM4PAR Paris Tactile Green', "Come with a 'Paris tactile Green'",
2, 2, 'W', 5900, 'https://images.stockx.com/images/Adidas-AM4PAR-Paris-Tactile-Green-W.png?fit=fill&bg=FFFFFF&w=480&h=320&fm=jpg&auto=compress&dpr=2&trim=color&updated_at=1606933132&q=60'),
(17, 'Adidas Swift RunGrey Two Icey Pink', "Made with a series of recycled materials, this upper features at least 50% recycled content. This product represents just one of our solutions to help end plastic waste.",
2, 2, 'W', 6900, 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQQ48R0jhiw3BUUVQMMpNao0aiggjKEdcQaLschbNOU5w&s'),
(18, 'Nike P-6000 Premium Triple Black', "The Nike P-6000 combines Pegasus sneakers from the past to take the look of running shoes from the early 2000s to the next level. It combines sporty lines with breathable mesh and overlays. It's the perfect blend of style and comfort that turns heads. Plus, foam cushioning adds a treadmill-inspired high profile and adds incredible cushioning.",
1, 2, 'M', 8900, 'https://images.stockx.com/images/Nike-P-6000-Premium-Triple-Black-Product.jpg?fit=fill&bg=FFFFFF&w=1200&h=857&fm=webp&auto=compress&dpr=2&trim=color&updated_at=1705684047&q=60'),
(19, 'Nike LD Waffle SF Sacai Fragment Grey', "The Nike LDWaffle sacai Fragment Grey features a grey mesh upper with layered suede overlays and white leather doubled Swooshes. On the side of the doubled sole, both sacai and Fragment branding is printed in black. From there, a doubled tongue with woven labels completes the design.",
1, 2, 'M', 12900, 'https://images.stockx.com/360/Nike-LD-Waffle-Sacai-White-Grey/Images/Nike-LD-Waffle-Sacai-White-Grey/Lv2/img01.jpg?fm=webp&auto=compress&w=480&dpr=2&updated_at=1635256320&h=320&q=60'),
(20, 'Adidas Energy Boost ESM Running White', "These women's shoes are built to run. With energy-returning boost™ in the midsole, they have a cushioned yet responsive feel that helps you push through every mile. Featuring TORSION® SYSTEM midfoot support and a durable ADIWEAR™ outsole.",
2, 2, 'W', 5900, 'https://images.stockx.com/images/Adidas-Energy-Boost-ESM-Running-White.jpg?fit=fill&bg=FFFFFF&w=700&h=500&fm=webp&auto=compress&q=90&dpr=2&trim=color&updated_at=1606937324'),
(21, 'Chanel Loafers Black Corduroy', 'A timeless blend of luxury and comfort, crafted with premium leather and adorned with the iconic CC logo, perfect for adding a touch of sophistication to any outfit.',
7, 3,'M', 69000, 'https://images.stockx.com/images/Chanel-Loafers-Black-Corduroy.jpg?fit=fill&bg=FFFFFF&w=480&h=320&fm=webp&auto=compress&dpr=2&trim=color&updated_at=1679513108&q=60'),
(22, 'Chanel Quilted Tab Loafers Black Leather', 'Stand out from the crowd with these Chanel quilted leather loafers. Comes with a striking all-black elegance, exuding sophistication and beauty. ',
7, 3,'M', 99900, 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQhy53_eyFX8PCScMbE6G4xt-_uDTSnCFrzmTsywlHicw&s'),
(23, 'Chanel Quilted Tab Loafers White Leather', 'Stand out from the crowd with these Chanel quilted leather loafers. Comes with a striking all-white elegance, exuding sophistication and beauty.',
7, 3,'M', 99900, 'https://images.stockx.com/images/Chanel-Quilted-Tab-Loafers-White-Leather.jpg?fit=fill&bg=FFFFFF&w=1200&h=857&fm=webp&auto=compress&dpr=2&trim=color&updated_at=1660332018&q=60'),
(24, 'Gucci Jordaan Loafer Black Leather', "The Gucci Jordaan is our new Horsebit loafer with a slimmer shape and Horsebit.",
9, 3, 'M', 34900, 'https://images.stockx.com/360/Gucci-Jordaan-Loafer-Black-Leather/Images/Gucci-Jordaan-Loafer-Black-Leather/Lv2/img01.jpg?fm=webp&auto=compress&w=480&dpr=2&updated_at=1700234887&h=320&q=60'),
(25, 'Bottega Veneta Croc-Effect Leather Loafer Yellow', "New from Bottega Veneta, the Mostra loafer pumps are defined by their glossy croc-effect leather and curved block heels. Made in Italy, this pair features antique golden hardware across the vamps and has a pebbled rubber sole.",
11, 3, 'W', 39900, 'https://images.stockx.com/images/Bottega-Veneta-Croc-Effect-Leather-Loafer-Yellow-Womens.jpg?fit=fill&bg=FFFFFF&w=1200&h=857&fm=webp&auto=compress&dpr=2&trim=color&updated_at=1700106209&q=60'),
(26, 'Gucci Marmont Matelassé Loafer White', "Features Gucci calfskin matelasse GG Marmont Espadrille Slippers, these lovely espadrilles are crafted of chevron quilted calfskin leather in white, with the iconic aged gold GG logo on the top, included dust bag.",
9, 3, 'W', 29900, 'https://images.stockx.com/images/Gucci-Marmont-Matelasse-Loafers-White-Womens.jpg?fit=fill&bg=FFFFFF&w=1200&h=857&fm=webp&auto=compress&dpr=2&trim=color&updated_at=1704960755&q=60'),
(27, 'Dr. Martens Adrian Vintage Tassel Loafer Black Quilon', "Dr Marten's traditional unisex tassel loafer has been a subcultural classic since the 80s and is bursting with alternative heritage. Crafted to perfection in Dr Marten's original factory in Wollaston, it is made from Quilon, a premium vintage-style leather used to recreate the original Docs designs.",
13, 3, 'M', 11900, 'https://images.stockx.com/images/Dr-Martens-Adrian-Tassel-Loafer-Black-Quilon.jpg?fit=fill&bg=FFFFFF&w=1200&h=857&fm=webp&auto=compress&dpr=2&trim=color&updated_at=1649277572&q=60'),
(28, 'Alexander Mcqueen Wander Loafer Beige', "Inspired by British punk style, an exaggerated lugged sole amps up the attitude of this penny loafer made from shiny spazzolato calfskin leather.",
8, 3, 'W', 29900, 'https://images.stockx.com/images/Alexander-Mcqueen-Wander-Loafer-Beige-Womens.jpg?fit=fill&bg=FFFFFF&w=480&h=320&fm=webp&auto=compress&dpr=2&trim=color&updated_at=1704428579&q=60'),
(29, 'Balenciaga Coin Rim Loafer Black', "Balenciaga Coin Rim Loafers L20 leather loafers. Toe detail and square heel. Sole with logo. Embossed BB logo detail on the front.",
12, 3, 'M', 37900, 'https://images.stockx.com/images/Balenciaga-Coin-Rim-Loafer-Black.jpg?fit=fill&bg=FFFFFF&w=1200&h=857&fm=webp&auto=compress&dpr=2&trim=color&updated_at=1693370098&q=60'),
(30, 'Hermes Hour Loafer Noir Calfskin Leather', "Loafer in glazed calfskin with iconic 'H' cut-out detail. For a comfortable modern look.",
10, 3, 'M', 49900, 'https://images.stockx.com/images/Hermes-Hour-Loafer-Noir-Calfskin-Leather.jpg?fit=fill&bg=FFFFFF&w=1200&h=857&fm=webp&auto=compress&dpr=2&trim=color&updated_at=1690619867&q=60'),
(31, 'Birkenstock Arizona Birko-Flor Black', 'An icon of timeless design and legendary comfort, the Arizona sandal has been defining style since 1973. The laid-back look comes in durable Birkibuc® for a brushed, leather-like finish. Complete with legendary BIRKENSTOCK design elements, like a contoured cork-latex footbed for the ultimate in support.',
3, 4,'M', 4900, 'https://images.stockx.com/360/Birkenstock-Arizona-Birko-Flor-Black/Images/Birkenstock-Arizona-Birko-Flor-Black/Lv2/img01.jpg?fm=webp&auto=compress&w=480&dpr=2&updated_at=1708442780&h=320&q=60'),
(32, 'Gucci Web Slide Sandal Black', 'A distinctive House code, the green and red Web is reimagined in a pop inspired take on this flat sandal, a slip-on design crafted from black rubber.',
9, 4,'M', 12900, 'https://images.stockx.com/images/Gucci-Web-Slide-Sandal-Black-Product.jpg?fit=fill&bg=FFFFFF&w=1200&h=857&fm=webp&auto=compress&dpr=2&trim=color&updated_at=1614568255&q=60'),
(33, 'Adidas Yeezy Slide Onyx', "The adidas Yeezy Slides 'Onyx' (Black) are stylish and comfortable slip-on sandals. They feature a sleek all-black colorway with a molded EVA foam construction for cushioning. The Yeezy branding adds a touch of luxury, making them a popular choice for both casual wear and lounging in comfort.",
2, 4,'M', 3900, 'https://images.stockx.com/images/adidas-Yeezy-Slide-Black-Product.jpg?fit=fill&bg=FFFFFF&w=700&h=500&fm=webp&auto=compress&q=90&dpr=2&trim=color&updated_at=1646687426'),
(34, 'Hermes Oran Sandal Jaune Curcuma Epsom Calfskin Leather', "Sandal in Box calfskin with iconic 'H' cut-out. An iconic Hermès style, this silhouette is an essential piece in every wardrobe.",
10, 4, 'M', 29900, 'https://images.stockx.com/images/Hermes-Oran-Sandal-Jaune-Curcuma-Epsom-Calfskin-Leather.jpg?fit=fill&bg=FFFFFF&w=1200&h=857&fm=webp&auto=compress&dpr=2&trim=color&updated_at=1663776374&q=60'),
(35, 'Adidas Yeezy Slide Bone', "Adidas Yeezy Slides Bone are stylish and comfortable slip-on sandals. Made of injected EVA foam, these shoes offer plenty of foot support and are a popular choice for leisurewear.",
2, 4, 'M', 4900, 'https://images.stockx.com/images/Yeezy-Slide-Bone-Product.jpg?fit=fill&bg=FFFFFF&w=700&h=500&fm=webp&auto=compress&q=90&dpr=2&trim=color&updated_at=1608522495'),
(36, 'Gucci Slide Pink Rubber', "The Gucci Slide Pink Rubber (Women's) is an Italian-made slide that boasts an all-Pink colorway and iconic Gucci branding. Crafted from premium rubber, the slide features a molded footbed that supports the foot's natural arch.",
9, 4, 'W', 12900, 'https://images.stockx.com/images/Gucci-Slide-Pink-Rubber-W-Product.jpg?fit=fill&bg=FFFFFF&w=1200&h=857&fm=webp&auto=compress&dpr=2&trim=color&updated_at=1622046340&q=60'),
(37, 'Hermes Chypre Sandal Noir Calfskin Leather', "Techno-sandal in calfskin with anatomical rubber sole and adjustable strap. A sleek design for a comfortable casual look.",
10, 4, 'W', 34900, 'https://images.stockx.com/360/Hermes-Chypre-Sandal-Noir-Leather-W/Images/Hermes-Chypre-Sandal-Noir-Leather-W/Lv2/img01.jpg?fm=webp&auto=compress&w=480&dpr=2&updated_at=1677140571&h=320&q=60'),
(38, 'Palm Angels PA Logo Slide Beige', "Designed for casual wear, these pool slides from Palm Angels are rendered in beige as a warm-weather footwear staple. The strap features the brand's initials for a signature look.",
4, 4, 'M', 9900, 'https://images.stockx.com/images/Palm-Angels-PA-Logo-Slide-Beige.jpg?fit=fill&bg=FFFFFF&w=1200&h=857&fm=webp&auto=compress&dpr=2&trim=color&updated_at=1706689638&q=60'),
(39, 'Balenciaga Logo Slide Fluo Orange', "Fuelled by futurism, this rendition of the distinctive Balenciaga Mold arrives in fluro orange. A summer staple shot to dizzying new heights, the sandal is crafted entirely from rubber, then overlaid with unique curved lines and ‘BB’ debossing for a touch of textural intrigue.",
12, 4, 'M', 12900, 'https://images.stockx.com/images/Balenciaga-Logo-Slide-Fluo-Orange-Product.jpg?fit=fill&bg=FFFFFF&w=1200&h=857&fm=webp&auto=compress&dpr=2&trim=color&updated_at=1710833642&q=60'),
(40, 'Burberry Embroidered Logo Slide Black', "Slip into something a little more elegant with these mesh slides from Burberry. This pair features an embroidered logo and flat sole for maximum comfort. Summer, we're ready.",
5, 4, 'W', 11900, 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTleYIXnecIrB_7HdJYiYrj1HQ7L5HalW6oeV008L3eqg&s'),
(41, 'Crocs Classic Clog Lightning McQueen', "Get ready for another lap because Lightning McQueen is back again! Each pair features Cars graphics and long-lasting LEDs that light up with every step so you can speed off in style.",
6, 4, 'M', 2900, 'https://images.stockx.com/images/Crocs-Classic-Clog-Lightning-McQueen-Product.jpg?fit=fill&bg=FFFFFF&w=1200&h=857&fm=webp&auto=compress&dpr=2&trim=color&updated_at=1620405722&q=60');

INSERT INTO product_item(prod_id, size_id, quantity, sku) 
SELECT p.prod_id, s.size_id, FLOOR(RAND() * 10), CONCAT('P', p.prod_id, '-S', s.size_id)
FROM product p
CROSS JOIN size s;

INSERT INTO manage_account(super_id, acc_id, action, action_change, action_date) VALUES 
(1001, 1002, 'Update', 'Address', '2024-03-26'),
(1002, 1003, 'Delete', NULL, '2024-03-25'),
(1003, 1004, 'Update', 'Email', '2024-03-24'),
(1004, 1005, 'Update', 'Last Name', '2024-03-23'),
(1005, 1006, 'Update', 'First Name', '2024-03-22'),
(1006, 1007, 'Delete', NULL, '2024-03-21'),
(1007, 1008, 'Update', 'IsAdmin', '2024-03-20'),
(1008, 1009, 'Update', 'Address', '2024-03-19'),
(1009, 1010, 'Delete', NULL, '2024-03-18'),
(1010, 1001, 'Update', 'Email', '2024-03-17');
    
INSERT INTO manage_product(super_id, prod_id, action, action_change, action_date) VALUES 
(1001, 10001, 'Update', 'Name', '2024-03-26'),
(1002, 10002, 'Delete', NULL, '2024-03-25'),
(1003, 10003, 'Update', 'Discript', '2024-03-24'),
(1004, 20001, 'Update', 'Name', '2024-03-23'),
(1005, 20002, 'Update', 'Discript', '2024-03-22'),
(1006, 20003, 'Delete', NULL, '2024-03-21'),
(1007, 30001, 'Update', 'Name', '2024-03-20'),
(1008, 30002, 'Update', 'Discript', '2024-03-19'),
(1009, 40001, 'Delete', NULL, '2024-03-18'),
(1010, 40002, 'Update', 'Price', '2024-03-17');