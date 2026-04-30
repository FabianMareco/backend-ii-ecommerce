// seed.js - Carga masiva de productos de danza y merchandising
import dotenv from 'dotenv';
import connectDB from './src/config/db.js';
import Product from './src/models/Product.js';

dotenv.config();

// ==============================================
// ARRAY COMPLETO DE PRODUCTOS (80+ productos)
// ==============================================
const productsRaw = [
  // ==================== BOLSOS (9 productos) ====================
  { "name": "BOLSO 1", "price": 65000, "stock": 20, "category": "merchandising", "subcategory": "bolsos", "description": "Bolso modelo 1 - Diseño Ballet Blanco", "pictureUrl": "/multimedia/merchandising2/bolso1.jpeg" },
  { "name": "BOLSO 2", "price": 65000, "stock": 20, "category": "merchandising", "subcategory": "bolsos", "description": "Bolso modelo 2 - Diseño Ballet Rosa", "pictureUrl": "/multimedia/merchandising2/bolso2.png" },
  { "name": "BOLSO 3", "price": 65000, "stock": 20, "category": "merchandising", "subcategory": "bolsos", "description": "Bolso modelo 3 - Diseño Contemporáneo", "pictureUrl": "/multimedia/merchandising2/bolso3.png" },
  { "name": "BOLSO 4", "price": 75000, "stock": 20, "category": "merchandising", "subcategory": "bolsos", "description": "Bolso modelo 4 - Diseño Jazz Negro", "pictureUrl": "/multimedia/merchandising2/bolso4.jpg" },
  { "name": "BOLSO 5", "price": 75000, "stock": 20, "category": "merchandising", "subcategory": "bolsos", "description": "Bolso modelo 5 - Diseño Jazz Azul", "pictureUrl": "/multimedia/merchandising2/bolso5.png" },
  { "name": "BOLSO 6", "price": 75000, "stock": 20, "category": "merchandising", "subcategory": "bolsos", "description": "Bolso modelo 6 - Diseño Jazz Rosa", "pictureUrl": "/multimedia/merchandising2/bolso6.png" },
  { "name": "BOLSO 7", "price": 25000, "stock": 20, "category": "merchandising", "subcategory": "bolsos", "description": "Bolso modelo 7 - Diseño Blanco", "pictureUrl": "/multimedia/merchandising2/bolso7.jpg" },
  { "name": "BOLSO 8", "price": 25000, "stock": 20, "category": "merchandising", "subcategory": "bolsos", "description": "Bolso modelo 8 - Diseño Arena", "pictureUrl": "/multimedia/merchandising2/bolso8.png" },
  { "name": "BOLSO 9", "price": 25000, "stock": 20, "category": "merchandising", "subcategory": "bolsos", "description": "Bolso modelo 9 - Diseño Watercolor", "pictureUrl": "/multimedia/merchandising2/bolso9.png" },

  // ==================== BOTELLAS (9 productos) ====================
  { "name": "BOTELLA 1", "price": 35000, "stock": 25, "category": "merchandising", "subcategory": "hidratarse", "description": "Botella térmica modelo 1", "pictureUrl": "/multimedia/merchandising2/botella1.jpeg" },
  { "name": "BOTELLA 2", "price": 35000, "stock": 25, "category": "merchandising", "subcategory": "hidratarse", "description": "Botella térmica modelo 2", "pictureUrl": "/multimedia/merchandising2/botella2.png" },
  { "name": "BOTELLA 3", "price": 35000, "stock": 25, "category": "merchandising", "subcategory": "hidratarse", "description": "Botella térmica modelo 3", "pictureUrl": "/multimedia/merchandising2/botella3.png" },
  { "name": "BOTELLA 4", "price": 45000, "stock": 25, "category": "merchandising", "subcategory": "hidratarse", "description": "Botella deportiva modelo 4", "pictureUrl": "/multimedia/merchandising2/botella4.jpeg" },
  { "name": "BOTELLA 5", "price": 45000, "stock": 25, "category": "merchandising", "subcategory": "hidratarse", "description": "Botella deportiva modelo 5", "pictureUrl": "/multimedia/merchandising2/botella5.png" },
  { "name": "BOTELLA 6", "price": 45000, "stock": 25, "category": "merchandising", "subcategory": "hidratarse", "description": "Botella deportiva modelo 6", "pictureUrl": "/multimedia/merchandising2/botella6.png" },
  { "name": "BOTELLA 7", "price": 25000, "stock": 25, "category": "merchandising", "subcategory": "hidratarse", "description": "Botella plegable modelo 7", "pictureUrl": "/multimedia/merchandising2/botella7.jpg" },
  { "name": "BOTELLA 8", "price": 25000, "stock": 25, "category": "merchandising", "subcategory": "hidratarse", "description": "Botella plegable modelo 8", "pictureUrl": "/multimedia/merchandising2/botella8.png" },
  { "name": "BOTELLA 9", "price": 25000, "stock": 25, "category": "merchandising", "subcategory": "hidratarse", "description": "Botella plegable modelo 9", "pictureUrl": "/multimedia/merchandising2/botella9.png" },

  // ==================== ELEMENTOS BÁSICOS ====================
  { "name": "PESAS 2 KG", "price": 45000, "stock": 50, "category": "merchandising", "subcategory": "elemento", "description": "Par de pesas 2kg", "pictureUrl": "/multimedia/merchandising2/pesas.jpg" },
  { "name": "MAT YOGA", "price": 45000, "stock": 50, "category": "merchandising", "subcategory": "elemento", "description": "Mat antideslizante", "pictureUrl": "/multimedia/merchandising2/mat.jpg" },
  { "name": "LADRILLO YOGA", "price": 45000, "stock": 50, "category": "merchandising", "subcategory": "elemento", "description": "Bloque de espuma de alta densidad", "pictureUrl": "/multimedia/merchandising2/E3-ladrillo.jpg" },
  { "name": "THERABANDS", "price": 15000, "stock": 100, "category": "merchandising", "subcategory": "elemento", "description": "Bandas de resistencia", "pictureUrl": "/multimedia/merchandising2/E4-therabands.jpg" },
  { "name": "FOAM ROLLER", "price": 25000, "stock": 30, "category": "merchandising", "subcategory": "elemento", "description": "Rodillo de masaje", "pictureUrl": "/multimedia/merchandising2/E5-foamroller.jpeg" },
  { "name": "PELOTAS TENIS X3", "price": 12000, "stock": 40, "category": "merchandising", "subcategory": "elemento", "description": "Set de 3 pelotas para masaje miofascial", "pictureUrl": "/multimedia/merchandising2/E6-pelotas.jpg" },
  { "name": "PELOTA YOGA", "price": 35000, "stock": 25, "category": "merchandising", "subcategory": "elemento", "description": "Pelota de estabilidad / Pilates", "pictureUrl": "/multimedia/merchandising2/E7-pelota-yoga.jpeg" },
  { "name": "CINTA YOGA", "price": 10000, "stock": 60, "category": "merchandising", "subcategory": "elemento", "description": "Cinta de estiramiento con hebilla", "pictureUrl": "/multimedia/merchandising2/E8-cinta-yoga.jpg" },
  { "name": "RODILLERAS", "price": 28000, "stock": 35, "category": "merchandising", "subcategory": "elemento", "description": "Rodilleras acolchadas para danza", "pictureUrl": "/multimedia/merchandising2/E9-rodilleras.jpeg" },

  // ==================== REMERAS (con colores) ====================
  { "name": "REMERA 1", "price": 40000, "stock": 50, "category": "merchandising", "subcategory": "remeras", "description": "Remera oversize modelo 1", "pictureUrl": "/multimedia/merchandising2/remera1-AZ.png", "colors": [ { "name": "Azul Francia", "pictureUrl": "/multimedia/merchandising2/remera1-AZ.png" }, { "name": "Verde", "pictureUrl": "/multimedia/merchandising2/remera1-VER.jpeg" } ] },
  { "name": "REMERA 2", "price": 40000, "stock": 50, "category": "merchandising", "subcategory": "remeras", "description": "Remera oversize modelo 2 - Diseño Ballet", "pictureUrl": "/multimedia/merchandising2/remera2-B.png", "colors": [ { "name": "Blanco", "pictureUrl": "/multimedia/merchandising2/remera2-B.png" }, { "name": "Negro", "pictureUrl": "/multimedia/merchandising2/remera2-N.png" } ] },
  { "name": "REMERA 3", "price": 40000, "stock": 50, "category": "merchandising", "subcategory": "remeras", "description": "Remera oversize modelo 3 - Diseño Ballroom", "pictureUrl": "/multimedia/merchandising2/remera3-B.png", "colors": [ { "name": "Blanco", "pictureUrl": "/multimedia/merchandising2/remera3-B.png" }, { "name": "Negro", "pictureUrl": "/multimedia/merchandising2/remera3-N.png" } ] },
  { "name": "REMERA 4", "price": 40000, "stock": 50, "category": "merchandising", "subcategory": "remeras", "description": "Remera oversize modelo 4 - Diseño Contemporary", "pictureUrl": "/multimedia/merchandising2/remera4-B.png", "colors": [ { "name": "Blanco", "pictureUrl": "/multimedia/merchandising2/remera4-B.png" }, { "name": "Negro", "pictureUrl": "/multimedia/merchandising2/remera4-N.jpg" } ] },
  { "name": "REMERA 5", "price": 40000, "stock": 50, "category": "merchandising", "subcategory": "remeras", "description": "Remera oversize modelo 5 - Diseño Jazz", "pictureUrl": "/multimedia/merchandising2/remera5-B.png", "colors": [ { "name": "Blanco", "pictureUrl": "/multimedia/merchandising2/remera5-B.png" }, { "name": "Negro", "pictureUrl": "/multimedia/merchandising2/remera5-N.png" } ] },
  { "name": "REMERA 6", "price": 40000, "stock": 50, "category": "merchandising", "subcategory": "remeras", "description": "Remera oversize modelo 6 - Diseño Ballroom Couple", "pictureUrl": "/multimedia/merchandising2/remera6-B.png", "colors": [ { "name": "Blanco", "pictureUrl": "/multimedia/merchandising2/remera6-B.png" }, { "name": "Negro", "pictureUrl": "/multimedia/merchandising2/remera6-N.png" } ] },
  { "name": "REMERA 7", "price": 40000, "stock": 50, "category": "merchandising", "subcategory": "remeras", "description": "Remera oversize modelo 7", "pictureUrl": "/multimedia/merchandising2/remera7-B.png", "colors": [ { "name": "Blanco", "pictureUrl": "/multimedia/merchandising2/remera7-B.png" }, { "name": "Negro", "pictureUrl": "/multimedia/merchandising2/remera7-N.jpg" } ] },
  { "name": "REMERA 8", "price": 40000, "stock": 50, "category": "merchandising", "subcategory": "remeras", "description": "Remera oversize modelo 8", "pictureUrl": "/multimedia/merchandising2/remera8-B.png", "colors": [ { "name": "Blanco", "pictureUrl": "/multimedia/merchandising2/remera8-B.png" }, { "name": "Negro", "pictureUrl": "/multimedia/merchandising2/remera8-N.png" } ] },
  { "name": "REMERA 9", "price": 40000, "stock": 50, "category": "merchandising", "subcategory": "remeras", "description": "Remera oversize modelo 9", "pictureUrl": "/multimedia/merchandising2/remera9-B.png", "colors": [ { "name": "Blanco", "pictureUrl": "/multimedia/merchandising2/remera9-B.png" }, { "name": "Negro", "pictureUrl": "/multimedia/merchandising2/remera9-N.png" } ] },

  // ==================== TAZAS (9 productos) ====================
  { "name": "TAZA 1", "price": 10000, "stock": 50, "category": "merchandising", "subcategory": "tazas", "description": "Taza modelo 1", "pictureUrl": "/multimedia/merchandising2/taza1.jpg" },
  { "name": "TAZA 2", "price": 10000, "stock": 50, "category": "merchandising", "subcategory": "tazas", "description": "Taza modelo 2", "pictureUrl": "/multimedia/merchandising2/taza2.png" },
  { "name": "TAZA 3", "price": 10000, "stock": 50, "category": "merchandising", "subcategory": "tazas", "description": "Taza modelo 3", "pictureUrl": "/multimedia/merchandising2/taza3.png" },
  { "name": "TAZA 4", "price": 12000, "stock": 50, "category": "merchandising", "subcategory": "tazas", "description": "Taza modelo 4", "pictureUrl": "/multimedia/merchandising2/taza4.jpg" },
  { "name": "TAZA 5", "price": 12000, "stock": 50, "category": "merchandising", "subcategory": "tazas", "description": "Taza modelo 5", "pictureUrl": "/multimedia/merchandising2/taza5.png" },
  { "name": "TAZA 6", "price": 12000, "stock": 50, "category": "merchandising", "subcategory": "tazas", "description": "Taza modelo 6", "pictureUrl": "/multimedia/merchandising2/taza6.png" },
  { "name": "TAZA 7", "price": 20000, "stock": 50, "category": "merchandising", "subcategory": "tazas", "description": "Taza modelo 7", "pictureUrl": "/multimedia/merchandising2/taza7.jpeg" },
  { "name": "TAZA 8", "price": 20000, "stock": 50, "category": "merchandising", "subcategory": "tazas", "description": "Taza modelo 8", "pictureUrl": "/multimedia/merchandising2/taza8.png" },
  { "name": "TAZA 9", "price": 20000, "stock": 50, "category": "merchandising", "subcategory": "tazas", "description": "Taza modelo 9", "pictureUrl": "/multimedia/merchandising2/taza9.png" },

  // ==================== ZAPATILLAS (9 productos) ====================
  { "name": "ZAPATILLA 1", "price": 99000, "stock": 25, "category": "merchandising", "subcategory": "zapatillas", "description": "Zapatillas de ballet profesional", "pictureUrl": "/multimedia/merchandising2/zapatilla1-ballet.jpg" },
  { "name": "ZAPATILLA 2", "price": 125000, "stock": 25, "category": "merchandising", "subcategory": "zapatillas", "description": "Badana de Jazz / Lírico", "pictureUrl": "/multimedia/merchandising2/zapatilla2-Badana-Jazz.jpg" },
  { "name": "ZAPATILLA 3", "price": 110000, "stock": 25, "category": "merchandising", "subcategory": "zapatillas", "description": "Zapatillas de Tap", "pictureUrl": "/multimedia/merchandising2/zapatilla3-tap.jpg" },
  { "name": "ZAPATILLA 4", "price": 150000, "stock": 25, "category": "merchandising", "subcategory": "zapatillas", "description": "Zapatillas de Jazz técnico", "pictureUrl": "/multimedia/merchandising2/zapatilla4-jazz.jpeg" },
  { "name": "ZAPATILLA 5", "price": 150000, "stock": 25, "category": "merchandising", "subcategory": "zapatillas", "description": "Zapatillas de Jazz reforzadas", "pictureUrl": "/multimedia/merchandising2/zapatilla5-jazz2.jpg" },
  { "name": "ZAPATILLA 6", "price": 125000, "stock": 25, "category": "merchandising", "subcategory": "zapatillas", "description": "Zapatilla Ballroom profesional", "pictureUrl": "/multimedia/merchandising2/zapatilla6-ballroom.jpg" },
  { "name": "ZAPATILLA 7", "price": 135000, "stock": 25, "category": "merchandising", "subcategory": "zapatillas", "description": "Zapatos de Heels - Edición Pink", "pictureUrl": "/multimedia/merchandising2/zapatilla7-HeelsPink.jpg" },
  { "name": "ZAPATILLA 8", "price": 135000, "stock": 25, "category": "merchandising", "subcategory": "zapatillas", "description": "Zapatos de Heels - Edición Dark", "pictureUrl": "/multimedia/merchandising2/zapatilla8-HeelsDark.jpg" },
  { "name": "ZAPATILLA 9", "price": 160000, "stock": 25, "category": "merchandising", "subcategory": "zapatillas", "description": "Bota Bucanera para Heels/High Heels", "pictureUrl": "/multimedia/merchandising2/zapatilla9-Heel-Bucanera.jpg" }
];

