import express from 'express';
import cors from 'cors';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import mysql from 'mysql2/promise';
import multer from 'multer';
import XLSX from 'xlsx';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static('public'));

const dbConfig = {
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'inventory_system',
    port: 3306
};

// Configuración de Multer
const storage = multer.memoryStorage();
const upload = multer({ 
    storage: storage,
    limits: {
        fileSize: 10 * 1024 * 1024
    }
});

const local = multer.memoryStorage();

// Middleware de autenticación MEJORADO
const authenticateToken = async (req, res, next) => {
    try {
        const authHeader = req.headers['authorization'];
        const token = authHeader && authHeader.split(' ')[1];

        if (!token) {
            console.log('No token provided');
            return res.status(401).json({ error: 'Token de acceso requerido' });
        }

        const decoded = jwt.verify(token, 'your-secret-key');
        const connection = await mysql.createConnection(dbConfig);
        
        const [users] = await connection.execute(
            'SELECT id, username, email, full_name, role FROM users WHERE id = ? AND is_active = TRUE',
            [decoded.userId]
        );
        
        connection.end();

        if (users.length === 0) {
            console.log('User not found or inactive');
            return res.status(403).json({ error: 'Usuario no válido' });
        }

        req.user = users[0];
        console.log('User authenticated:', req.user.username);
        next();
    } catch (error) {
        console.log('Token verification failed:', error.message);
        return res.status(403).json({ error: 'Token inválido' });
    }
};

// Routes

// Login
app.post('/api/login', async (req, res) => {
    let connection;
    try {
        const { username, password } = req.body;
        
        console.log('🔐 Login attempt for:', username);
        
        if (!username || !password) {
            return res.status(400).json({ error: 'Usuario y contraseña son requeridos' });
        }

        connection = await mysql.createConnection(dbConfig);

        const [users] = await connection.execute(
            'SELECT * FROM users WHERE username = ? AND is_active = TRUE',
            [username]
        );

        if (users.length === 0) {
            connection.end();
            return res.status(401).json({ error: 'Usuario no encontrado' });
        }

        const user = users[0];

        const isValidPassword = await bcrypt.compare(password, user.password);
        
        if (!isValidPassword) {
            connection.end();
            return res.status(401).json({ error: 'Contraseña incorrecta' });
        }

        // Login exitoso
        const token = jwt.sign(
            { userId: user.id, username: user.username },
            'your-secret-key',
            { expiresIn: '24h' }
        );

        const userData = {
            id: user.id,
            username: user.username,
            email: user.email,
            full_name: user.full_name,
            role: user.role
        };

        console.log('🎉 Login successful for:', username);
        
        res.json({ 
            success: true,
            token, 
            user: userData 
        });
    } catch (error) {
        console.error('💥 Login error:', error);
        res.status(500).json({ error: 'Error del servidor: ' + error.message });
    } finally {
        if (connection) connection.end();
    }
});

// Obtener inventarios del usuario
// En el endpoint GET /api/inventories
app.get('/api/inventories', authenticateToken, async (req, res) => {
    try {
        console.log('Fetching inventories for user:', req.user.id);
        const connection = await mysql.createConnection(dbConfig);
        
        // Consulta MEJORADA para calcular progreso basado en UNIDADES
        const [inventories] = await connection.execute(`
            SELECT 
                i.*, 
                u.full_name as created_by_name,
                -- Calcular unidades totales y contadas
                COALESCE(SUM(ip.expected_stock), 0) as total_units,
                COALESCE(SUM(ip.counted_stock), 0) as counted_units,
                -- Calcular productos totales y contados
                COUNT(ip.id) as total_products,
                SUM(CASE WHEN ip.counted_stock IS NOT NULL AND ip.counted_stock > 0 THEN 1 ELSE 0 END) as counted_products,
                -- Calcular progreso basado en UNIDADES (no en productos)
                CASE 
                    WHEN COALESCE(SUM(ip.expected_stock), 0) > 0 THEN 
                        (COALESCE(SUM(ip.counted_stock), 0) / COALESCE(SUM(ip.expected_stock), 0)) * 100 
                    ELSE 0 
                END as progress_percentage
            FROM inventories i 
            LEFT JOIN users u ON i.created_by = u.id 
            LEFT JOIN inventory_products ip ON i.id = ip.inventory_id
            WHERE i.created_by = ?
            GROUP BY i.id, i.name, i.description, i.created_by, i.created_at, i.updated_at, u.full_name
            ORDER BY i.created_at DESC
        `, [req.user.id]);
        
        connection.end();
        console.log(`Found ${inventories.length} inventories`);
        res.json(inventories);
    } catch (error) {
        console.error('Error getting inventories:', error);
        res.status(500).json({ error: 'Error del servidor' });
    }
});

