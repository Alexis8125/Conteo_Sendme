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

// Configuración de MySQL para XAMPP
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

// Middleware de autenticación MEJORADO
const authenticateToken = async (req, res, next) => {
    try {
        const authHeader = req.headers['authorization'];
        const token = authHeader && authHeader.split(' ')[1];

        if (!token) {
            console.log('❌ No token provided');
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
            console.log('❌ User not found or inactive');
            return res.status(403).json({ error: 'Usuario no válido' });
        }

        req.user = users[0];
        console.log('✅ User authenticated:', req.user.username);
        next();
    } catch (error) {
        console.log('❌ Token verification failed:', error.message);
        return res.status(403).json({ error: 'Token inválido' });
    }
};

// Routes

// Login (mejorado con más logs)
app.post('/api/login', async (req, res) => {
    try {
        const { username, password } = req.body;
        
        console.log('🔐 Login attempt for:', username);
        
        if (!username || !password) {
            return res.status(400).json({ error: 'Usuario y contraseña son requeridos' });
        }

        const connection = await mysql.createConnection(dbConfig);

        const [users] = await connection.execute(
            'SELECT * FROM users WHERE username = ? AND is_active = TRUE',
            [username]
        );

        if (users.length === 0) {
            connection.end();
            console.log('❌ User not found:', username);
            return res.status(401).json({ error: 'Credenciales inválidas' });
        }

        const user = users[0];
        const isValidPassword = await bcrypt.compare(password, user.password);

        if (!isValidPassword) {
            connection.end();
            console.log('❌ Invalid password for:', username);
            return res.status(401).json({ error: 'Credenciales inválidas' });
        }

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

        connection.end();
        console.log('✅ Login successful for:', username);
        
        res.json({ 
            success: true,
            token, 
            user: userData 
        });
    } catch (error) {
        console.error('💥 Login error:', error);
        res.status(500).json({ error: 'Error del servidor' });
    }
});

// Obtener inventarios del usuario
app.get('/api/inventories', authenticateToken, async (req, res) => {
    try {
        console.log('📋 Fetching inventories for user:', req.user.id);
        const connection = await mysql.createConnection(dbConfig);
        const [inventories] = await connection.execute(`
            SELECT i.*, u.full_name as created_by_name 
            FROM inventories i 
            LEFT JOIN users u ON i.created_by = u.id 
            WHERE i.created_by = ?
            ORDER BY i.created_at DESC
        `, [req.user.id]);
        
        connection.end();
        console.log(`✅ Found ${inventories.length} inventories`);
        res.json(inventories);
    } catch (error) {
        console.error('💥 Error getting inventories:', error);
        res.status(500).json({ error: 'Error del servidor' });
    }
});

// Obtener un inventario específico
app.get('/api/inventories/:id', authenticateToken, async (req, res) => {
    try {
        const inventoryId = req.params.id;
        console.log('📋 Fetching inventory:', inventoryId, 'for user:', req.user.id);
        
        const connection = await mysql.createConnection(dbConfig);
        
        const [inventories] = await connection.execute(`
            SELECT i.*, u.full_name as created_by_name 
            FROM inventories i 
            LEFT JOIN users u ON i.created_by = u.id 
            WHERE i.id = ? AND i.created_by = ?
        `, [inventoryId, req.user.id]);

        if (inventories.length === 0) {
            connection.end();
            console.log('❌ Inventory not found:', inventoryId);
            return res.status(404).json({ error: 'Inventario no encontrado' });
        }

        connection.end();
        res.json(inventories[0]);
    } catch (error) {
        console.error('💥 Error getting inventory:', error);
        res.status(500).json({ error: 'Error del servidor' });
    }
});

// Crear inventario
app.post('/api/inventories', authenticateToken, async (req, res) => {
    try {
        const { name, description } = req.body;
        console.log('🆕 Creating inventory for user:', req.user.id);

        if (!name || !name.trim()) {
            return res.status(400).json({ error: 'El nombre del inventario es requerido' });
        }

        const connection = await mysql.createConnection(dbConfig);

        const [result] = await connection.execute(
            'INSERT INTO inventories (name, description, created_by) VALUES (?, ?, ?)',
            [name.trim(), description, req.user.id]
        );

        connection.end();
        console.log('✅ Inventory created with ID:', result.insertId);
        
        res.json({ 
            success: true,
            id: result.insertId, 
            message: 'Inventario creado exitosamente' 
        });
    } catch (error) {
        console.error('💥 Error creating inventory:', error);
        res.status(500).json({ error: 'Error del servidor' });
    }
});

// Actualizar inventario
app.put('/api/inventories/:id', authenticateToken, async (req, res) => {
    try {
        const inventoryId = req.params.id;
        const { name, description } = req.body;

        console.log('✏️ Updating inventory:', inventoryId, 'for user:', req.user.id);

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
            console.log('❌ Inventory not found for update:', inventoryId);
            return res.status(404).json({ error: 'Inventario no encontrado' });
        }

        // Actualizar inventario
        await connection.execute(
            'UPDATE inventories SET name = ?, description = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?',
            [name.trim(), description, inventoryId]
        );

        connection.end();
        console.log('✅ Inventory updated:', inventoryId);
        
        res.json({ 
            success: true,
            message: 'Inventario actualizado exitosamente' 
        });
    } catch (error) {
        console.error('💥 Error updating inventory:', error);
        res.status(500).json({ error: 'Error del servidor' });
    }
});

