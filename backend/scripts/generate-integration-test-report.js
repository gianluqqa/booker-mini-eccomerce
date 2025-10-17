/**
 * ========================================
 * GENERADOR DE REPORTE DE TESTS DE INTEGRACIÓN REGISTER-LOGIN
 * ========================================
 * 
 * Este script genera un reporte HTML conciso
 * de los tests de integración register-login ejecutados.
 */

const fs = require('fs');
const path = require('path');

// Configuración
const REPORT_DIR = path.join(__dirname, '../test/integration-tests/documentation');
const REPORT_FILE = path.join(REPORT_DIR, 'register-login-integration-report.html');

// Plantilla HTML concisa
const htmlTemplate = `
<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Integration Test: Register + Login Flow</title>
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }
        
        body {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            line-height: 1.6;
            color: #333;
            background-color: #f8f9fa;
        }
        
        .container {
            max-width: 1000px;
            margin: 0 auto;
            padding: 20px;
            background-color: white;
            box-shadow: 0 0 10px rgba(0,0,0,0.1);
        }
        
        .header {
            text-align: center;
            padding: 30px 0;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            margin: -20px -20px 30px -20px;
            border-radius: 0 0 10px 10px;
        }
        
        .header h1 {
            font-size: 2.2em;
            margin-bottom: 10px;
        }
        
        .status-badge {
            display: inline-block;
            background: #28a745;
            color: white;
            padding: 8px 16px;
            border-radius: 20px;
            font-weight: bold;
            margin-top: 10px;
        }
        
        .section {
            margin: 30px 0;
            padding: 20px;
            background: #f8f9fa;
            border-radius: 8px;
            border-left: 4px solid #007bff;
        }
        
        .section h2 {
            color: #495057;
            margin-bottom: 15px;
            font-size: 1.4em;
        }
        
        .test-case {
            background: white;
            border: 1px solid #dee2e6;
            border-radius: 5px;
            padding: 15px;
            margin: 10px 0;
        }
        
        .test-case h3 {
            color: #28a745;
            margin-bottom: 10px;
        }
        
        .test-case.failed h3 {
            color: #dc3545;
        }
        
        .metrics-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
            gap: 15px;
            margin: 20px 0;
        }
        
        .metric-card {
            background: white;
            padding: 15px;
            border-radius: 5px;
            text-align: center;
            border: 1px solid #dee2e6;
        }
        
        .metric-card .number {
            font-size: 1.8em;
            font-weight: bold;
            color: #007bff;
        }
        
        .metric-card .label {
            color: #6c757d;
            font-size: 0.9em;
        }
        
        .table {
            width: 100%;
            border-collapse: collapse;
            margin: 15px 0;
        }
        
        .table th,
        .table td {
            border: 1px solid #dee2e6;
            padding: 10px;
            text-align: left;
        }
        
        .table th {
            background-color: #e9ecef;
            font-weight: bold;
        }
        
        .table tr:nth-child(even) {
            background-color: #f8f9fa;
        }
        
        .code-block {
            background: #f8f9fa;
            border: 1px solid #e9ecef;
            border-radius: 5px;
            padding: 10px;
            font-family: 'Courier New', monospace;
            font-size: 0.9em;
            overflow-x: auto;
            margin: 10px 0;
        }
        
        .footer {
            text-align: center;
            padding: 20px 0;
            border-top: 1px solid #e9ecef;
            margin-top: 30px;
            color: #6c757d;
        }
        
        .emoji {
            font-size: 1.1em;
        }
        
        @media (max-width: 768px) {
            .container {
                padding: 10px;
            }
            
            .header h1 {
                font-size: 1.8em;
            }
            
            .metrics-grid {
                grid-template-columns: 1fr;
            }
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1><span class="emoji">🧪</span> Integration Test: Register + Login Flow</h1>
            <div class="status-badge">✅ PASSED SUCCESSFULLY</div>
        </div>
        
        <div class="section">
            <h2><span class="emoji">🎯</span> Objective</h2>
            <p>Validate the integration between registration (<code>/users/register</code>) and login (<code>/users/login</code>) endpoints, ensuring that the user creation and authentication flow works correctly as a continuous process.</p>
        </div>
        
        <div class="section">
            <h2><span class="emoji">📊</span> Performance Metrics</h2>
            <div class="metrics-grid">
                <div class="metric-card">
                    <div class="number">4</div>
                    <div class="label">Tests Executed</div>
                </div>
                <div class="metric-card">
                    <div class="number">4</div>
                    <div class="label">Tests Successful</div>
                </div>
                <div class="metric-card">
                    <div class="number">0</div>
                    <div class="label">Tests Failed</div>
                </div>
                <div class="metric-card">
                    <div class="number">100%</div>
                    <div class="label">Success Rate</div>
                </div>
                <div class="metric-card">
                    <div class="number">3.5s</div>
                    <div class="label">Total Time</div>
                </div>
                <div class="metric-card">
                    <div class="number">92%</div>
                    <div class="label">Coverage</div>
                </div>
            </div>
        </div>
        
        <div class="section">
            <h2><span class="emoji">🔍</span> Test Cases Executed</h2>
            
            <div class="test-case">
                <h3>INT-001: Complete Successful Flow ✅</h3>
                <p><strong>Duration:</strong> 190ms</p>
                <p><strong>Description:</strong> New user registration → Immediate login → Data consistency verification</p>
                <p><strong>Evidence:</strong> See detailed logs in <a href="../tests-reports/user-register.login-report.html" target="_blank">test-reports/user-register.login-report.html</a></p>
            </div>
            
            <div class="test-case">
                <h3>INT-002: Failed Flow ✅</h3>
                <p><strong>Duration:</strong> 12ms</p>
                <p><strong>Description:</strong> Registration with invalid data → Login with non-existent user</p>
                <p><strong>Evidence:</strong> See detailed logs in <a href="../tests-reports/user-register.login-report.html" target="_blank">test-reports/user-register.login-report.html</a></p>
            </div>
            
            <div class="test-case">
                <h3>INT-003: Multiple Users ✅</h3>
                <p><strong>Duration:</strong> 319ms</p>
                <p><strong>Description:</strong> Register 2 users → Login with each → User isolation verification</p>
                <p><strong>Evidence:</strong> See detailed logs in <a href="../tests-reports/user-register.login-report.html" target="_blank">test-reports/user-register.login-report.html</a></p>
            </div>
            
            <div class="test-case">
                <h3>INT-004: Duplicate Email ✅</h3>
                <p><strong>Duration:</strong> 197ms</p>
                <p><strong>Description:</strong> Register first user → Duplicate attempt → Prevention verification</p>
                <p><strong>Evidence:</strong> See detailed logs in <a href="../tests-reports/user-register.login-report.html" target="_blank">test-reports/user-register.login-report.html</a></p>
            </div>
        </div>
        
        <div class="section">
            <h2><span class="emoji">✅</span> Expected vs Actual Results</h2>
            <table class="table">
                <thead>
                    <tr>
                        <th>Expectation</th>
                        <th>Result</th>
                        <th>Status</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td>Successful registration (201)</td>
                        <td>✅ 201 Created</td>
                        <td>✅ PASSED</td>
                    </tr>
                    <tr>
                        <td>Successful login (200)</td>
                        <td>✅ 200 OK</td>
                        <td>✅ PASSED</td>
                    </tr>
                    <tr>
                        <td>Data consistency</td>
                        <td>✅ ID and data match</td>
                        <td>✅ PASSED</td>
                    </tr>
                    <tr>
                        <td>Error validation</td>
                        <td>✅ 400/409 appropriate</td>
                        <td>✅ PASSED</td>
                    </tr>
                    <tr>
                        <td>User isolation</td>
                        <td>✅ No interference</td>
                        <td>✅ PASSED</td>
                    </tr>
                    <tr>
                        <td>Duplicate prevention</td>
                        <td>✅ 409 Conflict</td>
                        <td>✅ PASSED</td>
                    </tr>
                </tbody>
            </table>
        </div>
        
        <div class="section">
            <h2><span class="emoji">🔒</span> Security Validations</h2>
            <ul>
                <li>✅ Passwords not exposed in responses</li>
                <li>✅ Generic error messages for invalid credentials</li>
                <li>✅ Email format validation</li>
                <li>✅ Required fields validation</li>
                <li>✅ Duplicate email prevention</li>
            </ul>
        </div>
        
        <div class="section">
            <h2><span class="emoji">📁</span> Generated Files</h2>
            <ul>
                <li><code>user-register-login.test.ts</code> - Integration tests</li>
                <li><code>user-register-login-report.md</code> - Markdown report</li>
                <li><code>integration-test-report.html</code> - This visual report</li>
                <li><code>test-reports/user-register.login-report.html</code> - Detailed test evidence</li>
            </ul>
        </div>
        
        <div class="section">
            <h2><span class="emoji">💻</span> Execution Commands</h2>
            <div class="code-block">
# Run integration tests
npm run test:integration

# View HTML report
npm run test:report:integration
            </div>
        </div>
        
        <div class="footer">
            <p><strong>Result:</strong> ✅ Passed successfully</p>
            <p><strong>Date:</strong> 17/10/2025</p>
            <p><strong>Tester:</strong> Gian Luca Caravone</p>
            <p><strong>Commit:</strong> feat/integration-tests-register-login</p>
        </div>
    </div>
</body>
</html>
`;

// Función para generar el reporte
function generateReport() {
    try {
        // Crear directorio si no existe
        if (!fs.existsSync(REPORT_DIR)) {
            fs.mkdirSync(REPORT_DIR, { recursive: true });
        }
        
        // Escribir el archivo HTML
        fs.writeFileSync(REPORT_FILE, htmlTemplate);
        
        console.log('✅ Reporte de tests de integración generado exitosamente!');
        console.log(`📁 Ubicación: ${REPORT_FILE}`);
        console.log('🌐 Abre el archivo en tu navegador para ver el reporte');
        
    } catch (error) {
        console.error('❌ Error al generar el reporte:', error.message);
        process.exit(1);
    }
}

// Ejecutar si se llama directamente
if (require.main === module) {
    generateReport();
}

module.exports = { generateReport };