// Obtener un inventario específico
app.get('/api/inventories/:id', authenticateToken, async (req, res) => {
    try {
        const inventoryId = req.params.id;
        console.log('Fetching inventory:', inventoryId, 'for user:', req.user.id);
        
        const connection = await mysql.createConnection(dbConfig);
        
        const [inventories] = await connection.execute(`
            SELECT i.*, u.full_name as created_by_name 
            FROM inventories i 
            LEFT JOIN users u ON i.created_by = u.id 
            WHERE i.id = ? AND i.created_by = ?
        `, [inventoryId, req.user.id]);

        if (inventories.length === 0) {
            connection.end();
            console.log('Inventory not found:', inventoryId);
            return res.status(404).json({ error: 'Inventario no encontrado' });
        }

        connection.end();
        res.json(inventories[0]);
    } catch (error) {
        console.error('Error getting inventory:', error);
        res.status(500).json({ error: 'Error del servidor' });
    }
});

// Crear inventario
app.post('/api/inventories', authenticateToken, async (req, res) => {
    try {
        const { name, description } = req.body;
        console.log('Creating inventory for user:', req.user.id);

        if (!name || !name.trim()) {
            return res.status(400).json({ error: 'El nombre del inventario es requerido' });
        }

        const connection = await mysql.createConnection(dbConfig);

        const [result] = await connection.execute(
            'INSERT INTO inventories (name, description, created_by) VALUES (?, ?, ?)',
            [name.trim(), description, req.user.id]
        );

        connection.end();
        console.log('Inventory created with ID:', result.insertId);
        
        res.json({ 
            success: true,
            id: result.insertId, 
            message: 'Inventario creado exitosamente' 
        });
    } catch (error) {
        console.error('Error creating inventory:', error);
        res.status(500).json({ error: 'Error del servidor' });
    }
});

// Actualizar inventario
app.put('/api/inventories/:id', authenticateToken, async (req, res) => {
    try {
        const inventoryId = req.params.id;
        const { name, description } = req.body;

        console.log('Updating inventory:', inventoryId, 'for user:', req.user.id);

        if (!name || !name.trim()) {
            return res.status(400).json({ error: 'El nombre es requerido' });
        }

        const connection = await mysql.createConnection(dbConfig);
        
        // Verificar que el inventario existe y pertenece al usuario
        const [inventories] = await connection.execute(
            'SELECT * FROM inventories WHERE id = ? AND created_by = ?',
            [inventoryId, req.user.id]
        );

        if (inventories.length === 0) {
            connection.end();
            console.log('Inventory not found for update:', inventoryId);
            return res.status(404).json({ error: 'Inventario no encontrado' });
        }

        // Actualizar inventario
        await connection.execute(
            'UPDATE inventories SET name = ?, description = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?',
            [name.trim(), description, inventoryId]
        );

        connection.end();
        console.log('Inventory updated:', inventoryId);
        
        res.json({ 
            success: true,
            message: 'Inventario actualizado exitosamente' 
        });
    } catch (error) {
        console.error('Error updating inventory:', error);
        res.status(500).json({ error: 'Error del servidor' });
    }
});