// Eliminar inventario
app.delete('/api/inventories/:id', authenticateToken, async (req, res) => {
    try {
        const inventoryId = req.params.id;
        console.log('🗑️ Deleting inventory:', inventoryId, 'for user:', req.user.id);

        const connection = await mysql.createConnection(dbConfig);

        // Verificar que el inventario existe y pertenece al usuario
        const [inventories] = await connection.execute(
            'SELECT * FROM inventories WHERE id = ? AND created_by = ?',
            [inventoryId, req.user.id]
        );

        if (inventories.length === 0) {
            connection.end();
            console.log('❌ Inventory not found for delete:', inventoryId);
            return res.status(404).json({ error: 'Inventario no encontrado' });
        }

        // Eliminar productos del inventario primero
        await connection.execute(
            'DELETE FROM inventory_products WHERE inventory_id = ?',
            [inventoryId]
        );

        // Eliminar el inventario
        await connection.execute(
            'DELETE FROM inventories WHERE id = ?',
            [inventoryId]
        );

        connection.end();
        console.log('✅ Inventory deleted:', inventoryId);
        
        res.json({ 
            success: true,
            message: 'Inventario eliminado exitosamente' 
        });
    } catch (error) {
        console.error('💥 Error deleting inventory:', error);
        res.status(500).json({ error: 'Error del servidor' });
    }
});

// Cargar productos desde Excel - CORREGIDO
app.post('/api/inventories/:id/upload', authenticateToken, upload.single('file'), async (req, res) => {
    let connection;
    try {
        const inventoryId = req.params.id;
        const file = req.file;

        console.log('📤 Uploading file to inventory:', inventoryId, 'for user:', req.user.id);

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
            console.log('❌ Inventory not found for upload:', inventoryId);
            return res.status(404).json({ error: 'Inventario no encontrado' });
        }

        console.log('📊 Processing Excel file...');
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
        
        console.log('📋 Excel columns:', columnNames);
        
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

        console.log('🔄 Processing', data.length, 'rows...');

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
        
        console.log(`✅ File processed: ${processed} success, ${errors} errors`);
        
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
        console.error('💥 Error processing file:', error);
        res.status(500).json({ error: 'Error procesando archivo: ' + error.message });
    }
});

// Buscar producto por código de barras
app.get('/api/inventories/:id/products/search', authenticateToken, async (req, res) => {
    try {
        const { barcode } = req.query;
        const inventoryId = req.params.id;

        console.log('🔍 Searching product:', barcode, 'in inventory:', inventoryId);

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
        console.error('💥 Error searching product:', error);
        res.status(500).json({ error: 'Error del servidor' });
    }
});

// Registrar conteo
app.post('/api/inventories/:id/count', authenticateToken, async (req, res) => {
    try {
        const inventoryId = req.params.id;
        const { barcode, quantity } = req.body;

        console.log('📝 Counting product:', barcode, 'qty:', quantity, 'in inventory:', inventoryId);

        if (!barcode || !barcode.trim()) {
            return res.status(400).json({ error: 'Código de barras requerido' });
        }

        if (quantity === undefined || quantity === null || quantity < 0) {
            return res.status(400).json({ error: 'Cantidad válida requerida' });
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

        // Buscar el producto
        const [products] = await connection.execute(
            'SELECT * FROM inventory_products WHERE inventory_id = ? AND barcode = ?',
            [inventoryId, barcode.trim()]
        );

        let productId;

        if (products.length === 0) {
            // Crear nuevo producto si no existe
            const [insertResult] = await connection.execute(
                'INSERT INTO inventory_products (inventory_id, barcode, counted_stock, count_date, counted_by) VALUES (?, ?, ?, NOW(), ?)',
                [inventoryId, barcode.trim(), quantity, req.user.id]
            );
            productId = insertResult.insertId;
        } else {
            // Actualizar producto existente
            productId = products[0].id;
            await connection.execute(
                `UPDATE inventory_products 
                 SET counted_stock = ?, count_date = NOW(), counted_by = ?
                 WHERE inventory_id = ? AND barcode = ?`,
                [quantity, req.user.id, inventoryId, barcode.trim()]
            );
        }

        // Obtener estadísticas actualizadas
        const [stats] = await connection.execute(`
            SELECT 
                COUNT(*) as total,
                SUM(CASE WHEN counted_stock > 0 THEN 1 ELSE 0 END) as counted,
                (SUM(CASE WHEN counted_stock > 0 THEN 1 ELSE 0 END) / COUNT(*)) * 100 as progress
            FROM inventory_products 
            WHERE inventory_id = ?
        `, [inventoryId]);

        // Actualizar inventario
        await connection.execute(
            `UPDATE inventories 
             SET counted_products = ?, progress_percentage = ?, 
                 last_count_date = NOW(), last_count_by = ?, updated_at = CURRENT_TIMESTAMP
             WHERE id = ?`,
            [stats[0].counted, stats[0].progress, req.user.id, inventoryId]
        );

        connection.end();
        
        console.log('✅ Count registered successfully');
        
        res.json({ 
            success: true,
            message: 'Conteo registrado exitosamente',
            progress: stats[0].progress,
            productId 
        });
    } catch (error) {
        console.error('💥 Error registering count:', error);
        res.status(500).json({ error: 'Error del servidor' });
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

// Middleware para rutas no encontradas
app.use('*', (req, res) => {
    res.status(404).json({ error: 'Ruta no encontrada' });
});

// Manejo de errores global
app.use((error, req, res, next) => {
    console.error('💥 Error global:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
});

app.listen(PORT, () => {
    console.log(`🚀 Servidor corriendo en puerto ${PORT}`);
    console.log(`📊 Sistema de Inventario API`);
    console.log(`📍 Health check: http://localhost:${PORT}/api/health`);
    console.log(`🔐 Secret key:`, 'your-secret-key');
});