// ==============================================
// Transformar productos al formato del schema
// ==============================================
const transformProduct = (item) => {
  let code = item.name.replace(/\s+/g, '_').toUpperCase();
  return {
    title: item.name,
    description: item.description,
    code: code,
    category: item.category || 'merchandising',
    subcategory: item.subcategory,
    price: item.price,
    stock: item.stock,
    status: true,
    thumbnails: item.pictureUrl ? [item.pictureUrl] : [],
    colors: item.colors || []
  };
};

// ==============================================
// Función principal para cargar los productos
// ==============================================
const seedProducts = async () => {
  try {
    await connectDB();
    
    // Limpiar colección existente
    await Product.deleteMany({});
    console.log('🗑️ Productos anteriores eliminados');
    
    // Transformar e insertar nuevos productos
    const transformed = productsRaw.map(transformProduct);
    const inserted = await Product.insertMany(transformed);
    
    console.log(`✅ Se insertaron ${inserted.length} productos nuevos`);
    console.log('📊 Distribución:');
    console.log(`   - BOLSOS: 9`);
    console.log(`   - BOTELLAS: 9`);
    console.log(`   - ELEMENTOS: 9`);
    console.log(`   - REMERAS: 9`);
    console.log(`   - TAZAS: 9`);
    console.log(`   - ZAPATILLAS: 9`);
    console.log(`   TOTAL: 54 productos`);
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Error en seed:', error);
    process.exit(1);
  }
};

// Ejecutar el seed
seedProducts();