// Eliminar inventario
// Eliminar inventario - CORREGIDO
app.delete('/api/inventories/:id', authenticateToken, async (req, res) => {
    try {
        const inventoryId = req.params.id;
        console.log('Deleting inventory:', inventoryId, 'for user:', req.user.id);

        const connection = await mysql.createConnection(dbConfig);
        
        // Verificar que el inventario existe y pertenece al usuario
        const [inventories] = await connection.execute(
            'SELECT * FROM inventories WHERE id = ? AND created_by = ?',
            [inventoryId, req.user.id]
        );

        if (inventories.length === 0) {
            connection.end();
            console.log('Inventory not found for deletion:', inventoryId);
            return res.status(404).json({ error: 'Inventario no encontrado' });
        }

        // Primero eliminar los productos asociados
        await connection.execute(
            'DELETE FROM inventory_products WHERE inventory_id = ?',
            [inventoryId]
        );

        // Luego eliminar el inventario
        await connection.execute(
            'DELETE FROM inventories WHERE id = ?',
            [inventoryId]
        );

        connection.end();
        console.log('Inventory deleted successfully:', inventoryId);
        
        res.json({ 
            success: true,
            message: 'Inventario eliminado exitosamente' 
        });
    } catch (error) {
        console.error('Error deleting inventory:', error);
        res.status(500).json({ error: 'Error del servidor' });
    }
});
// Cargar productos desde Excel
app.post('/api/inventories/:id/upload', authenticateToken, upload.single('file'), async (req, res) => {
    let connection;
    try {
        const inventoryId = req.params.id;
        const file = req.file;

        console.log('Uploading file to inventory:', inventoryId, 'for user:', req.user.id);

        if (!file) {
            return res.status(400).json({ error: 'No se proporcionó archivo' });
        }

        connection = await mysql.createConnection(dbConfig);

        // Verificar que el inventario existe y pertenece al usuario
        const [inventories] = await connection.execute(
            'SELECT * FROM inventories WHERE id = ? AND created_by = ?',
            [inventoryId, req.user.id]
        );

        if (inventories.length === 0) {
            connection.end();
            console.log('Inventory not found for upload:', inventoryId);
            return res.status(404).json({ error: 'Inventario no encontrado' });
        }

        console.log('Processing Excel file...');
        const workbook = XLSX.read(file.buffer, { type: 'buffer' });
        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];
        const data = XLSX.utils.sheet_to_json(worksheet);

        if (data.length === 0) {
            connection.end();
            return res.status(400).json({ error: 'El archivo está vacío' });
        }

        // Validar estructura del archivo
        const firstRow = data[0];
        const columnNames = Object.keys(firstRow);
        
        console.log('Excel columns:', columnNames);
        
        // Buscar columnas que puedan ser código de barras
        const barcodeKey = columnNames.find(key => 
            key.toLowerCase().includes('barcode') || 
            key.toLowerCase().includes('codigo') ||
            key.toLowerCase().includes('código') ||
            key.toLowerCase().includes('ean') ||
            key.toLowerCase().includes('upc') ||
            key.toLowerCase().includes('sku')
        );

        if (!barcodeKey) {
            connection.end();
            return res.status(400).json({ 
                error: 'El archivo debe contener una columna de código de barras. Columnas encontradas: ' + columnNames.join(', ') 
            });
        }

        // Procesar datos
        let processed = 0;
        let errors = 0;
        const errorsList = [];

        console.log('Processing', data.length, 'rows...');

        for (const [index, row] of data.entries()) {
            try {
                const barcode = row[barcodeKey] ? String(row[barcodeKey]).trim() : null;
                
                if (!barcode) {
                    errors++;
                    errorsList.push(`Fila ${index + 2}: Sin código de barras`);
                    continue;
                }

                // Buscar otras columnas comunes
                const skuKey = columnNames.find(key => 
                    key.toLowerCase().includes('sku') ||
                    key.toLowerCase().includes('referencia') ||
                    key.toLowerCase().includes('modelo')
                );
                
                const nameKey = columnNames.find(key => 
                    key.toLowerCase().includes('name') || 
                    key.toLowerCase().includes('nombre') ||
                    key.toLowerCase().includes('producto') ||
                    key.toLowerCase().includes('descripcion') ||
                    key.toLowerCase().includes('artículo')
                );
                
                const stockKey = columnNames.find(key => 
                    key.toLowerCase().includes('stock') || 
                    key.toLowerCase().includes('cantidad') ||
                    key.toLowerCase().includes('existencia') ||
                    key.toLowerCase().includes('inventario')
                );

                await connection.execute(
                    `INSERT INTO inventory_products 
                    (inventory_id, barcode, sku, product_name, expected_stock) 
                    VALUES (?, ?, ?, ?, ?)
                    ON DUPLICATE KEY UPDATE
                    sku = VALUES(sku), product_name = VALUES(product_name), expected_stock = VALUES(expected_stock)`,
                    [
                        inventoryId,
                        barcode,
                        skuKey && row[skuKey] ? String(row[skuKey]) : null,
                        nameKey && row[nameKey] ? String(row[nameKey]) : null,
                        stockKey && row[stockKey] ? parseInt(row[stockKey]) || 0 : 0
                    ]
                );
                processed++;
            } catch (rowError) {
                errors++;
                errorsList.push(`Fila ${index + 2}: ${rowError.message}`);
            }
        }

        // Actualizar contador de productos en el inventario
        await connection.execute(
            'UPDATE inventories SET total_products = ? WHERE id = ?',
            [processed, inventoryId]
        );

        connection.end();
        
        console.log(`File processed: ${processed} success, ${errors} errors`);
        
        const response = { 
            success: true,
            message: `Se procesaron ${processed} productos exitosamente`,
            processed,
            errors,
            totalRows: data.length
        };

        if (errors > 0) {
            response.errorDetails = errorsList.slice(0, 10);
        }

        res.json(response);
    } catch (error) {
        if (connection) connection.end();
        console.error('Error processing file:', error);
        res.status(500).json({ error: 'Error procesando archivo: ' + error.message });
    }
});

// Buscar producto por código de barras
app.get('/api/inventories/:id/products/search', authenticateToken, async (req, res) => {
    try {
        const { barcode } = req.query;
        const inventoryId = req.params.id;

        console.log('Searching product:', barcode, 'in inventory:', inventoryId);

        if (!barcode || barcode.trim().length < 1) {
            return res.status(400).json({ error: 'Código de barras requerido' });
        }

        const connection = await mysql.createConnection(dbConfig);
        
        // Verificar que el inventario pertenece al usuario
        const [inventories] = await connection.execute(
            'SELECT * FROM inventories WHERE id = ? AND created_by = ?',
            [inventoryId, req.user.id]
        );

        if (inventories.length === 0) {
            connection.end();
            return res.status(404).json({ error: 'Inventario no encontrado' });
        }

        const searchTerm = `%${barcode.trim()}%`;
        const [products] = await connection.execute(
            `SELECT * FROM inventory_products 
             WHERE inventory_id = ? AND barcode LIKE ? 
             ORDER BY 
                 CASE 
                     WHEN barcode = ? THEN 1
                     WHEN barcode LIKE ? THEN 2
                     ELSE 3
                 END,
                 barcode
             LIMIT 10`,
            [inventoryId, searchTerm, barcode.trim(), `${barcode.trim()}%`]
        );

        connection.end();
        res.json(products);
    } catch (error) {
        console.error('Error searching product:', error);
        res.status(500).json({ error: 'Error del servidor' });
    }
});

// Obtener información detallada de un producto específico
app.get('/api/inventories/:id/products/:barcode', authenticateToken, async (req, res) => {
    try {
        const inventoryId = req.params.id;
        const barcode = req.params.barcode;

        console.log('Getting product details:', barcode, 'in inventory:', inventoryId);

        const connection = await mysql.createConnection(dbConfig);
        
        // Verificar que el inventario pertenece al usuario
        const [inventories] = await connection.execute(
            'SELECT * FROM inventories WHERE id = ? AND created_by = ?',
            [inventoryId, req.user.id]
        );

        if (inventories.length === 0) {
            connection.end();
            return res.status(404).json({ error: 'Inventario no encontrado' });
        }

        const [products] = await connection.execute(
            `SELECT 
                id,
                inventory_id,
                barcode,
                sku,
                product_name,
                expected_stock,
                counted_stock,
                count_date,
                counted_by,
                created_at,
                updated_at,
                CASE 
                    WHEN counted_stock IS NOT NULL AND counted_stock > 0 THEN 'CONTADO'
                    ELSE 'PENDIENTE'
                END as status,
                CASE 
                    WHEN expected_stock IS NOT NULL AND counted_stock IS NOT NULL 
                    THEN counted_stock - expected_stock
                    ELSE NULL
                END as diferencia
             FROM inventory_products 
             WHERE inventory_id = ? AND barcode = ?`,
            [inventoryId, barcode]
        );

        connection.end();

        if (products.length === 0) {
            return res.status(404).json({ error: 'Producto no encontrado' });
        }

        res.json(products[0]);
    } catch (error) {
        console.error('Error getting product details:', error);
        res.status(500).json({ error: 'Error del servidor' });
    }
});

// Obtener todos los productos del inventario con estadísticas
app.get('/api/inventories/:id/products', authenticateToken, async (req, res) => {
    try {
        const inventoryId = req.params.id;

        console.log('Getting all products for inventory:', inventoryId);

        const connection = await mysql.createConnection(dbConfig);
        
        // Verificar que el inventario pertenece al usuario
        const [inventories] = await connection.execute(
            'SELECT * FROM inventories WHERE id = ? AND created_by = ?',
            [inventoryId, req.user.id]
        );

        if (inventories.length === 0) {
            connection.end();
            return res.status(404).json({ error: 'Inventario no encontrado' });
        }

        const [products] = await connection.execute(`
            SELECT 
                id,
                inventory_id,
                barcode,
                sku,
                product_name,
                expected_stock,
                counted_stock,
                count_date,
                counted_by,
                created_at,
                updated_at,
                CASE 
                    WHEN counted_stock IS NOT NULL AND counted_stock > 0 THEN 'CONTADO'
                    ELSE 'PENDIENTE'
                END as status,
                CASE 
                    WHEN expected_stock IS NOT NULL AND counted_stock IS NOT NULL 
                    THEN counted_stock - expected_stock
                    ELSE NULL
                END as diferencia
            FROM inventory_products 
            WHERE inventory_id = ?
            ORDER BY product_name, barcode
        `, [inventoryId]);

        // Calcular estadísticas por producto
        const productsWithStats = products.map(product => ({
            ...product,
            progress_percentage: product.expected_stock > 0 
                ? Math.round((product.counted_stock / product.expected_stock) * 100) 
                : 0,
            remaining: Math.max(0, product.expected_stock - (product.counted_stock || 0))
        }));

        connection.end();
        res.json(productsWithStats);
    } catch (error) {
        console.error('Error getting products:', error);
        res.status(500).json({ error: 'Error del servidor' });
    }
});

// Registrar conteo - CORREGIDO para mostrar info por producto
app.post('/api/inventories/:id/count', authenticateToken, async (req, res) => {
    let connection;
    try {
        const inventoryId = req.params.id;
        const { barcode, quantity } = req.body;

        console.log('Counting product:', barcode, 'qty:', quantity, 'in inventory:', inventoryId);

        if (!barcode || !barcode.trim()) {
            return res.status(400).json({ error: 'Código de barras requerido' });
        }

        if (quantity === undefined || quantity === null || quantity < 0) {
            return res.status(400).json({ error: 'Cantidad válida requerida' });
        }

        connection = await mysql.createConnection(dbConfig);

        // Verificar que el inventario pertenece al usuario
        const [inventories] = await connection.execute(
            'SELECT * FROM inventories WHERE id = ? AND created_by = ?',
            [inventoryId, req.user.id]
        );

        if (inventories.length === 0) {
            connection.end();
            return res.status(404).json({ error: 'Inventario no encontrado' });
        }

        // Buscar el producto
        const [products] = await connection.execute(
            'SELECT * FROM inventory_products WHERE inventory_id = ? AND barcode = ?',
            [inventoryId, barcode.trim()]
        );

        let productId;
        let newCountedStock;

        if (products.length === 0) {
            // Crear nuevo producto si no existe
            const [insertResult] = await connection.execute(
                'INSERT INTO inventory_products (inventory_id, barcode, counted_stock, count_date, counted_by) VALUES (?, ?, ?, NOW(), ?)',
                [inventoryId, barcode.trim(), quantity, req.user.id]
            );
            productId = insertResult.insertId;
            newCountedStock = quantity;
        } else {
            // Actualizar producto existente SUMANDO la cantidad
            productId = products[0].id;
            newCountedStock = (products[0].counted_stock || 0) + quantity;
            
            await connection.execute(
                `UPDATE inventory_products 
                 SET counted_stock = ?, count_date = NOW(), counted_by = ?
                 WHERE inventory_id = ? AND barcode = ?`,
                [newCountedStock, req.user.id, inventoryId, barcode.trim()]
            );
        }

        // Obtener el producto actualizado con toda su información
        const [updatedProducts] = await connection.execute(
            `SELECT 
                id,
                inventory_id,
                barcode,
                sku,
                product_name,
                expected_stock,
                counted_stock,
                count_date,
                counted_by,
                created_at,
                updated_at,
                CASE 
                    WHEN counted_stock IS NOT NULL AND counted_stock > 0 THEN 'CONTADO'
                    ELSE 'PENDIENTE'
                END as status,
                CASE 
                    WHEN expected_stock IS NOT NULL AND counted_stock IS NOT NULL 
                    THEN counted_stock - expected_stock
                    ELSE NULL
                END as diferencia
             FROM inventory_products 
             WHERE id = ?`,
            [productId]
        );

        const updatedProduct = updatedProducts[0];

        // Calcular estadísticas del producto
        const productStats = {
            progress_percentage: updatedProduct.expected_stock > 0 
                ? Math.round((updatedProduct.counted_stock / updatedProduct.expected_stock) * 100) 
                : 0,
            remaining: Math.max(0, updatedProduct.expected_stock - (updatedProduct.counted_stock || 0)),
            counted_today: quantity
        };

        // Obtener estadísticas generales del inventario
       // Obtener estadísticas generales del inventario - CORREGIDO
        // Obtener estadísticas generales del inventario - MEJORADO
        const [stats] = await connection.execute(`
            SELECT 
                COUNT(*) as total_products,
                SUM(CASE WHEN counted_stock IS NOT NULL AND counted_stock > 0 THEN 1 ELSE 0 END) as counted_products,
                COALESCE(SUM(expected_stock), 0) as total_units,
                COALESCE(SUM(counted_stock), 0) as counted_units,
                CASE 
                    WHEN COUNT(*) > 0 THEN 
                        (SUM(CASE WHEN counted_stock IS NOT NULL AND counted_stock > 0 THEN 1 ELSE 0 END) / COUNT(*)) * 100 
                    ELSE 0 
                END as progress_percentage
            FROM inventory_products 
            WHERE inventory_id = ?
        `, [inventoryId]);

        // Actualizar inventario
        await connection.execute(
            `UPDATE inventories 
             SET total_products = ?, counted_products = ?, progress_percentage = ?, 
                 last_count_date = NOW(), last_count_by = ?, updated_at = CURRENT_TIMESTAMP
             WHERE id = ?`,
            [stats[0].total_products, stats[0].counted_products, stats[0].progress_percentage, req.user.id, inventoryId]
        );

        connection.end();
        
        console.log('Count registered successfully - added', quantity, 'to product', barcode);
        
        res.json({ 
            success: true,
            message: 'Conteo registrado exitosamente',
            product: updatedProduct,
            productStats: productStats,
            inventoryStats: {
                progress: stats[0].progress_percentage,
                total_products: stats[0].total_products,
                counted_products: stats[0].counted_products
            }
        });
    } catch (error) {
        if (connection) connection.end();
        console.error('Error registering count:', error);
        res.status(500).json({ error: 'Error del servidor' });
    }
});

// Exportar inventario
// En el endpoint de exportación, modificar la sección de Excel:
app.get('/api/inventories/:id/export', authenticateToken, async (req, res) => {
    let connection;
    try {
        const inventoryId = req.params.id;
        const format = req.query.format || 'excel';
        
        console.log('Exporting inventory:', inventoryId, 'format:', format, 'for user:', req.user.id);

        connection = await mysql.createConnection(dbConfig);

        // Verificar que el inventario existe y pertenece al usuario
        const [inventories] = await connection.execute(
            'SELECT * FROM inventories WHERE id = ? AND created_by = ?',
            [inventoryId, req.user.id]
        );

        if (inventories.length === 0) {
            connection.end();
            console.log('Inventory not found for export:', inventoryId);
            return res.status(404).json({ error: 'Inventario no encontrado' });
        }

        const inventory = inventories[0];

        // Obtener productos del inventario CON FECHA Y HORA
        const [products] = await connection.execute(`
            SELECT 
                barcode,
                sku,
                product_name,
                expected_stock,
                counted_stock,
                count_date,
                CASE 
                    WHEN counted_stock IS NOT NULL AND counted_stock > 0 THEN 'CONTADO'
                    ELSE 'PENDIENTE'
                END as status,
                CASE 
                    WHEN expected_stock IS NOT NULL AND counted_stock IS NOT NULL 
                    THEN counted_stock - expected_stock
                    ELSE NULL
                END as diferencia
            FROM inventory_products 
            WHERE inventory_id = ?
            ORDER BY barcode
        `, [inventoryId]);

        connection.end();

        if (products.length === 0) {
            console.log('No products found for inventory:', inventoryId);
            return res.status(404).json({ error: 'No se encontraron productos para exportar' });
        }

        console.log(`Found ${products.length} products to export`);

        if (format === 'csv') {
            // Exportar como CSV con fecha y hora
            const csvHeaders = ['Código Barras', 'SKU', 'Producto', 'Stock Esperado', 'Stock Contado', 'Diferencia', 'Estado', 'Fecha Conteo', 'Hora Conteo'];
            const csvData = products.map(product => [
                product.barcode || '',
                product.sku || '',
                product.product_name || '',
                product.expected_stock || 0,
                product.counted_stock || 0,
                product.diferencia || 0,
                product.status || '',
                product.count_date ? new Date(product.count_date).toLocaleDateString('es-ES') : '',
                product.count_date ? new Date(product.count_date).toLocaleTimeString('es-ES') : ''
            ]);

            const csvContent = [
                csvHeaders.join(','),
                ...csvData.map(row => row.map(field => `"${field}"`).join(','))
            ].join('\n');

            const filename = `inventario_${inventory.name}_${new Date().toISOString().split('T')[0]}.csv`;

            res.setHeader('Content-Type', 'text/csv; charset=utf-8');
            res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
            res.send(csvContent);

        } else {
            // Exportar como Excel (por defecto) CON FECHA Y HORA COMPLETA
            const workbook = XLSX.utils.book_new();
            
            // Crear hoja de datos principal CON FECHA Y HORA SEPARADAS
            const worksheetData = [
                ['Código Barras', 'SKU', 'Producto', 'Stock Esperado', 'Stock Contado', 'Diferencia', 'Estado', 'Fecha Conteo', 'Hora Conteo'],
                ...products.map(product => [
                    product.barcode || '',
                    product.sku || '',
                    product.product_name || '',
                    product.expected_stock || 0,
                    product.counted_stock || 0,
                    product.diferencia || 0,
                    product.status || '',
                    product.count_date ? new Date(product.count_date).toLocaleDateString('es-ES') : '',
                    product.count_date ? new Date(product.count_date).toLocaleTimeString('es-ES', { 
                        hour: '2-digit', 
                        minute: '2-digit',
                        second: '2-digit'
                    }) : ''
                ])
            ];

            const worksheet = XLSX.utils.aoa_to_sheet(worksheetData);
            
            // Aplicar estilos básicos
            if (worksheet['!ref']) {
                const range = XLSX.utils.decode_range(worksheet['!ref']);
                
                // Estilo para el header
                for (let col = range.s.c; col <= range.e.c; col++) {
                    const cellAddress = XLSX.utils.encode_cell({ r: 0, c: col });
                    if (!worksheet[cellAddress].s) {
                        worksheet[cellAddress].s = {
                            font: { bold: true, color: { rgb: "FFFFFF" } },
                            fill: { fgColor: { rgb: "4472C4" } },
                            alignment: { horizontal: "center" }
                        };
                    }
                }
            }

            XLSX.utils.book_append_sheet(workbook, worksheet, 'Inventario');

            // Crear hoja de resumen CON FECHA Y HORA DE EXPORTACIÓN
            const totalProducts = products.length;
            const countedProducts = products.filter(p => p.status === 'CONTADO').length;
            const pendingProducts = totalProducts - countedProducts;
            const progressPercentage = totalProducts > 0 ? (countedProducts / totalProducts * 100).toFixed(2) : 0;

            const summaryData = [
                ['RESUMEN DEL INVENTARIO'],
                [''],
                ['Nombre del Inventario:', inventory.name],
                ['Descripción:', inventory.description || ''],
                ['Fecha de Exportación:', new Date().toLocaleDateString('es-ES')],
                ['Hora de Exportación:', new Date().toLocaleTimeString('es-ES', { 
                    hour: '2-digit', 
                    minute: '2-digit',
                    second: '2-digit'
                })],
                [''],
                ['ESTADÍSTICAS'],
                ['Total de Productos:', totalProducts],
                ['Productos Contados:', countedProducts],
                ['Productos Pendientes:', pendingProducts],
                ['Progreso:', `${progressPercentage}%`],
                [''],
                ['INFORMACIÓN DEL INVENTARIO'],
                ['Creado por:', inventory.created_by_name || ''],
                ['Fecha de Creación:', new Date(inventory.created_at).toLocaleDateString('es-ES')],
                ['Hora de Creación:', new Date(inventory.created_at).toLocaleTimeString('es-ES')],
                ['Última Actualización:', inventory.updated_at ? new Date(inventory.updated_at).toLocaleDateString('es-ES') : ''],
                ['Hora Última Actualización:', inventory.updated_at ? new Date(inventory.updated_at).toLocaleTimeString('es-ES') : '']
            ];

            const summaryWorksheet = XLSX.utils.aoa_to_sheet(summaryData);
            XLSX.utils.book_append_sheet(workbook, summaryWorksheet, 'Resumen');

            // Nombre del archivo con fecha y hora completas
            const now = new Date();
            const timestamp = now.toISOString().slice(0,19).replace(/:/g, '-');
            const filename = `inventario_${inventory.name}_${timestamp}.xlsx`;

            // Convertir a buffer y enviar
            const excelBuffer = XLSX.write(workbook, { type: 'buffer', bookType: 'xlsx' });
            
            res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
            res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
            res.send(excelBuffer);
        }

        console.log('Inventory exported successfully:', inventoryId);

    } catch (error) {
        if (connection) connection.end();
        console.error('Error exporting inventory:', error);
        res.status(500).json({ error: 'Error exportando inventario: ' + error.message });
    }
});

// Health check mejorado
app.get('/api/health', async (req, res) => {
    try {
        const connection = await mysql.createConnection(dbConfig);
        await connection.execute('SELECT 1');
        connection.end();
        
        res.json({ 
            status: 'OK', 
            message: 'Servidor y base de datos funcionando correctamente',
            timestamp: new Date().toISOString()
        });
    } catch (error) {
        res.status(500).json({ 
            status: 'ERROR', 
            message: 'Error en la base de datos: ' + error.message 
        });
    }
});

// Agregar este endpoint al server.js para obtener datos de reportes
app.get('/api/inventories/:id/products/report', authenticateToken, async (req, res) => {
    try {
        const inventoryId = req.params.id;

        console.log('Fetching products report for inventory:', inventoryId);

        const connection = await mysql.createConnection(dbConfig);
        
        // Verificar que el inventario pertenece al usuario
        const [inventories] = await connection.execute(
            'SELECT * FROM inventories WHERE id = ? AND created_by = ?',
            [inventoryId, req.user.id]
        );

        if (inventories.length === 0) {
            connection.end();
            return res.status(404).json({ error: 'Inventario no encontrado' });
        }

        // Obtener productos con información completa para reportes
        const [products] = await connection.execute(`
            SELECT 
                ip.*,
                u.full_name as counted_by_name,
                CASE 
                    WHEN ip.counted_stock IS NULL OR ip.counted_stock = 0 THEN 'not-counted'
                    WHEN ip.counted_stock > ip.expected_stock THEN 'excess'
                    WHEN ip.counted_stock < ip.expected_stock THEN 'shortage'
                    ELSE 'exact'
                END as status,
                (ip.counted_stock - ip.expected_stock) as difference,
                CASE 
                    WHEN ip.expected_stock > 0 THEN 
                        ROUND(((ip.counted_stock - ip.expected_stock) / ip.expected_stock) * 100, 2)
                    ELSE 0
                END as difference_percentage,
                CASE 
                    WHEN ip.expected_stock > 0 THEN 
                        ROUND((ip.counted_stock / ip.expected_stock) * 100, 2)
                    ELSE 0
                END as progress_percentage
            FROM inventory_products ip
            LEFT JOIN users u ON ip.counted_by = u.id
            WHERE ip.inventory_id = ?
            ORDER BY ip.product_name, ip.barcode
        `, [inventoryId]);

        connection.end();
        res.json(products);
    } catch (error) {
        console.error('Error getting products report:', error);
        res.status(500).json({ error: 'Error del servidor' });
    }
});

// Middleware para rutas no encontradas
app.use('*', (req, res) => {
    res.status(404).json({ error: 'Ruta no encontrada' });
});

// Manejo de errores global
app.use((error, req, res, next) => {
    console.error('Error global:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
});

app.listen(PORT, () => {
    console.log(`Servidor corriendo en puerto ${PORT}`);
    console.log(`Sistema de Inventario API`);
    console.log(`Health check: http://localhost:${PORT}/api/health`);
});